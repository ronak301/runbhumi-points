import { HamburgerIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  IconButton,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";

export const PRIMARY_COLOR = "rgb(23, 52, 18)";
const HOVER_BG_COLOR = "#58D68D";
const TEXT_COLOR = "#333";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();

  // Function to highlight the selected nav item
  const getNavItemStyles = (route: any) => {
    return location.pathname === route
      ? { fontWeight: "bold", color: PRIMARY_COLOR }
      : { fontWeight: "normal", color: TEXT_COLOR };
  };

  const navItems = [
    { label: "Home", route: "/" },
    { label: "About Us", route: "/about" },
    {
      label: "Products",
      subMenu: [
        { label: "Cricket Turf", route: "/cricket-turf" },
        { label: "Football Turf", route: "/football-turf" },
      ],
    },
    { label: "Projects", route: "/projects" },
    { label: "Maintenance", route: "/maintenance" },
    { label: "News", route: "/blogs" },
    { label: "Contact Us", route: "/contact" },
  ];

  return (
    <Box
      as="nav"
      position="fixed"
      top={0}
      width="100%"
      zIndex={10}
      bg={useColorModeValue("white", "gray.800")}
      shadow="lg"
      borderBottom="2px solid #f0f0f0">
      <Flex justifyContent="space-between" alignItems="center" px={8} py={4}>
        <Text
          fontSize="3xl"
          fontWeight="bold"
          color={PRIMARY_COLOR}
          cursor="pointer"
          onClick={() => navigate("/")}>
          Turfwale
        </Text>

        {/* Desktop Navigation */}
        <Flex gap={6} display={{ base: "none", md: "flex" }}>
          {navItems.map((item, idx) =>
            item.subMenu ? (
              <Menu key={idx}>
                <MenuButton
                  fontSize={"md"}
                  as={Button}
                  _hover={{ color: PRIMARY_COLOR }}>
                  {item.label} <ChevronDownIcon ml={2} />
                </MenuButton>
                <MenuList>
                  {item.subMenu.map((subItem, subIdx) => (
                    <MenuItem
                      key={subIdx}
                      onClick={() => navigate(subItem.route)}
                      _hover={{
                        color: PRIMARY_COLOR,
                      }}>
                      {subItem.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            ) : (
              <Button
                fontSize={"md"}
                key={idx}
                variant="ghost"
                onClick={() => navigate(item.route)}
                _hover={{ color: PRIMARY_COLOR }}
                sx={getNavItemStyles(item.route)}>
                {item.label}
              </Button>
            )
          )}
        </Flex>

        {/* Call Us Button */}
        <Button
          bg={PRIMARY_COLOR}
          color="white"
          paddingX={6}
          paddingY={3}
          borderRadius="full"
          fontWeight="bold"
          onClick={() => (window.location.href = "tel:+916377478355")}>
          Call Us Now
        </Button>

        {/* Hamburger icon for mobile */}
        <IconButton
          aria-label="Open menu"
          icon={<HamburgerIcon />}
          display={{ base: "inline-flex", md: "none" }}
          onClick={onOpen}
          color={PRIMARY_COLOR}
        />
      </Flex>

      {/* Drawer for mobile */}
      <Drawer isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent bg="white" borderRadius="xl" paddingX={4} paddingY={6}>
          <DrawerCloseButton />
          <DrawerBody>
            <VStack spacing={6} mt={12}>
              {/* Mobile Navigation */}
              {navItems.map((item, idx) =>
                item.subMenu ? (
                  <Box key={idx}>
                    <Text fontWeight="bold" fontSize="xl" mb={4}>
                      {item.label}
                    </Text>
                    <VStack pl={4} spacing={4} align="stretch">
                      {item.subMenu.map((subItem, subIdx) => (
                        <Button
                          key={subIdx}
                          variant="ghost"
                          onClick={() => {
                            navigate(subItem.route);
                            onClose();
                          }}
                          _hover={{ color: PRIMARY_COLOR }}
                          sx={getNavItemStyles(subItem.route)}>
                          {subItem.label}
                        </Button>
                      ))}
                    </VStack>
                  </Box>
                ) : (
                  <Button
                    key={idx}
                    variant="ghost"
                    onClick={() => {
                      navigate(item.route);
                      onClose();
                    }}
                    _hover={{ color: PRIMARY_COLOR }}
                    sx={getNavItemStyles(item.route)}>
                    {item.label}
                  </Button>
                )
              )}

              {/* Call Us Button in Drawer */}
              <Button
                bg={PRIMARY_COLOR}
                color="white"
                paddingX={6}
                paddingY={3}
                borderRadius="full"
                fontWeight="bold"
                _hover={{ color: PRIMARY_COLOR }}
                onClick={() => {
                  window.location.href = "tel:+916377478355";
                  onClose();
                }}>
                Call Us Now
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
