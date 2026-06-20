import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  useToast,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import { ArrowBackIcon, EditIcon, PhoneIcon } from "@chakra-ui/icons";
import SlotSelector from "./SlotSelector";
import { isEmpty } from "lodash";
import moment from "moment";
import useBookingsManager from "../hooks/useBookingsManager";
import useCurrentProperty from "../hooks/useCurrentProperty";
import {
  fetchBookedSlotsForDate,
  getBookingFormBlockingError,
  getPhoneDigits,
  getSlotPriceForDate,
  mergeBookingSlotsWithProperty,
} from "./bookingHelpers";

export function EditBookingModal({ booking, isOpen, onClose, onComplete, slotOnly = false }) {
  const toast = useToast();
  const { propertyId, property } = useCurrentProperty();
  const courts = property?.courts || ["court1"];
  const isMultiCourt = courts.length > 1;
  const [form, setForm] = useState({
    name: "",
    number: "",
    date: "",
    discount: "",
    advanced: "",
    totalAmount: undefined,
  });
  const [selectedCourt, setSelectedCourt] = useState(courts[0]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [slotLoading, setSlotLoading] = useState(true);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [saving, setSaving] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const previousBookingDateRef = useRef(null);
  const previousSelectedSlotCountRef = useRef(null);
  const { updateSlotBooking } = useBookingsManager();

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
      const props = ["name", "tel"];
      const opts = { multiple: false };
      const contacts = await navigator.contacts.select(props, opts);
      if (contacts?.length > 0) {
        const c = contacts[0];
        const name = c.name?.join?.(" ") || c.name || "";
        const tel = (c.tel && (Array.isArray(c.tel) ? c.tel[0] : c.tel)) || "";
        const number = getPhoneDigits(
          String(tel).replace(/\D/g, "").slice(-10)
        );
        setForm((prev) => ({
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
    }
  };

  useEffect(() => {
    if (!isOpen || !booking?.id) return;
    previousBookingDateRef.current = booking.bookingDate;
    previousSelectedSlotCountRef.current = null;
    const slotsDef = property?.slots || property?.property?.slots || [];
    const merged = mergeBookingSlotsWithProperty(booking.slots, slotsDef);
    setSelectedSlots(merged);
    const courtIds = property?.courts || ["court1"];
    const courtFromSlots =
      merged[0]?.courtId && courtIds.includes(merged[0].courtId)
        ? merged[0].courtId
        : courtIds[0];
    setSelectedCourt(courtFromSlots);
    setForm({
      name: booking.customer?.name ?? "",
      number: getPhoneDigits(booking.customer?.number ?? ""),
      date: booking.bookingDate,
      discount: booking.amountSumary?.discount ?? "",
      advanced: booking.amountSumary?.advanced ?? "",
      totalAmount: undefined,
    });
    // Intentionally only when opening or switching booking — avoids clobbering edits on list refresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, booking?.id]);

  useEffect(() => {
    const fetchBooked = async () => {
      if (!isOpen || !propertyId || !form?.date) return;
      try {
        setSlotLoading(true);
        const slots = await fetchBookedSlotsForDate(propertyId, form.date);
        setBookedSlots(slots);
      } catch (err) {
        console.error("Error fetching booked slots:", err);
      } finally {
        setSlotLoading(false);
      }
    };
    fetchBooked();
  }, [form?.date, propertyId, isOpen]);

  useEffect(() => {
    if (courts.length > 0 && !courts.includes(selectedCourt)) {
      setSelectedCourt(courts[0]);
    }
  }, [courts, selectedCourt]);

  useEffect(() => {
    const n = selectedSlots.length;
    const prevCount = previousSelectedSlotCountRef.current;
    previousSelectedSlotCountRef.current = n;
    if (prevCount !== null && prevCount > 0 && n === 0) {
      setForm((prev) => ({
        ...prev,
        totalAmount: undefined,
        discount: "",
      }));
    }
  }, [selectedSlots.length]);

  useEffect(() => {
    const hasManualTotal =
      form?.totalAmount !== undefined && form?.totalAmount !== "";
    if (hasManualTotal) {
      const n = Number(form.totalAmount);
      setTotalAmount(Number.isFinite(n) ? n : 0);
    } else {
      const total = isEmpty(selectedSlots)
        ? 0
        : selectedSlots.reduce(
            (acc, slot) =>
              acc + getSlotPriceForDate(slot, form?.date || "", propertyId),
            0
          );
      setTotalAmount(total);
    }
  }, [selectedSlots, form?.totalAmount, form?.date, propertyId]);

  const filteredBookedSlots = isMultiCourt
    ? bookedSlots.filter((s) => (s.courtId || "court1") === selectedCourt)
    : bookedSlots;

  const subtotal = Number(totalAmount) || 0;
  const discount = Number(form?.discount) || 0;
  const totalAfterDiscount = Math.max(0, subtotal - discount);
  const advanced = Number(form?.advanced) || 0;
  const payable = Math.max(0, totalAfterDiscount - advanced);

  const submitError = getBookingFormBlockingError({
    name: form?.name,
    date: form?.date,
    phoneValue: form?.number,
    selectedSlotCount: selectedSlots.length,
  });
  const canSave = !submitError;

  const onSave = async () => {
    if (!booking?.id || !canSave) return;
    setSaving(true);
    try {
      const phone = getPhoneDigits(form?.number);
      const slotsWithDatePrice = selectedSlots.map((slot) => ({
        ...slot,
        price: getSlotPriceForDate(slot, form?.date || "", propertyId),
      }));
      const payload = {
        bookingDate: form.date,
        amountSumary: slotOnly
          ? booking.amountSumary
          : { subtotal, discount, total: totalAfterDiscount, advanced, payable },
        customer: {
          name: slotOnly ? booking.customer?.name : form.name,
          number: slotOnly ? booking.customer?.number : phone,
        },
        propertyId,
        property: { id: propertyId, title: property?.property?.title },
        slots: slotsWithDatePrice,
        timestamp: moment().format(),
        ...(booking.isMembershipBooking && {
          isMembershipBooking: true,
          membershipId: booking.membershipId,
          membershipBookingIndex: booking.membershipBookingIndex,
          membershipTotalBookings: booking.membershipTotalBookings,
          membershipEndDate: booking.membershipEndDate,
        }),
      };
      const ok = await updateSlotBooking(
        booking.id,
        previousBookingDateRef.current,
        payload,
        slotsWithDatePrice,
        onComplete
      );
      if (ok) onClose?.();
    } finally {
      setSaving(false);
    }
  };

  if (!booking?.id) return null;

  const slotInput = { date: form.date };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="full"
        scrollBehavior="inside"
        motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent mx={0} mb={0} borderRadius="0" p={0}>
          <Box
            backgroundColor="rgb(20,20,20)"
            height="60px"
            display="flex"
            alignItems="center"
            px={2}
            boxShadow="sm">
            <IconButton
              icon={<ArrowBackIcon color="white" boxSize={6} />}
              onClick={onClose}
              aria-label="Back"
              bg="transparent"
              _hover={{ bg: "rgba(255,255,255,0.1)" }}
              size="lg"
            />
            <Text ml={2} fontSize="lg" color="white" fontWeight="bold">
              Edit Booking
            </Text>
          </Box>
          <ModalBody px={8} pt={8} pb={24}>
            <VStack spacing={4} align="stretch">
              {!slotOnly && (
                <>
                  <Flex align="center" justify="space-between" wrap="wrap" gap={2}>
                    <FormLabel mb={0}>Name</FormLabel>
                    {supportsContactPicker && (
                      <Button
                        size="sm"
                        leftIcon={<PhoneIcon />}
                        variant="outline"
                        colorScheme="teal"
                        onClick={pickFromContacts}>
                        From contacts
                      </Button>
                    )}
                  </Flex>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Name"
                  />
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={10}
                    value={getPhoneDigits(form.number)}
                    onChange={(e) =>
                      setForm({ ...form, number: getPhoneDigits(e.target.value) })
                    }
                    placeholder="10-digit mobile number"
                  />
                </>
              )}

              <FormLabel>Select Date</FormLabel>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />

              <SlotSelector
                input={slotInput}
                selectedSlots={selectedSlots}
                setSelectedSlots={setSelectedSlots}
                bookedSlots={filteredBookedSlots}
                slotLoading={slotLoading}
                selectedCourt={selectedCourt}
                onCourtChange={setSelectedCourt}
                ignoreBookingId={booking.id}
              />

              {!slotOnly && (
                <>
                  <Text fontSize="xs" color="gray.600">
                    Amounts follow the same rules as new bookings: changing date or
                    slots updates the default total; you can still override total
                    below.
                  </Text>

                  <FormLabel>Total Amount</FormLabel>
                  <Input
                    value={totalAmount}
                    onChange={(e) =>
                      setForm({ ...form, totalAmount: e.target.value })
                    }
                    placeholder="Total Amount"
                  />

                  <FormLabel>Discount (₹)</FormLabel>
                  <Input
                    type="number"
                    min={0}
                    value={form.discount ?? ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        discount: e.target.value ? e.target.value : "",
                      })
                    }
                    placeholder="0"
                  />

                  <FormLabel>Advanced</FormLabel>
                  <Input
                    value={form.advanced ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, advanced: e.target.value })
                    }
                    placeholder="Advanced"
                  />

                  <FormLabel>Total Payable Amount</FormLabel>
                  <Input
                    value={payable}
                    readOnly
                    placeholder="Total Payable Amount"
                    backgroundColor="gray.50"
                  />
                </>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter
            borderTopWidth="1px"
            position="sticky"
            bottom={0}
            bg="white"
            zIndex={1}
            gap={2}
            px={8}
            py={4}
            flexDirection="column"
            alignItems="stretch">
            {submitError ? (
              <Text color="red.500" fontSize="sm" textAlign="center">
                {submitError}
              </Text>
            ) : null}
            <Flex gap={2} justify="flex-end" w="100%">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                isLoading={saving}
                isDisabled={!canSave}
                onClick={onSave}>
                Save changes
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export function EditBookingButton({ booking, onComplete }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <IconButton
        size="sm"
        onClick={() => setOpen(true)}
        isRound
        colorScheme="blue"
        aria-label="Edit booking"
        icon={<EditIcon />}
      />
      <EditBookingModal
        booking={booking}
        isOpen={open}
        onClose={() => setOpen(false)}
        onComplete={onComplete}
      />
    </>
  );
}
