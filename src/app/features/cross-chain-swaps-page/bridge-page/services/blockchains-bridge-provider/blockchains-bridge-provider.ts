import { List } from 'immutable';
import { Observable } from 'rxjs';
import { BridgeTrade } from 'src/app/features/cross-chain-swaps-page/bridge-page/models/BridgeTrade';
import { BridgeToken } from 'src/app/features/cross-chain-swaps-page/bridge-page/models/BridgeToken';
import SwapToken from 'src/app/shared/models/tokens/SwapToken';
import { BLOCKCHAIN_NAME } from 'src/app/shared/models/blockchain/BLOCKCHAIN_NAME';
import { TransactionReceipt } from 'web3-eth';
import { BRIDGE_PROVIDER_TYPE } from '../../models/ProviderType';

export abstract class BlockchainsBridgeProvider {
  public abstract get tokens(): Observable<List<BridgeToken>>;

  /**
   * @description get type of provider
   */
  public getProviderType?(token?: BridgeToken): BRIDGE_PROVIDER_TYPE;

  /**
   * @description get transformed list of bridge tokens from usually tokens
   * @param swapTokens swap list tokens
   * @return observable bridge list tokens
   */
  public abstract getTokensList(swapTokens: List<SwapToken>): Observable<List<BridgeToken>>;

  /**
   * @description get price blockchain provider's fee
   * @param token bridge token
   * @param toBlockchain destination blockchain
   * @return observable number fee price
   */
  public abstract getFee(token: BridgeToken, toBlockchain: BLOCKCHAIN_NAME): Observable<number>;

  /**
   * @description create trade between different networks
   * @param bridgeTrade object with data for trade
   * @param updateTransactionsList callback function for update list of bridge trades
   * @return observable transaction receipt object
   */
  public abstract createTrade(
    bridgeTrade: BridgeTrade,
    updateTransactionsList: () => Promise<void>
  ): Observable<TransactionReceipt>;
}
