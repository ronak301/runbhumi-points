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
  const user = localStorage.getItem("user");

  // Check if the user is already authenticated in localStorage
  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    }
  }, [user]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  return (
    <ChakraProvider theme={theme}>
      <AlertProvider>
        <Router>
          <Routes>
            {/* Redirect user to login if not authenticated */}
            <Route path="/" element={<Website />} />
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/home" />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/*"
              element={
                isAuthenticated ? (
                  <Navigate to="/home" />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            {/* Redirect user to login if not authenticated */}
            <Route
              path="/home"
              element={isAuthenticated ? <HomeTab /> : <Navigate to="/login" />}
            />
          </Routes>
        </Router>
      </AlertProvider>
    </ChakraProvider>
  );
}

export default App;
