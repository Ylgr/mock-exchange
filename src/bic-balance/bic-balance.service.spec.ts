import { Test, TestingModule } from '@nestjs/testing';
import { BicBalanceService } from './bic-balance.service';

describe('BicBalanceService', () => {
  let service: BicBalanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BicBalanceService],
    }).compile();

    service = module.get<BicBalanceService>(BicBalanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
