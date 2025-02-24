// src/modules/admin/Sidebar.tsx
import React from "react";
import { Box, VStack, Link, Text, Divider } from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const location = useLocation();

  // Function to check if the current route is selected
  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <Box
      w="250px"
      p={5}
      bg="gray.700" // Dark background for the sidebar
      color="white"
      height="100vh"
      pt={10} // Added top margin to give space
    >
      {/* TurfWale header */}
      <Box mb={6}>
        <Text fontSize="2xl" fontWeight="bold" color="white">
          TurfWale
        </Text>
        {/* Divider separator */}
        <Divider orientation="horizontal" borderColor="gray.500" my={2} />
      </Box>

      <VStack align="flex-start" spacing={6}>
        <Link
          as={RouterLink}
          to="/admin/home"
          p={3}
          borderRadius="md"
          w="100%" // Full width
          bg={isActive("/admin/home") ? "gray.500" : "transparent"} // Active state background
          _hover={{ bg: "gray.600" }} // Hover state background
          color={isActive("/admin/home") ? "white" : "gray.200"} // Active text color
          _focus={{ boxShadow: "none" }} // Removes focus outline
        >
          Home
        </Link>
        <Link
          as={RouterLink}
          to="/admin/settings"
          p={3}
          borderRadius="md"
          w="100%" // Full width
          bg={isActive("/admin/settings") ? "gray.500" : "transparent"} // Active state background
          _hover={{ bg: "gray.600" }} // Hover state background
          color={isActive("/admin/settings") ? "white" : "gray.200"} // Active text color
          _focus={{ boxShadow: "none" }} // Removes focus outline
        >
          Settings
        </Link>
        <Link
          as={RouterLink}
          to="/admin/blogs"
          p={3}
          borderRadius="md"
          w="100%" // Full width
          bg={isActive("/admin/blogs") ? "gray.500" : "transparent"} // Active state background
          _hover={{ bg: "gray.600" }} // Hover state background
          color={isActive("/admin/blogs") ? "white" : "gray.200"} // Active text color
          _focus={{ boxShadow: "none" }} // Removes focus outline
        >
          Blogs
        </Link>
      </VStack>
    </Box>
  );
};

export default Sidebar;
