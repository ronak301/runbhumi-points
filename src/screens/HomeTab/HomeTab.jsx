import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React from "react";
import Points from "../Points/Points";
import Bookings from "../Bookings";

export default function HomeTab() {
  return (
    <Box>
      <Box
        backgroundColor={"rgb(20,20,20)"}
        paddingTop={"10%"}
        paddingBottom={"6%"}
        borderRadius={8}
        overflow={"visible"}>
        <Box textAlign={"center"} fontSize={24} color={"white"}>
          Welcome To Runbhumi Mewar
        </Box>
        {/* <Box textAlign={"center"} fontSize={20} mt={4} color={"white"}>
          Points Table
        </Box> */}
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
