import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Progress,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormLabel,
  Input,
  VStack,
  Badge,
  Avatar,
} from "@chakra-ui/react";
import { ExternalLinkIcon, DeleteIcon, EditIcon, CalendarIcon } from "@chakra-ui/icons";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import useMembershipsManager from "../hooks/useMembershipsManager";
import useCurrentProperty from "../hooks/useCurrentProperty";
import { getMembershipWhatsAppMessage } from "./membershipHelpers";

export default function MembershipCard({ membership, onComplete, onViewBookings }) {
  const navigate = useNavigate();
  const { deleteMembership, updateMembership } = useMembershipsManager();
  const { property, propertyId } = useCurrentProperty();
  const propertyTitle = property?.property?.title || "";

  const { id, name, number, totalBookings, usedBookings, startDate, endDate, amount } = membership;
  const progressPercent = Math.min(100, Math.round((usedBookings / totalBookings) * 100));
  const remaining = totalBookings - usedBookings;
  const isExhausted = remaining === 0;

  const digits = String(number).replace(/\D/g, "").slice(-10);
  const wa = `91${digits}`;

  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editNumber, setEditNumber] = useState(number);
  const [editEndDate, setEditEndDate] = useState(endDate);
  const [saving, setSaving] = useState(false);

  const openEdit = () => {
    setEditName(name);
    setEditNumber(number);
    setEditEndDate(endDate);
    setEditOpen(true);
  };

  const canSave =
    editName.trim() &&
    editNumber.replace(/\D/g, "").length === 10 &&
    editEndDate;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    await updateMembership(id, {
      name: editName.trim(),
      number: editNumber.replace(/\D/g, "").slice(-10),
      endDate: editEndDate,
    });
    setSaving(false);
    setEditOpen(false);
    onComplete?.();
  };

  const handleAddBooking = () => {
    navigate(`/home/property/${propertyId}/add-booking`, {
      state: {
        membershipContext: {
          membershipId: id,
          membershipBookingIndex: usedBookings + 1,
          membershipTotalBookings: totalBookings,
          membershipEndDate: endDate,
          name,
          number,
        },
      },
    });
  };

  const handleWhatsApp = () => {
    const msg = getMembershipWhatsAppMessage(membership, propertyTitle);
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete membership for ${name}?`)) {
      await deleteMembership(id);
      onComplete?.();
    }
  };

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      <Box
        borderRadius="xl"
        backgroundColor="white"
        mb={3}
        overflow="hidden"
        boxShadow="0 1px 4px rgba(0,0,0,0.08)"
        borderWidth="1px"
        borderColor="gray.100">

        {/* Top accent bar */}
        <Box h="4px" bg={isExhausted ? "red.400" : "teal.400"} />

        <Box px={4} pt={4} pb={3}>
          {/* Header row */}
          <Flex align="center" gap={3} mb={3}>
            <Avatar
              name={name}
              size="md"
              bg={isExhausted ? "red.100" : "teal.100"}
              color={isExhausted ? "red.600" : "teal.700"}
              fontWeight="700"
            />
            <Box flex="1" minW={0}>
              <Text fontWeight="700" fontSize="md" color="gray.800" lineHeight="1.2">
                {name}
              </Text>
              <Text fontSize="xs" color="gray.500" mt={0.5}>
                {number}
              </Text>
              {amount > 0 && (
                <Text fontSize="xs" color="teal.600" fontWeight="600" mt={0.5}>
                  ₹{Number(amount).toLocaleString("en-IN")} paid
                </Text>
              )}
            </Box>
            <Badge
              colorScheme={isExhausted ? "red" : "teal"}
              borderRadius="full"
              px={3}
              py={1}
              fontSize="xs"
              fontWeight="600">
              {isExhausted ? "Exhausted" : `${remaining} left`}
            </Badge>
          </Flex>

          {/* Booking count */}
          <Flex align="baseline" gap={1} mb={2}>
            <Text fontSize="2xl" fontWeight="800" color={isExhausted ? "red.500" : "teal.600"} lineHeight="1">
              {usedBookings}
            </Text>
            <Text fontSize="sm" color="gray.400" fontWeight="500">/ {totalBookings} bookings used</Text>
          </Flex>

          {/* Progress */}
          <Progress
            value={progressPercent}
            size="sm"
            colorScheme={isExhausted ? "red" : progressPercent >= 80 ? "orange" : "teal"}
            borderRadius="full"
            bg="gray.100"
            mb={3}
          />

          {/* Validity */}
          <Flex align="center" gap={1} mb={4}>
            <CalendarIcon boxSize={3} color="gray.400" />
            <Text fontSize="xs" color="gray.500">
              Valid till{" "}
              <Text as="span" fontWeight="600" color="gray.700">
                {moment(endDate).format("DD MMM YYYY")}
              </Text>
            </Text>
          </Flex>

          {/* Actions */}
          <Flex gap={2} mb={3}>
            <Button
              flex="1"
              size="sm"
              colorScheme="teal"
              borderRadius="lg"
              fontWeight="600"
              onClick={handleAddBooking}
              isDisabled={isExhausted}>
              + Add Booking
            </Button>
            <Button
              flex="1"
              size="sm"
              variant="outline"
              colorScheme="gray"
              borderRadius="lg"
              fontWeight="600"
              onClick={() => onViewBookings?.(membership)}>
              View Bookings
            </Button>
          </Flex>

          <Flex justify="flex-end" gap={4}>
            <IconButton
              size="sm"
              isRound
              colorScheme="blue"
              aria-label="Edit"
              icon={<EditIcon />}
              onClick={openEdit}
            />
            <IconButton
              size="sm"
              isRound
              colorScheme="green"
              aria-label="WhatsApp"
              icon={<ExternalLinkIcon />}
              onClick={handleWhatsApp}
            />
            <IconButton
              size="sm"
              isRound
              colorScheme="red"
              aria-label="Delete"
              icon={<DeleteIcon />}
              onClick={handleDelete}
            />
          </Flex>
        </Box>
      </Box>

      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} isCentered>
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent mx={4} borderRadius="xl">
          <ModalHeader fontSize="md" pb={2}>Edit Membership</ModalHeader>
          <ModalBody>
            <VStack spacing={3} align="stretch">
              <FormLabel mb={0} fontSize="sm" color="gray.600">Name</FormLabel>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Player name"
                borderRadius="lg"
              />
              <FormLabel mb={0} fontSize="sm" color="gray.600">Mobile Number</FormLabel>
              <Input
                inputMode="numeric"
                maxLength={10}
                value={editNumber.replace(/\D/g, "").slice(0, 10)}
                onChange={(e) =>
                  setEditNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                placeholder="10-digit number"
                borderRadius="lg"
              />
              <FormLabel mb={0} fontSize="sm" color="gray.600">Valid Till</FormLabel>
              <Input
                type="date"
                value={editEndDate}
                onChange={(e) => setEditEndDate(e.target.value)}
                borderRadius="lg"
              />
            </VStack>
          </ModalBody>
          <ModalFooter gap={2} pt={3}>
            <Button variant="ghost" onClick={() => setEditOpen(false)} borderRadius="lg">
              Cancel
            </Button>
            <Button
              colorScheme="teal"
              isLoading={saving}
              isDisabled={!canSave}
              onClick={handleSave}
              borderRadius="lg">
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
