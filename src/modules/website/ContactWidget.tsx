import {
  Box,
  Button,
  Heading,
  Input,
  Text,
  VStack,
  Container,
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

  return (
    <Container maxW="md" bg="white" p={6} boxShadow="xl" borderRadius="lg">
      <Heading
        as="h3"
        size="md"
        textAlign="center"
        bg="green.500"
        color="white"
        p={4}
        borderRadius="md">
        PLANNING TO MAKE A SPORTS INFRASTRUCTURE?
      </Heading>
      <Text
        textAlign="center"
        mt={2}
        fontStyle="italic"
        color="grey"
        fontSize={16}>
        CONNECT WITH US FOR MORE DETAILS
      </Text>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} mt={4}>
          <Input color="black" placeholder="Name" name="name" required />
          <Input
            placeholder="Phone"
            name="phone"
            type="tel"
            pattern="[0-9]{10}"
            required
            color="black"
          />
          <Input
            placeholder="Enter state and country"
            name="location"
            required
            color="black"
          />
          <ReCAPTCHA
            sitekey="6LdXUfYqAAAAADXwyQTRcLIZ-FTU4JMiUlpsKbuD"
            onChange={setCaptchaValue}
          />
          <Button
            type="submit"
            colorScheme="green"
            isLoading={isSubmitting}
            w="full">
            Submit
          </Button>
          {formStatus && (
            <Text
              color={formStatus.includes("error") ? "red.500" : "green.500"}>
              {formStatus}
            </Text>
          )}
        </VStack>
      </form>
    </Container>
  );
}
