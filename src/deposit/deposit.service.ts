import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import Web3 from 'web3';
import { BicBalance } from '../bic-balance/entities/bic-balance.entity';
import { Config, ConfigType } from '../config/entities/config.entity';
import BeinChainAbi from '../contracts/BeinChain.json';
import { AbiItem } from 'web3-utils';
import BN  = require('bn.js');
import { Deposit } from './entities/deposite.entity';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

@Injectable()
export class DepositService {
  constructor(
    @Inject('BIC_BALANCE_REPOSITORY')
    private bicBalance: typeof BicBalance,
    @Inject('DEPOSIT_REPOSITORY')
    private deposit: typeof Deposit,
    @Inject('CONFIG_REPOSITORY')
    private config: typeof Config,
  ) {}

  private readonly logger = new Logger(DepositService.name);
  private readonly web3 = new Web3(process.env.BSC_ENDPOINT);
  private readonly bicContract = new this.web3.eth.Contract(BeinChainAbi as AbiItem[], process.env.BSC_BIC_CONTRACT)
  private isBlockScannerRun: boolean = false;

  @Cron('15 * * * * *')
  async handleCron() {
    if(this.isBlockScannerRun) return;
    this.logger.debug('Called when the current second is 15');

    this.isBlockScannerRun = true;
    try {
      const currentBlock = await this.web3.eth.getBlockNumber();

      const syncedBlock = await this.config.findOne<Config>({
        where: {
          type: ConfigType.syncedDeposit,
        },
      });

      if(!syncedBlock) {
        await this.config.create({
          type: ConfigType.syncedDeposit,
          value: currentBlock,
        });
        return
      }

      const lastSyncedBlock: number = parseInt(syncedBlock.value);
      let toBlock = (lastSyncedBlock + 5000) > (currentBlock - 15) ? currentBlock - 15 : lastSyncedBlock + 5000;

      if (lastSyncedBlock > toBlock) {
        return;
      }
      await syncedBlock.update({value: toBlock})

      const bicBalances = await this.bicBalance.findAll()
      const addressTrackingList = bicBalances.map(e => e.address)

      const pastEvents = await this.bicContract.getPastEvents('Transfer', { fromBlock: lastSyncedBlock, toBlock: toBlock })
      for(const eachEvent of pastEvents) {
        const lowerCaseAddress = eachEvent.returnValues.to.toLowerCase()
        if(addressTrackingList.includes(lowerCaseAddress)) {
          const depositEvent = {
            txHash: eachEvent.transactionHash,
            fromAddress: eachEvent.returnValues.from.toLowerCase(),
            toAddress: lowerCaseAddress,
            amount: new BN(eachEvent.returnValues.value),
            blockNumber: eachEvent.blockNumber
          }
          this.logger.debug(`Deposit ${eachEvent.returnValues.value} to ${depositEvent.toAddress} in ${depositEvent.txHash}`);
          try {
            await this.deposit.create(depositEvent)

            const updateBalance = bicBalances.find(e => e.address === depositEvent.toAddress)

            await updateBalance.update({amount: depositEvent.amount.add(new BN(updateBalance.amount))})
          } catch (e) {
            this.logger.error(e.message)
            this.logger.error(eachEvent.transactionHash)
          }
        }
      }

    } catch (e) {
      this.logger.error(e.message)
    }
    this.isBlockScannerRun = false;
  }
}
