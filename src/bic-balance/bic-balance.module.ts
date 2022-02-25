import { Module } from '@nestjs/common';
import { BicBalanceService } from './bic-balance.service';
import { BicBalanceController } from './bic-balance.controller';
import { privateSaleEventsProviders } from './bic-balance.providers';

@Module({
  controllers: [BicBalanceController],
  providers: [BicBalanceService, ...privateSaleEventsProviders]
})
export class BicBalanceModule {}
