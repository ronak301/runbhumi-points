// src/modules/admin/Navbar.tsx
import React from "react";
import { Box, Flex, Button, Text } from "@chakra-ui/react";

interface NavbarProps {
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      bg="gray.700" // Dark background for the navbar
      color="white"
      p={4}
      boxShadow="md"
      position="sticky" // Keeps the navbar fixed at the top
      top={0}
      width="100%"
      zIndex={999}>
      <Box fontSize="xl" fontWeight="bold">
        <Text>Admin Panel</Text>
      </Box>
      <Button
        colorScheme="red"
        onClick={onLogout}
        size="sm"
        variant="outline"
        borderColor="white"
        color="white">
        Logout
      </Button>
    </Flex>
  );
};

export default Navbar;
