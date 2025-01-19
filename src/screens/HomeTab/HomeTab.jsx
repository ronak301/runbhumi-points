import React, { useEffect } from "react";
import {
  Box,
  Text,
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Points from "../Points/Points";
import Bookings from "../Bookings";
import { useLocation, useNavigate } from "react-router-dom";

export default function HomeTab() {
  const location = useLocation();
  const { propertyId } = location.state || {}; // Fallback to empty if not passed via state
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userPropertyId = storedUser?.propertyId || propertyId;
  const navigate = useNavigate();

  useEffect(() => {
    if (userPropertyId) {
      // Fetch property-specific data or perform other actions
      console.log("User's Property ID:", userPropertyId);
    }
  }, [userPropertyId]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Box>
      <Box
        backgroundColor="rgb(20,20,20)"
        height="60px" // Standard navbar height
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={6} // Horizontal padding for spacing
        boxShadow="sm">
        <Text fontSize="lg" color="white" fontWeight="bold">
          Runbhumi Mewar
        </Text>
        <Button colorScheme="red" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      <Tabs>
        <TabList>
          <Tab>Bookings</Tab>
          <Tab>Points</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Bookings />
          </TabPanel>
          <TabPanel>
            <Points />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
