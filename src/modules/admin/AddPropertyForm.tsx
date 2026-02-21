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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { db } from "../../firebase"; // Firebase import
import { addDoc, collection } from "firebase/firestore";

// Function to generate 24 hours of slots, each with a 30-minute duration and increasing sort value
// courtId optional - for multi-court properties, each court gets its own set of 48 slots
const generateSlots = (numberOfCourts: number = 1) => {
  const slots: any[] = [];

  for (let courtIndex = 0; courtIndex < numberOfCourts; courtIndex++) {
    const courtId =
      numberOfCourts > 1 ? `court${courtIndex + 1}` : undefined;
    let currentHour = 0;
    let currentMinute = 0;
    let sortValue = courtIndex * 48 + 1;

    for (let i = 0; i < 48; i++) {
      const startHour = currentHour < 10 ? `0${currentHour}` : `${currentHour}`;
      const startMinute =
        currentMinute < 10 ? `0${currentMinute}` : `${currentMinute}`;

      const endMinute = currentMinute === 30 ? "00" : "30";
      const endHour = currentMinute === 30 ? currentHour + 1 : currentHour;

      const slotTitle = `${startHour}:${startMinute} - ${
        endHour < 10 ? `0${endHour}` : endHour
      }:${endMinute}`;

      // Default: ₹600 for 7 AM - 12 PM (peak / weekend), ₹300 for rest
      const isPeakSlot = currentHour >= 7 && currentHour < 12;
      const defaultPrice = isPeakSlot ? 600 : 300;

      const slot: any = {
        title: slotTitle,
        sort: sortValue,
        price: defaultPrice,
      };
      if (courtId) slot.courtId = courtId;
      slots.push(slot);

      currentMinute = currentMinute === 0 ? 30 : 0;
      if (currentMinute === 0) currentHour++;
      sortValue++;
    }
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
  const [numberOfCourts, setNumberOfCourts] = useState(1);
  const [slots, setSlots] = useState(generateSlots(1));

  const handleCourtsChange = (n: number) => {
    const num = Math.max(1, Math.min(10, n));
    setNumberOfCourts(num);
    setSlots(generateSlots(num));
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      // Add the property
      const propertyRef = await addDoc(collection(db, "properties"), {
        title,
        description,
        imgUrl,
        numberOfCourts: numberOfCourts > 1 ? numberOfCourts : undefined,
      });

      // Add slots as sub-collection for this property
      console.log("slots", slots);
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

            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Number of Courts
              </Text>
              <NumberInput
                min={1}
                max={10}
                value={numberOfCourts}
                onChange={(_v, n) => handleCourtsChange(isNaN(n) ? 1 : n)}>
                <NumberInputField placeholder="1" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {numberOfCourts > 1 && (
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {numberOfCourts} courts × 48 slots = {numberOfCourts * 48} total
                  slots
                </Text>
              )}
            </Box>

            {/* Slots Section */}
            <Box mt={4} maxH="300px" overflowY="auto">
              <Text fontSize="lg" fontWeight="bold">
                Slots
              </Text>
              <Text fontSize="xs" color="gray.500" mb={2}>
                Default: ₹600 (7AM–12PM), ₹300 (rest). Adjust per slot.
              </Text>
              <Box mt={2}>
                {numberOfCourts > 1
                  ? Array.from({ length: numberOfCourts }, (_, i) => {
                      const courtId = `court${i + 1}`;
                      const courtSlots = slots.filter(
                        (s) => (s.courtId || "court1") === courtId
                      );
                      return (
                        <Box key={courtId} mb={4}>
                          <Text fontWeight="medium" mb={2}>
                            Court {i + 1}
                          </Text>
                          {courtSlots.map((slot, idx) => {
                            const index = slots.indexOf(slot);
                            return (
                              <Box
                                key={`${courtId}-${idx}`}
                                display="flex"
                                justifyContent="space-between"
                                mb={2}>
                                <Text>{slot.title}</Text>
                                <Input
                                  type="number"
                                  value={slot.price}
                                  onChange={(e) => {
                                    const updatedSlots = [...slots];
                                    updatedSlots[index].price = Number(
                                      e.target.value
                                    );
                                    setSlots(updatedSlots);
                                  }}
                                  placeholder="Price"
                                  width="100px"
                                />
                              </Box>
                            );
                          })}
                        </Box>
                      );
                    })
                  : slots.map((slot, index) => (
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
          <Button variant="outline" onClick={onClose} ml={4}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddPropertyForm;
