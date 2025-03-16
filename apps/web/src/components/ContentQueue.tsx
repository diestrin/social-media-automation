"use client";

import { useState, useRef } from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  Badge,
  Flex,
  Avatar,
  useColorModeValue,
  Button,
  IconButton,
  Spinner,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Skeleton,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, ViewIcon } from "@chakra-ui/icons";
import { useContent } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export default function ContentQueue() {
  const { content, isLoading, isError, deleteContent } = useContent();
  const toast = useToast();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [contentToDelete, setContentToDelete] = useState<string | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const confirmDelete = (id: string) => {
    setContentToDelete(id);
    onOpen();
  };

  const handleDelete = async () => {
    if (!contentToDelete) return;

    setIsDeleting(contentToDelete);
    try {
      await deleteContent(contentToDelete);
      toast({
        title: "Content deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Deletion failed",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(null);
      setContentToDelete(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/content/edit/${id}`);
  };

  const handleView = (id: string) => {
    router.push(`/content/${id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "green";
      case "scheduled":
        return "blue";
      case "draft":
        return "yellow";
      case "failed":
        return "red";
      default:
        return "gray";
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return "twitter.500";
      case "linkedin":
        return "linkedin.500";
      case "facebook":
        return "facebook.500";
      case "instagram":
        return "pink.500";
      default:
        return "gray.500";
    }
  };

  if (isError) {
    return (
      <Box p={4}>
        <Heading size="md" mb={4}>
          Content Queue
        </Heading>
        <Text color="red.500">
          Error loading content. Please try again later.
        </Text>
      </Box>
    );
  }

  return (
    <Box
      p={4}
      bg={useColorModeValue("white", "gray.700")}
      borderRadius="lg"
      shadow="sm"
      borderWidth="1px"
    >
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="md">Content Queue</Heading>
        <Button
          colorScheme="blue"
          size="sm"
          onClick={() => router.push("/content/new")}
        >
          Create Content
        </Button>
      </Flex>

      {isLoading ? (
        <Stack spacing={4}>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} height="80px" />
          ))}
        </Stack>
      ) : content.length === 0 ? (
        <Box textAlign="center" py={6}>
          <Text mb={4}>No content in your queue yet.</Text>
          <Button
            colorScheme="blue"
            size="sm"
            onClick={() => router.push("/content/new")}
          >
            Create Your First Content
          </Button>
        </Box>
      ) : (
        <Stack spacing={3} maxH="300px" overflowY="auto" pr={2}>
          {content.map((item) => (
            <Box
              key={item.id}
              p={3}
              borderWidth="1px"
              borderRadius="md"
              bg={useColorModeValue("gray.50", "gray.800")}
              shadow="sm"
            >
              <Flex justify="space-between" align="flex-start">
                <Box>
                  <Heading size="sm" mb={2}>
                    {item.title}
                  </Heading>
                  <Text fontSize="sm" noOfLines={2} mb={2}>
                    {item.body}
                  </Text>
                  <Flex align="center" mt={2}>
                    <Avatar size="xs" name={item.accountName} mr={2} />
                    <Text fontSize="xs" color="gray.500">
                      {item.accountName}
                    </Text>
                    <Badge
                      ml={2}
                      colorScheme={getPlatformColor(item.platform)}
                      fontSize="xs"
                    >
                      {item.platform}
                    </Badge>
                  </Flex>
                </Box>
                <Box>
                  <Flex direction="column" align="flex-end">
                    <Badge colorScheme={getStatusColor(item.status)} mb={2}>
                      {item.status}
                    </Badge>
                    {item.scheduledFor && (
                      <Text fontSize="xs" color="gray.500" mb={2}>
                        {format(
                          new Date(item.scheduledFor),
                          "MMM d, yyyy h:mm a"
                        )}
                      </Text>
                    )}
                    <Flex>
                      <IconButton
                        aria-label="View content"
                        icon={<ViewIcon />}
                        size="sm"
                        colorScheme="gray"
                        mr={2}
                        onClick={() => handleView(item.id)}
                      />
                      <IconButton
                        aria-label="Edit content"
                        icon={<EditIcon />}
                        size="sm"
                        colorScheme="blue"
                        mr={2}
                        onClick={() => handleEdit(item.id)}
                      />
                      <IconButton
                        aria-label="Delete content"
                        icon={
                          isDeleting === item.id ? (
                            <Spinner size="sm" />
                          ) : (
                            <DeleteIcon />
                          )
                        }
                        size="sm"
                        colorScheme="red"
                        isDisabled={isDeleting !== null}
                        onClick={() => confirmDelete(item.id)}
                      />
                    </Flex>
                  </Flex>
                </Box>
              </Flex>
            </Box>
          ))}
        </Stack>
      )}

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Content
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this content? This action cannot
              be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
                isLoading={isDeleting !== null}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
