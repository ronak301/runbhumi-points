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
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons"; // Elegant hamburger icon
import { Link as ScrollLink } from "react-scroll";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeLink, setActiveLink] = useState<string | null>(null);

  const handleLinkClick = (section: string) => {
    setActiveLink(section);
    onClose(); // Close the drawer on item click
  };

  const navItems = ["About", "Features", "Gallery", "Testimonials", "Contact"];

  // Border style for active item
  const activeBorderColor = "#63B853"; // Primary color for active border
  const hoverBgColor = "#f4f4f4"; // Subtle hover effect for items

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
        justifyContent="flex-start"
        alignItems="center"
        px={4}
        py={2}>
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
