import BigNumber from 'bignumber.js';
import { BLOCKCHAIN_NAME } from '../../../../../../../shared/models/blockchain/BLOCKCHAIN_NAME';

export interface EvoContractTokenInBlockchains {
  [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: EvoContractToken;
  [BLOCKCHAIN_NAME.POLYGON]: EvoContractToken;
}

export interface EvoContractToken {
  symbol: string;
  address: string;
  fee: BigNumber;
  feeBase: BigNumber;
  feeTarget: string;
  minAmount: number;
  dailyLimit: BigNumber;
  bonus: number;
}
