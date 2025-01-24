// src/modules/admin/HomeTab/PropertyCard.tsx

import React from "react";
import {
  Box,
  Image,
  Text,
  Heading,
  Badge,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    description: string;
    imgUrl: string;
    slots: any[];
  };
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { title, description, imgUrl } = property;

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      p={4}
      transition="transform 0.2s"
      _hover={{ transform: "scale(1.05)" }}>
      <Image
        src={imgUrl || "https://via.placeholder.com/400x250"} // Default placeholder if no image
        alt={title}
        borderRadius="md"
        boxSize="100%"
        objectFit="cover"
      />

      <VStack align="start" mt={4}>
        <Heading as="h3" size="md" noOfLines={1}>
          {title}
        </Heading>
        <Text noOfLines={2}>{description}</Text>
      </VStack>
    </Box>
  );
};

export default PropertyCard;
