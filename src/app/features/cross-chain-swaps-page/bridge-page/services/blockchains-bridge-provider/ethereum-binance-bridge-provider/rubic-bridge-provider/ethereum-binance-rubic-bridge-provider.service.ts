import { Injectable } from '@angular/core';
import BigNumber from 'bignumber.js';
import { HttpClient } from '@angular/common/http';
import { List } from 'immutable';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Web3PrivateService } from 'src/app/core/services/blockchain/web3-private-service/web3-private.service';
import { Web3PublicService } from 'src/app/core/services/blockchain/web3-public-service/web3-public.service';
import { BridgeApiService } from 'src/app/core/services/backend/bridge-api/bridge-api.service';
import { UseTestingModeService } from 'src/app/core/services/use-testing-mode/use-testing-mode.service';
import { BLOCKCHAIN_NAME } from 'src/app/shared/models/blockchain/BLOCKCHAIN_NAME';
import { Web3Public } from 'src/app/core/services/blockchain/web3-public-service/Web3Public';
import {
  BlockchainsTokens,
  BridgeToken
} from 'src/app/features/cross-chain-swaps-page/bridge-page/models/BridgeToken';
import { BridgeTrade } from 'src/app/features/cross-chain-swaps-page/bridge-page/models/BridgeTrade';
import { TransactionReceipt } from 'web3-eth';
import BinanceContractAbi from './abi/BinanceContractAbi';
import EthereumContractAbi from './abi/EthereumContractAbi';
import { BlockchainsBridgeProvider } from '../../blockchains-bridge-provider';

interface RubicTrade {
  token: {
    address: string;
    decimals: number;
    symbol: string;
  };
  amount: BigNumber;
  swapContractAddress: string;
  swapContractAbi: any[];
}

@Injectable()
export class EthereumBinanceRubicBridgeProviderService extends BlockchainsBridgeProvider {
  private static readonly RubicMaxAmount = 50000;

  private readonly apiUrl = 'https://swap.rubic.exchange/api/v1/';

  private EthereumSmartContractAddress = '0x8E3BCC334657560253B83f08331d85267316e08a';

  private BinanceSmartContractAddress = '0xE77b0E832A58aFc2fcDaed060E8D701d97533086';

  constructor(
    private httpClient: HttpClient,
    private web3PrivateService: Web3PrivateService,
    private web3PublicService: Web3PublicService,
    private bridgeApiService: BridgeApiService,
    useTestingMode: UseTestingModeService
  ) {
    super();
    useTestingMode.isTestingMode.subscribe(value => {
      if (value) {
        this.EthereumSmartContractAddress = '0xd806e441b27f4f827710469b0acb4e045e62b676';
        this.BinanceSmartContractAddress = '0x17caca02ddf472f62bfed5165facf7a6b5c72926';
      }
    });

    this.loadTokens().subscribe(tokens => this._tokens.next(tokens));
  }

  public loadTokens(): Observable<List<BridgeToken>> {
    return this.loadRubicTokenInfo().pipe(map(rubicToken => List([rubicToken])));
  }

