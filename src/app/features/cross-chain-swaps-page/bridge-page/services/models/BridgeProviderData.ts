import { BlockchainsBridgeProvider } from '../blockchains-bridge-provider/blockchains-bridge-provider';
import { BLOCKCHAIN_NAME } from '../../../../../shared/models/blockchain/BLOCKCHAIN_NAME';

export type BlockchainsProviders = {
  [fromBlockchainData in BLOCKCHAIN_NAME]?: {
    [toBlockchainData in BLOCKCHAIN_NAME]?: BlockchainsBridgeProvider;
  };
};
