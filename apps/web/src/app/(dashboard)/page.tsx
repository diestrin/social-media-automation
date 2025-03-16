"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Flex, Spinner } from "@chakra-ui/react";

export default function DashboardRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <Flex justify="center" align="center" minH="80vh">
      <Spinner size="xl" />
    </Flex>
  );
}
