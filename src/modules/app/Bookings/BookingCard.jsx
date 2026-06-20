import React from "react";
import { Box, Flex, Text, IconButton, Badge } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import moment from "moment";
import { DeleteBooking } from "../../../components/DeleteBooking";
import { getPoints, isValidPoints } from "../Points/Points";
import useCurrentProperty from "../hooks/useCurrentProperty";
import { EditBookingButton } from "./EditBookingModal";
import { getSlotsSummary } from "./bookingDisplay";

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
  const discountAmount = Number(booking?.amountSumary?.discount) || 0;
  const discountString =
    discountAmount > 0
      ? `Discount: Rs. ${booking?.amountSumary?.discount}`
      : "";

  const linkedUser = usersWithPoints.find((user) => {
    const uNum = String(user?.number || "").replace(/\s/g, "");
    const bNum = num.replace(/\s/g, "");
    return uNum.slice(-10) === bNum.slice(-10);
  });

  const pointsAvailable = isValidPoints(linkedUser)
    ? getPoints(linkedUser?.points)
    : 0;

  const totalAmount = booking?.amountSumary?.total ?? 0;
  const advancedAmount = Number(booking?.amountSumary?.advanced) || 0;
  const formattedTotal = totalAmount.toLocaleString("en-IN");
  const displayDate = moment(booking?.bookingDate).format("DD MMM YYYY");

  const getMembershipLine = () => {
    const idx = booking?.membershipBookingIndex;
    const total = booking?.membershipTotalBookings;
    const end = booking?.membershipEndDate;
    const validTill = end ? `Valid Till: ${moment(end).format("DD/MM/YYYY")}` : "";
    return `Booking: ${idx} of ${total}\n${validTill}`;
  };

  const getMessage = () => {
    if (booking?.isMembershipBooking) {
      const membershipLine = getMembershipLine();
      switch (propertyId) {
        case "iNANAwfMb6EXNtp7MRwJ":
          return `
*🏏${title} Booking Confirmation🏏*
Name: ${name}
Mobile: ${num}
Location: F-266, Road No. 12, Near Airtel Office, Madri Industrial Area
Map: https://maps.app.goo.gl/QAs3A9APjdqRZfmS9
Date of Booking: ${moment(booking?.bookingDate).format("DD-MM-YYYY")}
Time Slots: ${getSlotsSummary(booking, propertyId)}
${membershipLine}
              `;
        case "4HJl3JYH5TzUeylFEHKj":
          return `
*🏏${title} Booking Confirmation🏏*
Name: ${name}
Mobile: ${num}
Location: Behind Vatsalya academy, Tagore Nagar, Sector 4, Hiran Magri, Udaipur
Map: https://maps.app.goo.gl/gCNNeNtW6yQEAmmKA
Date of Booking: ${moment(booking?.bookingDate).format("DD-MM-YYYY")}
Time Slots: ${getSlotsSummary(booking, propertyId)}
${membershipLine}
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
Time Slots: ${getSlotsSummary(booking, propertyId)}
${membershipLine}
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
Time Slots: ${getSlotsSummary(booking, propertyId)}
${membershipLine}
              `;
        default:
          return `
*🏏${title} - Booking Confirmation🏏*
Name: ${name}
Mobile: ${num}
Date of Booking: ${moment(booking?.bookingDate).format("DD-MM-YYYY")}
Time Slots: ${getSlotsSummary(booking, propertyId)}
${membershipLine}
              `;
      }
    }

    const totalLine = `*Total Amount: Rs. ${booking?.amountSumary?.total}*`;
    const discountLine = discountString ? `${discountString}\n` : "";
    switch (propertyId) {
      case "iNANAwfMb6EXNtp7MRwJ":
        return `
*🏏${title} Booking Confirmation🏏*
Name: ${name}
Mobile: ${num}
Location: F-266, Road No. 12, Near Airtel Office, Madri Industrial Area
Map: https://maps.app.goo.gl/QAs3A9APjdqRZfmS9
Date of Booking: ${moment(booking?.bookingDate).format("DD-MM-YYYY")}
Time Slots: ${getSlotsSummary(booking, propertyId)}
${discountLine}${totalLine}
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
Time Slots: ${getSlotsSummary(booking, propertyId)}
${discountLine}${totalLine}
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
Time Slots: ${getSlotsSummary(booking, propertyId)}
${discountLine}${totalLine}
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
Time Slots: ${getSlotsSummary(booking, propertyId)}
${discountLine}${totalLine}
${advancedAmountString}

*Note:* Maximum 4 persons per court. Extra charges apply for additional persons.
              `;
      default:
        return `
*🏏${title} - Booking Confirmation🏏*
Name: ${name}
Mobile: ${num}
Date of Booking: ${moment(booking?.bookingDate).format("DD-MM-YYYY")}
Time Slots: ${getSlotsSummary(booking, propertyId)}
${discountLine}${totalLine}
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
      {booking?.isMembershipBooking && (
        <Badge colorScheme="purple" borderRadius="full" px={2} fontSize="xs" mb={2}>
          Member · {booking.membershipBookingIndex}/{booking.membershipTotalBookings}
        </Badge>
      )}
      <Flex justifyContent="space-between" align="center" mb={2} gap={2}>
        <Box flex="1" minW={0}>
          <Text fontSize="sm" fontWeight="600" color="teal.700" mb={0.5}>
            {name}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {num}
          </Text>
        </Box>
        {!booking?.isMembershipBooking && (
          <Text fontSize="sm" fontWeight="700" color="teal.700" flexShrink={0}>
            ₹{formattedTotal}
          </Text>
        )}
      </Flex>

      <Text fontSize="xs" color="gray.700">
        {displayDate} · {getSlotsSummary(booking, propertyId)}
      </Text>
      {discountAmount > 0 && (
        <Text fontSize="xs" color="orange.600" mt={1}>
          Discount: ₹{discountAmount.toLocaleString("en-IN")}
        </Text>
      )}
      {advancedAmount > 0 && (
        <Text fontSize="xs" color="gray.600" mt={1}>
          Advanced: ₹{advancedAmount.toLocaleString("en-IN")}
        </Text>
      )}

      <Flex justifyContent="space-between" align="center" mt={3}>
        <Flex align="center" gap={1}>
          {!booking?.isMembershipBooking && (
            <>
              <DeleteBooking booking={booking} onComplete={onComplete} />
              <EditBookingButton booking={booking} onComplete={onComplete} />
            </>
          )}
        </Flex>
        <Box>
          <IconButton
            size="sm"
            onClick={() => {
              const url = `https://wa.me/${updatedNumber}?text=${encodeURIComponent(
                message,
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
