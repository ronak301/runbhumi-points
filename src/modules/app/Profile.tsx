import React from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Profile({ onLogout }: any) {
  return (
    <Box p={6} textAlign="center">
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        User Profile
      </Text>
      <Text fontSize="md" mb={8}>
        Manage your account settings here.
      </Text>
      <Button colorScheme="red" onClick={onLogout}>
        Logout
      </Button>
    </Box>
  );
}
