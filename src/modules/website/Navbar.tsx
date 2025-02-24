import { useState } from "react";
import {
  Box,
  Flex,
  Link,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Button,
  VStack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from "@chakra-ui/icons";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      width="100%"
      px={{ base: 5, md: 32 }}
      zIndex={10}
      bg="transparent">
      <Flex
        h={16}
        alignItems={"center"}
        justifyContent={"space-between"}
        mx="auto">
        <Text fontSize="xl" fontWeight="bold" color="white">
          Turfwale
        </Text>
        <Flex alignItems="center">
          <Flex
            display={{ base: "none", md: "flex" }}
            gap={6}
            alignItems="center">
            <Button
              variant="ghost"
              color="white"
              _hover={{ bg: "transparent", cursor: "pointer" }}>
              Home
            </Button>
            <Button
              variant="ghost"
              color="white"
              _hover={{ bg: "transparent", cursor: "pointer" }}>
              Projects
            </Button>
            <Menu>
              <MenuButton
                _hover={{ bg: "transparent", cursor: "pointer" }}
                as={Button}
                variant="ghost"
                color="white"
                rightIcon={<ChevronDownIcon />}>
                Products
              </MenuButton>
              <MenuList bg="white">
                <MenuItem>Cricket Turf</MenuItem>
                <MenuItem>Football Turf</MenuItem>
                <MenuItem>PickleBall Court</MenuItem>
                <MenuItem>Badminton Court</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: "none" }}
            onClick={toggleMenu}
            ml={2}
            color="white"
            variant="ghost"
            _hover={{ bg: "transparent", cursor: "pointer" }}
          />
        </Flex>
      </Flex>
      {isOpen && (
        <Box pb={4} display={{ md: "none" }}>
          <VStack spacing={4} align="stretch">
            <Button w="full" variant="ghost" color="white">
              Home
            </Button>
            <Button w="full" variant="ghost" color="white">
              Projects
            </Button>
            <Menu>
              <MenuButton
                _hover={{ bg: "transparent", cursor: "pointer" }}
                as={Button}
                w="full"
                variant="ghost"
                color="white"
                rightIcon={<ChevronDownIcon />}>
                Products
              </MenuButton>
              <MenuList bg="white">
                <MenuItem>Cricket Turf</MenuItem>
                <MenuItem>Football Turf</MenuItem>
                <MenuItem>PickleBall Court</MenuItem>
                <MenuItem>Badminton Court</MenuItem>
              </MenuList>
            </Menu>
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default Navbar;
