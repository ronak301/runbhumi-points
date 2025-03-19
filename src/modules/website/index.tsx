import { Box, ChakraProvider } from "@chakra-ui/react";
import { lazy, Suspense } from "react";
import Hero from "./Hero"; // Load Hero immediately
const WhatWeDo = lazy(() => import("./WhatWeDo"));
const TurfConstruction = lazy(() => import("./TurfConstruction"));
const Gallery = lazy(() => import("./Gallery"));
const Testimonials = lazy(() => import("./Testimonials"));
const Faq = lazy(() => import("./Faq"));
const ContactUs = lazy(() => import("./ContactUs"));

const Website = () => {
  return (
    <Box>
      {/* Hero section loads immediately */}
      <Hero />

      {/* Lazy load the rest */}
      <Suspense fallback={<div>Loading...</div>}>
        <WhatWeDo />
        <TurfConstruction />
        <Gallery />
        <Testimonials />
        <Faq />
        <ContactUs />
      </Suspense>
    </Box>
  );
};

export default Website;
