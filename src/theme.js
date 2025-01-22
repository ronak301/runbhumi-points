import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: `'Neulis Alt', sans-serif`,
    body: `'Neulis Alt', sans-serif`,
  },
  styles: {
    global: {
      "@font-face": [
        {
          fontFamily: "Neulis Alt",
          src: "url('/fonts/NeulisAlt-Regular.ttf') format('truetype')",
          fontWeight: "normal",
          fontStyle: "normal",
        },
      ],
      body: {
        fontFamily: "Neulis Alt, sans-serif",
      },
      "*": {
        fontFamily: "Neulis Alt, sans-serif",
      },
    },
  },
  colors: {
    brand: {
      500: "#3F8735",
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
