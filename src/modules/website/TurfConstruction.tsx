import { Box, Grid, Text, VStack, Button, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionImage = motion(Image);

const TurfConstruction = () => {
  return (
    <Box bg="white" py={16} px={8} maxW="1200px" mx="auto">
      <Grid
        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
        gap={10}
        alignItems="center">
        {/* Text Section */}
        <VStack align="start" spacing={4}>
          <Text fontSize="3xl" fontWeight="bold" color="gray.800">
            Leading Turf Construction Experts in India
          </Text>
          <Text color="gray.600" fontSize="lg">
            We specialize in designing and building high-quality sports turfs
            that meet international standards. Whether it’s a football ground,
            cricket pitch, or multi-sport complex, we bring innovation and
            durability to every project.
          </Text>
          <Text color="gray.600" fontSize="md">
            Our team ensures the best surface quality with advanced materials,
            precise engineering, and expert maintenance services to keep your
            turf in top condition year-round.
          </Text>
          <Button colorScheme="green" size="lg">
            Explore Our Work
          </Button>
        </VStack>

        {/* Image Section with Animation */}
        <MotionImage
          src="https://justurf.club//assets/upload/1739089591.jpg"
          alt="Cricket Turf"
          borderRadius="lg"
          boxShadow="lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        />
      </Grid>
    </Box>
  );
};

export default TurfConstruction;
