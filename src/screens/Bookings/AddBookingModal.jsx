import React from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

export default function AddBookingModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // update this later
  const isUpdating = false;

  const onAddBooking = () => {};

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent width="90%">
        <ModalHeader>{isUpdating ? "Update" : "Add New Member"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input />
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button colorScheme="blue" ml={3} onClick={onAddBooking}>
            Add Booking
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
