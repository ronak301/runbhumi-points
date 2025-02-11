import { Box, Flex, Heading, Image, Text, VStack } from "@chakra-ui/react";

import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionImage = motion(Image);

export default function Features() {
  return (
    <VStack
      id="features"
      spacing={8}
      p={8}
      textAlign="center"
      py={16}
      bg="gray.100">
      <Heading size="lg" color="green.600" textDecoration="underline">
        Our Features
      </Heading>
      <Flex wrap="wrap" justify="center" gap={8}>
        {[
          {
            title: "Free Consultation",
            description:
              "Expert advice tailored to your project requirements, at no cost.",
            image:
              "https://images.pexels.com/photos/5816291/pexels-photo-5816291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          },
          {
            title: "Quality Construction",
            description:
              "Durable and premium turf construction for long-lasting performance.",
            image: "https://justurf.club//assets/upload/1732193865.jpg",
          },
          {
            title: "Booking Management Portal",
            description:
              "Manage bookings and schedules effortlessly with our advanced platform.",
            image:
              "https://images.pexels.com/photos/572056/pexels-photo-572056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          },
        ].map((feature, index) => (
          <MotionBox
            key={index}
            p={6}
            bg="white"
            borderRadius="lg"
            shadow="md"
            width={{ base: "100%", sm: "45%", lg: "30%" }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}>
            <MotionImage
              src={feature.image}
              alt={feature.title}
              mb={4}
              borderRadius="md"
              h={200}
              w="100%"
            />
            <Heading size="md" color="green.600" mb={2}>
              {feature.title}
            </Heading>
            <Text fontSize="sm" color="gray.700">
              {feature.description}
            </Text>
          </MotionBox>
        ))}
      </Flex>
    </VStack>
  );
}
