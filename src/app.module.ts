import { Module } from '@nestjs/common';
import { BicBalanceModule } from './bic-balance/bic-balance.module';
import { DepositModule } from './deposit/deposit.module';
import { TransactionModule } from './transaction/transaction.module';
import { DatabaseModule } from './database/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    DatabaseModule,
    ScheduleModule.forRoot(),
    BicBalanceModule,
    DepositModule,
    TransactionModule
  ],
})
export class AppModule {}
