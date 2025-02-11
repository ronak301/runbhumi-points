import { Box, ChakraProvider } from "@chakra-ui/react";

import FloatingButtons from "../../components/FloatingButtons";
import About from "./About";
import ContactUs from "./ContactUs";
import Features from "./Features";
import Footer from "./Footer";
import Gallery from "./Gallery";
import Hero from "./Hero";
import NavBar from "./Navbar";
import Testimonials from "./Testimonials";

const Website = () => {
  return (
    <ChakraProvider>
      <Box>
        <Hero />
        <About />
        <Features />
        <Gallery />
        <Testimonials />
        <ContactUs />
      </Box>
    </ChakraProvider>
  );
};

export default Website;
