import { useState } from "react";
import {
  Input,
  Button,
  Box,
  Text,
  useToast,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  // Mapping of mobile numbers to passwords and property IDs
  const userMap = {
    7042770304: {
      password: "1234",
      propertyId: "iNANAwfMb6EXNtp7MRwJ",
      title: "Runbhumi Mewar",
      owner: {
        firstName: "Ronak",
        lastName: "Kothari",
      },
    },
    9649354356: {
      password: "1234",
      propertyId: "iNANAwfMb6EXNtp7MRwJ",
      title: "Runbhumi Mewar",
      owner: {
        firstName: "Abhay",
        lastName: "Kothari",
      },
    },
    9664317924: {
      password: "1234",
      propertyId: "JNznXP3zKHF6PL08RwVv",
      title: "Velocity Turf",
      owner: {
        firstName: "The Velocity Turf",
        lastName: "",
      },
    },
  };

  const handleLogin = () => {
    const user = userMap[mobileNo];

    if (user && user.password === password) {
      // Store user info and property ID in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          mobileNo,
          propertyId: user.propertyId,
          title: user.title,
          owner: user.owner,
        })
      );

      onLogin();
      navigate(`/home/property/${user.propertyId}`);
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
    <Box minHeight="100vh" display="flex" flexDirection="column">
      {/* Top Bar */}
      <Box bg="teal.500" p={4} color="white">
        <Heading size="md" textAlign="center">
          Turfwale
        </Heading>
      </Box>

      {/* Centered Login Form */}
      <VStack
        spacing={6}
        maxWidth="400px"
        mx="auto"
        mt="100px"
        p={6}
        borderRadius="md"
        boxShadow="lg"
        bg="white"
        border="1px solid #e2e8f0">
        <Text fontSize="2xl" fontWeight="bold" color="teal.600">
          Login to Your Account
        </Text>

        <Input
          placeholder="Mobile Number"
          value={mobileNo}
          onChange={(e) => setMobileNo(e.target.value)}
          mb={4}
          isFullWidth
          focusBorderColor="teal.500"
          borderColor="gray.300"
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          mb={4}
          isFullWidth
          focusBorderColor="teal.500"
          borderColor="gray.300"
        />

        <Button
          width="full"
          colorScheme="teal"
          onClick={handleLogin}
          isLoading={false} // Can add loading state if needed
        >
          Login
        </Button>
      </VStack>
    </Box>
  );
};

export default Login;
