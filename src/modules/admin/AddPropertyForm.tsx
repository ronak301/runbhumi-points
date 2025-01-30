import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Stack,
  Box,
  Text,
} from "@chakra-ui/react";
import { db } from "../../firebase"; // Firebase import
import { addDoc, collection } from "firebase/firestore";

// Function to generate 24 hours of slots, each with a 30-minute duration and increasing sort value
const generateSlots = () => {
  const slots: any[] = [];
  let currentHour = 0; // Start from 12:00 AM (midnight)
  let currentMinute = 0; // Start at 0 minutes
  let sortValue = 1;

  // Loop through 24 hours to create slots
  for (let i = 0; i < 48; i++) {
    // 48 slots (24 hours * 2 per hour)
    const startHour = currentHour < 10 ? `0${currentHour}` : `${currentHour}`;
    const startMinute =
      currentMinute < 10 ? `0${currentMinute}` : `${currentMinute}`;

    // Calculate the end time for the slot (30 minutes after start time)
    const endMinute = currentMinute === 30 ? "00" : "30"; // Toggle between :00 and :30
    const endHour = currentMinute === 30 ? currentHour + 1 : currentHour; // Increment hour after 30 minutes

    const slotTitle = `${startHour}:${startMinute} - ${
      endHour < 10 ? `0${endHour}` : endHour
    }:${endMinute}`;

    slots.push({
      title: slotTitle,
      sort: sortValue,
      price: 400, // Default price for each slot
    });

    // Update time for next iteration
    currentMinute = currentMinute === 0 ? 30 : 0; // Toggle between 00 and 30 minutes
    if (currentMinute === 0) {
      currentHour++;
    }

    sortValue++; // Increment the sort value for each slot
  }

  return slots;
};

const AddPropertyForm: React.FC<any> = ({
  isOpen,
  onClose,
  onPropertyAdded,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [slots, setSlots] = useState(generateSlots()); // Call the generateSlots function to get slots

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      // Add the property
      const propertyRef = await addDoc(collection(db, "properties"), {
        title,
        description,
        imgUrl,
      });

      // Add slots as sub-collection for this property
      const slotsRef = collection(db, "properties", propertyRef.id, "slots");
      for (let slot of slots) {
        await addDoc(slotsRef, slot);
      }

      await onPropertyAdded(); // Refetch properties after adding new one
      onClose(); // Close the modal

      console.log("Property and slots added successfully");
    } catch (error) {
      console.error("Error adding property with slots: ", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Property</ModalHeader>
        <ModalBody>
          <Stack spacing={4}>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
            <Input
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
              placeholder="Image URL"
            />

            {/* Slots Section */}
            <Box mt={4}>
              <Text fontSize="lg" fontWeight="bold">
                Slots
              </Text>
              <Box mt={2}>
                {slots.map((slot, index) => (
                  <Box
                    key={index}
                    display="flex"
                    justifyContent="space-between"
                    mb={2}>
                    <Text>{slot.title}</Text>
                    <Input
                      type="number"
                      value={slot.price}
                      onChange={(e) => {
                        const updatedSlots = [...slots];
                        updatedSlots[index].price = Number(e.target.value);
                        console.log("updatedSlots", updatedSlots);
                        setSlots(updatedSlots);
                      }}
                      placeholder="Price"
                      width="100px"
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="teal" onClick={handleSubmit}>
            Add Property
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddPropertyForm;
