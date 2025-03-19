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
import ReCAPTCHA from "react-google-recaptcha";

export default function ContactWidget() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState("");
  const [captchaValue, setCaptchaValue] = useState<any>(null);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!captchaValue) {
      setFormStatus("Please verify the CAPTCHA");
      return;
    }

    setIsSubmitting(true);
    setFormStatus("");

    const formData = new FormData(event.target);

    try {
      await fetch("https://formspree.io/f/mzzzlydl", {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "application/json" },
      });

      setFormStatus("Thank you! Your message has been submitted.");
      event.target.reset();
      setCaptchaValue(null);
    } catch (error) {
      setFormStatus("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setFormStatus(""), 5000);
    }
  };

  // Responsive font sizes
  const headingSize = useBreakpointValue({ base: "lg", md: "lg" });
  const textSize = useBreakpointValue({ base: "sm", md: "md" });

  return (
    <Container
      maxW={{ base: "90%", md: "md" }}
      bg="white"
      p={{ base: 4, md: 6 }}
      boxShadow="xl"
      borderRadius="lg">
      <Heading
        as="h3"
        size={headingSize}
        textAlign="center"
        bg="green.500"
        color="white"
        p={{ base: 3, md: 4 }}
        borderRadius="md">
        PLANNING TO MAKE A SPORTS INFRASTRUCTURE?
      </Heading>
      <Text
        textAlign="center"
        mt={2}
        fontStyle="italic"
        color="gray.600"
        fontSize={textSize}>
        CONNECT WITH US FOR MORE DETAILS
      </Text>
      <form onSubmit={handleSubmit}>
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
          <Box transform="scale(0.9)">
            <ReCAPTCHA
              sitekey="6LdVOvkqAAAAAJV7bA7rPDgbVLKpoeoRkSo5QxoR"
              onChange={setCaptchaValue}
            />
          </Box>
          <Button
            type="submit"
            colorScheme="green"
            isLoading={isSubmitting}
            w="full"
            fontSize={textSize}
            py={{ base: 3, md: 4 }}>
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
