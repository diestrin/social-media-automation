"use client";

import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const bgColor = useColorModeValue("gray.50", "gray.900");

  return (
    <ProtectedRoute>
      <Box minH="100vh" bg={bgColor}>
        <Header />
        <Flex>
          <Sidebar />
          <Box flex="1" p={4} ml={{ base: 0, md: 60 }} mt="60px">
            {children}
          </Box>
        </Flex>
      </Box>
    </ProtectedRoute>
  );
}
