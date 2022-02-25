import { BicBalance } from './entities/bic-balance.entity';

export const privateSaleEventsProviders = [
  {
    provide: 'BIC_BALANCE_REPOSITORY',
    useValue: BicBalance,
  },
];
