import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Icon,
} from "@chakra-ui/react"; // Full import from Chakra UI
import { useNavigate, useParams } from "react-router-dom";
import { FaCalendarAlt, FaStar, FaUser } from "react-icons/fa";
import Bookings from "../Bookings"; // Assuming Bookings component fetches bookings for the property
import Profile from "../Profile"; // Assuming Profile component exists
import featureConfig from "../../../featureConfig"; // Import the feature config
import Points from "../Points/Points";

export default function HomeTab({ onLogout }) {
  const { id: propertyIdFromUrl } = useParams(); // Get propertyId from URL params
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userPropertyId = propertyIdFromUrl || storedUser?.propertyId; // PropertyId from URL or user data
  const user = storedUser;

  const navigate = useNavigate();

  // Redirect to login if no user is authenticated
  useEffect(() => {
    if (!storedUser) {
      navigate("/login");
    }
  }, [storedUser, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    onLogout();
    navigate("/login", { replace: true });
  };

  // Get feature flags for the current property
  const features = featureConfig[userPropertyId] || {}; // Default to an empty object if the property ID is not found

  // State to manage the active tab
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleTabChange = (index) => {
    setActiveTabIndex(index); // Update active tab index when a tab is clicked
  };

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      {/* Header */}
      <Box
        backgroundColor="rgb(20,20,20)"
        height="60px"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={6}
        boxShadow="sm">
        <Text fontSize="lg" color="white" fontWeight="bold">
          {user?.title || "User"} {/* Safely access user title */}
        </Text>
      </Box>

      {/* Main Content */}
      <Box flex="1" overflowY="auto">
        <Tabs
          index={activeTabIndex}
          onChange={handleTabChange}
          variant="unstyled">
          <TabPanels p={0}>
            <TabPanel>
              <Bookings /> {/* Render Bookings component */}
            </TabPanel>

            {/* Conditionally Render the Points Tab and Panel */}
            {features.points ? (
              <TabPanel>
                <Points />
              </TabPanel>
            ) : null}

            <TabPanel>
              <Profile onLogout={handleLogout} />{" "}
              {/* Render Profile component */}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      {/* Bottom Tabs */}
      <Box
        position="fixed"
        bottom={0}
        width="100%"
        backgroundColor="rgb(20,20,20)"
        boxShadow="lg"
        zIndex={10}>
        <Tabs
          index={activeTabIndex}
          onChange={handleTabChange}
          variant="unstyled"
          align="center">
          <TabList display="flex" justifyContent="space-around">
            <Tab
              _selected={{ color: "green.500" }}
              color="white"
              flexDirection="column"
              alignItems="center">
              <Icon as={FaCalendarAlt} boxSize={5} />
              <Text fontSize="sm">Bookings</Text>
            </Tab>
            {/* Conditionally Render the Points Tab */}
            {features.points ? (
              <Tab
                _selected={{ color: "green.500" }}
                color="white"
                flexDirection="column"
                alignItems="center">
                <Icon as={FaStar} boxSize={5} />
                <Text fontSize="sm">Points</Text>
              </Tab>
            ) : null}{" "}
            {/* Don't render Points tab if feature is disabled */}
            <Tab
              _selected={{ color: "green.500" }}
              color="white"
              flexDirection="column"
              alignItems="center">
              <Icon as={FaUser} boxSize={5} />
              <Text fontSize="sm">Profile</Text>
            </Tab>
          </TabList>
        </Tabs>
      </Box>
    </Box>
  );
}
