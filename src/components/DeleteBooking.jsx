import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import * as React from "react";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { DeleteIcon } from "@chakra-ui/icons";
import useBookingsManager from "../modules/app/hooks/useBookingsManager";

export function DeleteBooking({ booking }) {
  const id = booking?.id;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const { deleteSlotBooking } = useBookingsManager();

  const onDeleteEntry = () => {
    deleteSlotBooking(id, booking?.bookingDate);
    onClose();
  };

  return (
    <>
      <Box>
        <IconButton
          onClick={() => {
            onOpen();
          }}
          isRound
          colorScheme="red"
          aria-label="Delete"
          icon={<DeleteIcon />}
        />
      </Box>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent mr={4} ml={4}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Booking
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete booking?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={onDeleteEntry} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
