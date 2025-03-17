import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { Link } from "react-scroll";
import ContactWidget from "./ContactWidget";

export default function Hero() {
  return (
    <Box
      id="hero"
      position="relative"
      minHeight="100vh"
      bgImage="url('/images/hero-image.webp')"
      bgSize="cover"
      bgPosition="center center"
      bgRepeat="no-repeat"
      display="flex"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      color="white"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bg: "blackAlpha.800", // Darker overlay to enhance readability
        zIndex: 1, // Overlay is above background but below content
      }}>
      {/* Overlay Content */}
      <Box display="flex" flexDirection={"row"} position="relative" zIndex={2}>
        <Box position="relative" zIndex={2} maxW="xl" px={6}>
          <Heading
            as="h1"
            color="white"
            fontSize={{ base: "4xl", md: "6xl" }}
            fontWeight="bold"
            style={{ fontFamily: "Sora, sans-serif" }}>
            Artificial Sports Court Construction?
          </Heading>
          <Text fontSize={{ base: "lg", md: "2xl" }} mt={2} opacity={0.9}>
            You've Arrived At India's Best!
          </Text>
          <Text fontSize={{ base: "md", md: "lg" }} mt={4} opacity={0.9}>
            Choose Turfwale for premium, tech-enabled artificial turf
            construction, delivering custom-built sports fields with top-notch
            quality.
          </Text>
          <Link to="contact-form" smooth={true} duration={800} offset={-70}>
            <Button
              mt={6}
              size="lg"
              borderWidth={1}
              borderColor={"white"}
              colorScheme="transparent"
              bg="transparent"
              _hover={{ bg: "green.600" }}>
              Get a Quote
            </Button>
          </Link>
        </Box>
        <Box position="relative" zIndex={2} ml={{ base: 0, md: 40 }}>
          <ContactWidget />
        </Box>
      </Box>
    </Box>
  );
}
