import { Box, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function Footer() {
  return (
    <MotionBox
      bg="green.600"
      color="white"
      textAlign="center"
      py={6}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}>
      <Text fontSize="md" mb={2}>
        Contact us today at{" "}
        <a href="tel:6377478355" style={{ fontWeight: "bold" }}>
          6377478355
        </a>{" "}
        for more details!
      </Text>
      <Text fontSize="sm">&copy; 2025 Turfwale. All rights reserved.</Text>
    </MotionBox>
  );
}
