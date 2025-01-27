import { Box, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";

export default function NoBookings() {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      h="100vh" // Full height of the viewport
      p={4}>
      <Image
        src="/empty.svg" // Relative path to the file in the public folder
        alt="No bookings illustration"
        boxSize="100px" // Set both width and height to 100px
        mb={6} // Margin below the image
        objectFit="contain" // Ensure the image maintains its aspect ratio
      />
      <Text
        textAlign={"center"}
        fontSize="2xl"
        fontWeight="semibold"
        color="gray.700">
        No Bookings Available
      </Text>
      <Text textAlign={"center"} fontSize="md" color="gray.500" mt={2}>
        Add a new booking.
      </Text>
    </Flex>
  );
}
