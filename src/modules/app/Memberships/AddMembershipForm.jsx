import React, { useState } from "react";
import {
  Box,
  Button,
  FormLabel,
  Input,
  Text,
  VStack,
  HStack,
  IconButton,
  RadioGroup,
  Radio,
  Stack,
  Flex,
} from "@chakra-ui/react";
import { ArrowBackIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import moment from "moment";
import useMembershipsManager from "../hooks/useMembershipsManager";
import useCurrentProperty from "../hooks/useCurrentProperty";
import { BOOKING_OPTIONS, DEFAULT_AMOUNTS, computeEndDate, getMembershipWhatsAppMessage } from "./membershipHelpers";

export default function AddMembershipForm({ onBack, onAdded }) {
  const { addMembership } = useMembershipsManager();
  const { property } = useCurrentProperty();
  const propertyTitle = property?.property?.title || "";

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [totalBookings, setTotalBookings] = useState("30");
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(computeEndDate(moment().format("YYYY-MM-DD"), 30));
  const [amount, setAmount] = useState(String(DEFAULT_AMOUNTS[30]));
  const [saving, setSaving] = useState(false);
  const [savedMembership, setSavedMembership] = useState(null);

  const handleTotalBookingsChange = (val) => {
    setTotalBookings(val);
    setEndDate(computeEndDate(startDate, Number(val)));
    setAmount(String(DEFAULT_AMOUNTS[Number(val)] ?? ""));
  };

  const handleStartDateChange = (val) => {
    setStartDate(val);
    setEndDate(computeEndDate(val, Number(totalBookings)));
  };

  const amountNum = Number(amount);
  const canSubmit =
    name.trim() &&
    number.trim().length === 10 &&
    startDate &&
    endDate &&
    amount !== "" &&
    !isNaN(amountNum) &&
    amountNum > 0;

  const handleSave = async () => {
    if (!canSubmit) return;
    setSaving(true);
    const data = {
      name: name.trim(),
      number: number.trim(),
      totalBookings: Number(totalBookings),
      startDate,
      endDate,
      amount: amountNum,
    };
    const id = await addMembership(data);
    setSaving(false);
    if (id) {
      setSavedMembership({ ...data, id });
    }
  };

  const handleWhatsApp = () => {
    if (!savedMembership) return;
    const digits = savedMembership.number.replace(/\D/g, "").slice(-10);
    const wa = `91${digits}`;
    const msg = getMembershipWhatsAppMessage(savedMembership, propertyTitle);
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (savedMembership) {
    return (
      <Box p={6}>
        <VStack spacing={5} align="stretch">
          <Text fontSize="lg" fontWeight="bold" color="teal.700">
            Membership Added!
          </Text>
          <Text fontSize="sm" color="gray.600">
            {savedMembership.name} · {savedMembership.number}
          </Text>
          <Text fontSize="sm">
            {savedMembership.totalBookings} bookings · ₹{savedMembership.amount?.toLocaleString("en-IN")} · Valid till{" "}
            {moment(savedMembership.endDate).format("DD MMM YYYY")}
          </Text>
          <Button
            leftIcon={<ExternalLinkIcon />}
            colorScheme="green"
            onClick={handleWhatsApp}>
            Send WhatsApp
          </Button>
          <Button variant="outline" onClick={() => { onAdded?.(); onBack?.(); }}>
            Done
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        backgroundColor="rgb(20,20,20)"
        height="60px"
        display="flex"
        alignItems="center"
        px={2}
        boxShadow="sm">
        <IconButton
          icon={<ArrowBackIcon color="white" boxSize={6} />}
          onClick={onBack}
          aria-label="Back"
          bg="transparent"
          _hover={{ bg: "rgba(255,255,255,0.1)" }}
          size="lg"
        />
        <Text ml={2} fontSize="lg" color="white" fontWeight="bold">
          Add Membership
        </Text>
      </Box>

      <Box p={6}>
        <VStack spacing={4} align="stretch">
          <FormLabel mb={0}>Name</FormLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Player name"
          />

          <FormLabel mb={0}>Mobile Number</FormLabel>
          <Input
            inputMode="numeric"
            maxLength={10}
            value={number}
            onChange={(e) => setNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="10-digit number"
          />

          <FormLabel mb={0}>Total Bookings</FormLabel>
          <RadioGroup value={totalBookings} onChange={handleTotalBookingsChange}>
            <Stack direction="row" spacing={4}>
              {BOOKING_OPTIONS.map((opt) => (
                <Radio key={opt} value={String(opt)}>
                  {opt}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>

          <FormLabel mb={0}>Start Date</FormLabel>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
          />

          <FormLabel mb={0}>End Date (auto)</FormLabel>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <FormLabel mb={0}>Membership Amount (₹)</FormLabel>
          <Input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 2000"
          />

          {!canSubmit && (
            <Text fontSize="sm" color="red.500">
              Fill in name, 10-digit number, dates, and a valid amount.
            </Text>
          )}

          <Button
            colorScheme="teal"
            isLoading={saving}
            isDisabled={!canSubmit}
            onClick={handleSave}>
            Save Membership
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
