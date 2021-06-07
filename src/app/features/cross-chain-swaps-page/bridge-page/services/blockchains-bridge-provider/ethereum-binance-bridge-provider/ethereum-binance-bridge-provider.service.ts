import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { List } from 'immutable';
import { BLOCKCHAIN_NAME } from 'src/app/shared/models/blockchain/BLOCKCHAIN_NAME';
import { BridgeToken } from 'src/app/features/cross-chain-swaps-page/bridge-page/models/BridgeToken';
import { BridgeTrade } from 'src/app/features/cross-chain-swaps-page/bridge-page/models/BridgeTrade';
import { TransactionReceipt } from 'web3-eth';
import { EthereumBinancePanamaBridgeProviderService } from './panama-bridge-provider/ethereum-binance-panama-bridge-provider.service';
import { EthereumBinanceRubicBridgeProviderService } from './rubic-bridge-provider/ethereum-binance-rubic-bridge-provider.service';
import { BlockchainsBridgeProvider } from '../blockchains-bridge-provider';
import { BRIDGE_PROVIDER_TYPE } from '../../../models/ProviderType';

@Injectable()
export class EthereumBinanceBridgeProviderService extends BlockchainsBridgeProvider {
  getProviderType(token?: BridgeToken): BRIDGE_PROVIDER_TYPE {
    return token?.symbol === 'RBC' ? BRIDGE_PROVIDER_TYPE.RUBIC : BRIDGE_PROVIDER_TYPE.PANAMA;
  }

  constructor(
    private panamaBridgeProvider: EthereumBinancePanamaBridgeProviderService,
    private rubicBridgeProvider: EthereumBinanceRubicBridgeProviderService
  ) {
    super();
    this.loadTokens().subscribe(tokens => this._tokens.next(tokens));
  }

  public loadTokens(): Observable<List<BridgeToken>> {
    const panamaTokensObservable = this.panamaBridgeProvider.tokens;
    const rubicTokenObservable = this.rubicBridgeProvider.tokens;
    return combineLatest([rubicTokenObservable, panamaTokensObservable]).pipe(
      map(([rubicToken, panamaTokens]) => rubicToken.concat(panamaTokens))
    );
  }

  public getFee(token: BridgeToken, toBlockchain: BLOCKCHAIN_NAME): Observable<number> {
    if (token.symbol === 'RBC') {
      return this.rubicBridgeProvider.getFee(token, toBlockchain);
    }
    return this.panamaBridgeProvider.getFee(token, toBlockchain);
  }

  public createTrade(
    bridgeTrade: BridgeTrade,
    updateTransactionsList: () => Promise<void>
  ): Observable<TransactionReceipt> {
    if (bridgeTrade.token.symbol === 'RBC') {
      return this.rubicBridgeProvider.createTrade(bridgeTrade, updateTransactionsList);
    }
    return this.panamaBridgeProvider.createTrade(bridgeTrade, updateTransactionsList);
  }
}
