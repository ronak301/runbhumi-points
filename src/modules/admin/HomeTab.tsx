import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Text,
  Stack,
  Image,
  useDisclosure,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // Firebase import
import AddPropertyForm from "./AddPropertyForm"; // Import AddPropertyForm component

interface Property {
  id: string;
  title: string;
  description: string;
  imgUrl: string; // Changed to imgUrl
  slots: any[];
}

const HomeTab: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);

  // Chakra UI's useDisclosure hook to manage the modal's open/close state
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // Fetch properties from Firebase Firestore
    const fetchProperties = async () => {
      const querySnapshot = await getDocs(collection(db, "properties"));
      const propertiesList: Property[] = [];
      querySnapshot.forEach((doc) => {
        propertiesList.push({
          id: doc.id,
          ...doc.data(),
        } as Property);
      });
      setProperties(propertiesList);
    };

    fetchProperties();
  }, []);

  const handleAddProperty = () => {
    onOpen(); // Open the modal when the button is clicked
  };

  const handlePropertyAdded = () => {
    // Refetch the properties list after adding a new property
    const fetchProperties = async () => {
      const querySnapshot = await getDocs(collection(db, "properties"));
      const propertiesList: Property[] = [];
      querySnapshot.forEach((doc) => {
        propertiesList.push({
          id: doc.id,
          ...doc.data(),
        } as Property);
      });
      setProperties(propertiesList);
    };

    fetchProperties();
  };

  console.log("properties", properties);

  return (
    <Box p={6}>
      <Stack direction="row" justify="space-between" align="center" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Properties
        </Text>
        <Button colorScheme="teal" onClick={handleAddProperty}>
          Add Property
        </Button>
      </Stack>

      {/* List of Properties */}
      <Grid
        templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
        gap={6}
        alignItems="stretch">
        {properties.map((property) => (
          <GridItem key={property.id}>
            <Box
              bg="white"
              borderRadius="lg"
              boxShadow="md"
              overflow="hidden"
              height="100%"
              display="flex"
              flexDirection="column">
              {/* Image with fixed height */}
              <Image
                src={property.imgUrl} // Corrected to imgUrl
                alt={property.title}
                width="100%"
                height="200px" // Fixed height for image
                objectFit="cover"
              />
              <Box p={4}>
                <Text fontSize="xl" fontWeight="bold">
                  {property.title}
                </Text>
                <Text mt={2} color="gray.500" noOfLines={3}>
                  {property.description}
                </Text>
              </Box>
            </Box>
          </GridItem>
        ))}
      </Grid>

      {/* Modal for Add Property Form - This will only be shown when 'Add Property' is clicked */}
      <AddPropertyForm
        isOpen={isOpen}
        onClose={onClose}
        onPropertyAdded={handlePropertyAdded}
      />
    </Box>
  );
};

export default HomeTab;
