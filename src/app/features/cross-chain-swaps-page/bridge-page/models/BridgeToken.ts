import { BLOCKCHAIN_NAME } from 'src/app/shared/models/blockchain/BLOCKCHAIN_NAME';

interface BlockchainToken {
  address: string;
  name: string;
  symbol: string;
  decimals: number;

  minAmount: number;
  maxAmount: number;
}

export type BlockchainsTokens = {
  [blockchain in BLOCKCHAIN_NAME]?: BlockchainToken;
};

export interface BridgeToken {
  symbol: string;
  image: string;
  rank: number;

  blockchainToken: BlockchainsTokens;

  fromEthFee?: number;
  toEthFee?: number;

  used_in_iframe?: boolean;
}
