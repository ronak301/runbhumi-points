// src/modules/admin/AdminPanel.tsx
import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Box, Flex } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import HomeTab from "./HomeTab";
import SettingsTab from "./SettingsTab"; // Placeholder for SettingsTab

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  return (
    <Flex height="100vh">
      {/* Sidebar */}
      <Sidebar />
      <Box flex="1">
        {/* Navbar */}
        <Navbar onLogout={onLogout} />

        {/* Admin Routes */}
        <Routes>
          <Route path="/home" element={<HomeTab />} />
          <Route path="/settings" element={<SettingsTab />} />
        </Routes>
      </Box>
    </Flex>
  );
};

export default AdminPanel;