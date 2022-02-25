import { Module } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { DepositController } from './deposit.controller';
import { privateSaleEventsProviders } from '../bic-balance/bic-balance.providers';
import { configProviders } from '../config/config.providers';
import { depositProviders } from './deposit.providers';

@Module({
  controllers: [DepositController],
  providers: [DepositService, ...privateSaleEventsProviders, ...configProviders, ...depositProviders]
})
export class DepositModule {}