  public loadRubicTokenInfo(): Observable<BridgeToken> {
    return this.httpClient.get(`${this.apiUrl}dex/Rubic/`).pipe(
      map((response: any) => {
        const ethToken = response.tokens.find(token => token.symbol === 'RBC');
        const bscToken = response.tokens.find(token => token.symbol === 'BRBC');
        return {
          symbol: 'RBC',
          image: '',
          rank: 0,

          blockchainToken: {
            [BLOCKCHAIN_NAME.ETHEREUM]: {
              address: ethToken.token_address,
              name: 'Rubic',
              symbol: ethToken.symbol,
              decimals: ethToken.decimals,

              minAmount: response.min_swap_amount,
              maxAmount: EthereumBinanceRubicBridgeProviderService.RubicMaxAmount
            },
            [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: {
              address: bscToken.token_address,
              name: 'Rubic',
              symbol: bscToken.symbol,
              decimals: bscToken.decimals,

              minAmount: response.min_swap_amount,
              maxAmount: EthereumBinanceRubicBridgeProviderService.RubicMaxAmount
            }
          } as BlockchainsTokens,

          fromEthFee: bscToken.fee,
          toEthFee: ethToken.fee
        };
      })
    );
  }

  public getFee(token: BridgeToken, toBlockchain: BLOCKCHAIN_NAME): Observable<number> {
    if (toBlockchain === BLOCKCHAIN_NAME.ETHEREUM) {
      return of(token.toEthFee);
    }
    return of(token.fromEthFee);
  }

  public checkIfEthereumGasPriceIsHigh(): Observable<boolean> {
    return this.httpClient
      .get(`${this.apiUrl}gas/Ethereum/`)
      .pipe(map((res: { status: string }) => res.status === 'HIGH'));
  }

  public createTrade(
    bridgeTrade: BridgeTrade,
    updateTransactionsList: () => Promise<void>
  ): Observable<TransactionReceipt> {
    return new Observable(subscriber => {
      this.createRubicTrade(bridgeTrade, updateTransactionsList)
        .then(receipt => {
          this.bridgeApiService.notifyBridgeBot(
            bridgeTrade,
            receipt.transactionHash,
            this.web3PrivateService.address
          );
          subscriber.next(receipt);
        })
        .catch(err => {
          subscriber.error(err);
        })
        .finally(() => {
          subscriber.complete();
        });
    });
  }

  private async createRubicTrade(
    bridgeTrade: BridgeTrade,
    updateTransactionsList: () => Promise<void>
  ): Promise<TransactionReceipt> {
    const { token } = bridgeTrade;

    if (token.symbol !== 'RBC') {
      throw new Error('Rubic bridge supports only rubic token.');
    }

    const web3Public: Web3Public = this.web3PublicService[bridgeTrade.fromBlockchain];
    const trade: RubicTrade = {
      token: {
        address: token.blockchainToken[bridgeTrade.fromBlockchain].address,
        decimals: token.blockchainToken[bridgeTrade.fromBlockchain].decimals
      }
    } as RubicTrade;

    if (bridgeTrade.fromBlockchain === BLOCKCHAIN_NAME.ETHEREUM) {
      trade.token.symbol = 'RBC';
      trade.swapContractAddress = this.EthereumSmartContractAddress;
      trade.swapContractAbi = EthereumContractAbi;
    } else {
      trade.token.symbol = 'BRBC';
      trade.swapContractAddress = this.BinanceSmartContractAddress;
      trade.swapContractAbi = BinanceContractAbi;
    }

    trade.amount = bridgeTrade.amount.multipliedBy(10 ** trade.token.decimals);

    const onApprove = bridgeTrade.onTransactionHash;
    await this.provideAllowance(trade, web3Public, onApprove);

    const blockchain = bridgeTrade.fromBlockchain === BLOCKCHAIN_NAME.ETHEREUM ? 1 : 2;

    const onTradeTransactionHash = async (hash: string) => {
      if (bridgeTrade.onTransactionHash) {
        bridgeTrade.onTransactionHash(hash);
      }
      await this.bridgeApiService.postRubicTransaction(
        bridgeTrade.fromBlockchain,
        hash,
        trade.amount.toFixed(),
        this.web3PrivateService.address
      );
      updateTransactionsList();
    };

    const receipt = await this.web3PrivateService.executeContractMethod(
      trade.swapContractAddress,
      trade.swapContractAbi,
      'transferToOtherBlockchain',
      [blockchain, trade.amount.toFixed(0), bridgeTrade.toAddress],
      {
        onTransactionHash: onTradeTransactionHash
      }
    );

    return receipt;
  }

  private async provideAllowance(trade: RubicTrade, web3Public: Web3Public, onApprove) {
    const allowance = await web3Public.getAllowance(
      trade.token.address,
      this.web3PrivateService.address,
      trade.swapContractAddress
    );
    if (trade.amount.gt(allowance)) {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      const uintInfinity = new BigNumber(2).pow(256).minus(1);
      await this.web3PrivateService.approveTokens(
        trade.token.address,
        trade.swapContractAddress,
        uintInfinity,
        {
          onTransactionHash: onApprove
        }
      );
    }
  }
}
