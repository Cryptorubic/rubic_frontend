import { BLOCKCHAIN_NAME } from '../../../../shared/models/blockchain/BLOCKCHAIN_NAME';
import { EthereumBinanceBridgeProviderService } from './blockchains-bridge-provider/ethereum-binance-bridge-provider/ethereum-binance-bridge-provider.service';
import { EthereumPolygonBridgeProviderService } from './blockchains-bridge-provider/ethereum-polygon-bridge-provider/ethereum-polygon-bridge-provider.service';
import { EthereumTronBridgeProviderService } from './blockchains-bridge-provider/ethereum-tron-bridge-provider/ethereum-tron-bridge-provider.service';
import { EthereumXdaiBridgeProviderService } from './blockchains-bridge-provider/ethereum-xdai-bridge-provider/ethereum-xdai-bridge-provider.service';
import { BinancePolygonBridgeProviderService } from './blockchains-bridge-provider/binance-polygon-bridge-provider/binance-polygon-bridge-provider.service';

export const bridgeProvidersData = {
  [BLOCKCHAIN_NAME.ETHEREUM]: {
    [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: EthereumBinanceBridgeProviderService,
    [BLOCKCHAIN_NAME.POLYGON]: EthereumPolygonBridgeProviderService,
    [BLOCKCHAIN_NAME.TRON]: EthereumTronBridgeProviderService,
    [BLOCKCHAIN_NAME.XDAI]: EthereumXdaiBridgeProviderService
  },
  [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: {
    [BLOCKCHAIN_NAME.ETHEREUM]: EthereumBinanceBridgeProviderService,
    [BLOCKCHAIN_NAME.POLYGON]: BinancePolygonBridgeProviderService,
    [BLOCKCHAIN_NAME.TRON]: EthereumTronBridgeProviderService
  },
  [BLOCKCHAIN_NAME.POLYGON]: {
    [BLOCKCHAIN_NAME.ETHEREUM]: EthereumPolygonBridgeProviderService,
    [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: BinancePolygonBridgeProviderService
  }
};
