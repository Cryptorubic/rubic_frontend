import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TransactionReceipt } from 'web3-eth';
import { List } from 'immutable';
import { TranslateService } from '@ngx-translate/core';
import { BlockchainsBridgeProvider } from '../blockchains-bridge-provider';
import { BridgeTrade } from '../../../models/BridgeTrade';
import { BridgeToken } from '../../../models/BridgeToken';
import { BLOCKCHAIN_NAME } from '../../../../../../shared/models/blockchain/BLOCKCHAIN_NAME';
import SwapToken from '../../../../../../shared/models/tokens/SwapToken';
import { Web3Public } from '../../../../../../core/services/blockchain/web3-public-service/Web3Public';
import { EvoBridgeToken } from './models/EvoBridgeToken';
import { EVO_ABI, EVO_ADDRESSES } from './constants/contract';
import { RubicError } from '../../../../../../shared/models/errors/RubicError';
import { BRIDGE_PROVIDER_TYPE } from '../../../models/ProviderType';

@Injectable({
  providedIn: 'root'
})
export class BinancePolygonBridgeProviderService extends BlockchainsBridgeProvider {
  private tokensList$ = new BehaviorSubject<List<EvoBridgeToken>>(List([]));

  constructor(private web3Public: Web3Public, private readonly translateService: TranslateService) {
    super();
    this.loadTokens();
  }

  public getProviderType(): BRIDGE_PROVIDER_TYPE {
    return BRIDGE_PROVIDER_TYPE.EVO;
  }

  createTrade(
    bridgeTrade: BridgeTrade,
    updateTransactionsList: () => Promise<void>
  ): Observable<TransactionReceipt> {
    return undefined;
  }

  getFee(token: BridgeToken, toBlockchain: BLOCKCHAIN_NAME): Observable<number> {
    return undefined;
  }

  getTokensList(swapTokens: List<SwapToken>): Observable<List<BridgeToken>> {
    return undefined;
  }

  private async loadTokens(): Promise<void> {
    const blockchains = [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN, BLOCKCHAIN_NAME.POLYGON];
    const tokensListPromises = blockchains.map(blockchain =>
      this.web3Public[blockchain].callContractMethod(
        EVO_ADDRESSES[blockchain],
        EVO_ABI,
        'listTokensNames'
      )
    );

    const tokensInBlockchains: string[][] = await Promise.all(tokensListPromises);
    if (
      tokensInBlockchains.length !== 2 ||
      tokensInBlockchains[0].length !== tokensInBlockchains[1].length
    ) {
      console.error('Error while loading evo tokens');
      throw new RubicError(this.translateService);
    }

    const tokensInfoPromises = blockchains.map(blockchain =>
      this.web3Public[blockchain].multicallContractMethod(
        EVO_ADDRESSES[blockchain],
        EVO_ABI,
        'tokens',
        [...Array(tokensInBlockchains[0].length).keys()].map(number => [number])
      )
    );

    const tokens = await Promise.all(tokensInfoPromises);
    console.log(tokens);
  }
}
