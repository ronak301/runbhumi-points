import { Box, Button, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";

const MotionBox = motion(Box);

export default function ContactUs() {
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
    <VStack
      id="contact"
      spacing={8}
      p={8}
      textAlign="center"
      bg="gray.50"
      py={16}>
      <Heading size="lg" color="green.600" textDecoration="underline">
        Contact Us
      </Heading>

      <MotionBox
        bg="white"
        p={8}
        borderRadius="lg"
        shadow="2xl"
        width={{ base: "100%", sm: "80%", md: "60%" }}
        id="contact-form"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.5 }}>
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
    </VStack>
  );
}
