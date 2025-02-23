import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
} from "@chakra-ui/react";
import { Link } from "react-scroll";

export default function Hero() {
  return (
    <Box
      id="hero"
      bg="white"
      minHeight="80vh"
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      alignItems="center"
      justifyContent="space-between"
      px={{ base: 6, md: 32 }}
      py={{ base: 10, md: 20 }}
      gap={10}>
      {/* Left Section (Text + CTA) */}
      <Box flex="1" textAlign={{ base: "center", md: "left" }}>
        <Text fontSize="lg" color="red.500" fontWeight="bold">
          Elevate Your Game with
        </Text>
        <Heading
          as="h1"
          fontSize={{ base: "3xl", md: "5xl" }}
          fontWeight="bold"
          style={{ fontFamily: "Sora, sans-serif" }}>
          High-Performance Sports Courts <br />
          <Text as="span" color="black" fontWeight="extrabold">
            Built for Champions
          </Text>
        </Heading>

        <Text fontSize="lg" opacity={0.8} maxW="xl" mt={4}>
          At{" "}
          <Text as="span" fontWeight="bold">
            Turfwale
          </Text>
          , we specialize in crafting premium-quality sports surfaces tailored
          to your needs. Whether it's football, tennis, or multi-sport
          facilities, we bring expertise and innovation to every
          project—ensuring top-tier durability, safety, and performance.
        </Text>

        <HStack
          spacing={6}
          mt={6}
          justify={{ base: "center", md: "flex-start" }}>
          <Link to="contact-form" smooth={true} duration={800} offset={-70}>
            <Button
              size="lg"
              colorScheme="green"
              bg="green.500"
              _hover={{ bg: "green.600" }}>
              Get Started
            </Button>
          </Link>
          <Link to="projects" smooth={true} duration={800} offset={-70}>
            <Button
              size="lg"
              colorScheme="gray"
              variant="outline"
              _hover={{ bg: "gray.200" }}>
              View Our Work
            </Button>
          </Link>
        </HStack>
      </Box>

      {/* Right Section (Local Image) */}
      <Box flex="1" display="flex" justifyContent="center">
        <Image
          src="/images/hero-image.jpg"
          alt="Turf Construction"
          maxW={{ base: "100%", md: "100%" }}
          maxH={{ base: "300px", md: "500px" }}
          objectFit="contain" // Ensures image fits without cropping
          borderRadius="lg"
          boxShadow="lg"
        />
      </Box>
    </Box>
  );
}
