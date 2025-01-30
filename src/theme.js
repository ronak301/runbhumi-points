// src/theme.ts
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
        backgroundColor: "#ffffff", // White background for the body
        color: "#333333", // Charcoal text color
      },
      "*": {
        fontFamily: "Neulis Alt, sans-serif",
      },
    },
  },
  colors: {
    black: "#000000", // Black color for backgrounds
    white: "#ffffff", // White color for text and backgrounds
    gray: {
      100: "#F7F7F7", // Light gray for hover
      500: "#333333", // Dark gray for text and active state
      700: "#1A1A1A", // Darker gray for deep backgrounds
    },
    green: {
      500: "rgb(23, 52, 18)",
      600: "rgb(23, 52, 18)",
      700: "rgb(23, 52, 18)",
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "bold", // Default to bold text for buttons
        borderRadius: "md", // Rounded corners
      },
      variants: {
        outline: {
          borderColor: "gray.500",
          color: "gray.500",
        },
      },
    },
  },
});

export default theme;
