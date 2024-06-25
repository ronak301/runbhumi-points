import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import HomeTab from "./screens/HomeTab/HomeTab";

function App() {
  return (
    <ChakraProvider>
      <HomeTab />
    </ChakraProvider>
  );
}

export default App;
