import React from "react";
import {
  Button,
  Flex,
  FormLabel,
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
import { addSlotBooking } from "../../api/bookings";
import { isEmpty, map } from "lodash";

export default function AddBookingModal({ isOpen, onClose, fetchBookings }) {
  const [input, setInput] = React.useState({
    date: moment().format("YYYY-MM-DD"),
  });
  const [selectedSlots, setSelectedSlots] = React.useState([]); // [slot1, slot2, slot3]
  const isUpdating = false;
  const [isAddBookingDisabled, setIsAddBookingDisabled] = React.useState(true);
  const [additionOrUpdationInProgress, setAdditionOrUpdationInProgress] =
    React.useState(false);
  const [totalAmount, setTotalAmount] = React.useState(0);

  React.useEffect(() => {
    const { name, number, date } = input;
    if (name && number && date && selectedSlots.length > 0) {
      setIsAddBookingDisabled(false);
    } else {
      setIsAddBookingDisabled(true);
    }
  }, [input, selectedSlots]);

  const onCloseModal = () => {
    onClose();
    setInput({});
    setSelectedSlots([]);
  };

  React.useEffect(() => {
    if (input?.totalAmount !== undefined) {
      setTotalAmount(input?.totalAmount);
    } else {
      setTotalAmount(
        isEmpty(selectedSlots)
          ? 0
          : map(selectedSlots, (slot) => slot?.price).reduce(
              (acc, cur) => acc + cur,
              0
            )
      );
    }
  }, [selectedSlots, input?.totalAmount]);

  const payable = totalAmount - (input?.advanced || 0);

  const onAddBooking = async () => {
    setAdditionOrUpdationInProgress(true);
    const bookingDate = input?.date;
    const booking = {
      bookingDate,
      amountSumary: {
        total: totalAmount,
        advanced: Number(input?.advanced) || 0,
        payable: payable,
      },
      customer: {
        name: input?.name,
        number: input?.number,
      },
      property: {
        // todo fix this
        id: "iNANAwfMb6EXNtp7MRwJ",
        title: "RunBhumi Mewar",
      },
      slots: selectedSlots,
      timestamp: moment().format(),
    };
    await addSlotBooking(booking, selectedSlots);
    fetchBookings();
    setAdditionOrUpdationInProgress(false);
    onCloseModal();
  };

  return (
    <Modal isOpen={isOpen} onClose={onCloseModal}>
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
              onChange={(e) => {
                setInput({
                  ...input,
                  date: e?.target?.value,
                });
              }}
              defaultValue={moment().format("YYYY-MM-DD")}
              // min={moment().format("YYYY-MM-DD")}
            />
            <SlotSelector
              input={input}
              selectedSlots={selectedSlots}
              setSelectedSlots={setSelectedSlots}
            />
            <FormLabel mb={-2} mt={3}>
              Total Amount
            </FormLabel>
            <Input
              value={totalAmount}
              width={"100%"}
              onChange={(e) => {
                setInput({
                  ...input,
                  totalAmount: e?.target?.value,
                });
              }}
              defaultValue={totalAmount}
              placeholder="Total Amount"
            />

            <FormLabel mb={-2}>Advanced</FormLabel>
            <Input
              value={input?.advanced}
              width={"100%"}
              onChange={(e) => {
                setInput({
                  ...input,
                  advanced: e?.target?.value,
                });
              }}
              placeholder="Advanced"
            />
            <FormLabel mb={-2}>Total Payable Amount</FormLabel>
            <Input
              value={input?.payable || payable}
              width={"100%"}
              onChange={(e) => {
                setInput({
                  ...input,
                  payable: e?.target?.value,
                });
              }}
              placeholder="Total Payable Amount"
            />
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            isLoading={additionOrUpdationInProgress}
            isDisabled={isAddBookingDisabled}
            colorScheme="blue"
            ml={3}
            onClick={onAddBooking}>
            Add Booking
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
