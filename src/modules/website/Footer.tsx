import {
  Box,
  Text,
  VStack,
  HStack,
  Link,
  Divider,
  IconButton,
} from "@chakra-ui/react";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

const footerConfig = {
  logo: "Turfwale",
  quickLinks: ["Home", "About Us", "Why Us", "Projects", "Blog", "Login"],
  locations: ["Udaipur - India"],
  contact: {
    address: "27-28 Sevashram Chouraha, Udaipur",
    phones: ["+91 6377478355"],
    email: "turfwale@gmail.com",
  },
  socialLinks: [
    {
      icon: FaFacebook,
      url: "https://www.facebook.com/profile.php?id=61572663668111#",
    },
    { icon: FaInstagram, url: "https://www.instagram.com/turfwale/" },
    { icon: FaYoutube, url: "https://www.youtube.com/@turfwale" },
    {
      icon: FaLinkedin,
      url: "https://www.linkedin.com/in/turf-wale-072303351/",
    },
    { icon: FaTwitter, url: "https://x.com/turfwale" },
  ],
};

const Footer = () => {
  return (
    <Box bg="green.500" color="white" py={10} px={5}>
      <VStack spacing={6} align="center">
        <Text fontSize="2xl" fontWeight="bold">
          {footerConfig.logo}
        </Text>
        <HStack spacing={8} wrap="wrap" justify="center">
          <VStack align="start">
            <Text fontWeight="bold">QUICK LINKS</Text>
            {footerConfig.quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link === "Login" ? "/login" : "#"}
                _hover={{ textDecoration: "underline" }}>
                {link}
              </Link>
            ))}
          </VStack>
          <VStack align="start">
            <Text fontWeight="bold">REACH US</Text>
            {footerConfig.locations.map((location, index) => (
              <Text key={index}>{location}</Text>
            ))}
          </VStack>
          <VStack align="start">
            <Text fontWeight="bold">CONTACT US</Text>
            <Text>{footerConfig.contact.address}</Text>
            {footerConfig.contact.phones.map((phone, index) => (
              <Text key={index}>{phone}</Text>
            ))}
            <Link
              href={`mailto:${footerConfig.contact.email}`}
              _hover={{ textDecoration: "underline" }}>
              {footerConfig.contact.email}
            </Link>
          </VStack>
        </HStack>
        <HStack spacing={4}>
          {footerConfig.socialLinks.map((social, index) => (
            <IconButton
              key={index}
              as="a"
              href={social.url}
              icon={<social.icon />}
              aria-label="Social Media"
              variant="ghost"
              color="white"
            />
          ))}
        </HStack>
      </VStack>
      <Divider my={4} borderColor="whiteAlpha.600" />
      <Text textAlign="center" fontSize="sm">
        Copyright 2025@Turfwale and all rights reserved
      </Text>
    </Box>
  );
};

export default Footer;
