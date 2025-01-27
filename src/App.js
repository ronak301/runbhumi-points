import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import HomeTab from "./modules/app/HomeTab/HomeTab";
import { AlertProvider } from "./context/AlertContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Website from "./modules/website/index";
import { useState, useEffect } from "react";
import Login from "./modules/auth/Login";
import AdminPanel from "./modules/admin/AdminPanel"; // Import AdminPanel

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
    localStorage.clear();
  };

  return (
    <ChakraProvider theme={theme}>
      <AlertProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Website />} />

            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  // If authenticated, redirect to home with dynamic propertyId
                  <Navigate
                    to={`/home/property/${
                      JSON.parse(localStorage.getItem("user")).propertyId
                    }`}
                  />
                ) : (
                  <Login onLogin={onLogin} />
                )
              }
            />

            {/* /home route for authenticated users */}
            <Route
              path="/home"
              element={
                isAuthenticated ? (
                  <Navigate
                    to={`/home/property/${
                      JSON.parse(localStorage.getItem("user")).propertyId
                    }`}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Dynamic Route for Property Home */}
            <Route
              path="/home/property/:id"
              element={
                isAuthenticated ? (
                  <HomeTab onLogout={onLogout} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={<Navigate to="/admin/home" />} // Redirect /admin to /admin/home
            />
            <Route
              path="/admin/*"
              element={
                isAuthenticated ? (
                  <AdminPanel onLogout={onLogout} />
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
