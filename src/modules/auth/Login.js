import { useState } from "react";
import {
  Input,
  Button,
  Box,
  Text,
  useToast,
  VStack,
  Heading,
  IconButton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";

const Login = ({ onLogin }) => {
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

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
      password: "7924",
      propertyId: "4HJl3JYH5TzUeylFEHKj",
      title: "Velocity Turf",
      owner: {
        firstName: "The Velocity Turf",
        lastName: "",
      },
    },
    9461583720: {
      password: "3720",
      propertyId: "D5FfylDnU6NXlmTtPtoj",
      title: "Satyam Sports Arena",
      owner: {
        firstName: "Saurmya",
        lastName: "Agrawal",
      },
    },
  };

  const handleLogin = () => {
    const user = userMap[mobileNo];

    if (user && user.password === password) {
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
      {/* Top Bar with Bigger Back Button */}
      <Box bg="teal.500" p={4} color="white" display="flex" alignItems="center">
        <IconButton
          icon={<ArrowBackIcon boxSize={6} />} // Increased icon size
          variant="ghost"
          color="white"
          onClick={() => navigate("/")}
          aria-label="Back to Home"
          _hover={{ bg: "teal.600" }}
          mr={4}
          fontSize="2xl" // Bigger icon button
        />
        <Heading size="md" textAlign="center" flex="1">
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
