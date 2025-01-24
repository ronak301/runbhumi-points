import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Icon,
} from "@chakra-ui/react";
import Points from "../Points/Points";
import Bookings from "../Bookings";
import Profile from "../Profile";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaStar, FaUser } from "react-icons/fa";

export default function HomeTab({ onLogout }) {
  const location = useLocation();
  const { propertyId } = location.state || {}; // Fallback to empty if not passed via state
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userPropertyId = storedUser?.propertyId || propertyId;
  const navigate = useNavigate();
  const [activeTabIndex, setActiveTabIndex] = useState(0); // State for active tab

  useEffect(() => {
    if (!storedUser) {
      navigate("/login");
    }
  }, [storedUser, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user data
    onLogout();
    navigate("/login", { replace: true }); // Navigate to login after clearing
  };

  const handleTabChange = (index) => {
    setActiveTabIndex(index);
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
          Runbhumi Mewar
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
              <Bookings />
            </TabPanel>
            <TabPanel>
              <Points />
            </TabPanel>
            <TabPanel>
              <Profile onLogout={handleLogout} />
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
            <Tab
              _selected={{ color: "green.500" }}
              color="white"
              flexDirection="column"
              alignItems="center">
              <Icon as={FaStar} boxSize={5} />
              <Text fontSize="sm">Points</Text>
            </Tab>
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
