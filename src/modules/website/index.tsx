import { Box, ChakraProvider } from "@chakra-ui/react";

import About from "./About";
import ContactUs from "./ContactUs";
import Features from "./Features";
import Gallery from "./Gallery";
import Hero from "./Hero";
import Testimonials from "./Testimonials";
import Faq from "./Faq";
import WhatWeDo from "./WhatWeDo";
import TurfConstruction from "./TurfConstruction";

const Website = () => {
  return (
    <Box>
      <Hero />
      <WhatWeDo />
      {/* <About /> */}
      {/* <Features /> */}
      <TurfConstruction />
      <Gallery />
      <Testimonials />
      <Faq />
      <ContactUs />
    </Box>
  );
};

export default Website;
