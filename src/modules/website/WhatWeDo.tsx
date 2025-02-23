import { Box, Grid, Image, Text, VStack } from "@chakra-ui/react";

const services = [
  { title: "CRICKET TURF", image: "/images/cricket_turf.jpeg" },
  { title: "PICKLE BALL COURT", image: "/images/pickleball.webp" },
  { title: "FOOTBALL TURF", image: "/images/football_turf.png" },
  { title: "BADMINTON COURT", image: "/images/badminton_court.webp" },
  { title: "MULTISPORT TURF", image: "/images/multisport_turf.jpeg" },
  { title: "TURF MAINTENANCE", image: "/images/turf_maintenance.png" },
];

const WhatWeDo = () => {
  return (
    <Box bg="gray.100" py={10} px={32} textAlign="center">
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        WHAT WE DO
      </Text>
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={6}>
        {services.map((service, index) => (
          <VStack
            key={index}
            bg="white"
            p={4}
            borderRadius="lg"
            boxShadow="lg"
            spacing={3}
            align="center"
            width="100%">
            <Image
              src={service.image}
              alt={service.title}
              borderRadius="md"
              boxSize="200px"
              objectFit="cover"
            />
            <Text fontWeight="bold" textAlign="center">
              {service.title}
            </Text>
          </VStack>
        ))}
      </Grid>
    </Box>
  );
};

export default WhatWeDo;
