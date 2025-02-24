import { ChakraProvider, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import { AlertProvider } from "./context/AlertContext";
import AdminPanel from "./modules/admin/AdminPanel";
import AddBookingPage from "./modules/app/Bookings/AddBookingPage";
import HomeTab from "./modules/app/HomeTab/HomeTab";
import Login from "./modules/auth/Login";
import Footer from "./modules/website/Footer";
import Website from "./modules/website/index";
import Navbar from "./modules/website/Navbar";
import Projects from "./modules/website/Projects/Projects";
import theme from "./theme";
import FloatingButtons from "./components/FloatingButtons";
import ProjectDetail from "./modules/website/Projects/ProjectDetail";
import AllBlogs from "./modules/website/Blogs/AllBlogs";
import BlogDetail from "./modules/website/Blogs/BlogDetail";
import CricketTurf from "./modules/website/Products/CricketTurf";
import FootballTurf from "./modules/website/Products/FootballTurf";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const onLogin = () => setIsAuthenticated(true);
  const onLogout = () => {
    setIsAuthenticated(false);
    localStorage.clear();
  };

  if (loading) return null;

  return (
    <ChakraProvider theme={theme}>
      <AlertProvider>
        <Router>
          <AppContent
            isAuthenticated={isAuthenticated}
            onLogout={onLogout}
            onLogin={onLogin}
          />
        </Router>
      </AlertProvider>
    </ChakraProvider>
  );
};

const AppContent = ({ isAuthenticated, onLogout, onLogin }) => {
  const location = useLocation();
  const showNavbarFooter =
    [
      "/",
      "/projects",
      "/projects/:id",
      "/news-blogs",
      "/news-blogs/:slug",
    ].some((path) => location.pathname.startsWith(path.replace(":id", ""))) &&
    !["/login", "/admin", "/home"].some((path) =>
      location.pathname.startsWith(path)
    );

  return (
    <Box display="flex" flexDirection="column" minH="100vh">
      {showNavbarFooter && <Navbar />}

      {/* Main Content Area */}
      <Box flex="1" as="main" d="flex">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate
                  to={`/home/property/${
                    JSON.parse(localStorage.getItem("user")).propertyId
                  }`}
                />
              ) : (
                <Website />
              )
            }
          />

          <Route path="/cricket-turf" element={<CricketTurf />} />
          <Route path="/football-turf" element={<FootballTurf />} />

          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />

          <Route path="/news-blogs" element={<AllBlogs />} />
          <Route path="/news-blogs/:slug" element={<BlogDetail />} />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
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
          <Route
            path="/home/property/:propertyId/add-booking"
            element={
              isAuthenticated ? <AddBookingPage /> : <Navigate to="/login" />
            }
          />
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
          <Route path="/admin" element={<Navigate to="/admin/home" />} />
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
      </Box>

      {/* Floating Buttons */}
      {showNavbarFooter && <FloatingButtons />}

      {/* Footer (Sticks to bottom if content is short) */}
      {showNavbarFooter && <Footer />}
    </Box>
  );
};

export default App;
