import { Module } from '@nestjs/common';
import { BicBalanceModule } from './bic-balance/bic-balance.module';
import { DepositModule } from './deposit/deposit.module';
import { TransactionModule } from './transaction/transaction.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, BicBalanceModule, DepositModule, TransactionModule],
})
export class AppModule {}
