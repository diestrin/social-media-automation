"use client";

import {
  Box,
  SimpleGrid,
  Text,
  useColorModeValue,
  Skeleton,
} from "@chakra-ui/react";
import StatCard from "./StatCard";
import { useAnalytics } from "@/lib/hooks";

export default function Dashboard() {
  const { analytics, isLoading, isError } = useAnalytics();

  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box p={4}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        {isLoading ? (
          <>
            <Skeleton height="120px" />
            <Skeleton height="120px" />
            <Skeleton height="120px" />
            <Skeleton height="120px" />
          </>
        ) : isError ? (
          <Box p={4} borderWidth="1px" borderRadius="lg" bg={bgColor}>
            <Text color="red.500">
              Error loading analytics. Please try again later.
            </Text>
          </Box>
        ) : (
          <>
            <StatCard
              title="Total Accounts"
              stat={analytics.totalAccounts.toString()}
              icon="accounts"
              bgColor={bgColor}
              borderColor={borderColor}
            />
            <StatCard
              title="Scheduled Posts"
              stat={analytics.scheduledPosts.toString()}
              icon="posts"
              bgColor={bgColor}
              borderColor={borderColor}
            />
            <StatCard
              title="Posts This Week"
              stat={analytics.postsThisWeek.toString()}
              icon="calendar"
              bgColor={bgColor}
              borderColor={borderColor}
            />
            <StatCard
              title="Engagement Rate"
              stat={`${analytics.engagementRate}%`}
              icon="engagement"
              bgColor={bgColor}
              borderColor={borderColor}
            />
          </>
        )}
      </SimpleGrid>
    </Box>
  );
}
