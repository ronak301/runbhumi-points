import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { Link } from "react-scroll";

import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function Hero() {
  return (
    <MotionBox
      id="hero"
      bgImage={`url(https://images.pexels.com/photos/9420724/pexels-photo-9420724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)`}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      position="relative"
      color="white"
      textAlign="center"
      minHeight={{ base: "70vh", md: "85vh" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}>
      {/* Overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="black"
        opacity={0.3}
        zIndex={1}
      />
      {/* Content */}
      <Box position="relative" zIndex={2} textAlign="center" px={4}>
        <Heading
          as="h1"
          fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }}
          fontWeight="extrabold"
          mb={6}
          textShadow="3px 3px rgba(0, 0, 0, 0.5)"
          lineHeight="1.1"
          letterSpacing="wide"
          style={{ fontFamily: "Neulis Alt, sans-serif" }}
          textAlign="center">
          Turfwale
        </Heading>
        <Text
          fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
          fontWeight="bold"
          mb={8}
          textShadow="2px 2px #000000"
          lineHeight="1.2">
          India&apos;s Leading Sports Infra Manufacturer
        </Text>
        {/* CTA Buttons */}
        <Box
          mt={6}
          display="flex"
          flexDirection={{ base: "column", sm: "row" }}
          gap={4}>
          <Link to="contact-form" smooth={true} duration={800} offset={-70}>
            {" "}
            {/* Added smooth scrolling */}
            <Button
              size="lg"
              colorScheme="green"
              bg="green.600"
              _hover={{ bg: "green.600" }}
              mb={{ base: 4, sm: 0 }} // Margin bottom for mobile view
            >
              Get a Free Consultation
            </Button>
          </Link>
          <Link to="about" smooth={true} duration={800} offset={-70}>
            {" "}
            {/* Added smooth scrolling */}
            <Button
              size="lg"
              colorScheme="white"
              variant="outline"
              _hover={{ bg: "whiteAlpha.300" }}>
              Learn More
            </Button>
          </Link>
        </Box>
      </Box>
    </MotionBox>
  );
}
