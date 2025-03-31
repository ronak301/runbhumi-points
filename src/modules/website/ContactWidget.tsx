import {
  Box,
  Button,
  Heading,
  Input,
  Text,
  VStack,
  Container,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useState } from "react";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export default function ContactWidget() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState("");

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    setIsSubmitting(true);
    setFormStatus("");

    const formData = new FormData(event.currentTarget);
    const jsonData: Record<string, string> = {};
    formData.forEach((value, key) => {
      jsonData[key] = value as string;
    });

    // ✅ Send event to Google Tag Manager
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "form_submit",
      formId: "contact-form",
      formData: jsonData, // Sends all input values to GTM
    });

    console.log("jsonData", jsonData);

    try {
      const res = await fetch("https://formspree.io/f/mzzzlydl", {
        method: "POST",
        body: JSON.stringify(jsonData),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setFormStatus("Thank you!! Your message has been submitted.");
        event.target.reset(); // Reset form after submission
      } else {
        setFormStatus("Submission failed. Please try again.");
      }
    } catch (error) {
      setFormStatus("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
      // setTimeout(() => setFormStatus(""), 60000);
    }
  };

  const headingSize = useBreakpointValue({ base: "md", md: "md" });
  const textSize = useBreakpointValue({ base: "sm", md: "md" });

  return (
    <Container
      maxW={{ base: "100%", md: "md" }}
      bg="white"
      p={{ base: 3, md: 6 }}
      boxShadow="xl"
      borderRadius="lg">
      <Heading
        as="h3"
        size={headingSize}
        textAlign="center"
        bg="green.500"
        color="white"
        borderRadius={"sm"}
        p={{ base: 4, md: 4 }}>
        Planning to make a Sports Infrastructure?
      </Heading>
      <Text
        textAlign="center"
        mt={2}
        fontStyle="italic"
        color="gray.600"
        fontSize={textSize}>
        Connect with us for more details
      </Text>
      <form onSubmit={handleSubmit} data-gtm-id="contact-form">
        <VStack spacing={{ base: 3, md: 4 }} mt={4}>
          <Input
            fontSize={textSize}
            color="black"
            placeholder="Name"
            name="name"
            required
          />
          <Input
            fontSize={textSize}
            placeholder="Phone"
            name="phone"
            type="tel"
            pattern="[0-9]{10}"
            required
            color="black"
          />
          <Input
            fontSize={textSize}
            placeholder="Enter state and country"
            name="location"
            required
            color="black"
          />
          <Button
            type="submit"
            colorScheme="green"
            isLoading={isSubmitting}
            w="full"
            fontSize={textSize}
            mt={4}
            py={{ base: 6, md: 6 }}
            data-gtm-id="form-submit-btn">
            Submit
          </Button>
          {formStatus && (
            <Text
              fontSize={textSize}
              color={formStatus.includes("error") ? "red.500" : "green.500"}>
              {formStatus}
            </Text>
          )}
        </VStack>
      </form>
    </Container>
  );
}
