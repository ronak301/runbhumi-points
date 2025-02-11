import { Heading, Text, VStack } from "@chakra-ui/react";
import React from "react";

export default function About() {
  return (
    <VStack
      id="about"
      spacing={8}
      p={8}
      textAlign="center"
      bg="gray.50"
      py={16}>
      <Heading
        style={{ fontFamily: "Neulis Alt, sans-serif" }}
        size="lg"
        color="green.600"
        textDecoration="underline">
        About Us
      </Heading>
      <Text maxW="800px" fontSize="lg" lineHeight="1.8">
        At Turfwale, we specialize in crafting world-class cricket and football
        turfs with a commitment to quality, innovation, and customer
        satisfaction. Our mission is to deliver exceptional sports
        infrastructure tailored to your needs.
      </Text>
    </VStack>
  );
}
