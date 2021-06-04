import { List } from 'immutable';
import { BridgeToken } from '../../models/BridgeToken';
import { BlockchainsBridgeProvider } from '../blockchains-bridge-provider/blockchains-bridge-provider';
import { BLOCKCHAIN_NAME } from '../../../../../shared/models/blockchain/BLOCKCHAIN_NAME';

export type BlockchainsPairs = {
  [fromBlockchainData in BLOCKCHAIN_NAME]?: {
    [toBlockchainData in BLOCKCHAIN_NAME]?: BlockchainsPairProvider;
  };
};

export interface BlockchainsPairProvider {
  provider: BlockchainsBridgeProvider;
  tokens: List<BridgeToken>;
}
