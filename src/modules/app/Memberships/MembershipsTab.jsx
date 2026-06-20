import React, { useState } from "react";
import {
  Box,
  Button,
  Spinner,
  Text,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import useMembershipsManager from "../hooks/useMembershipsManager";
import MembershipCard from "./MembershipCard";
import AddMembershipForm from "./AddMembershipForm";
import MemberBookingsView from "./MemberBookingsView";
import { getMembershipStatus } from "./membershipHelpers";

export default function MembershipsTab() {
  const { memberships, loading, fetchMemberships } = useMembershipsManager();
  const [showForm, setShowForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const active = memberships.filter((m) => getMembershipStatus(m) === "active");
  const past = memberships.filter((m) => getMembershipStatus(m) === "past");

  if (showForm) {
    return (
      <AddMembershipForm
        onBack={() => setShowForm(false)}
        onAdded={fetchMemberships}
      />
    );
  }

  if (selectedMember) {
    return (
      <MemberBookingsView
        membership={selectedMember}
        onBack={() => setSelectedMember(null)}
      />
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box
        bg="rgb(20,20,20)"
        px={4}
        pt={5}
        pb={4}>
        <Flex align="center" justify="space-between" mb={1}>
          <Text fontSize="xl" fontWeight="800" color="white" letterSpacing="-0.3px">
            Memberships
          </Text>
          <Button
            size="sm"
            leftIcon={<AddIcon boxSize={2.5} />}
            colorScheme="teal"
            borderRadius="full"
            fontWeight="600"
            onClick={() => setShowForm(true)}>
            New
          </Button>
        </Flex>
        <Text fontSize="xs" color="gray.400">
          {active.length} active · {past.length} past
        </Text>
      </Box>

      {loading ? (
        <Flex justify="center" align="center" mt={16}>
          <Spinner color="teal.500" size="lg" />
        </Flex>
      ) : (
        <Tabs variant="unstyled" mt={0}>
          <Box bg="white" borderBottomWidth="1px" borderColor="gray.100" px={4}>
            <TabList gap={0}>
              {[`Active (${active.length})`, `Past (${past.length})`].map((label) => (
                <Tab
                  key={label}
                  fontSize="sm"
                  fontWeight="600"
                  color="gray.400"
                  pb={3}
                  pt={3}
                  px={3}
                  mr={2}
                  borderBottomWidth="2px"
                  borderColor="transparent"
                  _selected={{ color: "teal.600", borderColor: "teal.500" }}
                  _focus={{ boxShadow: "none" }}>
                  {label}
                </Tab>
              ))}
            </TabList>
          </Box>

          <TabPanels>
            <TabPanel px={3} pt={3} pb={0}>
              {active.length === 0 ? (
                <Flex direction="column" align="center" mt={16} gap={2}>
                  <Text fontSize="3xl">🏅</Text>
                  <Text fontSize="sm" color="gray.400" fontWeight="500">
                    No active memberships
                  </Text>
                  <Button
                    size="sm"
                    colorScheme="teal"
                    variant="outline"
                    borderRadius="full"
                    mt={2}
                    onClick={() => setShowForm(true)}>
                    Add first member
                  </Button>
                </Flex>
              ) : (
                active.map((m) => (
                  <MembershipCard key={m.id} membership={m} onComplete={fetchMemberships} onViewBookings={setSelectedMember} />
                ))
              )}
            </TabPanel>
            <TabPanel px={3} pt={3} pb={0}>
              {past.length === 0 ? (
                <Flex direction="column" align="center" mt={16} gap={2}>
                  <Text fontSize="3xl">📁</Text>
                  <Text fontSize="sm" color="gray.400" fontWeight="500">
                    No past memberships
                  </Text>
                </Flex>
              ) : (
                past.map((m) => (
                  <MembershipCard key={m.id} membership={m} onComplete={fetchMemberships} onViewBookings={setSelectedMember} />
                ))
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </Box>
  );
}
