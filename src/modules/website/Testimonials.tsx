import { Box, Heading, Image, Text, VStack } from "@chakra-ui/react";

import { motion } from "framer-motion";

const MotionBox = motion(Box);

const testimonials = [
  {
    name: "Mohit Fattawat",
    position: "Director, LBS Sports Junction, Chittor",
    testimonial:
      "TurfWale provided excellent service! The turf quality is top-notch.",
    image:
      "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-845.jpg?semt=ais_incoming",
  },
  {
    name: "Ronak Kothari",
    position: "Founder, Runbhumi Mewar",
    testimonial:
      "The team at TurfWale was incredibly professional and timely. Highly recommend!",
    image:
      "https://cdni.iconscout.com/illustration/premium/thumb/man-illustration-download-in-svg-png-gif-file-formats--portrait-beard-glasses-portraits-pack-people-illustrations-2790260.png",
  },
];

export default function Testimonials() {
  return (
    <VStack
      id="testimonials"
      spacing={8}
      p={8}
      textAlign="center"
      bg="gray.50"
      py={16}>
      <Heading size="lg" color="green.600" textDecoration="underline">
        What Our Clients Say
      </Heading>
      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={8}>
        {testimonials.map((testimonial, index) => (
          <MotionBox
            key={index}
            bg="white"
            borderRadius="lg"
            shadow="lg"
            width={{ base: "100%", sm: "45%", md: "30%" }}
            p={6}
            transition="all 0.3s"
            whileHover={{ scale: 1.05 }}
            borderWidth="1px"
            borderColor="gray.200"
            display="flex"
            flexDirection="column"
            alignItems="center">
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              borderRadius="full"
              boxSize="100px"
              objectFit="cover"
              mb={4}
            />
            <Text fontWeight="bold" color="green.600" mb={2}>
              {testimonial.name}
            </Text>
            <Text fontSize="sm" color="gray.600" mb={4}>
              {testimonial.position}
            </Text>
            <Text fontSize="md" color="gray.700" textAlign="center">
              "{testimonial.testimonial}"
            </Text>
          </MotionBox>
        ))}
      </Box>
    </VStack>
  );
}
