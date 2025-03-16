"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { SWRConfig } from "swr";
import theme from "@/lib/theme";
import { AuthProvider } from "@/lib/auth-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <SWRConfig
          value={{
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            shouldRetryOnError: true,
          }}
        >
          <AuthProvider>{children}</AuthProvider>
        </SWRConfig>
      </ChakraProvider>
    </CacheProvider>
  );
}
