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
import useBookingsManager from "./hooks/useBookingsManager";

// Define the Profile component to receive `onLogout` prop
const Profile = ({ onLogout }: any) => {
  // Retrieve user data from localStorage
  const userData = JSON.parse(localStorage.getItem("user") || "{}");

  // Handle navigate (if you want to implement navigation from the profile)
  const navigate = useNavigate();

  const {
    monthlyCollectionTotal,
    lastMonthCollectionTotal,
    financialYearCollectionTotal,
  } = useBookingsManager();

  const now = new Date();
  const thisMonthLabel = now.toLocaleString("default", {
    month: "short",
  });
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthLabel = lastMonthDate.toLocaleString("default", {
    month: "short",
  });

  const fyLabel = (() => {
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-based
    const fyStartYear = month >= 3 ? year : year - 1;
    const fyEndYear = fyStartYear + 1;
    return `FY ${String(fyStartYear).slice(-2)}-${String(fyEndYear).slice(-2)}`;
  })();

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

        <VStack align="flex-start" spacing={1} width="full">
          <Text fontSize="sm" color="gray.600">
            {thisMonthLabel} Collection - ₹
            {(monthlyCollectionTotal ?? 0).toLocaleString("en-IN")}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {lastMonthLabel} Collection - ₹
            {(lastMonthCollectionTotal ?? 0).toLocaleString("en-IN")}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {fyLabel} Collection - ₹
            {(financialYearCollectionTotal ?? 0).toLocaleString("en-IN")}
          </Text>
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
