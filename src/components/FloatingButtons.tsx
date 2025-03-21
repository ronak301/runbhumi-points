import React from "react";
import { Box, IconButton, Tooltip } from "@chakra-ui/react";
import { FaWhatsapp, FaPhone, FaInstagram } from "react-icons/fa";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

const FloatingButtons = () => {
  const handlePress = (type: string, event: React.MouseEvent) => {
    const target = event.currentTarget as HTMLElement; // Ensures we get the button itself

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "customButtonClick",
      buttonId: target.id || type, // Capturing the ID or type
      buttonLabel: target.getAttribute("aria-label"), // Capturing the aria-label
      buttonClass: target.className, // Capturing button classes
    });

    switch (type) {
      case "call":
        window.location.href = "tel:+6377478355";
        break;
      case "whatsapp":
        const phoneNumber = "6377478355";
        const message = encodeURIComponent(
          "Hi, I would like to know more information about - Turf Construction - Turfwale - https://www.turfwale.com/"
        );
        window.location.href = `https://wa.me/${phoneNumber}?text=${message}`;
        break;
      case "instagram":
        window.location.href =
          "https://www.instagram.com/turfwale/?igsh=Z2tqcXVkOWoxdnNp&utm_source=qr#";
        break;
      default:
        break;
    }
  };

  return (
    <Box
      position="fixed"
      bottom="80px"
      right="20px"
      display="flex"
      flexDirection="column"
      gap="20px"
      zIndex="9999">
      <Tooltip label="https://wa.me/6377478355" placement="left">
        <IconButton
          id="whatsapp-btn"
          aria-label="WhatsApp"
          icon={<FaWhatsapp />}
          onClick={() => handlePress("whatsapp")}
          size="lg"
          borderRadius="full"
          colorScheme="whatsapp"
          backgroundColor="green.500"
          boxShadow="0px 4px 10px rgba(0, 128, 0, 0.2)"
          _hover={{ backgroundColor: "green.600", transform: "scale(1.2)" }}
          _active={{ backgroundColor: "green.700", transform: "scale(1)" }}
          fontSize="24px"
        />
      </Tooltip>

      <Tooltip label="tel:+6377478355" placement="left">
        <IconButton
          id="call-btn"
          aria-label="Call"
          icon={<FaPhone />}
          onClick={() => handlePress("call")}
          size="lg"
          borderRadius="full"
          colorScheme="blue"
          backgroundColor="blue.500"
          boxShadow="0px 4px 10px rgba(0, 0, 255, 0.2)"
          _hover={{ backgroundColor: "blue.600", transform: "scale(1.2)" }}
          _active={{ backgroundColor: "blue.700", transform: "scale(1)" }}
          fontSize="24px"
        />
      </Tooltip>

      <Tooltip label="https://www.instagram.com/turfwale/" placement="left">
        <IconButton
          id="insta-btn"
          aria-label="Instagram"
          icon={<FaInstagram />}
          onClick={() => handlePress("instagram")}
          size="lg"
          borderRadius="full"
          colorScheme="pink"
          backgroundColor="red.500"
          boxShadow="0px 4px 10px rgba(255, 0, 0, 0.2)"
          _hover={{ backgroundColor: "red.600", transform: "scale(1.2)" }}
          _active={{ backgroundColor: "red.700", transform: "scale(1)" }}
          fontSize="24px"
        />
      </Tooltip>
    </Box>
  );
};

export default FloatingButtons;
