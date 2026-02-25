import React from "react";
import { Box, Flex, Text, IconButton } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import moment from "moment";
import { DeleteBooking } from "../../../components/DeleteBooking";
import { getPoints, isValidPoints } from "../Points/Points";
import useCurrentProperty from "../hooks/useCurrentProperty";

// This component represents each individual booking's card
const BookingCard = ({ onComplete, booking, title, usersWithPoints }) => {
  const num = String(booking?.customer?.number);
  const updatedNumber = (() => {
    const digits = num.replace(/\D/g, "");
    const last10 = digits.slice(-10);
    return `91${last10}`;
  })();
  const name = booking?.customer?.name;
  const { propertyId } = useCurrentProperty();
  const advancedAmountString = booking?.amountSumary?.advanced
    ? `Advance Received: Rs. ${booking?.amountSumary?.advanced}`
    : "";

  const linkedUser = usersWithPoints.find((user) => {
    const uNum = String(user?.number || "").replace(/\s/g, "");
    const bNum = num.replace(/\s/g, "");
    return uNum.slice(-10) === bNum.slice(-10);
  });

  const getFormattedTime = (time) => {
    if (!time || typeof time !== "string" || !time.includes(":")) {
      return time || "";
    }
    let [hours, minutes] = time.split(":").map((v) => Number(v || 0));
    const suffix = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return minutes === 0
      ? `${hours}`
      : `${hours}:${minutes.toString().padStart(2, "0")}`;
  };

  const getSlotsInfo = (booking) => {
    const rawSlots = booking?.slots || [];
    // Normalise possible legacy shapes: { title }, { slot: { title } }
    const slots = rawSlots
      .map((s) => {
        if (s && typeof s.title === "string") return s;
        if (s && s.slot && typeof s.slot.title === "string") return s.slot;
        return null;
      })
      .filter(Boolean);

    if (!slots.length) return "";

    if (propertyId === "iNANAwfMb6EXNtp7MRwJ") {
      const titles = slots.map((slot) => slot.title);
      const info = titles.join(", ");
      const matches = [...info.matchAll(/-/g)];
      const indexes = matches.map((match) => match.index);
      if (indexes.length === 1) return info;
      const start = indexes[0];
      const end = indexes[indexes.length - 1];
      return info.slice(0, start) + info.slice(end);
    }

    const courtId = slots[0]?.courtId;
    const courtLabel = courtId
      ? `Court ${courtId.replace("court", "")} • `
      : "";

    const titles = slots.map((slot) => slot.title);

    // Get first and last time from all slots
    const firstSlot = titles[0];
    const lastSlot = titles[titles.length - 1];
    if (!firstSlot || !lastSlot || !firstSlot.includes(" - ") || !lastSlot.includes(" - ")) {
      return courtLabel + (firstSlot || "");
    }
    const startTime = firstSlot.split(" - ")[0];
    const endTime = lastSlot.split(" - ")[1];

    const suffix = Number(startTime.split(":")[0]) >= 12 ? "PM" : "AM";

    return `${courtLabel}${getFormattedTime(startTime)} - ${getFormattedTime(
      endTime
    )} ${suffix}`;
  };

  const pointsAvailable = isValidPoints(linkedUser)
    ? getPoints(linkedUser?.points)
    : 0;

  const totalAmount = booking?.amountSumary?.total ?? 0;
  const formattedTotal = totalAmount.toLocaleString("en-IN");
  const displayDate = moment(booking?.bookingDate).format("DD MMM YYYY");

  const getMessage = () => {
    switch (propertyId) {
      case "iNANAwfMb6EXNtp7MRwJ":
        return `
*🏏${title} Booking Confirmation🏏*
Name: ${name}
Mobile: ${num}
Location: F-266, Road No. 12, Near Airtel Office, Madri Industrial Area
Map: https://maps.app.goo.gl/QAs3A9APjdqRZfmS9
Date of Booking: ${moment(booking?.bookingDate).format("DD-MM-YYYY")}
Time Slots: ${getSlotsInfo(booking)}
*Total Amount: Rs. ${booking?.amountSumary?.total}*
${advancedAmountString}
Points Available: ${pointsAvailable}
              `;
      case "4HJl3JYH5TzUeylFEHKj":
        return `
*🏏${title} Booking Confirmation🏏*
Name: ${name}
Mobile: ${num}
Location: Behind Vatsalya academy, Tagore Nagar, Sector 4, Hiran Magri, Udaipur
Map: https://maps.app.goo.gl/gCNNeNtW6yQEAmmKA
Date of Booking: ${moment(booking?.bookingDate).format("DD-MM-YYYY")}
Time Slots: ${getSlotsInfo(booking)}
*Total Amount: Rs. ${booking?.amountSumary?.total}*
${advancedAmountString}
              `;
      case "D5FfylDnU6NXlmTtPtoj":
        return `
*🏏Booking Confirmation🏏*
*Satyam Sports Arena*
Name: ${name}
Mobile: ${num}
Location: Gopal mill, near railway underpass
Map: https://maps.app.goo.gl/4sEQXASVY2TGrXxQ7
Date of Booking: ${moment(booking?.bookingDate).format("DD-MM-YYYY")}
Time Slots: ${getSlotsInfo(booking)}
*Total Amount: Rs. ${booking?.amountSumary?.total}*
${advancedAmountString}
              `;
      case "2H3Ld4uq17AeCtfXpuo0":
        return `
*🏏${title} Booking Confirmation🏏*
Name: ${name}
Mobile: ${num}
Location: 1, New Vidhya Nagar
Near Samudayik Bhawan, BSNL Road
Hiran Magri, Sector 4, Udaipur
Map: https://maps.app.goo.gl/x3UwszbasrKsUyFP6
Date of Booking: ${moment(booking?.bookingDate).format("DD-MM-YYYY")}
Time Slots: ${getSlotsInfo(booking)}
*Total Amount: Rs. ${booking?.amountSumary?.total}*
${advancedAmountString}
              `;
      default:
        return `
*🏏${title} - Booking Confirmation🏏*
Name: ${name}
Mobile: ${num}
Date of Booking: ${moment(booking?.bookingDate).format("DD-MM-YYYY")}
Time Slots: ${getSlotsInfo(booking)}
*Total Amount: Rs. ${booking?.amountSumary?.total}*
${advancedAmountString}
              `;
    }
  };

  const message = getMessage();

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      backgroundColor="white"
      mt={2}
      mb={2}
      px={3}
      py={3}
      boxShadow="sm"
      _hover={{ boxShadow: "md" }}>
      <Flex justifyContent="space-between" align="center" mb={2}>
        <Box>
          <Text fontSize="sm" fontWeight="600" color="teal.700">
            {name}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {num}
          </Text>
        </Box>
        <Text fontSize="sm" fontWeight="700" color="teal.700">
          ₹{formattedTotal}
        </Text>
      </Flex>

      <Text fontSize="xs" color="gray.700">
        {displayDate} · {getSlotsInfo(booking)}
      </Text>

      <Flex justifyContent="space-between" align="center" mt={3}>
        <DeleteBooking booking={booking} onComplete={onComplete} />
        <Box>
          <IconButton
            size="sm"
            onClick={() => {
              const url = `https://wa.me/${updatedNumber}?text=${encodeURIComponent(
                message
              )}`;
              window.open(url, "_blank");
            }}
            isRound
            colorScheme="green"
            aria-label="Share"
            icon={<ExternalLinkIcon />}
            mr={1}
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default BookingCard;
