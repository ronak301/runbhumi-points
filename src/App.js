import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import HomeTab from "./screens/HomeTab/HomeTab";
import { AlertProvider } from "./context/AlertContext";

function App() {
  return (
    <ChakraProvider>
      <AlertProvider>
        <HomeTab />
      </AlertProvider>
    </ChakraProvider>
  );
}

export default App;
