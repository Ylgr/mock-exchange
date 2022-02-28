import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionToAddressDto, CreateTransactionToUidDto } from './dto/create-transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('transferToAddress')
  async createToAddress(@Body() createTransactionDto: CreateTransactionToAddressDto) {
    return this.transactionService.createTransactionToAddress(createTransactionDto);
  }

  @Post('transferToUid')
  createToUid(@Body() createTransactionDto: CreateTransactionToUidDto) {
    return this.transactionService.createTransactionToUid(createTransactionDto);
  }
}
