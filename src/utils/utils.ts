import HDWalletProvider = require('@truffle/hdwallet-provider');
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

export const providerUser = new HDWalletProvider({
  mnemonic: {
    phrase: process.env.MASTER_WALLET_PHRASE
  },
  derivationPath: "m/06'/06'/21'/0/",
  providerOrUrl: process.env.BSC_ENDPOINT
})

export const providerWithdrawWallet = new HDWalletProvider({
  privateKeys: [process.env.WITHDRAW_WALLET_KEY],
  providerOrUrl: process.env.BSC_ENDPOINT
})
