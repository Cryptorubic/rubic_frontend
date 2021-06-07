import { Injectable } from '@angular/core';
import { List } from 'immutable';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BLOCKCHAIN_NAME } from 'src/app/shared/models/blockchain/BLOCKCHAIN_NAME';
import { NATIVE_TOKEN_ADDRESS } from 'src/app/shared/constants/blockchain/NATIVE_TOKEN_ADDRESS';
import {
  BlockchainsTokens,
  BridgeToken
} from 'src/app/features/cross-chain-swaps-page/bridge-page/models/BridgeToken';
import { BridgeTrade } from 'src/app/features/cross-chain-swaps-page/bridge-page/models/BridgeTrade';
import { TransactionReceipt } from 'web3-eth';
import { PanamaToken } from '../../common/panama-bridge-provider/models/PanamaToken';
import { PanamaBridgeProviderService } from '../../common/panama-bridge-provider/panama-bridge-provider.service';
import { BlockchainsBridgeProvider } from '../../blockchains-bridge-provider';

@Injectable()
export class EthereumBinancePanamaBridgeProviderService extends BlockchainsBridgeProvider {
  constructor(private panamaBridgeProvider: PanamaBridgeProviderService) {
    super();
    this.loadTokens().subscribe(tokens => this._tokens.next(tokens));
  }

  private static parsePanamaToken(token: PanamaToken): BridgeToken {
    return {
      symbol: token.symbol,
      image: '',
      rank: 0,

      blockchainToken: {
        [BLOCKCHAIN_NAME.ETHEREUM]: {
          address: token.ethContractAddress || (token.ethSymbol === 'ETH' && NATIVE_TOKEN_ADDRESS),
          name: token.name,
          symbol: token.ethSymbol,
          decimals: token.ethContractDecimal,

          minAmount: token.minAmount,
          maxAmount: token.maxAmount
        },
        [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: {
          address: token.bscContractAddress,
          name: token.name,
          symbol: token.bscSymbol,
          decimals: token.bscContractDecimal,

          minAmount: token.minAmount,
          maxAmount: token.maxAmount
        }
      } as BlockchainsTokens,

      fromEthFee: token.ethToBscFee,
      toEthFee: token.bscToEthFee
    };
  }

  public loadTokens(): Observable<List<BridgeToken>> {
    return this.panamaBridgeProvider.tokens.pipe(
      map(tokens => tokens.map(EthereumBinancePanamaBridgeProviderService.parsePanamaToken))
    );
  }

  public getFee(token: BridgeToken, toBlockchain: BLOCKCHAIN_NAME): Observable<number> {
    return this.panamaBridgeProvider.getFee(token, toBlockchain);
  }

  public createTrade(
    bridgeTrade: BridgeTrade,
    updateTransactionsList: () => Promise<void>
  ): Observable<TransactionReceipt> {
    return this.panamaBridgeProvider.createTrade(bridgeTrade, updateTransactionsList);
  }
}
