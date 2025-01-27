import React from "react";
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Avatar,
  Divider,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

// Define the Profile component to receive `onLogout` prop
const Profile = ({ onLogout }: any) => {
  // Retrieve user data from localStorage
  const userData = JSON.parse(localStorage.getItem("user") || "{}");

  // Handle navigate (if you want to implement navigation from the profile)
  const navigate = useNavigate();

  // If user data is not available, show a message
  if (!userData?.owner) {
    return (
      <Box p={6} textAlign="center">
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          No User Data Available
        </Text>
        <Button colorScheme="blue" onClick={() => navigate("/login")}>
          Login
        </Button>
      </Box>
    );
  }

  // Destructure the user data
  const { mobileNo, propertyId, title, owner } = userData;

  return (
    <Box
      p={6}
      maxWidth="md"
      mx="auto"
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="lg">
      <VStack spacing={6} align="flex-start">
        <HStack spacing={4} align="center">
          {/* Avatar Section */}
          <Avatar name={`${owner.firstName} ${owner.lastName}`} size="lg" />
          <VStack align="flex-start" spacing={1}>
            <Text fontSize="xl" fontWeight="bold">
              {owner.firstName} {owner.lastName}
            </Text>
            <Text fontSize="md" color="gray.500">
              {title || "Property Owner"}
            </Text>
          </VStack>
        </HStack>

        <Divider />

        {/* User Information Section */}
        <VStack align="flex-start" spacing={2} width="full">
          <HStack spacing={4} width="full">
            <Text fontSize="md" fontWeight="bold" width="150px">
              Mobile No:
            </Text>
            <Text fontSize="md">{mobileNo}</Text>
          </HStack>
        </VStack>

        <Divider />

        {/* Logout Button */}
        <Button colorScheme="red" width="full" onClick={onLogout}>
          Logout
        </Button>
      </VStack>
    </Box>
  );
};

export default Profile;
