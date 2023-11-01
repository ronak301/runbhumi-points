import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import Points from "./Points";

function App() {
  return (
    <ChakraProvider>
      <Points />
    </ChakraProvider>
  );
}

export default App;
