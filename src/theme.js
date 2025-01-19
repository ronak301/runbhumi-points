import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      500: "#38A169",
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "bold",
      },
    },
  },
});

export default theme;
