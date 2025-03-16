import useSWR, { mutate as globalMutate, SWRConfiguration } from "swr";
import api from "./api";
import {
  Account,
  Content,
  Analytics,
  CreateAccountDto,
  UpdateAccountDto,
  CreateContentDto,
  UpdateContentDto,
} from "./types";
import { useCallback } from "react";

// Generic fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await api.get(url);
  return response.data;
};

// Default SWR configuration
const defaultConfig: SWRConfiguration = {
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  refreshInterval: 0, // No automatic polling by default
  shouldRetryOnError: true,
  errorRetryCount: 3,
};

// Hook for fetching data
export function useData<T>(endpoint: string, config: SWRConfiguration = {}) {
  const { data, error, isLoading, mutate } = useSWR<T>(endpoint, fetcher, {
    ...defaultConfig,
    ...config,
  });

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
}

// Hook for submitting data
export function useSubmit() {
  const submit = async <T>(
    endpoint: string,
    data: any,
    method: "post" | "put" | "patch" | "delete" = "post"
  ): Promise<T> => {
    try {
      const response = await api[method](endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return { submit };
}

// Hook for fetching accounts
export function useAccounts() {
  const { data, isLoading, isError, mutate } = useData<Account[]>("/accounts");

  const createAccount = useCallback(
    async (accountData: CreateAccountDto): Promise<Account> => {
      const response = await api.post("/accounts", accountData);
      mutate();
      return response.data;
    },
    [mutate]
  );

  const updateAccount = useCallback(
    async (id: string, accountData: UpdateAccountDto): Promise<Account> => {
      const response = await api.patch(`/accounts/${id}`, accountData);
      mutate();
      return response.data;
    },
    [mutate]
  );

  const deleteAccount = useCallback(
    async (id: string): Promise<void> => {
      await api.delete(`/accounts/${id}`);
      mutate();
    },
    [mutate]
  );

  const verifyCredentials = useCallback(
    async (id: string): Promise<any> => {
      const response = await api.post(`/accounts/${id}/verify`);
      mutate();
      return response.data;
    },
    [mutate]
  );

  return {
    accounts: data || [],
    isLoading,
    isError,
    createAccount,
    updateAccount,
    deleteAccount,
    verifyCredentials,
    mutate,
  };
}

// Hook for fetching a single account
export function useAccount(id: string) {
  const { data, isLoading, isError, mutate } = useData<Account>(
    `/accounts/${id}`
  );

  const updateAccount = useCallback(
    async (accountData: UpdateAccountDto): Promise<Account> => {
      const response = await api.patch(`/accounts/${id}`, accountData);
      mutate();
      // Also update the accounts list
      globalMutate("/accounts");
      return response.data;
    },
    [id, mutate]
  );

  const deleteAccount = useCallback(async (): Promise<void> => {
    await api.delete(`/accounts/${id}`);
    // Update the accounts list
    globalMutate("/accounts");
  }, [id]);

  const verifyCredentials = useCallback(async (): Promise<any> => {
    const response = await api.post(`/accounts/${id}/verify`);
    mutate();
    return response.data;
  }, [id, mutate]);

  return {
    account: data,
    isLoading,
    isError,
    updateAccount,
    deleteAccount,
    verifyCredentials,
    mutate,
  };
}

// Hook for fetching content
export function useContent() {
  // This is a mock implementation until the content API is available
  const mockContent: Content[] = [
    {
      id: "1",
      title: "Product Launch Announcement",
      body: "We are excited to announce our new product launch!",
      platform: "Twitter",
      accountId: "1",
      accountName: "Company Twitter",
      scheduledFor: "2023-03-15T10:00:00",
      status: "scheduled",
      createdAt: "2023-03-10T10:00:00",
      updatedAt: "2023-03-10T10:00:00",
    },
    {
      id: "2",
      title: "Weekly Industry Insights",
      body: "Check out our latest industry insights for this week.",
      platform: "LinkedIn",
      accountId: "2",
      accountName: "Marketing LinkedIn",
      scheduledFor: "2023-03-16T14:30:00",
      status: "scheduled",
      createdAt: "2023-03-11T10:00:00",
      updatedAt: "2023-03-11T10:00:00",
    },
    {
      id: "3",
      title: "Customer Success Story",
      body: "Read about how our customer achieved success with our product.",
      platform: "Instagram",
      accountId: "3",
      accountName: "Product Instagram",
      scheduledFor: "2023-03-17T09:00:00",
      status: "draft",
      createdAt: "2023-03-12T10:00:00",
      updatedAt: "2023-03-12T10:00:00",
    },
    {
      id: "4",
      title: "Support FAQ Thread",
      body: "Here are the most frequently asked questions about our product.",
      platform: "Twitter",
      accountId: "4",
      accountName: "Support Twitter",
      scheduledFor: "2023-03-18T11:00:00",
      status: "scheduled",
      createdAt: "2023-03-13T10:00:00",
      updatedAt: "2023-03-13T10:00:00",
    },
  ];

  const createContent = useCallback(
    async (contentData: CreateContentDto): Promise<Content> => {
      // Mock implementation
      console.log("Creating content:", contentData);
      return {
        id: Math.random().toString(),
        title: contentData.title,
        body: contentData.body,
        platform: "Twitter", // Mock platform
        accountId: contentData.accountId,
        accountName: "Mock Account",
        scheduledFor: contentData.scheduledFor,
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    },
    []
  );

  const updateContent = useCallback(
    async (id: string, contentData: UpdateContentDto): Promise<Content> => {
      // Mock implementation
      console.log("Updating content:", id, contentData);
      return {
        ...mockContent.find((c) => c.id === id)!,
        ...contentData,
        updatedAt: new Date().toISOString(),
      };
    },
    []
  );

  const deleteContent = useCallback(async (id: string): Promise<void> => {
    // Mock implementation
    console.log("Deleting content:", id);
  }, []);

  return {
    content: mockContent,
    isLoading: false,
    isError: null,
    createContent,
    updateContent,
    deleteContent,
  };
}

// Hook for fetching analytics
export function useAnalytics() {
  // This is a mock implementation until the analytics API is available
  const mockAnalytics: Analytics = {
    totalAccounts: 5,
    scheduledPosts: 12,
    postsThisWeek: 8,
    engagementRate: 3.2,
  };

  return {
    analytics: mockAnalytics,
    isLoading: false,
    isError: null,
  };
}
