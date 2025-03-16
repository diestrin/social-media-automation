// Account types
export enum AccountType {
  TWITTER = "TWITTER",
  LINKEDIN = "LINKEDIN",
  FACEBOOK = "FACEBOOK",
  INSTAGRAM = "INSTAGRAM",
}

export interface TwitterCredentials {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  description?: string;
  goals: string[];
  interests: string[];
  credentials: TwitterCredentials;
  isActive: boolean;
  status: "verified" | "pending" | "error";
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountDto {
  type: AccountType;
  name: string;
  description?: string;
  goals: string[];
  interests: string[];
  credentials: TwitterCredentials;
  postFrequency?: number;
  bestTimeToPost?: string[];
}

export interface UpdateAccountDto {
  name?: string;
  description?: string;
  goals?: string[];
  interests?: string[];
  credentials?: TwitterCredentials;
  postFrequency?: number;
  bestTimeToPost?: string[];
  isActive?: boolean;
}

// Auth types
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto extends LoginDto {
  name: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// Content types (to be implemented in the API)
export interface Content {
  id: string;
  title: string;
  body: string;
  platform: string;
  accountId: string;
  accountName: string;
  scheduledFor: string;
  status: "draft" | "scheduled" | "published" | "failed";
  createdAt: string;
  updatedAt: string;
}

export interface CreateContentDto {
  title: string;
  body: string;
  accountId: string;
  scheduledFor: string;
}

export interface UpdateContentDto {
  title?: string;
  body?: string;
  scheduledFor?: string;
  status?: "draft" | "scheduled" | "published" | "failed";
}

// Analytics types (to be implemented in the API)
export interface Analytics {
  totalAccounts: number;
  scheduledPosts: number;
  postsThisWeek: number;
  engagementRate: number;
}
