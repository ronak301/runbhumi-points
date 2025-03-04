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
            <Link href="/" _hover={{ textDecoration: "none" }}>
              <Button
                variant="ghost"
                color="white"
                _hover={{ bg: "transparent", cursor: "pointer" }}>
                Home
              </Button>
            </Link>
            <Link href="/projects" _hover={{ textDecoration: "none" }}>
              <Button
                variant="ghost"
                color="white"
                _hover={{ bg: "transparent", cursor: "pointer" }}>
                Projects
              </Button>
            </Link>
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
                <Link href="/cricket-turf">
                  <MenuItem>Cricket Turf</MenuItem>
                </Link>
                <Link href="/football-turf">
                  <MenuItem>Football Turf</MenuItem>
                </Link>
                <Link href="/pickleball-court">
                  <MenuItem>PickleBall Court</MenuItem>
                </Link>
                <Link href="/badminton-court">
                  <MenuItem>Badminton Court</MenuItem>
                </Link>
              </MenuList>
            </Menu>
            <Link href="/news-blogs" _hover={{ textDecoration: "none" }}>
              <Button
                variant="ghost"
                color="white"
                _hover={{ bg: "transparent", cursor: "pointer" }}>
                Blogs
              </Button>
            </Link>
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
          <VStack
            borderRadius={"md"}
            spacing={4}
            align="stretch"
            backgroundColor="rgba(0,0,0,0.5)"
            py={4}>
            <Link href="/" _hover={{ textDecoration: "none" }}>
              <Button w="full" variant="ghost" color="white">
                Home
              </Button>
            </Link>
            <Link href="/projects" _hover={{ textDecoration: "none" }}>
              <Button w="full" variant="ghost" color="white">
                Projects
              </Button>
            </Link>
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
                <Link href="/products/cricket-turf">
                  <MenuItem>Cricket Turf</MenuItem>
                </Link>
                <Link href="/products/football-turf">
                  <MenuItem>Football Turf</MenuItem>
                </Link>
                <Link href="/products/pickleball-court">
                  <MenuItem>PickleBall Court</MenuItem>
                </Link>
                <Link href="/products/badminton-court">
                  <MenuItem>Badminton Court</MenuItem>
                </Link>
              </MenuList>
            </Menu>
            <Link href="/news-blogs" _hover={{ textDecoration: "none" }}>
              <Button w="full" variant="ghost" color="white">
                Blogs
              </Button>
            </Link>
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default Navbar;
