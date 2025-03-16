import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAccountDto,
  UpdateAccountDto,
  AccountType,
} from './dto/account.dto';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createDto: CreateAccountDto) {
    const account = await this.prisma.account.create({
      data: {
        userId,
        type: createDto.type,
        name: createDto.name,
        description: createDto.description,
        goals: createDto.goals,
        interests: createDto.interests,
        credentials: createDto.credentials as any,
        postFrequency: createDto.postFrequency,
        bestTimeToPost: createDto.bestTimeToPost || [],
        contentPreferences: {},
      },
    });

    return this.sanitizeAccount(account);
  }

  async findAll(userId: string, type?: AccountType) {
    const accounts = await this.prisma.account.findMany({
      where: {
        userId,
        ...(type && { type }),
      },
    });

    return accounts.map((account) => this.sanitizeAccount(account));
  }

  async findOne(userId: string, id: string) {
    const account = await this.prisma.account.findFirst({
      where: { id, userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return this.sanitizeAccount(account);
  }

  async update(userId: string, id: string, updateDto: UpdateAccountDto) {
    const account = await this.prisma.account.findFirst({
      where: { id, userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const updatedAccount = await this.prisma.account.update({
      where: { id },
      data: {
        name: updateDto.name,
        description: updateDto.description,
        goals: updateDto.goals,
        interests: updateDto.interests,
        credentials: updateDto.credentials
          ? { ...(account.credentials as any), ...updateDto.credentials }
          : undefined,
        postFrequency: updateDto.postFrequency,
        bestTimeToPost: updateDto.bestTimeToPost,
        isActive: updateDto.isActive,
      },
    });

    return this.sanitizeAccount(updatedAccount);
  }

  async remove(userId: string, id: string) {
    const account = await this.prisma.account.findFirst({
      where: { id, userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    await this.prisma.account.delete({
      where: { id },
    });
  }

  async verifyCredentials(userId: string, id: string) {
    const account = await this.prisma.account.findFirst({
      where: { id, userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    switch (account.type) {
      case AccountType.TWITTER:
        return this.verifyTwitterCredentials(account.credentials);
      default:
        throw new BadRequestException(
          `Unsupported account type: ${account.type}`,
        );
    }
  }

  private async verifyTwitterCredentials(credentials: any) {
    // TODO: Implement Twitter API client to verify credentials
    return true;
  }

  private sanitizeAccount(account: any) {
    const { credentials, ...sanitized } = account;

    let maskedCredentials;
    switch (account.type) {
      case AccountType.TWITTER:
        maskedCredentials = {
          apiKey: this.maskCredential(credentials.apiKey),
          apiSecret: this.maskCredential(credentials.apiSecret),
          accessToken: this.maskCredential(credentials.accessToken),
          accessTokenSecret: this.maskCredential(credentials.accessTokenSecret),
        };
        break;
      default:
        maskedCredentials = {};
    }

    return {
      ...sanitized,
      credentials: maskedCredentials,
    };
  }

  private maskCredential(credential: string) {
    if (!credential) return null;
    return `${credential.substring(0, 4)}...${credential.substring(credential.length - 4)}`;
  }
}
