import {
  Box,
  Heading,
  Text,
  Image,
  VStack,
  Grid,
  GridItem,
  Container,
} from "@chakra-ui/react";
import PageHeader from "../PageHeader";

const CricketTurfPage = () => {
  return (
    <>
      <PageHeader
        title={"Cricket Turf"}
        imageUrl="https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />
      <Container maxW="6xl" py={10}>
        {/* Hero Section */}
        <VStack spacing={6} textAlign="center">
          <Heading size="2xl">What is a Cricket Turf?</Heading>
          <Text fontSize="lg">
            A cricket turf is an artificial playing surface designed to provide
            a consistent and high-quality playing experience. It is widely used
            for commercial cricket grounds and training facilities.
          </Text>
        </VStack>

        {/* Business Opportunity */}
        <Box mt={10}>
          <Heading size="xl">Business Opportunity</Heading>
          <Text fontSize="lg" mt={4}>
            Investing in a commercial cricket ground is a lucrative business
            opportunity. With the rising popularity of cricket, turf-based
            facilities attract players, academies, and corporate events,
            generating substantial revenue.
          </Text>
        </Box>

        {/* Factors to Consider */}
        <Box mt={10}>
          <Heading size="xl">
            Factors to Consider While Constructing a Cricket Ground
          </Heading>
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap={6}
            mt={6}>
            <GridItem>
              <Heading size="lg">1. Dimension</Heading>
              <Text mt={2}>
                The preferred minimum area is 6000 sqft, and it can be either
                rectangular or oval.
              </Text>
            </GridItem>

            <GridItem>
              <Heading size="lg">2. Infill Grass</Heading>
              <Text mt={2}>
                Preferred: 15mm Multisport grass over concrete pitch with
                dynamic stone base for the rest. Another option: Permanent
                cricket pitch with non-infill grass.
              </Text>
            </GridItem>
          </Grid>
        </Box>

        {/* Non-infill Grass Explanation */}
        <Box mt={10}>
          <Heading size="lg">What is Non-infill Grass?</Heading>
          <Text mt={2}>
            Non-infill grass is artificial turf that does not require infill
            materials like sand or rubber. It maintains stability and
            performance similar to natural grass while eliminating the
            maintenance of infill materials.
          </Text>
        </Box>

        {/* Structure Height */}
        <Box mt={10}>
          <Heading size="lg">3. Height of the Structure</Heading>
          <Text mt={2}>
            Some grounds have been constructed up to 70 feet high using
            fabricated poles. The height depends on the area and client budget.
          </Text>
        </Box>

        {/* FAQ Section */}
        <Box mt={10} py={6} bg="gray.100" borderRadius="lg" p={6}>
          <Heading size="lg">FAQs</Heading>
          <Text mt={4}>
            <strong>Q: What is the maintenance cost of a cricket turf?</strong>
            <br />
            A: Maintenance costs vary, but artificial turf requires less upkeep
            than natural grass.
          </Text>
        </Box>
      </Container>
    </>
  );
};

export default CricketTurfPage;
