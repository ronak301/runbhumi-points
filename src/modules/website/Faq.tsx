import {
  Box,
  Text,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";

const faqsConfig = [
  {
    question: "How much land is needed to build a turf field?",
    answer:
      "To build a standard 5-a-side football turf, you need minimum 5000-6000 sq. ft. For 7-a-side, you need 8000-9000 sq. ft. For 11-a-side (full-size football field), it requires 50,000+ sq. ft. The land requirement depends on the sport, number of players, and space for amenities (parking, seating, etc.).",
  },
  {
    question: "Is the turf business profitable?",
    answer:
      "Yes, the turf business is highly profitable due to the increasing demand for sports infrastructure. ROI within 18-24 months if managed properly. Average revenue per hour: ₹2,500-₹5,000. Extra revenue from tournaments, coaching, sponsorships, and renting to corporates.",
  },
  {
    question: "How much investment is needed for a turf business?",
    answer:
      "Investment depends on land ownership, turf size, and location. Approximate costs range from ₹20-50 lakh including artificial grass, base preparation, lighting, fencing, and branding.",
  },
  {
    question:
      "What is the ROI (Return on Investment) for a sports turf business?",
    answer:
      "The ROI on a sports turf is 18-24 months. Example: Investment ₹25 lakh, daily bookings: 6 hours/day @ ₹2,500/hr, Monthly Revenue: ₹4.5 lakh, ROI in ~1.5 years.",
  },
  {
    question: "Which games can be played on artificial turf?",
    answer:
      "Most popular sports: Football, Cricket, Hockey, Tennis, Badminton, Rugby, Kabaddi, Golf, and Multi-sport training zones.",
  },
  {
    question: "What is DTEX in artificial turf?",
    answer:
      "DTEX measures the thickness & density of artificial grass fibers. Higher DTEX = Stronger & more durable turf. Recommended DTEX for football turf = 12,000 – 16,000 DTEX.",
  },
  {
    question: "Why are rubber granules & silica sand used as infill?",
    answer:
      "Rubber granules provide shock absorption & player safety. Silica sand weighs down the turf to keep it stable, prevents matting, and improves drainage.",
  },
  {
    question: "How long does artificial turf last?",
    answer:
      "Artificial turf lasts between 8-12 years, depending on usage & maintenance. High-quality FIFA-certified turf ensures better durability.",
  },
  {
    question: "How can I earn money referring high-end turf clients?",
    answer:
      "Turfwale offers a Referral Program! Earn ₹X per successful client referral. Higher payouts for stadiums, sports academies & school projects.",
  },
];

const FAQ = () => {
  return (
    <Box py={10} px={5} textAlign="center">
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        FREQUENTLY ASKED QUESTIONS
      </Text>
      <Box maxW="800px" mx="auto">
        <Accordion allowToggle defaultIndex={[0]}>
          {faqsConfig.map((faq, index) => (
            <AccordionItem
              key={index}
              borderRadius="md"
              overflow="hidden"
              boxShadow="md"
              mb={3}>
              <h2>
                <AccordionButton _expanded={{ bg: "blue.500", color: "white" }}>
                  <Box flex="1" textAlign="left" fontWeight="bold">
                    {faq.question}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} textAlign="left" color="gray.700">
                {faq.answer}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Box>
    </Box>
  );
};

export default FAQ;
