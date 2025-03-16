import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AccountService } from './account.service';
import {
  CreateAccountDto,
  UpdateAccountDto,
  AccountType,
} from './dto/account.dto';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  create(@Request() req, @Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(req.user.id, createAccountDto);
  }

  @Get()
  findAll(@Request() req, @Query('type') type?: AccountType) {
    return this.accountService.findAll(req.user.id, type);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.accountService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountService.update(req.user.id, id, updateAccountDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.accountService.remove(req.user.id, id);
  }

  @Post(':id/verify')
  verifyCredentials(@Request() req, @Param('id') id: string) {
    return this.accountService.verifyCredentials(req.user.id, id);
  }
}
