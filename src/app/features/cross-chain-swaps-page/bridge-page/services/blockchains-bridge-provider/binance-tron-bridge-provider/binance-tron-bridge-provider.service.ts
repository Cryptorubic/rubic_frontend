import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { List } from 'immutable';
import { map } from 'rxjs/operators';
import { BLOCKCHAIN_NAME } from 'src/app/shared/models/blockchain/BLOCKCHAIN_NAME';
import {
  BlockchainsTokens,
  BridgeToken
} from 'src/app/features/cross-chain-swaps-page/bridge-page/models/BridgeToken';
import { BridgeTrade } from 'src/app/features/cross-chain-swaps-page/bridge-page/models/BridgeTrade';
import { TransactionReceipt } from 'web3-eth';
import { BlockchainsBridgeProvider } from '../blockchains-bridge-provider';
import { PanamaBridgeProviderService } from '../common/panama-bridge-provider/panama-bridge-provider.service';
import { PanamaToken } from '../common/panama-bridge-provider/models/PanamaToken';
import { BRIDGE_PROVIDER_TYPE } from '../../../models/ProviderType';

@Injectable()
export class BinanceTronBridgeProviderService extends BlockchainsBridgeProvider {
  constructor(private commonPanamaBridgeProviderService: PanamaBridgeProviderService) {
    super();
    this.loadTokens().subscribe(tokens => this._tokens.next(tokens));
  }

  get providerType(): BRIDGE_PROVIDER_TYPE {
    return BRIDGE_PROVIDER_TYPE.PANAMA;
  }

  private static parseUSDTPanamaToken(token: PanamaToken): BridgeToken {
    return {
      symbol: token.symbol,
      image: '',
      rank: 0,

      blockchainToken: {
        [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: {
          address: token.bscContractAddress,
          name: token.name,
          symbol: token.bscSymbol,
          decimals: token.bscContractDecimal,

          minAmount: token.minAmount,
          maxAmount: token.maxAmount
        },
        [BLOCKCHAIN_NAME.TRON]: {
          address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
          name: token.name,
          symbol: token.ethSymbol,
          decimals: token.ethContractDecimal,

          minAmount: token.minAmount,
          maxAmount: token.maxAmount
        }
      } as BlockchainsTokens
    };
  }

  loadTokens(): Observable<List<BridgeToken>> {
    return this.commonPanamaBridgeProviderService.tokens.pipe(
      map(tokens => {
        return tokens
          .filter(token => token.symbol === 'USDT')
          .map(BinanceTronBridgeProviderService.parseUSDTPanamaToken);
      })
    );
  }

  getFee(token: BridgeToken, toBlockchain: BLOCKCHAIN_NAME): Observable<number> {
    return this.commonPanamaBridgeProviderService.getFee(token, toBlockchain);
  }

  createTrade(
    bridgeTrade: BridgeTrade,
    updateTransactionsList: () => Promise<void>
  ): Observable<TransactionReceipt> {
    return this.commonPanamaBridgeProviderService.createTrade(bridgeTrade, updateTransactionsList);
  }
}
