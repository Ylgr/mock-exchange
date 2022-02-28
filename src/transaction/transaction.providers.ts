import { BlockchainTransaction } from './entities/blockchain-transaction.entity';
import { InternalTransaction } from './entities/internal-transaction.entity';

export const blockchainTransactionProviders = [
  {
    provide: 'BLOCKCHAIN_TRANSACTION_REPOSITORY',
    useValue: BlockchainTransaction,
  },
];

export const internalTransactionProviders = [
  {
    provide: 'INTERNAL_TRANSACTION_REPOSITORY',
    useValue: InternalTransaction,
  },
];
