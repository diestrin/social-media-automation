"use client";

import { Box, Container, Heading, SimpleGrid } from "@chakra-ui/react";
import Dashboard from "@/components/Dashboard";
import AccountsList from "@/components/AccountsList";
import ContentQueue from "@/components/ContentQueue";

export default function DashboardPage() {
  return (
    <Container maxW="container.xl" py={5}>
      <Heading mb={6}>Dashboard</Heading>

      <Dashboard />

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mt={8}>
        <AccountsList />
        <ContentQueue />
      </SimpleGrid>
    </Container>
  );
}
