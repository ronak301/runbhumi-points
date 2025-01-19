import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import HomeTab from "./screens/HomeTab/HomeTab";
import { AlertProvider } from "./context/AlertContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Website from "./screens/Website/index";

function App() {
  return (
    <ChakraProvider>
      <AlertProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomeTab />} />
            <Route path="/web" element={<Website />} />
          </Routes>
        </Router>
      </AlertProvider>
    </ChakraProvider>
  );
}

export default App;
