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
  Image,
} from "@chakra-ui/react"; // Full import from Chakra UI
import { useNavigate, useParams } from "react-router-dom";
import { FaCalendarAlt, FaStar, FaUser } from "react-icons/fa";
import Bookings from "../Bookings"; // Assuming Bookings component fetches bookings for the property
import Profile from "../Profile"; // Assuming Profile component exists
import featureConfig from "../../../featureConfig"; // Import the feature config
import Points from "../Points/Points";
import useCurrentProperty from "../hooks/useCurrentProperty";

export default function HomeTab({ onLogout }) {
  const { propertyId, property } = useCurrentProperty();

  const navigate = useNavigate();

  // Redirect to login if no user is authenticated
  useEffect(() => {
    if (!propertyId) {
      navigate("/login");
    }
  }, [propertyId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    onLogout();
    navigate("/login", { replace: true });
  };

  // Get feature flags for the current property
  const features = featureConfig[propertyId] || {}; // Default to an empty object if the property ID is not found

  // State to manage the active tab
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleTabChange = (index) => {
    setActiveTabIndex(index); // Update active tab index when a tab is clicked
  };

  const src = propertyId === "D5FfylDnU6NXlmTtPtoj" ? "/logo_3.png" : null;

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
        {/* Logo */}
        {src ? (
          <Image src={src} alt="Logo" height="40px" borderRadius={999} />
        ) : null}

        {/* Title */}
        <Text
          fontSize="lg"
          color="white"
          fontWeight="bold"
          flex="1"
          textAlign="center">
          {property?.property?.title || "Loading..."}
        </Text>

        {/* Placeholder for spacing on the right */}
        <Box width="40px" />
      </Box>

      {/* Main Content */}
      <Box flex="1" overflowY="auto">
        <Tabs
          index={activeTabIndex}
          onChange={handleTabChange}
          variant="unstyled">
          <TabPanels p={0}>
            <TabPanel>
              <Bookings />
            </TabPanel>

            {/* Conditionally Render the Points Tab and Panel */}
            {features.points ? (
              <TabPanel>
                <Points />
              </TabPanel>
            ) : null}

            <TabPanel>
              <Profile onLogout={handleLogout} />{" "}
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
        alignItems={"center"}
        justifyContent={"center"}
        d="flex"
        h={20}
        zIndex={10}>
        <Tabs
          index={activeTabIndex}
          onChange={handleTabChange}
          variant="unstyled"
          mt={2}
          align="center">
          <TabList display="flex" justifyContent="space-around">
            <Tab
              _selected={{ color: "white" }}
              color="grey"
              flexDirection="column"
              alignItems="center">
              <Icon as={FaCalendarAlt} boxSize={5} />
              <Text fontSize="sm" mt={1}>
                Bookings
              </Text>
            </Tab>
            {/* Conditionally Render the Points Tab */}
            {features.points ? (
              <Tab
                _selected={{ color: "white" }}
                color="grey"
                flexDirection="column"
                alignItems="center">
                <Icon as={FaStar} boxSize={5} />
                <Text fontSize="sm" mt={1}>
                  Points
                </Text>
              </Tab>
            ) : null}{" "}
            {/* Don't render Points tab if feature is disabled */}
            <Tab
              _selected={{ color: "white" }}
              color="grey"
              flexDirection="column"
              alignItems="center">
              <Icon as={FaUser} boxSize={5} />
              <Text fontSize="sm" mt={1}>
                Profile
              </Text>
            </Tab>
          </TabList>
        </Tabs>
      </Box>
    </Box>
  );
}
