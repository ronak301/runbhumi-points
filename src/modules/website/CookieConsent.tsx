import { Box, Button, Text, Slide } from "@chakra-ui/react";
import { useState, useEffect } from "react";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // For unmounting after animation

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowBanner(false);
    setTimeout(() => setIsVisible(false), 300); // Unmount after animation
  };

  if (!isVisible) return null; // Completely remove from DOM when not visible

  return (
    <Slide direction="bottom" in={showBanner} style={{ zIndex: 1000 }}>
      <Box
        position="fixed"
        bottom="0"
        width="100%"
        bg="gray.900"
        color="white"
        p={4}
        textAlign="center">
        <Text fontSize="sm">
          This website uses cookies to improve your experience. By continuing to
          use our site, you accept our use of cookies.
        </Text>
        <Button size="sm" colorScheme="green" mt={2} onClick={handleAccept}>
          Accept
        </Button>
      </Box>
    </Slide>
  );
};

export default CookieConsent;
