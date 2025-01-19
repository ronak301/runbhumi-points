import { useState } from "react";
import { Input, Button, Box, Text, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  // Mapping of mobile numbers to passwords and property IDs
  const userMap = {
    7042770304: { password: "1234", propertyId: "iNANAwfMb6EXNtp7MRwJ" },
    7042770304: { password: "1234", propertyId: "iNANAwfMb6EXNtp7MRwJ" },
    9999999999: { password: "5678", propertyId: "xyz" },
    8888888888: { password: "0000", propertyId: "abc" },
  };

  const handleLogin = () => {
    const user = userMap[mobileNo];

    if (user && user.password === password) {
      // Store user info and property ID in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({ mobileNo, propertyId: user.propertyId })
      );

      // Call the onLogin prop to update authentication state in App.js
      onLogin();

      // Redirect to Home Tab with the property ID
      navigate("/home", { state: { propertyId: user.propertyId } });
    } else {
      toast({
        title: "Invalid credentials",
        description: "Please check your mobile number and password.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      maxWidth="400px"
      mx="auto"
      mt="100px"
      p={6}
      borderRadius="md"
      boxShadow="lg">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Login
      </Text>
      <Input
        placeholder="Mobile Number"
        value={mobileNo}
        onChange={(e) => setMobileNo(e.target.value)}
        mb={4}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        mb={4}
      />
      <Button width="full" colorScheme="green" onClick={handleLogin}>
        Login
      </Button>
    </Box>
  );
};

export default Login;
