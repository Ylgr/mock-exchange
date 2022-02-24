import { Module } from '@nestjs/common';
import { BicBalanceService } from './bic-balance.service';
import { BicBalanceController } from './bic-balance.controller';

@Module({
  controllers: [BicBalanceController],
  providers: [BicBalanceService]
})
export class BicBalanceModule {}
