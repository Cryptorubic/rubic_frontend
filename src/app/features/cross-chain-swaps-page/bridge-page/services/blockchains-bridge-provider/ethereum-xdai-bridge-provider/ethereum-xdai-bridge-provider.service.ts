import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { List } from 'immutable';
import { tap } from 'rxjs/operators';
import { TransactionReceipt } from 'web3-eth';
import { BlockchainsBridgeProvider } from '../blockchains-bridge-provider';
import { BridgeToken } from '../../../models/BridgeToken';
import { BLOCKCHAIN_NAME } from '../../../../../../shared/models/blockchain/BLOCKCHAIN_NAME';
import { BridgeTrade } from '../../../models/BridgeTrade';
import { Web3PrivateService } from '../../../../../../core/services/blockchain/web3-private-service/web3-private.service';
import { BridgeApiService } from '../../../../../../core/services/backend/bridge-api/bridge-api.service';
import { ethToXDaiDepositWallet } from '../../../../../../shared/constants/bridge/deposit-wallets';
import { BRIDGE_PROVIDER_TYPE } from '../../../models/ProviderType';

@Injectable()
export class EthereumXdaiBridgeProviderService extends BlockchainsBridgeProvider {
  get tokens(): Observable<List<BridgeToken>> {
    return of(List(this.xDaiProviderTokens));
  }

  private xDaiProviderTokens = [
    {
      symbol: 'DAI',
      image: '',
      rank: 0,

      blockchainToken: {
        [BLOCKCHAIN_NAME.ETHEREUM]: {
          address: '0x6b175474e89094c44da98b954eedeac495271d0f',
          name: 'Dai',
          symbol: 'DAI',
          decimals: 18,

          minAmount: 0.005,
          maxAmount: 9999999
        },
        [BLOCKCHAIN_NAME.XDAI]: {
          address: '0x0000000000000000000000000000000000000000',
          name: 'xDai',
          symbol: 'XDAI',
          decimals: 18,

          minAmount: 10,
          maxAmount: 9999999
        }
      }
    } as BridgeToken
  ];

  getProviderType(): BRIDGE_PROVIDER_TYPE {
    return BRIDGE_PROVIDER_TYPE.XDAI;
  }

  constructor(
    private web3PrivateService: Web3PrivateService,
    private bridgeApiService: BridgeApiService
  ) {
    super();
  }

  getFee(): Observable<number> {
    return of(0);
  }

  public createTrade(
    bridgeTrade: BridgeTrade,
    updateTransactionsList: () => Promise<void>
  ): Observable<TransactionReceipt> {
    const { token } = bridgeTrade;
    const tokenAddress = token.blockchainToken[bridgeTrade.fromBlockchain].address;
    const { decimals } = token.blockchainToken[bridgeTrade.fromBlockchain];
    const amountInWei = bridgeTrade.amount.multipliedBy(10 ** decimals);

    const onTradeTransactionHash = async hash => {
      if (bridgeTrade.onTransactionHash) {
        bridgeTrade.onTransactionHash(hash);
      }
      await this.bridgeApiService.postXDaiTransaction(hash);
      updateTransactionsList();
    };

    return from(
      this.web3PrivateService.transferTokens(
        tokenAddress,
        ethToXDaiDepositWallet,
        amountInWei.toFixed(),
        {
          onTransactionHash: onTradeTransactionHash
        }
      )
    ).pipe(
      tap(receipt => {
        this.bridgeApiService.notifyBridgeBot(
          bridgeTrade,
          receipt.transactionHash,
          this.web3PrivateService.address
        );
      })
    );
  }
}
