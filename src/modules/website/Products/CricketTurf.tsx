import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  VStack,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import PageHeader from "../PageHeader";

const sections = [
  {
    title: "What is Box Cricket?",
    description:
      "Box Cricket is a fast-paced, modified version of cricket played in an enclosed area with netted boundaries. It’s ideal for limited spaces while maintaining the excitement of the traditional game.",
    image:
      "https://images.pexels.com/photos/31217414/pexels-photo-31217414/free-photo-of-two-cricket-players-in-action-on-a-sunny-day.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    title: "Standard Dimensions",
    description:
      "The typical Box Cricket field ranges from 50x100 feet with a 25-foot-high net. It allows for dynamic, uninterrupted gameplay while keeping the ball in play at all times.",
    image:
      "https://images.pexels.com/photos/5691667/pexels-photo-5691667.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    title: "Artificial Turf Benefits",
    description:
      "Artificial turf offers durability, all-weather playability, and minimal maintenance. It's designed to replicate natural grass while providing a professional playing experience.",
    image:
      "https://images.pexels.com/photos/4747326/pexels-photo-4747326.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
];

const MotionBox = motion(Box);

const BoxCricketPage = () => {
  return (
    <>
      <PageHeader
        title="Turf Cricket"
        imageUrl="https://images.pexels.com/photos/31223121/pexels-photo-31223121/free-photo-of-close-up-of-a-tennis-ball-on-grass.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />
      <Box bg="gray.50" py={12}>
        <Container maxW="container.lg" textAlign="center">
          <Heading size="xl" color="gray.800">
            Box Cricket: The Ultimate Turf Experience
          </Heading>
          <Text fontSize="lg" color="gray.600" mt={4}>
            Discover the thrill of Box Cricket with high-quality turf, strategic
            dimensions, and a game format suited for urban play areas, schools,
            and corporate setups.
          </Text>
        </Container>

        {sections.map((section, index) => (
          <Container maxW="container.lg" py={12} key={index}>
            <Flex
              direction={{
                base: "column",
                md: index % 2 === 0 ? "row" : "row-reverse",
              }}
              align="center"
              gap={10}>
              <MotionBox
                flex="1"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                textAlign={{ base: "center", md: "left" }}>
                <Heading size="lg" color="gray.800">
                  {section.title}
                </Heading>
                <Text mt={4} fontSize="md" color="gray.600">
                  {section.description}
                </Text>
              </MotionBox>
              <Image
                src={section.image}
                alt={section.title}
                borderRadius="lg"
                flex="1"
                boxShadow="lg"
                height="300px"
                width="100%"
                objectFit="cover"
              />
            </Flex>
            <Divider my={10} />
          </Container>
        ))}

        {/* Footer Section */}
        {/* <Box bg="gray.100" py={6} mt={10} textAlign="center">
          <Text fontSize="md" color="gray.700">
            For a detailed breakdown of what we provide, refer to the PDF
            document.
          </Text>
        </Box> */}
      </Box>
    </>
  );
};

export default BoxCricketPage;
