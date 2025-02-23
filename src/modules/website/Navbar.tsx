import { useState } from "react";
import {
  Box,
  Flex,
  Link,
  IconButton,
  useColorModeValue,
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
      bg={useColorModeValue("white", "gray.900")}
      px={{ base: 5, md: 32 }}
      boxShadow="md"
      position="fixed"
      top={0}
      left={0}
      width="100%"
      zIndex={10}>
      <Flex
        h={16}
        alignItems={"center"}
        justifyContent={"space-between"}
        mx="auto">
        <Text fontSize="xl" fontWeight="bold">
          Turfwale
        </Text>
        <Flex alignItems="center">
          <Flex
            display={{ base: "none", md: "flex" }}
            gap={6}
            alignItems="center">
            <Button variant="ghost">Home</Button>
            <Button variant="ghost">Projects</Button>
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                rightIcon={<ChevronDownIcon />}>
                Products
              </MenuButton>
              <MenuList>
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
          />
        </Flex>
      </Flex>
      {isOpen ? (
        <Box pb={4} display={{ md: "none" }}>
          <VStack spacing={4} align="stretch">
            <Button w="full" variant="ghost">
              Home
            </Button>
            <Button w="full" variant="ghost">
              Projects
            </Button>
            <Menu>
              <MenuButton
                as={Button}
                w="full"
                variant="ghost"
                rightIcon={<ChevronDownIcon />}>
                Products
              </MenuButton>
              <MenuList>
                <MenuItem>Cricket Turf</MenuItem>
                <MenuItem>Football Turf</MenuItem>
                <MenuItem>PickleBall Court</MenuItem>
                <MenuItem>Badminton Court</MenuItem>
              </MenuList>
            </Menu>
          </VStack>
        </Box>
      ) : null}
    </Box>
  );
};

export default Navbar;
