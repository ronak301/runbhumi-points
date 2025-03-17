import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  VStack,
  Button,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Parallax } from "react-parallax";

const sections = [
  {
    title: "Box Cricket: The Ultimate Game for Limited Spaces",
    text: "Box Cricket is an exciting, fast-paced format of cricket played in an enclosed space, making it ideal for urban areas, corporate events, and societies.",
    image: "https://source.unsplash.com/1600x900/?cricket,sports",
  },
  {
    title: "Standard Dimensions & Setup",
    text: "Box Cricket setups range from 50x100 feet with 25 feet net height, ensuring a compact yet thrilling gameplay.",
    image: "https://source.unsplash.com/1600x900/?stadium,field",
  },
  {
    title: "Why Artificial Turf?",
    text: "Artificial turf ensures zero maintenance, all-weather playability, and a professional game experience.",
    image: "https://source.unsplash.com/1600x900/?artificialgrass,turf",
  },
];

const MotionBox = motion(Box);

const BoxCricketPage = () => {
  return (
    <Box>
      {sections.map((section, index) => (
        <Parallax key={index} bgImage={section.image} strength={300}>
          <Container maxW="container.xl" py={20} textAlign="center">
            <MotionBox
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}>
              <Heading color="white">{section.title}</Heading>
              <Text color="white" mt={4}>
                {section.text}
              </Text>
            </MotionBox>
          </Container>
        </Parallax>
      ))}
      <VStack py={10} spacing={4} bg="gray.800" color="white">
        <Heading>Start Building Your Box Cricket Arena Today!</Heading>
        <Button colorScheme="green" size="lg">
          Contact Us
        </Button>
      </VStack>
    </Box>
  );
};

export default BoxCricketPage;
