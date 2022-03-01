import { Inject, Injectable } from '@nestjs/common';
import { BicBalance } from './entities/bic-balance.entity';
import BN = require('bn.js');
import { providerUser } from '../utils/utils';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

@Injectable()
export class BicBalanceService {
  constructor(
    @Inject('BIC_BALANCE_REPOSITORY')
    private bicBalance: typeof BicBalance,
  ) {}

  async getOrCreate(uid) {
    const address = providerUser.getAddress(uid)
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
