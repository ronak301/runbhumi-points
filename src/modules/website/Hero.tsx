import {
  Box,
  Button,
  Heading,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Link } from "react-scroll";
import ContactWidget from "./ContactWidget";
import React from "react";

export default function Hero() {
  // Select the video source based on screen size
  const videoSrc = useBreakpointValue({
    base: "/videos/hero_mobile.mp4", // Mobile
    md: "/videos/hero.mp4", // Desktop
  });

  // Check if it's mobile view
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [videoLoaded, setVideoLoaded] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => setVideoLoaded(true), 100); // Delay by 2 sec
  }, []);

  return (
    <Box
      id="hero"
      position="relative"
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      color="white"
      overflow="hidden">
      {videoLoaded ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/images/cricket_turf.webp" // Add a lightweight static image
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -1,
          }}>
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : null}

      {/* Overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.700" // Dark overlay for readability
        zIndex={1}
      />

      {/* Mobile View: SEO Optimized Text & Contact Widget */}
      {isMobile ? (
        <Box position="relative" zIndex={2} px={4} textAlign="center" pb={32}>
          <Heading
            as="h1"
            color="white"
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="bold"
            mt={12}
            mb={12}>
            India's Leading Sports Infra Construction Experts!
          </Heading>
          <ContactWidget />
        </Box>
      ) : (
        // Desktop View: Full Content
        <Box
          display="flex"
          flexDirection="row"
          position="relative"
          zIndex={2}
          alignItems={"center"}>
          <Box position="relative" zIndex={2} maxW="xl" px={6}>
            <Heading
              as="h1"
              color="white"
              fontSize={{ base: "4xl", md: "6xl" }}
              fontWeight="bold"
              style={{ fontFamily: "Sora, sans-serif" }}>
              Cricket Turf Construction ?
            </Heading>
            <Text fontSize={{ base: "lg", md: "2xl" }} mt={2} opacity={0.9}>
              You've Arrived At{" "}
              <Text
                as="span"
                fontSize={{ base: "2xl", md: "4xl" }}
                fontWeight="bold">
                India's Best!
              </Text>
            </Text>
            <Text fontSize={{ base: "md", md: "lg" }} mt={4} opacity={0.9}>
              Choose Turfwale for premium, tech-enabled artificial turf
              construction, delivering custom-built sports fields with top-notch
              quality.
            </Text>
            {/* <Link to="contact-form" smooth={true} duration={800} offset={-70}>
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
            </Link> */}
          </Box>
          <Box position="relative" zIndex={2} ml={{ base: 0, md: 40 }}>
            <ContactWidget />
          </Box>
        </Box>
      )}
    </Box>
  );
}
