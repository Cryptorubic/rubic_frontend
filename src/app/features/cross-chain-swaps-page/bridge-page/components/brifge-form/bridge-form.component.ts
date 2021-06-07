import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { List } from 'immutable';
import BigNumber from 'bignumber.js';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { QueryParamsService } from 'src/app/core/services/query-params/query-params.service';
import { TranslateService } from '@ngx-translate/core';
import { BLOCKCHAIN_NAME } from 'src/app/shared/models/blockchain/BLOCKCHAIN_NAME';
import InputToken from 'src/app/shared/models/tokens/InputToken';
import { BLOCKCHAINS } from 'src/app/features/cross-chain-swaps-page/common/constants/BLOCKCHAINS';
import ADDRESS_TYPE from 'src/app/shared/models/blockchain/ADDRESS_TYPE';
import { ErrorsService } from 'src/app/core/services/errors/errors.service';

import { TransactionReceipt } from 'web3-eth';
import { BridgeToken } from '../../models/BridgeToken';
import { BridgeBlockchain } from '../../models/BridgeBlockchain';
import { BridgeTrade } from '../../models/BridgeTrade';
import { BridgeService } from '../../services/bridge.service';
import { BRIDGE_PROVIDER_TYPE } from '../../models/ProviderType';

@Component({
  selector: 'app-bridge-form',
  templateUrl: './bridge-form.component.html',
  styleUrls: ['./bridge-form.component.scss']
})
export class BridgeFormComponent implements OnInit, OnDestroy {
  public readonly BRBC_ADDRESS = '0x8E3BCC334657560253B83f08331d85267316e08a';

  public readonly ETHEREUM_ADDRESS_PATTERN = '^(0x)[0-9A-Fa-f]{40}$';

  public readonly TRON_ADDRESS_PATTERN = '^T[1-9A-HJ-NP-Za-km-z]{33}$';

  public BLOCKCHAIN_NAME = BLOCKCHAIN_NAME;

  public ADDRESS_TYPE = ADDRESS_TYPE;

  public fromBlockchainsList: BridgeBlockchain[] = Object.values(BLOCKCHAINS).filter(
    b => b.key !== BLOCKCHAIN_NAME.TRON && b.key !== BLOCKCHAIN_NAME.XDAI
  );

  public toBlockchainsList: BridgeBlockchain[] = Object.values(BLOCKCHAINS);

  private _fromBlockchain = BLOCKCHAINS[BLOCKCHAIN_NAME.ETHEREUM];

  private _toBlockchain = BLOCKCHAINS[BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN];

  private _tokens: List<BridgeToken> = List([]);

  public dropDownTokens: List<InputToken> = List([]);

  public _selectedToken: BridgeToken = null;

  public selectedTokenAsInputToken: InputToken = null;

  public _fromNumber: string;

  private _fee: BigNumber;

  public _toNumber: string;

  public feeCalculationProgress: boolean = false;

  public buttonAnimation: boolean = false;

  public tradeInProgress: boolean = false;

  public tradeSuccessId: string;

  public fromWalletAddress: string;

  public toWalletAddress: string;

