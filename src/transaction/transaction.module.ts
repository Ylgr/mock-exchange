import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { privateSaleEventsProviders } from '../bic-balance/bic-balance.providers';
import { blockchainTransactionProviders, internalTransactionProviders } from './transaction.providers';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, ...privateSaleEventsProviders, ...blockchainTransactionProviders, ...internalTransactionProviders]
})
export class TransactionModule {}
