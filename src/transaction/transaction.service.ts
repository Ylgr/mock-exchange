import { Inject, Injectable } from '@nestjs/common';
import { CreateTransactionToUidDto, CreateTransactionToAddressDto } from './dto/create-transaction.dto';
import { BicBalance } from '../bic-balance/entities/bic-balance.entity';
import { BlockchainTransaction } from './entities/blockchain-transaction.entity';
import { InternalTransaction } from './entities/internal-transaction.entity';
import BN = require('bn.js');

export enum TransactionType {
  Internal = 'INTERNAL_TRANSACTION',
  External = 'EXTERNAL_TRANSACTION',
  StillNotDefine = 'STILL_NOT_DEFINE_TRANSACTION',
}

export enum TransactionStatus {
  Pass = 'PASS',
  Success = 'SUCCESS',
  Fail = 'FAIL'
}

@Injectable()
export class TransactionService {
  constructor(
    @Inject('BIC_BALANCE_REPOSITORY')
    private bicBalance: typeof BicBalance,
    @Inject('BLOCKCHAIN_TRANSACTION_REPOSITORY')
    private blockchainTransaction: typeof BlockchainTransaction,
    @Inject('INTERNAL_TRANSACTION_REPOSITORY')
    private internalTransaction: typeof InternalTransaction,
  ) {}

  async createTransactionToAddress(createTransactionToAddressDto: CreateTransactionToAddressDto) {
    const userFrom = await this.verifyUser(createTransactionToAddressDto.fromUid, createTransactionToAddressDto.amount);
    if(userFrom.status === TransactionStatus.Fail) {
      return {
        type: TransactionType.StillNotDefine,
        status: TransactionStatus.Fail
      }
    }
    const userToInternal = await this.bicBalance.findOne({where: {address: createTransactionToAddressDto.toAddress}});
    if(userToInternal) {
      return this.internalTransferToUid(userFrom.user, userToInternal, new BN(createTransactionToAddressDto.amount))
    } else {
      return {
        type: TransactionType.External,
        status: TransactionStatus.Fail
      }
    }
  }

  async createTransactionToUid(createTransactionToUidDto: CreateTransactionToUidDto) {
    const userFrom = await this.verifyUser(createTransactionToUidDto.fromUid, createTransactionToUidDto.amount);
    if(userFrom.status === TransactionStatus.Fail) {
      return {
        type: TransactionType.StillNotDefine,
        status: TransactionStatus.Fail
      }
    }
    const userTo = await this.verifyUser(createTransactionToUidDto.toUid);
    if(userTo.status === TransactionStatus.Fail) {
      return {
        type: TransactionType.StillNotDefine,
        status: TransactionStatus.Fail
      }
    }
    return this.internalTransferToUid(userFrom.user, userTo.user, new BN(createTransactionToUidDto.amount))
  }


  async verifyUser(uid: number, amount: string | null = null) {
    const user = await this.bicBalance.findOne({where: {uid: uid}})
    if(user) {
      if(amount) {
        if(new BN(user.amount).gt(new BN(amount))) {
          return {
            user: user,
            status: TransactionStatus.Pass
          }
        } else return {
          user: null,
          status: TransactionStatus.Fail
        }
      }
      return {
        user: user,
        status: TransactionStatus.Pass
      }
    } else return {
      user: null,
      status: TransactionStatus.Fail
    }
  }

  async internalTransferToUid(fromUser: BicBalance, toUser: BicBalance, amount: BN) {
    await fromUser.update({amount: new BN(fromUser.amount).sub(amount)})
    await toUser.update({amount: new BN(toUser.amount).add(amount)})
    return {
      status: TransactionStatus.Success
    }
  }

}
