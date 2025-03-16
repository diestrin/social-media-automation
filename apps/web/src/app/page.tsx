'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Flex, Spinner } from '@chakra-ui/react';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <Flex justify="center" align="center" minH="100vh">
      <Spinner size="xl" />
    </Flex>
  );
}
