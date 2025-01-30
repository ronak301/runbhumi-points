import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
  Button,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons"; // Elegant hamburger icon
import { Link as ScrollLink } from "react-scroll";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLinkClick = (section: string) => {
    setActiveLink(section);
    onClose(); // Close the drawer on item click
  };

  const navItems = ["About", "Features", "Gallery", "Testimonials", "Contact"];

  // Border style for active item
  const activeBorderColor = "#63B853"; // Primary color for active border
  const hoverBgColor = "#f4f4f4"; // Subtle hover effect for items

  const handleLoginClick = () => {
    // Navigate to the login page when the button is clicked
    navigate("/login");
  };

  return (
    <Box
      as="nav"
      position="fixed"
      top={0}
      width="100%"
      zIndex={10}
      bg="white"
      shadow="sm">
      {/* Desktop Navigation */}
      <Flex
        display={{ base: "none", md: "flex" }}
        justifyContent="space-between"
        alignItems="center"
        px={8}
        py={4}>
        <Text
          fontSize="xl"
          fontWeight="bold"
          color="#333"
          cursor="pointer"
          onClick={() => handleLinkClick("About")}>
          Turfwale
        </Text>
        <Flex gap={8} alignItems="center">
          {navItems.map((section, idx) => (
            <ScrollLink
              key={idx}
              to={section.toLowerCase()}
              smooth
              duration={800}
              offset={-70}
              onClick={() => handleLinkClick(section)}
              style={{
                fontSize: "16px",
                fontWeight: "500",
                color: activeLink === section ? "#333" : "#333",
                cursor: "pointer",
                padding: "12px 20px", // Adequate horizontal padding
                borderRadius: "8px",
                backgroundColor:
                  activeLink === section ? "transparent" : "transparent",
                border:
                  activeLink === section
                    ? `2px solid ${activeBorderColor}`
                    : "none", // Active border
                transition: "all 0.3s ease",
                textAlign: "center",
              }}>
              {section}
            </ScrollLink>
          ))}
        </Flex>
      </Flex>

      {/* Mobile Navigation */}
      <Flex
        display={{ base: "flex", md: "none" }}
        alignItems="center"
        px={4}
        py={2}
        justifyContent={"space-between"}>
        <Flex justifyContent="flex-start" alignItems="center">
          <IconButton
            aria-label="Open Menu"
            icon={<HamburgerIcon />}
            onClick={onOpen}
            variant="ghost"
            color="gray.600"
          />
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="#333"
            cursor="pointer"
            onClick={() => handleLinkClick("About")}>
            Turfwale
          </Text>
        </Flex>
        <Button
          variant="outline" // This ensures the button has a border
          borderColor="green.600" // Set the border color to your custom green
          color="green.600" // Text color to match the border
          _hover={{
            backgroundColor: "green.600", // Change background on hover
            color: "white", // Text color changes to white on hover
            borderColor: "green.700", // Darker green border on hover
          }}
          _active={{
            backgroundColor: "green.700", // Dark green when the button is active (clicked)
            color: "white",
          }}
          _focus={{
            borderColor: "green.700", // Focus state border color
            boxShadow: "0 0 0 2px rgba(23, 52, 18, 0.6)", // Optional shadow for focus state
          }}
          padding="8px 16px" // Add padding to make the button larger
          borderRadius="8px" // Rounded corners
          fontWeight="600" // Slightly bold text for emphasis
          fontSize="16px" // Medium font size
          onClick={handleLoginClick} // Add the onClick handler to navigate
        >
          Login
        </Button>
      </Flex>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton mt={4} />
          <DrawerBody p={0}>
            <Flex direction="column" mt={16}>
              {navItems.map((section, idx) => (
                <ScrollLink
                  key={idx}
                  to={section.toLowerCase()}
                  smooth
                  duration={800}
                  offset={-70}
                  onClick={() => handleLinkClick(section)}
                  style={{
                    fontSize: "18px",
                    fontWeight: "500",
                    color: "#333333",
                    cursor: "pointer",
                    margin: "0px 16px",
                    padding: "16px 16px", // Improved padding for better click targets
                    borderRadius: "8px",
                    backgroundColor:
                      activeLink === section ? "#7EAE6A" : "transparent",
                    transition: "all 0.3s ease",
                    marginBottom: "12px", // Separation between items
                  }}>
                  {section}
                </ScrollLink>
              ))}
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
