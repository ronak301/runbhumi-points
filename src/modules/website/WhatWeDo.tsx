import { Box, Grid, Text, VStack } from "@chakra-ui/react";
import {
  FaTools,
  FaUsers,
  FaCheckCircle,
  FaFutbol,
  FaAward,
} from "react-icons/fa";

const services = [
  { title: "CRICKET TURF", image: "/images/cricket_turf.jpeg" },
  { title: "PICKLE BALL COURT", image: "/images/pickleball.jpg" },
  { title: "FOOTBALL TURF", image: "/images/football_turf.png" },
  { title: "BADMINTON COURT", image: "/images/badminton_court.webp" },
  { title: "MULTISPORT TURF", image: "/images/multisport_turf.jpeg" },
  { title: "TURF MAINTENANCE", image: "/images/turf_maintenance.png" },
];

const qualities = [
  { title: "Advanced Technology", icon: FaTools },
  { title: "FIFA Approved", icon: FaFutbol },
  { title: "Quality Speaks", icon: FaCheckCircle },
  { title: "Best Team", icon: FaUsers },
  { title: "Best Maintenance Team", icon: FaAward },
];

const WhatWeDo = () => {
  return (
    <Box bg="gray.100" py={10} px={{ base: 5, md: 32 }} textAlign="center">
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        WHAT WE BUILD
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
            p={8}
            borderRadius="lg"
            boxShadow="lg"
            spacing={3}
            align="center"
            width="100%">
            <img
              src={service.image}
              alt={service.title}
              style={{
                borderRadius: "8px",
                width: "360px",
                height: "200px",
                objectFit: "cover",
              }}
            />
            <Text fontWeight="bold" textAlign="center" fontSize={"lg"} mt={2}>
              {service.title}
            </Text>
          </VStack>
        ))}
      </Grid>

      <Box mt={10}>
        <Text fontSize="2xl" fontWeight="bold" mb={6}>
          WHY CHOOSE US
        </Text>
        <Grid
          templateColumns={{
            base: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(5, 1fr)",
          }}
          gap={6}>
          {qualities.map((quality, index) => (
            <VStack
              key={index}
              bg="white"
              p={6}
              borderRadius="lg"
              boxShadow="lg"
              spacing={3}
              align="center">
              <quality.icon size={50} color="gray.700" />
              <Text fontWeight="bold" textAlign="center">
                {quality.title}
              </Text>
            </VStack>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default WhatWeDo;
