import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Button,
  Flex,
  FormLabel,
  Input,
  Box,
  Text,
  Spinner,
  VStack,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon, PhoneIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import SlotSelector from "./SlotSelector";
import moment from "moment";
import { isEmpty } from "lodash";
import useBookingsManager from "../hooks/useBookingsManager";
import useCurrentProperty from "../hooks/useCurrentProperty";
import {
  fetchBookedSlotsForDate,
  getBookingFormBlockingError,
  getPhoneDigits,
  getSlotPriceForDate,
} from "./bookingHelpers";

export default function AddBookingPage() {
  const navigate = useNavigate();
  const { propertyId, setInput, input, property } = useCurrentProperty();
  const courts = useMemo(
    () => property?.courts || ["court1"],
    [property?.courts]
  );
  const isMultiCourt = courts.length > 1;
  const [selectedCourt, setSelectedCourt] = useState(courts[0]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [slotLoading, setSlotLoading] = React.useState(true);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [additionOrUpdationInProgress, setAdditionOrUpdationInProgress] =
    useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const previousSelectedSlotCountRef = useRef(null);
  const { addSlotBooking } = useBookingsManager();
  const toast = useToast();
  const [pickingContact, setPickingContact] = useState(false);

  const supportsContactPicker =
    typeof navigator !== "undefined" &&
    navigator.contacts &&
    typeof navigator.contacts.select === "function";

  const pickFromContacts = async () => {
    if (!supportsContactPicker) {
      toast({
        title: "Not supported",
        description:
          "This browser/device does not support picking from phone contacts.",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    try {
      setPickingContact(true);
      const props = ["name", "tel"];
      const opts = { multiple: false };
      const contacts = await navigator.contacts.select(props, opts);
      if (contacts?.length > 0) {
        const c = contacts[0];
        const name = c.name?.join?.(" ") || c.name || "";
        const tel = (c.tel && (Array.isArray(c.tel) ? c.tel[0] : c.tel)) || "";
        const number = getPhoneDigits(String(tel).replace(/\D/g, "").slice(-10));
        setInput((prev) => ({
          ...prev,
          name: name || prev.name,
          number: number || prev.number,
        }));
      }
    } catch (err) {
      if (err.name !== "SecurityError" && err.name !== "AbortError") {
        toast({
          title: "Could not open contacts",
          description: err?.message || "Try entering name and number manually.",
          status: "warning",
          duration: 4000,
          isClosable: true,
        });
      }
    } finally {
      setPickingContact(false);
    }
  };

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!propertyId || !input.date) return;
      try {
        setSlotLoading(true);
        const slots = await fetchBookedSlotsForDate(propertyId, input.date);
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
  }, [courts, selectedCourt]);

  useEffect(() => {
    const n = selectedSlots.length;
    const prev = previousSelectedSlotCountRef.current;
    previousSelectedSlotCountRef.current = n;
    if (prev !== null && prev > 0 && n === 0) {
      setInput((prevInput) => ({
        ...prevInput,
        totalAmount: undefined,
        discount: undefined,
      }));
    }
  }, [selectedSlots.length, setInput]);

  useEffect(() => {
    const hasManualTotal =
      input?.totalAmount !== undefined && input?.totalAmount !== "";
    if (hasManualTotal) {
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

  const submitError = getBookingFormBlockingError({
    name: input?.name,
    date: input?.date,
    phoneValue: input?.number,
    selectedSlotCount: selectedSlots.length,
  });
  const canSubmit = !submitError;

  const subtotal = Number(totalAmount) || 0;
  const discount = Number(input?.discount) || 0;
  const totalAfterDiscount = Math.max(0, subtotal - discount);
  const advanced = Number(input?.advanced) || 0;
  const payable = Math.max(0, totalAfterDiscount - advanced);

  const onAddBooking = async () => {
    if (!canSubmit) return;
    setAdditionOrUpdationInProgress(true);
    const phone = getPhoneDigits(input?.number);
    const slotsWithDatePrice = selectedSlots.map((slot) => ({
      ...slot,
      price: getSlotPriceForDate(slot, input?.date || "", propertyId),
    }));
    const booking = {
      bookingDate: input?.date,
      amountSumary: {
        subtotal,
        discount,
        total: totalAfterDiscount,
        advanced,
        payable,
      },
      customer: {
        name: input?.name,
        number: phone,
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
          <Flex align="center" justify="space-between" wrap="wrap" gap={2}>
            <FormLabel mb={0}>Name</FormLabel>
            {supportsContactPicker && (
              <Button
                size="sm"
                leftIcon={<PhoneIcon />}
                variant="outline"
                colorScheme="teal"
                isLoading={pickingContact}
                onClick={pickFromContacts}>
                From contacts
              </Button>
            )}
          </Flex>
          <Input
            value={input?.name}
            onChange={(e) => setInput({ ...input, name: e.target.value })}
            placeholder="Name"
          />

          <FormLabel>Phone Number</FormLabel>
          <Input
            inputMode="numeric"
            autoComplete="tel"
            maxLength={10}
            value={getPhoneDigits(input?.number)}
            onChange={(e) =>
              setInput({ ...input, number: getPhoneDigits(e.target.value) })
            }
            placeholder="10-digit mobile number"
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

          <FormLabel>Discount (₹)</FormLabel>
          <Input
            type="number"
            min={0}
            value={input?.discount ?? ""}
            onChange={(e) =>
              setInput({ ...input, discount: e.target.value ? e.target.value : undefined })
            }
            placeholder="0"
          />

          <FormLabel>Advanced</FormLabel>
          <Input
            value={input?.advanced}
            onChange={(e) => setInput({ ...input, advanced: e.target.value })}
            placeholder="Advanced"
          />

          <FormLabel>Total Payable Amount</FormLabel>
          <Input
            value={payable}
            readOnly
            placeholder="Total Payable Amount"
            backgroundColor="gray.50"
          />

          {submitError ? (
            <Text color="red.500" fontSize="sm" textAlign="center">
              {submitError}
            </Text>
          ) : null}
          <Button
            colorScheme="blue"
            isLoading={additionOrUpdationInProgress}
            isDisabled={!canSubmit}
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
