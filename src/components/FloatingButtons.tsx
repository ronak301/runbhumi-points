import React from "react";
import { Box, Tooltip } from "@chakra-ui/react";
import { FaWhatsapp, FaPhone, FaInstagram } from "react-icons/fa";

const FloatingButtons = () => {
  return (
    <Box
      position="fixed"
      bottom="80px"
      right="20px"
      display="flex"
      flexDirection="column"
      gap="20px"
      zIndex="9999">
      {/* WhatsApp Button */}
      <Tooltip label="WhatsApp" placement="left">
        <a
          href="https://wa.me/6377478355"
          target="_blank"
          rel="noopener noreferrer">
          <Box
            as="button"
            borderRadius="full"
            p="12px"
            bg="green.500"
            color="white"
            boxShadow="0px 4px 10px rgba(0, 128, 0, 0.2)"
            _hover={{ bg: "green.600", transform: "scale(1.2)" }}
            _active={{ bg: "green.700", transform: "scale(1)" }}>
            <FaWhatsapp size={24} />
          </Box>
        </a>
      </Tooltip>

      {/* Call Button */}
      <Tooltip label="Call" placement="left">
        <a href="tel:+6377478355">
          <Box
            as="button"
            borderRadius="full"
            p="12px"
            bg="blue.500"
            color="white"
            boxShadow="0px 4px 10px rgba(0, 0, 255, 0.2)"
            _hover={{ bg: "blue.600", transform: "scale(1.2)" }}
            _active={{ bg: "blue.700", transform: "scale(1)" }}>
            <FaPhone size={24} />
          </Box>
        </a>
      </Tooltip>

      {/* Instagram Button */}
      <Tooltip label="Instagram" placement="left">
        <a
          href="https://www.instagram.com/turfwale/"
          target="_blank"
          rel="noopener noreferrer">
          <Box
            as="button"
            borderRadius="full"
            p="12px"
            bg="red.500"
            color="white"
            boxShadow="0px 4px 10px rgba(255, 0, 0, 0.2)"
            _hover={{ bg: "red.600", transform: "scale(1.2)" }}
            _active={{ bg: "red.700", transform: "scale(1)" }}>
            <FaInstagram size={24} />
          </Box>
        </a>
      </Tooltip>
    </Box>
  );
};

export default FloatingButtons;
