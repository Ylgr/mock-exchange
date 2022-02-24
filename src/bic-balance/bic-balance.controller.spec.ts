import { Test, TestingModule } from '@nestjs/testing';
import { BicBalanceController } from './bic-balance.controller';
import { BicBalanceService } from './bic-balance.service';

describe('BicBalanceController', () => {
  let controller: BicBalanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BicBalanceController],
      providers: [BicBalanceService],
    }).compile();

    controller = module.get<BicBalanceController>(BicBalanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
