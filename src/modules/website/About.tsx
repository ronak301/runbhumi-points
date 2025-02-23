import { Heading, Text, VStack } from "@chakra-ui/react";
import React from "react";

const aboutUsText = `At Turfwale, we specialize in designing and constructing high-performance artificial turfs for football, cricket, and multi-sport facilities. Our expertise lies in creating durable, low-maintenance, and all-weather sports surfaces that enhance gameplay and player safety.

What We Build:
🏏 Cricket Pitches & Nets – Custom-built for professional and recreational play.
⚽ Football Turfs – FIFA-grade synthetic grass for high-intensity matches.
🏀 Multi-Sport Courts – Versatile designs for basketball, tennis, hockey, and more.
🏟️ Stadium-Grade Sports Infrastructure – Engineered for durability and superior performance.

Using advanced technology, premium artificial grass, and innovative construction methods, Turfwale ensures top-tier sports facilities tailored to your needs. Whether it's a sports academy, commercial rental turf, school ground, or private play area, we deliver excellence from design to execution.`;

export default function About() {
  return (
    <VStack id="about" spacing={8} p={8} textAlign="center" bg="white" py={16}>
      <Heading
        style={{ fontFamily: "Sora, sans-serif" }}
        size="lg"
        color="green.600"
        textDecoration="underline">
        About Us
      </Heading>
      <Text maxW="800px" fontSize="lg" lineHeight="1.8">
        {aboutUsText}
      </Text>
    </VStack>
  );
}
