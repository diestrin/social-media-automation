"use client";

import {
  Box,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiUsers, FiCalendar, FiBarChart2, FiTrendingUp } from "react-icons/fi";

interface StatCardProps {
  title: string;
  stat: string;
  icon: 'accounts' | 'posts' | 'calendar' | 'engagement';
  bgColor?: string;
  borderColor?: string;
}

export default function StatCard({ title, stat, icon, bgColor, borderColor }: StatCardProps) {
  const defaultBgColor = useColorModeValue("white", "gray.700");
  const defaultBorderColor = useColorModeValue("gray.200", "gray.600");
  
  const getIcon = () => {
    switch (icon) {
      case "accounts":
        return <FiUsers size="3em" />;
      case "posts":
        return <FiCalendar size="3em" />;
      case "calendar":
        return <FiBarChart2 size="3em" />;
      case "engagement":
        return <FiTrendingUp size="3em" />;
      default:
        return <FiUsers size="3em" />;
    }
  };

  const getIconColor = () => {
    switch (icon) {
      case "accounts":
        return "blue.500";
      case "posts":
        return "green.500";
      case "calendar":
        return "purple.500";
      case "engagement":
        return "orange.500";
      default:
        return "gray.500";
    }
  };

  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py="5"
      shadow="sm"
      border="1px solid"
      borderColor={borderColor || defaultBorderColor}
      rounded="lg"
      bg={bgColor || defaultBgColor}
    >
      <Flex justifyContent="space-between">
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight="medium" isTruncated>
            {title}
          </StatLabel>
          <StatNumber fontSize="2xl" fontWeight="medium">
            {stat}
          </StatNumber>
        </Box>
        <Box
          my="auto"
          color={getIconColor()}
          alignContent="center"
        >
          {getIcon()}
        </Box>
      </Flex>
    </Stat>
  );
}
