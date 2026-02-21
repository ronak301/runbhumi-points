import React, { useState, useEffect } from "react";
import {
  Button,
  Flex,
  FormLabel,
  Input,
  Box,
  Heading,
  Text,
  Spinner,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import SlotSelector from "./SlotSelector";
import moment from "moment";
import { isEmpty, map } from "lodash";
import useBookingsManager from "../hooks/useBookingsManager";
import useCurrentProperty from "../hooks/useCurrentProperty";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

const getBookedSlotsForDateAndPlayground = async (date, propertyId) => {
  let slots = [];
  const slotsCollectionRef = collection(
    db,
    `properties/${propertyId}/bookings/${date}/bookedSlot`
  );
  const slotsQuerySnapshot = await getDocs(slotsCollectionRef);
  slotsQuerySnapshot.forEach((slotDoc) => {
    slots.push({ ...slotDoc.data(), id: slotDoc.id });
  });
  return slots;
};

// PickleX: Sat/Sun 7PM–12AM = ₹600 per half hour; else ₹300. Other properties use slot.price.
const PICKLEX_PROPERTY_ID = "2H3Ld4uq17AeCtfXpuo0";
const getSlotPriceForDate = (slot, dateStr, propertyId) => {
  if (propertyId !== PICKLEX_PROPERTY_ID) {
    return Number(slot?.price) || 300;
  }
  const day = new Date(dateStr).getDay();
  const isWeekend = day === 0 || day === 6;
  const match = (slot?.title || "").match(/^(\d{1,2}):/);
  const hour = match ? parseInt(match[1], 10) : 0;
  const isPeakTime = hour >= 19 && hour < 24;
  return isWeekend && isPeakTime ? 600 : 300;
};

export default function AddBookingPage() {
  const navigate = useNavigate();
  const { propertyId, setInput, input, property } = useCurrentProperty();
  const courts = property?.courts || ["court1"];
  const isMultiCourt = courts.length > 1;
  const [selectedCourt, setSelectedCourt] = useState(courts[0]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [slotLoading, setSlotLoading] = React.useState(true);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [isAddBookingDisabled, setIsAddBookingDisabled] = useState(true);
  const [additionOrUpdationInProgress, setAdditionOrUpdationInProgress] =
    useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const { addSlotBooking } = useBookingsManager();

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!propertyId || !input.date) return;
      try {
        setSlotLoading(true);
        const slots = await getBookedSlotsForDateAndPlayground(
          input.date,
          propertyId
        );
        setBookedSlots(slots);
      } catch (err) {
        console.error("Error fetching booked slots:", err);
      } finally {
        setSlotLoading(false);
      }
    };
    fetchBookedSlots();
  }, [input.date, propertyId]);

  const filteredBookedSlots = isMultiCourt
    ? bookedSlots.filter((s) => (s.courtId || "court1") === selectedCourt)
    : bookedSlots;

  useEffect(() => {
    if (courts.length > 0 && !courts.includes(selectedCourt)) {
      setSelectedCourt(courts[0]);
    }
  }, [courts]);

  useEffect(() => {
    const { name, number, date } = input;
    setIsAddBookingDisabled(
      !(name && number && date && selectedSlots.length > 0)
    );
  }, [input, selectedSlots]);

  useEffect(() => {
    if (input?.totalAmount !== undefined) {
      setTotalAmount(input?.totalAmount);
    } else {
      const total = isEmpty(selectedSlots)
        ? 0
        : selectedSlots.reduce(
            (acc, slot) =>
              acc + getSlotPriceForDate(slot, input?.date || "", propertyId),
            0
          );
      setTotalAmount(total);
    }
  }, [selectedSlots, input?.totalAmount, input?.date, propertyId]);

  const onAddBooking = async () => {
    setAdditionOrUpdationInProgress(true);
    const slotsWithDatePrice = selectedSlots.map((slot) => ({
      ...slot,
      price: getSlotPriceForDate(slot, input?.date || "", propertyId),
    }));
    const booking = {
      bookingDate: input?.date,
      amountSumary: {
        total: totalAmount,
        advanced: Number(input?.advanced) || 0,
        payable: totalAmount - (input?.advanced || 0),
      },
      customer: {
        name: input?.name,
        number: input?.number,
      },
      propertyId,
      property: { id: propertyId, title: property?.property?.title },
      slots: slotsWithDatePrice,
      timestamp: moment().format(),
    };
    await addSlotBooking(booking, slotsWithDatePrice);
    setAdditionOrUpdationInProgress(false);
    navigate("/home");
  };

  return (
    <Box>
      {/* Navbar Section */}
      <Box
        backgroundColor="rgb(20,20,20)"
        height="60px"
        display="flex"
        alignItems="center"
        px={2}
        boxShadow="sm">
        <IconButton
          icon={<ArrowBackIcon color="white" boxSize={6} />} // Increase icon size
          onClick={() => navigate(-1)}
          aria-label="Back"
          bg="transparent"
          _hover={{ bg: "rgba(255,255,255,0.1)" }}
          size="lg" // Increase button size
        />
        <Text ml={2} fontSize="lg" color="white" fontWeight="bold">
          {"Add Booking"}
        </Text>
      </Box>

      {/* Form Section */}
      <Box p={8}>
        <VStack spacing={4} align="stretch">
          <FormLabel>Name</FormLabel>
          <Input
            value={input?.name}
            onChange={(e) => setInput({ ...input, name: e.target.value })}
            placeholder="Name"
          />

          <FormLabel>Phone Number</FormLabel>
          <Input
            value={input?.number}
            onChange={(e) => setInput({ ...input, number: e.target.value })}
            placeholder="Phone Number"
          />

          <FormLabel>Select Date</FormLabel>
          <Input
            type="date"
            value={input?.date}
            onChange={(e) => setInput({ ...input, date: e.target.value })}
            // min={moment().format("YYYY-MM-DD")}
          />

          <SlotSelector
            input={input}
            selectedSlots={selectedSlots}
            setSelectedSlots={setSelectedSlots}
            bookedSlots={filteredBookedSlots}
            slotLoading={slotLoading}
            selectedCourt={selectedCourt}
            onCourtChange={setSelectedCourt}
          />

          <FormLabel>Total Amount</FormLabel>
          <Input
            value={totalAmount}
            onChange={(e) =>
              setInput({ ...input, totalAmount: e.target.value })
            }
            placeholder="Total Amount"
          />

          <FormLabel>Advanced</FormLabel>
          <Input
            value={input?.advanced}
            onChange={(e) => setInput({ ...input, advanced: e.target.value })}
            placeholder="Advanced"
          />

          <FormLabel>Total Payable Amount</FormLabel>
          <Input
            value={input?.payable || totalAmount - (input?.advanced || 0)}
            onChange={(e) => setInput({ ...input, payable: e.target.value })}
            placeholder="Total Payable Amount"
          />

          <Button
            colorScheme="blue"
            isLoading={additionOrUpdationInProgress}
            isDisabled={isAddBookingDisabled}
            onClick={onAddBooking}>
            Add Booking
          </Button>
        </VStack>
      </Box>

      {additionOrUpdationInProgress && (
        <Flex justify="center" align="center" mt={6}>
          <Spinner />
          <Text ml={4}>Processing...</Text>
        </Flex>
      )}
    </Box>
  );
}
