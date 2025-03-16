import {
  IsString,
  IsArray,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsBoolean,
  ValidateNested,
  IsEnum,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum AccountType {
  TWITTER = 'TWITTER',
  LINKEDIN = 'LINKEDIN',
  FACEBOOK = 'FACEBOOK',
  INSTAGRAM = 'INSTAGRAM',
}

export class TwitterCredentials {
  @IsString()
  apiKey: string;

  @IsString()
  apiSecret: string;

  @IsString()
  accessToken: string;

  @IsString()
  accessTokenSecret: string;
}

export class CreateAccountDto {
  @IsEnum(AccountType)
  type: AccountType;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  goals: string[];

  @IsArray()
  @IsString({ each: true })
  interests: string[];

  @IsObject()
  credentials: TwitterCredentials; // Will be a union type when more platforms are added

  @IsInt()
  @Min(1)
  @Max(24)
  @IsOptional()
  postFrequency?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  bestTimeToPost?: string[];
}

export class UpdateAccountDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  goals?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interests?: string[];

  @IsObject()
  @IsOptional()
  credentials?: TwitterCredentials; // Will be a union type when more platforms are added

  @IsInt()
  @Min(1)
  @Max(24)
  @IsOptional()
  postFrequency?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  bestTimeToPost?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class AccountResponseDto {
  id: string;
  type: AccountType;
  name: string;
  description?: string;
  goals: string[];
  interests: string[];
  isActive: boolean;
  lastSyncAt?: Date;
  postFrequency: number;
  bestTimeToPost: string[];
  contentPreferences: any;
  createdAt: Date;
  updatedAt: Date;
  credentials?: {
    apiKey?: string;
    apiSecret?: string;
    accessToken?: string;
    accessTokenSecret?: string;
  };
}
