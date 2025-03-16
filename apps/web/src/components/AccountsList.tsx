"use client";

import { useState, useRef } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Avatar,
  Flex,
  Text,
  Button,
  useColorModeValue,
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
  Stack,
  Skeleton,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, CheckIcon } from "@chakra-ui/icons";
import { useAccounts } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { AccountType } from "@/lib/types";

export default function AccountsList() {
  const {
    accounts,
    isLoading,
    isError,
    verifyCredentials,
    deleteAccount,
    mutate,
  } = useAccounts();
  const toast = useToast();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleVerify = async (id: string) => {
    setIsVerifying(id);
    try {
      await verifyCredentials(id);
      toast({
        title: "Account verified",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      mutate(); // Refresh the accounts data
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsVerifying(null);
    }
  };

  const confirmDelete = (id: string) => {
    setAccountToDelete(id);
    onOpen();
  };

  const handleDelete = async () => {
    if (!accountToDelete) return;

    setIsDeleting(accountToDelete);
    try {
      await deleteAccount(accountToDelete);
      toast({
        title: "Account deleted",
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
      setAccountToDelete(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/accounts/edit/${id}`);
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case AccountType.TWITTER:
        return "twitter.500";
      case AccountType.LINKEDIN:
        return "linkedin.500";
      case AccountType.FACEBOOK:
        return "facebook.500";
      case AccountType.INSTAGRAM:
        return "pink.500";
      default:
        return "gray.500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "green";
      case "pending":
        return "yellow";
      case "error":
        return "red";
      default:
        return "gray";
    }
  };

  if (isError) {
    return (
      <Box p={4}>
        <Heading size="md" mb={4}>
          Connected Accounts
        </Heading>
        <Text color="red.500">
          Error loading accounts. Please try again later.
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
        <Heading size="md">Connected Accounts</Heading>
        <Button
          colorScheme="blue"
          size="sm"
          onClick={() => router.push("/accounts/new")}
        >
          Add Account
        </Button>
      </Flex>

      {isLoading ? (
        <Stack>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} height="60px" />
          ))}
        </Stack>
      ) : accounts.length === 0 ? (
        <Box textAlign="center" py={6}>
          <Text mb={4}>No accounts connected yet.</Text>
          <Button
            colorScheme="blue"
            size="sm"
            onClick={() => router.push("/accounts/new")}
          >
            Connect Your First Account
          </Button>
        </Box>
      ) : (
        <Box overflowX="auto" maxH="300px" overflowY="auto">
          <Table variant="simple" size="sm">
            <Thead
              position="sticky"
              top={0}
              bg={useColorModeValue("white", "gray.700")}
              zIndex={1}
            >
              <Tr>
                <Th>Account</Th>
                <Th>Platform</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {accounts.map((account) => (
                <Tr key={account.id}>
                  <Td>
                    <Flex align="center">
                      <Avatar
                        size="sm"
                        name={account.name}
                        src={account.avatarUrl}
                        mr={2}
                      />
                      <Box>
                        <Text fontWeight="bold">{account.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {account.description?.substring(0, 30) ||
                            "No description"}
                          {account.description &&
                          account.description.length > 30
                            ? "..."
                            : ""}
                        </Text>
                      </Box>
                    </Flex>
                  </Td>
                  <Td>
                    <Badge
                      px={2}
                      py={1}
                      colorScheme={getPlatformColor(account.type)}
                      borderRadius="full"
                    >
                      {account.type}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={getStatusColor(account.status)}
                      borderRadius="full"
                      px={2}
                      py={1}
                    >
                      {account.status}
                    </Badge>
                  </Td>
                  <Td>
                    <IconButton
                      aria-label="Verify account"
                      icon={
                        isVerifying === account.id ? (
                          <Spinner size="sm" />
                        ) : (
                          <CheckIcon />
                        )
                      }
                      size="sm"
                      colorScheme="green"
                      mr={2}
                      isDisabled={isVerifying !== null}
                      onClick={() => handleVerify(account.id)}
                    />
                    <IconButton
                      aria-label="Edit account"
                      icon={<EditIcon />}
                      size="sm"
                      colorScheme="blue"
                      mr={2}
                      onClick={() => handleEdit(account.id)}
                    />
                    <IconButton
                      aria-label="Delete account"
                      icon={
                        isDeleting === account.id ? (
                          <Spinner size="sm" />
                        ) : (
                          <DeleteIcon />
                        )
                      }
                      size="sm"
                      colorScheme="red"
                      isDisabled={isDeleting !== null}
                      onClick={() => confirmDelete(account.id)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Account
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this account? This action cannot
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
