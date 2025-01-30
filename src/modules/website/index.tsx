import React, { useState } from "react";
import {
  ChakraProvider,
  Box,
  Flex,
  Text,
  Heading,
  Button,
  Input,
  Textarea,
  VStack,
  Image,
  IconButton,
  Grid,
  GridItem,
  useBreakpointValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
} from "@chakra-ui/react";
import { Link } from "react-scroll";

import { motion } from "framer-motion";
import { Link as ScrollLink, animateScroll as scroll } from "react-scroll";
import { HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { FiHome, FiInfo, FiPhone, FiImage, FiStar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import FloatingButtons from "../../components/FloatingButtons";
import NavBar from "./Navbar";

const MotionBox = motion(Box);
const MotionImage = motion(Image);

const Website = ({ onLoginClick }: any) => {
  const scrollToTop = () => scroll.scrollToTop();
  const [formStatus, setFormStatus] = useState(""); // To track form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure(); // Correctly use useDisclosure hook
  const navigate = useNavigate();

  const testimonials = [
    {
      name: "Mohit Fattawat",
      position: "Director, LBS Sports Junction, Chittor",
      testimonial:
        "TurfWale provided excellent service! The turf quality is top-notch.",
      image:
        "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-845.jpg?semt=ais_incoming",
    },
    {
      name: "Ronak Kothari",
      position: "Founder, Runbhumi Mewar",
      testimonial:
        "The team at TurfWale was incredibly professional and timely. Highly recommend!",
      image:
        "https://cdni.iconscout.com/illustration/premium/thumb/man-illustration-download-in-svg-png-gif-file-formats--portrait-beard-glasses-portraits-pack-people-illustrations-2790260.png",
    },
  ];

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormStatus("");

    const formData = new FormData(event.target);

    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    try {
      const response = await fetch("https://formspree.io/f/mzzzlydl", {
        method: "POST",
        body: formData,
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json", // Make sure to set the content-type
        },
      });

      setFormStatus("Thank you! Your message has been submitted.");
      event.target.reset();
    } catch (error) {
      setFormStatus("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);

      // Clear the status message after 5 seconds
      setTimeout(() => setFormStatus(""), 5000);
    }
  };

  const handleNavigation = (section: any) => {
    onClose(); // Close the Drawer

    // Scroll to the respective section
    scrollToSection(section);
  };

  const scrollToSection = (section: any) => {
    const element = document.getElementById(section); // Get the section by id
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 70, // Adjust for the fixed navbar height
        behavior: "smooth",
      });
    }
  };

  return (
    <ChakraProvider>
      <Box>
        {/* Top Navigation */}
        <NavBar />

        {/* Hamburger Icon for Mobile */}
        {/* <IconButton
          aria-label="Open Menu"
          icon={<HamburgerIcon />}
          onClick={onOpen}
          display={{ base: "flex", md: "none" }} // Show only on mobile
          position="fixed"
          top={4}
          right={4}
          zIndex={20}
        /> */}

        {/* <Drawer isOpen={isOpen} onClose={onClose} placement="left">
          <DrawerOverlay />
          <DrawerContent bg="white">
            <DrawerCloseButton />
            <DrawerHeader bg="green.600" color="white" textAlign="center">
              Menu
            </DrawerHeader>
            <DrawerBody>
              <VStack spacing={6} align="start" p={4}>
                <Button
                  variant="link"
                  leftIcon={<FiInfo />}
                  fontSize="lg"
                  color="green.600"
                  onClick={() => handleNavigation("about")}>
                  About
                </Button>
                <Button
                  variant="link"
                  leftIcon={<FiInfo />}
                  fontSize="lg"
                  color="green.600"
                  onClick={() => handleNavigation("features")}>
                  Features
                </Button>
                <Button
                  variant="link"
                  leftIcon={<FiPhone />}
                  fontSize="lg"
                  color="green.600"
                  onClick={() => handleNavigation("contact")}>
                  Contact
                </Button>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer> */}

        {/* Hero Section */}
        <MotionBox
          id="hero"
          bgImage={`url(https://images.pexels.com/photos/9420724/pexels-photo-9420724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)`}
          bgSize="cover"
          bgPosition="center"
          bgRepeat="no-repeat"
          position="relative"
          color="white"
          textAlign="center"
          minHeight={{ base: "70vh", md: "85vh" }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}>
          {/* Overlay */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="black"
            opacity={0.3}
            zIndex={1}
          />
          {/* Content */}
          <Box position="relative" zIndex={2} textAlign="center" px={4}>
            <Heading
              as="h1"
              fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }}
              fontWeight="extrabold"
              mb={6}
              textShadow="3px 3px rgba(0, 0, 0, 0.5)"
              lineHeight="1.1"
              letterSpacing="wide"
              style={{ fontFamily: "Neulis Alt, sans-serif" }}
              textAlign="center">
              Turfwale
            </Heading>
            <Text
              fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
              fontWeight="bold"
              mb={8}
              textShadow="2px 2px #000000"
              lineHeight="1.2">
              India&apos;s Leading Sports Infra Manufacturer
            </Text>
            {/* CTA Buttons */}
            <Box
              mt={6}
              display="flex"
              flexDirection={{ base: "column", sm: "row" }}
              gap={4}>
              <Link to="contact-form" smooth={true} duration={800} offset={-70}>
                {" "}
                {/* Added smooth scrolling */}
                <Button
                  size="lg"
                  colorScheme="green"
                  bg="green.600"
                  _hover={{ bg: "green.600" }}
                  mb={{ base: 4, sm: 0 }} // Margin bottom for mobile view
                >
                  Get a Free Consultation
                </Button>
              </Link>
              <Link to="about" smooth={true} duration={800} offset={-70}>
                {" "}
                {/* Added smooth scrolling */}
                <Button
                  size="lg"
                  colorScheme="white"
                  variant="outline"
                  _hover={{ bg: "whiteAlpha.300" }}>
                  Learn More
                </Button>
              </Link>
            </Box>
          </Box>
        </MotionBox>
        {/* About Section */}
        <VStack
          id="about"
          spacing={8}
          p={8}
          textAlign="center"
          bg="gray.50"
          py={16}>
          <Heading
            style={{ fontFamily: "Neulis Alt, sans-serif" }}
            size="lg"
            color="green.600"
            textDecoration="underline">
            About Us
          </Heading>
          <Text maxW="800px" fontSize="lg" lineHeight="1.8">
            At Turfwale, we specialize in crafting world-class cricket and
            football turfs with a commitment to quality, innovation, and
            customer satisfaction. Our mission is to deliver exceptional sports
            infrastructure tailored to your needs.
          </Text>
        </VStack>
        {/* Features Section */}
        <VStack
          id="features"
          spacing={8}
          p={8}
          textAlign="center"
          py={16}
          bg="gray.100">
          <Heading size="lg" color="green.600" textDecoration="underline">
            Our Features
          </Heading>
          <Flex wrap="wrap" justify="center" gap={8}>
            {[
              {
                title: "Free Consultation",
                description:
                  "Expert advice tailored to your project requirements, at no cost.",
                image:
                  "https://images.pexels.com/photos/5816291/pexels-photo-5816291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
              },
              {
                title: "Quality Construction",
                description:
                  "Durable and premium turf construction for long-lasting performance.",
                image: "https://justurf.club//assets/upload/1732193865.jpg",
              },
              {
                title: "Booking Management Portal",
                description:
                  "Manage bookings and schedules effortlessly with our advanced platform.",
                image:
                  "https://images.pexels.com/photos/572056/pexels-photo-572056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
              },
            ].map((feature, index) => (
              <MotionBox
                key={index}
                p={6}
                bg="white"
                borderRadius="lg"
                shadow="md"
                width={{ base: "100%", sm: "45%", lg: "30%" }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}>
                <MotionImage
                  src={feature.image}
                  alt={feature.title}
                  mb={4}
                  borderRadius="md"
                  h={200}
                  w="100%"
                />
                <Heading size="md" color="green.600" mb={2}>
                  {feature.title}
                </Heading>
                <Text fontSize="sm" color="gray.700">
                  {feature.description}
                </Text>
              </MotionBox>
            ))}
          </Flex>
        </VStack>
        {/* Gallery Section */}
        <VStack
          id="gallery"
          spacing={8}
          p={8}
          textAlign="center"
          py={16}
          bg="gray.50">
          <Heading size="lg" color="green.600" textDecoration="underline">
            Our Gallery
          </Heading>
          <Grid
            templateColumns={{ base: "repeat(2, 1fr)", sm: "repeat(3, 1fr)" }}
            gap={6}>
            {[
              "https://justurf.club//assets/upload/1735213410.jpg",
              "https://justurf.club//assets/upload/1732193865.jpg",
              "https://justurf.club//assets/upload/1724961794.jpeg",
              "https://lh5.googleusercontent.com/p/AF1QipPT1iBa4Y0BN1UKCFPJOFsgGkpOgprgwU2akl0V=w213-h160-k-no",
              "https://lh3.googleusercontent.com/p/AF1QipOdBYrt_-bkev3XuLNW21l_LIKW5kSNJQ4MIgUY=s1360-w1360-h1020",
              "https://lh3.googleusercontent.com/p/AF1QipMxihI8L5ssKxZIJANjmD1yrcqJ_jVpJ-prlLzV=s1360-w1360-h1020",
            ].map((image, index) => (
              <GridItem key={index}>
                <Image
                  src={image}
                  alt={`Gallery Image ${index}`}
                  borderRadius="md"
                  width="100%" // Ensure the image takes full width of the grid item
                  height="200px" // Fixed height for consistent size
                  objectFit="cover" // Ensure the image covers the area without distorting the aspect ratio
                />
              </GridItem>
            ))}
          </Grid>
        </VStack>
        {/* Testimonials Section */}
        <VStack
          id="testimonials"
          spacing={8}
          p={8}
          textAlign="center"
          bg="gray.50"
          py={16}>
          <Heading size="lg" color="green.600" textDecoration="underline">
            What Our Clients Say
          </Heading>
          <Box display="flex" flexWrap="wrap" justifyContent="center" gap={8}>
            {testimonials.map((testimonial, index) => (
              <MotionBox
                key={index}
                bg="white"
                borderRadius="lg"
                shadow="lg"
                width={{ base: "100%", sm: "45%", md: "30%" }}
                p={6}
                transition="all 0.3s"
                whileHover={{ scale: 1.05 }}
                borderWidth="1px"
                borderColor="gray.200"
                display="flex"
                flexDirection="column"
                alignItems="center">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  borderRadius="full"
                  boxSize="100px"
                  objectFit="cover"
                  mb={4}
                />
                <Text fontWeight="bold" color="green.600" mb={2}>
                  {testimonial.name}
                </Text>
                <Text fontSize="sm" color="gray.600" mb={4}>
                  {testimonial.position}
                </Text>
                <Text fontSize="md" color="gray.700" textAlign="center">
                  "{testimonial.testimonial}"
                </Text>
              </MotionBox>
            ))}
          </Box>
        </VStack>

        <VStack
          id="contact"
          spacing={8}
          p={8}
          textAlign="center"
          bg="gray.50"
          py={16}>
          <Heading size="lg" color="green.600" textDecoration="underline">
            Contact Us
          </Heading>

          <MotionBox
            bg="white"
            p={8}
            borderRadius="lg"
            shadow="2xl"
            width={{ base: "100%", sm: "80%", md: "60%" }}
            id="contact-form"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5 }}>
            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                <Input placeholder="Your Name" name="name" required />
                <Input
                  placeholder="Your Phone Number"
                  name="phone"
                  type="tel"
                  pattern="[0-9]{10}"
                  required
                />
                <Button
                  type="submit"
                  colorScheme="green"
                  size="lg"
                  isLoading={isSubmitting} // Show loading spinner while submitting
                >
                  Submit
                </Button>
              </VStack>
            </form>

            {formStatus && (
              <Box mt={4} textAlign="center">
                <Text
                  color={
                    formStatus.includes("Oops") || formStatus.includes("error")
                      ? "red.500"
                      : "green.500"
                  }>
                  {formStatus}
                </Text>
              </Box>
            )}
          </MotionBox>
        </VStack>

        {/* Footer */}
        <MotionBox
          bg="green.600"
          color="white"
          textAlign="center"
          py={6}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}>
          <Text fontSize="md" mb={2}>
            Contact us today at{" "}
            <a href="tel:6377478355" style={{ fontWeight: "bold" }}>
              6377478355
            </a>{" "}
            for more details!
          </Text>
          <Text fontSize="sm">&copy; 2025 Turfwale. All rights reserved.</Text>
        </MotionBox>
      </Box>
      <FloatingButtons />
    </ChakraProvider>
  );
};

export default Website;
