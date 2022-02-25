import { Deposit } from './entities/deposite.entity';

export const depositProviders = [
  {
    provide: 'DEPOSIT_REPOSITORY',
    useValue: Deposit,
  },
];
