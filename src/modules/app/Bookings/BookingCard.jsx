import React from "react";
import {
  Box,
  Flex,
  Text,
  IconButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import moment from "moment";
import { map } from "lodash";
import { DeleteBooking } from "../../../components/DeleteBooking";
import { getPoints, isValidPoints } from "../Points/Points";

// This component represents each individual booking's card
const BookingCard = ({ booking, title, usersWithPoints }) => {
  const num = String(booking?.customer?.number);
  const updatedNumber = num?.startsWith("91") ? num : `91${num}`;
  const name = booking?.customer?.name;
  const advancedAmountString = booking?.amountSumary?.advanced
    ? `Advance Received: Rs. ${booking?.amountSumary?.advanced}`
    : "";

  const linkedUser = usersWithPoints.find(
    (user) =>
      user?.number?.replace(/\s/g, "").slice(-10) ===
      num?.replace(/\s/g, "").slice(-10)
  );

  const getSlotsInfo = (booking) => {
    const slots = booking?.slots;
    const slotsInfo = slots.map((slot) => {
      return slot.title;
    });
    const info = slotsInfo.join(", ");

    const matches = [...info.matchAll(/-/g)];
    const indexes = matches.map((match) => match.index);
    if (indexes.length === 1) {
      return info;
    } else {
      const start = indexes[0];
      const end = indexes[indexes.length - 1];
      return info.slice(0, start) + info.slice(end);
    }
  };

  const pointsAvailable = isValidPoints(linkedUser)
    ? getPoints(linkedUser?.points)
    : 0;

  return (
    <Box
      boxShadow="lg"
      backgroundColor={"white"}
      mt={2}
      mb={2}
      pb={3}
      pl={3}
      pr={3}
      borderRadius={8}
      pt={3}
      _hover={{
        boxShadow: "2xl",
        transform: "scale(1.02)",
        transition: "all 0.2s ease",
      }}>
      <Flex justifyContent={"space-between"} align="center">
        <Text fontSize="lg" fontWeight="bold" color="teal.700">
          {name}
        </Text>
        <Flex>
          <Text fontWeight="500" fontSize="md" px={2}>
            {getSlotsInfo(booking)}
          </Text>
          <Text fontWeight="500" ml={2} fontSize="md" px={2}>
            {moment(booking?.bookingDate).format("DD-MM-YYYY")}
          </Text>
        </Flex>
      </Flex>
      <Text fontSize="sm" color="gray.600">
        {num}
      </Text>

      <Flex justifyContent={"space-between"} mt={4}>
        <DeleteBooking booking={booking} />
        <Box>
          <IconButton
            onClick={() => {
              const message = `
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
              window.open(
                `https://api.whatsapp.com/send/?phone=${updatedNumber}&text=${encodeURIComponent(
                  message
                )}`,
                "_blank"
              );
            }}
            isRound
            colorScheme="green"
            aria-label="Share"
            icon={<ExternalLinkIcon />}
            mr={2}
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default BookingCard;