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
    localStorage.removeItem("user"); // Remove user from localStorage on logout
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
                  <Navigate to="/home" />
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
