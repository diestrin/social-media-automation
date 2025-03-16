import * as React from "react";

declare global {
  namespace React {
    interface ReactNode {
      // Empty interface to extend React.ReactNode
    }
  }
}

// Fix for modules without type declarations
declare module "@chakra-ui/react";
declare module "@chakra-ui/next-js";
declare module "@chakra-ui/icons";
declare module "react-icons/fi";
declare module "react-icons";
