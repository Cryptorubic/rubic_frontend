import BigNumber from 'bignumber.js';
import { BridgeToken } from '../../../../models/BridgeToken';
import { BLOCKCHAIN_NAME } from '../../../../../../../shared/models/blockchain/BLOCKCHAIN_NAME';

export interface EvoBridgeToken extends BridgeToken {
  [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: EvoToken;
  [BLOCKCHAIN_NAME.POLYGON]: EvoToken;
}

interface EvoToken {
  fee: BigNumber;
  feeBase: BigNumber;
  dailyLimit: BigNumber;
}
