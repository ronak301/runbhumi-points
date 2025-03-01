import {
  Box,
  Button,
  Heading,
  Input,
  Text,
  VStack,
  Image,
  SimpleGrid,
  Container,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";

const MotionBox = motion(Box);

export default function ContactUs({
  withImage = true,
}: {
  withImage?: boolean;
}) {
  const [formStatus, setFormStatus] = useState(""); // To track form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormStatus("");

    const formData = new FormData(event.target);

    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    try {
      await fetch("https://formspree.io/f/mzzzlydl", {
        method: "POST",
        body: formData,
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json", // Make sure to set the content-type
        },
      });

      setFormStatus("Thank you! Your message has been submitted.");
      event.target.reset();
    } catch (error) {
      setFormStatus("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);

      // Clear the status message after 5 seconds
      setTimeout(() => setFormStatus(""), 5000);
    }
  };

  return (
    <Container maxW="container.lg" textAlign="center">
      <VStack
        id="contact"
        spacing={8}
        textAlign="center"
        bg="white"
        py={16}
        justify="center" // Ensures content is centered vertically
        align="center" // Ensures content is centered horizontally
        minHeight="100vh" // Make sure it takes up full height for vertical centering
      >
        <Text fontSize="2xl" fontWeight="bold" mb={6}>
          Contact Us
        </Text>

        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing={10}
          alignItems="center" // Aligns the items within the grid cell vertically
          justifyContent="center" // Centers items horizontally in the grid
          textAlign="center" // Centers the text content inside each grid cell
        >
          {/* Image Section */}
          {withImage && (
            <Box
              display={{ base: "none", md: "block" }}
              maxW="100%"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="2xl">
              <Image
                src="images/contact.jpg"
                alt="Contact Us"
                objectFit="cover"
                h={300}
              />
            </Box>
          )}

          {/* Form Section */}
          <MotionBox
            bg="white"
            p={8}
            borderRadius="lg"
            shadow="2xl"
            h="auto" // Adjust the height to auto so it expands based on the content
            width="100%"
            maxW={{ base: "100%", sm: "80%", md: "100%" }}
            id="contact-form"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5 }}>
            {/* Green Header */}
            <Heading as="h3" size="lg" color="green.500" mb={6}>
              Contact Us
            </Heading>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                <Input placeholder="Your Name" name="name" required />
                <Input
                  placeholder="Your Phone Number"
                  name="phone"
                  type="tel"
                  pattern="[0-9]{10}"
                  required
                />
                <Button
                  type="submit"
                  colorScheme="green"
                  size="lg"
                  isLoading={isSubmitting} // Show loading spinner while submitting
                >
                  Submit
                </Button>
              </VStack>
            </form>

            {/* Status Message */}
            {formStatus && (
              <Box mt={4} textAlign="center">
                <Text
                  color={
                    formStatus.includes("Oops") || formStatus.includes("error")
                      ? "red.500"
                      : "green.500"
                  }>
                  {formStatus}
                </Text>
              </Box>
            )}
          </MotionBox>
        </SimpleGrid>
      </VStack>
    </Container>
  );
}
