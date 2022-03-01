import { Inject, Injectable } from '@nestjs/common';
import { CreateTransactionToUidDto, CreateTransactionToAddressDto } from './dto/create-transaction.dto';
import { BicBalance } from '../bic-balance/entities/bic-balance.entity';
import { BlockchainTransaction } from './entities/blockchain-transaction.entity';
import { InternalTransaction } from './entities/internal-transaction.entity';
import BN = require('bn.js');
import BeinChainAbi from '../contracts/BeinChain.json';
import { AbiItem } from 'web3-utils';
import Web3 from 'web3';
import { providerUser, providerWithdrawWallet } from '../utils/utils';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

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

  private readonly web3 = new Web3(providerUser);
  private readonly web3Withdraw = new Web3(providerWithdrawWallet);
  private readonly bicContract = new this.web3.eth.Contract(BeinChainAbi as AbiItem[], process.env.BSC_BIC_CONTRACT)

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
      // return this.createWithdrawTransaction(userFrom.user, createTransactionToAddressDto.toAddress, new BN(createTransactionToAddressDto.amount));
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

  async createWithdrawTransaction(fromUser: BicBalance, toAddress: string, amount: BN) {
    // await fromUser.update({amount: new BN(fromUser.amount).sub(amount)})
  }

  async collectBicStoreWallet(addresses: string[]) {
    const gasPrice = await this.web3.eth.getGasPrice();
    const gasLimit = 21000;
    for(const address of addresses) {
      console.log('address: ',address)
      const balance = await this.bicContract.methods.balanceOf(address).call();
      console.log('balance: ', balance)
      if(balance !== '0') {
        const sendBnb = await this.web3Withdraw.eth.sendTransaction({from: providerWithdrawWallet.getAddress(0), to: address, value: 1e18.toString()})
        const transferBIC = await this.bicContract.methods.transfer(process.env.GENERAL_ADDRESS, balance).send({ from: address })
        const remainBnb = await this.web3.eth.getBalance(address);
        console.log('remainBnb: ', remainBnb);
        const remainBnbCanCollect = new BN(remainBnb).sub(new BN(gasPrice).mul(new BN(gasLimit)))
        const collectBnb = await this.web3.eth.sendTransaction({
          from: address,
          to: providerWithdrawWallet.getAddress(0),
          value: remainBnbCanCollect,
          gasPrice,
          gas: gasLimit
        })
        console.log(`collect ${balance} BIC from ${address} to ${process.env.GENERAL_ADDRESS}`);
      }
    }
  }
}
