import React from "react";
import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import SlotSelector from "./SlotSelector";
import moment from "moment";
import ContactPicker from "./ContactPicker";

export default function AddBookingModal({ isOpen, onClose, input, setInput }) {
  // update this later
  const isUpdating = false;

  const onAddBooking = () => {};

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent width="96%">
        <ModalHeader>{isUpdating ? "Update" : "Add Booking"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex gap={4} direction={"column"}>
            <Input
              value={input?.name}
              width={"100%"}
              onChange={(e) => {
                setInput({
                  ...input,
                  name: e?.target?.value,
                });
              }}
              placeholder="Name"
            />
            <Input
              value={input?.number}
              width={"100%"}
              onChange={(e) => {
                setInput({
                  ...input,
                  number: e?.target?.value,
                });
              }}
              placeholder="Phone Number"
            />
            <Input
              placeholder="Select Date"
              size="md"
              type="date"
              defaultValue={moment().format("YYYY-MM-DD")}
              min={moment().format("YYYY-MM-DD")}
            />
            <ContactPicker />
            <SlotSelector input={input} setInput={setInput} />
          </Flex>
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
