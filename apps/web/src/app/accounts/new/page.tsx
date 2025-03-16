"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  useColorModeValue,
  FormErrorMessage,
  useToast,
  Select,
  Textarea,
  Container,
  Flex,
  VStack,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { useAccounts } from "@/lib/hooks";
import { CreateAccountDto, AccountType } from "@/lib/types";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function NewAccount() {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [goals, setGoals] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [currentGoal, setCurrentGoal] = useState("");
  const [currentInterest, setCurrentInterest] = useState("");

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<CreateAccountDto>();

  const { createAccount } = useAccounts();

  const addGoal = () => {
    if (currentGoal.trim() && !goals.includes(currentGoal.trim())) {
      setGoals([...goals, currentGoal.trim()]);
      setCurrentGoal("");
    }
  };

  const removeGoal = (goal: string) => {
    setGoals(goals.filter((g) => g !== goal));
  };

  const addInterest = () => {
    if (currentInterest.trim() && !interests.includes(currentInterest.trim())) {
      setInterests([...interests, currentInterest.trim()]);
      setCurrentInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  const onSubmit = async (
    data: Omit<CreateAccountDto, "goals" | "interests">
  ) => {
    if (goals.length === 0) {
      toast({
        title: "Goals required",
        description: "Please add at least one goal for this account",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (interests.length === 0) {
      toast({
        title: "Interests required",
        description: "Please add at least one interest for this account",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const accountData = {
        ...data,
        goals,
        interests,
      };
      await createAccount(accountData);
      toast({
        title: "Account created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/");
    } catch (error: any) {
      toast({
        title: "Error creating account",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const boxBgColor = useColorModeValue("white", "gray.700");

  return (
    <Box minH="100vh" bg={bgColor}>
      <Header />
      <Flex>
        <Sidebar />
        <Box flex="1" p={4} ml={{ base: 0, md: 60 }}>
          <Container maxW="container.md" py={5}>
            <Heading mb={6}>Add New Account</Heading>

            <Box rounded="lg" bg={boxBgColor} boxShadow="lg" p={8}>
              <form onSubmit={handleSubmit(onSubmit as any)}>
                <Stack spacing={4}>
                  <FormControl id="type" isInvalid={!!errors.type}>
                    <FormLabel>Platform</FormLabel>
                    <Controller
                      name="type"
                      control={control}
                      rules={{ required: "Platform is required" }}
                      render={({ field }) => (
                        <Select placeholder="Select platform" {...field}>
                          <option value={AccountType.TWITTER}>Twitter</option>
                          <option value={AccountType.LINKEDIN}>LinkedIn</option>
                          <option value={AccountType.FACEBOOK}>Facebook</option>
                          <option value={AccountType.INSTAGRAM}>
                            Instagram
                          </option>
                        </Select>
                      )}
                    />
                    <FormErrorMessage>
                      {errors.type && errors.type.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl id="name" isInvalid={!!errors.name}>
                    <FormLabel>Account Name</FormLabel>
                    <Input
                      {...register("name", {
                        required: "Account name is required",
                      })}
                    />
                    <FormErrorMessage>
                      {errors.name && errors.name.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl id="description">
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      {...register("description")}
                      placeholder="Brief description of this account"
                    />
                  </FormControl>

                  <FormControl id="goals">
                    <FormLabel>Goals</FormLabel>
                    <InputGroup>
                      <Input
                        value={currentGoal}
                        onChange={(e) => setCurrentGoal(e.target.value)}
                        placeholder="Add a goal for this account"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addGoal();
                          }
                        }}
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={addGoal}>
                          Add
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <Box mt={2}>
                      <HStack spacing={2} flexWrap="wrap">
                        {goals.map((goal, index) => (
                          <Tag
                            size="md"
                            key={index}
                            borderRadius="full"
                            variant="solid"
                            colorScheme="blue"
                            m={1}
                          >
                            <TagLabel>{goal}</TagLabel>
                            <TagCloseButton onClick={() => removeGoal(goal)} />
                          </Tag>
                        ))}
                      </HStack>
                    </Box>
                  </FormControl>

                  <FormControl id="interests">
                    <FormLabel>Interests</FormLabel>
                    <InputGroup>
                      <Input
                        value={currentInterest}
                        onChange={(e) => setCurrentInterest(e.target.value)}
                        placeholder="Add an interest for this account"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addInterest();
                          }
                        }}
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={addInterest}>
                          Add
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <Box mt={2}>
                      <HStack spacing={2} flexWrap="wrap">
                        {interests.map((interest, index) => (
                          <Tag
                            size="md"
                            key={index}
                            borderRadius="full"
                            variant="solid"
                            colorScheme="green"
                            m={1}
                          >
                            <TagLabel>{interest}</TagLabel>
                            <TagCloseButton
                              onClick={() => removeInterest(interest)}
                            />
                          </Tag>
                        ))}
                      </HStack>
                    </Box>
                  </FormControl>

                  <Heading size="md" mt={4}>
                    API Credentials
                  </Heading>

                  <FormControl
                    id="credentials.apiKey"
                    isInvalid={!!errors.credentials?.apiKey}
                  >
                    <FormLabel>API Key</FormLabel>
                    <Input
                      {...register("credentials.apiKey", {
                        required: "API Key is required",
                      })}
                    />
                    <FormErrorMessage>
                      {errors.credentials?.apiKey &&
                        errors.credentials.apiKey.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl
                    id="credentials.apiSecret"
                    isInvalid={!!errors.credentials?.apiSecret}
                  >
                    <FormLabel>API Secret</FormLabel>
                    <Input
                      type="password"
                      {...register("credentials.apiSecret", {
                        required: "API Secret is required",
                      })}
                    />
                    <FormErrorMessage>
                      {errors.credentials?.apiSecret &&
                        errors.credentials.apiSecret.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl
                    id="credentials.accessToken"
                    isInvalid={!!errors.credentials?.accessToken}
                  >
                    <FormLabel>Access Token</FormLabel>
                    <Input
                      {...register("credentials.accessToken", {
                        required: "Access Token is required",
                      })}
                    />
                    <FormErrorMessage>
                      {errors.credentials?.accessToken &&
                        errors.credentials.accessToken.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl
                    id="credentials.accessTokenSecret"
                    isInvalid={!!errors.credentials?.accessTokenSecret}
                  >
                    <FormLabel>Access Token Secret</FormLabel>
                    <Input
                      type="password"
                      {...register("credentials.accessTokenSecret", {
                        required: "Access Token Secret is required",
                      })}
                    />
                    <FormErrorMessage>
                      {errors.credentials?.accessTokenSecret &&
                        errors.credentials.accessTokenSecret.message}
                    </FormErrorMessage>
                  </FormControl>

                  <Stack spacing={10} pt={2}>
                    <Button
                      loadingText="Submitting"
                      size="lg"
                      bg="blue.400"
                      color="white"
                      _hover={{
                        bg: "blue.500",
                      }}
                      type="submit"
                      isLoading={isLoading}
                    >
                      Create Account
                    </Button>
                  </Stack>
                </Stack>
              </form>
            </Box>
          </Container>
        </Box>
      </Flex>
    </Box>
  );
}
