import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionReceipt } from 'web3-eth';
import { TranslateService } from '@ngx-translate/core';
import { BlockchainsBridgeProvider } from '../blockchains-bridge-provider';
import { BridgeTrade } from '../../../models/BridgeTrade';
import { BridgeToken } from '../../../models/BridgeToken';
import { BLOCKCHAIN_NAME } from '../../../../../../shared/models/blockchain/BLOCKCHAIN_NAME';
import { EvoBridgeToken } from './models/EvoBridgeToken';
import { EVO_ABI, EVO_ADDRESSES } from './constants/contract';
import { RubicError } from '../../../../../../shared/models/errors/RubicError';
import { BRIDGE_PROVIDER_TYPE } from '../../../models/ProviderType';
import { Web3PublicService } from '../../../../../../core/services/blockchain/web3-public-service/web3-public.service';

@Injectable()
export class BinancePolygonBridgeProviderService extends BlockchainsBridgeProvider {
  constructor(
    private web3PublicService: Web3PublicService,
    private readonly translateService: TranslateService
  ) {
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

  private async loadTokens(): Promise<void> {
    const blockchains = [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN, BLOCKCHAIN_NAME.POLYGON];
    const tokensListPromises = blockchains.map(blockchain =>
      this.web3PublicService[blockchain].callContractMethod(
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
      this.web3PublicService[blockchain].multicallContractMethod(
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
