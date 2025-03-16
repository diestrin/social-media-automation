import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#e6f7ff",
      100: "#b3e0ff",
      200: "#80caff",
      300: "#4db3ff",
      400: "#1a9dff",
      500: "#0080ff",
      600: "#0066cc",
      700: "#004d99",
      800: "#003366",
      900: "#001a33",
    },
    twitter: {
      500: "#1DA1F2",
    },
    linkedin: {
      500: "#0077B5",
    },
    facebook: {
      500: "#1877F2",
    },
    instagram: {
      500: "#E1306C",
    },
  },
  fonts: {
    heading: "Inter, system-ui, sans-serif",
    body: "Inter, system-ui, sans-serif",
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "semibold",
        borderRadius: "md",
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: "semibold",
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: "lg",
          boxShadow: "sm",
          p: 4,
        },
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: "full",
        px: 2,
        py: 1,
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: "gray.50",
      },
    },
  },
});

export default theme;
