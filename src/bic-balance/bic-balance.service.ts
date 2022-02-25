import { Inject, Injectable } from '@nestjs/common';
import HDWalletProvider = require('@truffle/hdwallet-provider');
import { BicBalance } from './entities/bic-balance.entity';
import BN  = require('bn.js');
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

@Injectable()
export class BicBalanceService {
  constructor(
    @Inject('BIC_BALANCE_REPOSITORY')
    private bicBalance: typeof BicBalance,
  ) {}

  private readonly provider = new HDWalletProvider({
    mnemonic: {
      phrase: process.env.MASTER_WALLET_PHRASE
    },
    derivationPath: "m/06'/06'/21'/0/",
    providerOrUrl: process.env.BSC_ENDPOINT
  })

  async getOrCreate(uid) {
    const address = this.provider.getAddress(uid)
    let balance = await this.bicBalance.findOne({where: {uid: uid}});
    if(!balance) {
      balance = await this.bicBalance.create({
        address: address,
        amount: new BN(0),
        uid: uid,
      })
    }
    return balance
  }
}
