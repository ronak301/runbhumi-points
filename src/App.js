import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme"; // Assuming you've defined your theme
import HomeTab from "./screens/HomeTab/HomeTab";
import { AlertProvider } from "./context/AlertContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Website from "./screens/Website/index";
import { useState, useEffect } from "react";
import Login from "./screens/Login"; // Assuming Login component is in "screens/Login"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if the user is authenticated based on localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);

  const onLogin = () => {
    setIsAuthenticated(true);
  };

  const onLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <ChakraProvider theme={theme}>
      <AlertProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Website />} />
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/home" />
                ) : (
                  <Login onLogin={onLogin} />
                )
              }
            />
            <Route
              path="/home"
              element={
                isAuthenticated ? (
                  <HomeTab onLogout={onLogout} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </Router>
      </AlertProvider>
    </ChakraProvider>
  );
}

export default App;