  public BLOCKCHAIN_DATA = {
    [BLOCKCHAIN_NAME.ETHEREUM]: {
      link: 'https://ethereum.org/en/',
      caption: 'Ethereum'
    },
    [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: {
      link: 'https://www.binance.org/',
      caption: 'Binance Smart Chain',
      providerImg: 'Binance'
    },
    [BLOCKCHAIN_NAME.POLYGON]: {
      link: 'https://polygon.technology/',
      caption: 'Polygon',
      providerImg: 'Polygon'
    },
    [BLOCKCHAIN_NAME.TRON]: {
      link: 'https://tron.network/',
      caption: 'TRON',
      providerImg: 'Binance'
    },
    [BLOCKCHAIN_NAME.XDAI]: {
      link: 'https://www.xdaichain.com/',
      caption: 'xDai',
      providerImg: 'XDai'
    }
  };

  public PROVIDERS_DATA = {
    [BRIDGE_PROVIDER_TYPE.PANAMA]: {
      img: 'Binance',
      href: 'https://www.binance.org/'
    },
    [BRIDGE_PROVIDER_TYPE.RUBIC]: {
      img: '',
      href: ''
    },
    [BRIDGE_PROVIDER_TYPE.POLYGON]: {
      img: 'Polygon',
      href: 'https://polygon.technology/'
    },
    [BRIDGE_PROVIDER_TYPE.XDAI]: {
      img: 'XDai',
      href: 'https://www.xdaichain.com/'
    },
    [BRIDGE_PROVIDER_TYPE.EVO]: {
      img: 'Evo',
      href: 'https://evodefi.com/'
    }
  };

  private tokensSubscription$: Subscription;

  private addressSubscription$: Subscription;

  public isHighGasPriceModalShown = false;

  public isPolygonToEthTradeModalShown = false;

  private isFirstTokensEmit = true;

  public isToWalletAddressSectionOpened = false;

  get tokens(): List<BridgeToken> {
    return this._tokens;
  }

  set tokens(tokens: List<BridgeToken>) {
    this._tokens = tokens;
    this.updateDropDownTokens();
  }

  private updateDropDownTokens(): void {
    this.dropDownTokens = this._tokens.map(token => ({
      address: token.blockchainToken[this.fromBlockchain.key].address,
      name: token.blockchainToken[this.fromBlockchain.key].name,
      symbol: token.blockchainToken[this.fromBlockchain.key].symbol,
      decimals: token.blockchainToken[this.fromBlockchain.key].decimals,
      image: token.image,
      rank: token.rank
    }));
  }

  get selectedToken(): BridgeToken {
    return this._selectedToken;
  }

  set selectedToken(value: BridgeToken) {
    this._selectedToken = value;
    this.selectedTokenAsInputToken = this.dropDownTokens.find(
      token =>
        token.address === this._selectedToken?.blockchainToken[this.fromBlockchain.key].address
    );

    if (this._selectedToken) {
      this.queryParamsService.setQueryParam(
        'from',
        this._selectedToken.blockchainToken[this.fromBlockchain.key].symbol
      );
    } else {
      this.queryParamsService.removeQueryParam('from');
    }
  }

  get fromBlockchain() {
    return this._fromBlockchain;
  }

  set fromBlockchain(blockchain) {
    if (blockchain.key === this._toBlockchain.key) {
      this.revertBlockchains();
    } else {
      const { correctness, correctPair } = this.bridgeService.checkPairCorrectness(
        blockchain.key,
        this.toBlockchain.key
      );

      if (!correctness) {
        [this._fromBlockchain, this._toBlockchain] = correctPair.map(name => BLOCKCHAINS[name]);
      } else {
        this._fromBlockchain = blockchain;
      }

      if (this.selectedToken) {
        this.selectedToken = null;
      }
      this.setBlockchainsToService();
    }
    this.queryParamsService.setQueryParam('chain', this._fromBlockchain.key);

    this.setToWalletAddress();
  }

  get toBlockchain() {
    return this._toBlockchain;
  }

  set toBlockchain(blockchain) {
    if (
      this._toBlockchain.key === BLOCKCHAIN_NAME.TRON &&
      blockchain.key !== BLOCKCHAIN_NAME.TRON
    ) {
      if (blockchain.key !== BLOCKCHAIN_NAME.ETHEREUM) {
        this._fromBlockchain = BLOCKCHAINS[BLOCKCHAIN_NAME.ETHEREUM];
      } else {
        this._fromBlockchain = BLOCKCHAINS[BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN];
      }
    }

    if (blockchain === this._fromBlockchain) {
      this.revertBlockchains();
    } else {
      this._toBlockchain = blockchain;
      if (!this.isBlockchainsPairValid()) {
        this._fromBlockchain = BLOCKCHAINS[BLOCKCHAIN_NAME.ETHEREUM];
      }
      if (this.selectedToken) {
        this.selectedToken = null;
      }
      this.setBlockchainsToService();
    }
    this.queryParamsService.setQueryParam('chain', this._fromBlockchain.key);

    this.setToWalletAddress();
  }

  set fromNumber(fromNumber: string) {
    this._fromNumber = fromNumber;
    this.setToNumber();

    this.queryParamsService.setQueryParam('amount', this.fromNumber);
  }

  get fromNumber(): string {
    return this._fromNumber;
  }

  get fromNumberAsBigNumber(): BigNumber {
    return new BigNumber(this._fromNumber);
  }

  set fee(fee: BigNumber) {
    this._fee = fee;
    this.setToNumber();
  }

  get fee(): BigNumber {
    return this._fee;
  }

  get toNumber(): string {
    if (!this._toNumber) {
      return '';
    }

    if (!this.selectedToken) {
      this._toNumber = null;
      return '';
    }

    if (this._toNumber.includes('.')) {
      const startIndex = this._toNumber.indexOf('.') + 1;
      this._toNumber = this._toNumber.slice(
        0,
        startIndex + this.selectedToken.blockchainToken[this.toBlockchain.key].decimals
      );
    }

    return this._toNumber;
  }

  private setToNumber(): void {
    if (this.fromNumber && this.fee) {
      this._toNumber = new BigNumber(this.fromNumber).minus(this.fee).toFixed();
    } else {
      this._toNumber = null;
    }
  }

  get providerData(): { img: string; href: string } {
    const providerType = this.bridgeService.getProviderType(this.selectedToken);
    return this.PROVIDERS_DATA[providerType];
  }

  constructor(
    private bridgeService: BridgeService,
    private dialog: MatDialog,
    private readonly translateService: TranslateService,
    private queryParamsService: QueryParamsService,
    private errorsService: ErrorsService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.setBlockchainsToService();
    this.tokensSubscription$ = this.bridgeService.tokens.subscribe(tokens => {
      this.tokens = tokens;
      if (tokens.size > 0 && this.isFirstTokensEmit) {
        this.isFirstTokensEmit = false;
        this.initializeForm();
      }
    });
    this.addressSubscription$ = this.bridgeService.walletAddress.subscribe(address => {
      this.fromWalletAddress = address;

      if (this.toBlockchain.key !== BLOCKCHAIN_NAME.TRON) {
        this.toWalletAddress = address;
      }
    });
  }

  ngOnDestroy() {
    this.tokensSubscription$.unsubscribe();
    this.addressSubscription$.unsubscribe();
    this.queryParamsService.clearCurrentParams();
  }

  private initializeForm(): void {
    if (!this.queryParamsService.currentQueryParams) {
      this.queryParamsService.initiateBridgeParams({});
    }

    if (!this.queryParamsService.currentQueryParams?.chain) {
      this.queryParamsService.setQueryParam('chain', this.fromBlockchain.key);
    } else {
      this.fromBlockchain = this.fromBlockchainsList.find(
        blockchain => blockchain.key === this.queryParamsService.currentQueryParams?.chain
      );
    }

    if (this.queryParamsService.currentQueryParams?.amount) {
      this.fromNumber = this.queryParamsService.currentQueryParams?.amount;
    }

    if (this.queryParamsService.currentQueryParams?.from) {
      let token;
      if (this.queryParamsService.isAddress(this.queryParamsService.currentQueryParams?.from)) {
        token = this.queryParamsService.searchTokenByAddress(
          this.queryParamsService.currentQueryParams?.from,
          this.cdr,
          this.tokens,
          true
        );
      } else {
        token = this.queryParamsService.searchTokenBySymbol(
          this.queryParamsService.currentQueryParams?.from,
          this.cdr,
          this.tokens,
          true
        );
      }
      this.changeSelectedToken(token);
    }
  }

  private setBlockchainsToService(): void {
    this.bridgeService.setBlockchains(this.fromBlockchain.key, this.toBlockchain.key);
  }

  public isBlockchainSelected(blockchain: BLOCKCHAIN_NAME): boolean {
    return this.fromBlockchain.key === blockchain || this.toBlockchain.key === blockchain;
  }

  private isBlockchainsPairValid(): boolean {
    if (this.isBlockchainSelected(BLOCKCHAIN_NAME.ETHEREUM)) {
      return true;
    }
    return (
      this.fromBlockchain.key === BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN &&
      this.toBlockchain.key === BLOCKCHAIN_NAME.TRON
    );
  }

  public revertBlockchains(): void {
    [this._fromBlockchain, this._toBlockchain] = [this._toBlockchain, this._fromBlockchain];
    this.queryParamsService.setQueryParam('chain', this._fromBlockchain.key);
    this.updateDropDownTokens();

    if (this.selectedToken) {
      this.changeSelectedToken(this.selectedToken);
    }
  }

  private changeSelectedToken(token: BridgeToken): void {
    this.fee = null;
    this.selectedToken = token;
    if (!token) {
      return;
    }

    this.feeCalculationProgress = true;
    this.bridgeService
      .getFee(this.selectedToken, this.toBlockchain.key)
      .pipe(first())
      .subscribe(
        fee => {
          this.fee = new BigNumber(fee);
        },
        err => console.error(err),
        () => {
          this.feeCalculationProgress = false;
        }
      );
  }

  public onSelectedTokenChanges(inputToken: InputToken | null): void {
    if (inputToken) {
      const bridgeToken = this.tokens.find(
        token => token.blockchainToken[this.fromBlockchain.key].address === inputToken.address
      );
      this.changeSelectedToken(bridgeToken);
    } else {
      this.changeSelectedToken(null);
    }
  }

  private setToWalletAddress(): void {
    if (this._toBlockchain.key === BLOCKCHAIN_NAME.TRON) {
      this.toWalletAddress = (window as any).tronWeb?.defaultAddress.base58;
    } else {
      this.toWalletAddress = this.fromWalletAddress;
    }
  }

  public onIsToWalletAddressSectionOpenedChange(value: boolean): void {
    if (this.isToWalletAddressSectionOpened !== value) {
      this.isToWalletAddressSectionOpened = value;
      this.cdr.detectChanges();
    }
  }

  public isToWalletAddressCorrect(): boolean {
    return new RegExp(
      this.toBlockchain.key === BLOCKCHAIN_NAME.TRON
        ? this.TRON_ADDRESS_PATTERN
        : this.ETHEREUM_ADDRESS_PATTERN
    ).test(this.toWalletAddress);
  }

  public checkAndConfirm(): void {
    if (
      this.fromBlockchain.key === BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN &&
      this.toBlockchain.key === BLOCKCHAIN_NAME.ETHEREUM &&
      this.selectedToken.blockchainToken[BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]?.address ===
        this.BRBC_ADDRESS
    ) {
      this.bridgeService.checkIfEthereumGasPriceIsHigh().subscribe(isHigh => {
        if (isHigh) {
          this.isHighGasPriceModalShown = true;
        } else {
          this.onConfirm();
        }
      });
    } else if (
      this.fromBlockchain.key === BLOCKCHAIN_NAME.POLYGON &&
      this.toBlockchain.key === BLOCKCHAIN_NAME.ETHEREUM
    ) {
      this.isPolygonToEthTradeModalShown = true;
    } else {
      this.onConfirm();
    }
  }

  public onHighGasPriceConfirm() {
    this.isHighGasPriceModalShown = false;
    this.onConfirm();
  }

  public onPolygonToEthTradeConfirm(): void {
    this.isPolygonToEthTradeModalShown = false;
    this.onConfirm();
  }

  public onConfirm(): void {
    this.buttonAnimation = true;

    const bridgeTrade: BridgeTrade = {
      token: this.selectedToken,
      fromBlockchain: this.fromBlockchain.key,
      toBlockchain: this.toBlockchain.key,
      amount: new BigNumber(this.fromNumber),
      toAddress: this.toWalletAddress,
      onTransactionHash: () => {
        this.tradeInProgress = true;
      }
    };

    this.bridgeService
      .createTrade(bridgeTrade)
      .pipe(first())
      .subscribe(
        (res: TransactionReceipt) => {
          this.tradeSuccessId = res.transactionHash;
          this.tradeInProgress = false;
          this.buttonAnimation = false;
        },
        err => {
          this.tradeInProgress = false;
          this.buttonAnimation = false;
          this.errorsService.showErrorDialog(err, this.dialog);
        }
      );
  }
}
