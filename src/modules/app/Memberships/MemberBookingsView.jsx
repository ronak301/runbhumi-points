import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Spinner,
  Badge,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowBackIcon, DeleteIcon } from "@chakra-ui/icons";
import { collection, getDocs, query, where } from "firebase/firestore";
import moment from "moment";
import { db } from "../../../firebase";
import useBookingsManager from "../hooks/useBookingsManager";
import useMembershipsManager from "../hooks/useMembershipsManager";
import { getSlotsSummary } from "../Bookings/bookingDisplay";
import useCurrentProperty from "../hooks/useCurrentProperty";
import useStore from "../../../zustand/useStore";

function MemberBookingItem({ booking, membershipId, onDeleted, onAfterDelete }) {
  const { deleteSlotBooking, loading } = useBookingsManager();
  const { decrementUsedBookings } = useMembershipsManager();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const { propertyId } = useCurrentProperty();

  const handleDelete = async () => {
    await deleteSlotBooking(booking.id, booking.bookingDate, onDeleted);
    await decrementUsedBookings(membershipId);
    onClose();
    onAfterDelete?.();
  };

  return (
    <>
      <Box
        borderWidth="1px"
        borderRadius="xl"
        bg="white"
        px={4}
        py={3}
        mb={3}
        boxShadow="0 1px 3px rgba(0,0,0,0.07)">
        <Flex justify="space-between" align="flex-start" mb={1}>
          <Box>
            <Text fontSize="sm" fontWeight="700" color="gray.800">
              {moment(booking.bookingDate).format("DD MMM YYYY")}
            </Text>
            <Text fontSize="xs" color="gray.500" mt={0.5}>
              {getSlotsSummary(booking, propertyId)}
            </Text>
          </Box>
          <Badge colorScheme="purple" borderRadius="full" px={2} fontSize="xs">
            #{booking.membershipBookingIndex}
          </Badge>
        </Flex>

        <Flex justify="flex-end" mt={2}>
          <IconButton
            size="sm"
            isRound
            variant="ghost"
            colorScheme="red"
            aria-label="Delete"
            icon={<DeleteIcon />}
            onClick={onOpen}
          />
        </Flex>
      </Box>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent mx={4}>
            <AlertDialogHeader fontSize="md" fontWeight="bold">Delete Booking</AlertDialogHeader>
            <AlertDialogBody fontSize="sm">
              Delete booking #{booking.membershipBookingIndex} on{" "}
              {moment(booking.bookingDate).format("DD MMM YYYY")}?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} size="sm">Cancel</Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3} size="sm" isLoading={loading}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

    </>
  );
}

export default function MemberBookingsView({ membership, onBack, onMembershipChanged }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const triggerBookingsRefresh = useStore((s) => s.triggerBookingsRefresh);
  const requestTabSwitch = useStore((s) => s.requestTabSwitch);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(
        query(collection(db, "bookings"), where("membershipId", "==", membership.id))
      );
      const list = snap.docs
        .map((d) => ({ ...d.data(), id: d.id }))
        .sort((a, b) => (a.membershipBookingIndex || 0) - (b.membershipBookingIndex || 0));
      setBookings(list);
    } catch (e) {
      console.error("Failed to fetch member bookings", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [membership.id]);

  const handleAfterDelete = () => {
    onMembershipChanged?.();
    triggerBookingsRefresh();
    requestTabSwitch(0);
    onBack();
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Box bg="rgb(20,20,20)" px={2} height="60px" display="flex" alignItems="center">
        <IconButton
          icon={<ArrowBackIcon color="white" boxSize={6} />}
          onClick={onBack}
          aria-label="Back"
          bg="transparent"
          _hover={{ bg: "rgba(255,255,255,0.1)" }}
          size="lg"
        />
        <Box ml={2}>
          <Text fontSize="md" color="white" fontWeight="bold" lineHeight="1.2">
            {membership.name}
          </Text>
          <Text fontSize="xs" color="gray.400">
            {bookings.length} of {membership.totalBookings} bookings
          </Text>
        </Box>
      </Box>

      <Box px={3} pt={4}>
        {loading ? (
          <Flex justify="center" mt={12}>
            <Spinner color="teal.500" />
          </Flex>
        ) : bookings.length === 0 ? (
          <Flex direction="column" align="center" mt={16} gap={2}>
            <Text fontSize="3xl">📅</Text>
            <Text fontSize="sm" color="gray.400">No bookings yet for this member.</Text>
          </Flex>
        ) : (
          bookings.map((b) => (
            <MemberBookingItem key={b.id} booking={b} membershipId={membership.id} onDeleted={fetchBookings} onAfterDelete={handleAfterDelete} />
          ))
        )}
      </Box>
    </Box>
  );
}
