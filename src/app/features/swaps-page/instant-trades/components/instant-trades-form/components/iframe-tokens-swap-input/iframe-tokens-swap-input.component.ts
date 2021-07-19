import { Component, Input } from '@angular/core';
import BigNumber from 'bignumber.js';
import { BLOCKCHAIN_NAME } from 'src/app/shared/models/blockchain/BLOCKCHAIN_NAME';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ProviderConnectorService } from 'src/app/core/services/blockchain/provider-connector/provider-connector.service';
import { WalletsModalComponent } from 'src/app/core/header/components/header/components/wallets-modal/wallets-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { WarningModalComponent } from 'src/app/features/cross-chain-swaps-page/bridge-page/components/modals/warning-modal/warning-modal.component';
import { InstantTradeProviderController } from '../../../../models/instant-trades-provider-controller';
import { InstantTradeSwapInput } from '../../../../models/instant-trade-input';

@Component({
  selector: 'app-iframe-tokens-swap-input',
  templateUrl: './iframe-tokens-swap-input.component.html',
  styleUrls: ['./iframe-tokens-swap-input.component.scss']
})
export class IframeTokensSwapInputComponent extends InstantTradeSwapInput {
  @Input() public disableSelection: boolean;

  public get tradeController(): InstantTradeProviderController {
    return this.trades[this.index];
  }

  public get isLoggedIn(): boolean {
    return Boolean(
      this.providerConnectorService?.provider && this.providerConnectorService?.address
    );
  }

  public get gasFeeDisplayCondition(): BigNumber | undefined {
    return (
      this.blockchain !== BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN &&
      this.blockchain !== BLOCKCHAIN_NAME.POLYGON &&
      this.tradeController?.trade?.gasFeeInEth &&
      this.tradeController?.trade?.gasFeeInUsd
    );
  }

  constructor(
    private readonly authService: AuthService,
    private readonly providerConnectorService: ProviderConnectorService,
    private dialog: MatDialog
  ) {
    super();
    this.disableSelection = false;
  }

  public async login(): Promise<void> {
    const isMetamaskBrowser = this.detectMobile && window.ethereum;
    const isIframe = true;
    if (isMetamaskBrowser && isIframe) {
      this.dialog.open(WarningModalComponent, {
        width: '420px',
        data: {
          text: 'Sorry, but metamask browser is not supported by rubic.exchange widget. Please, try to use the app via Chrome browser.'
        }
      });
    } else {
      this.dialog.open(WalletsModalComponent, { width: '420px' });
    }
  }

  private detectMobile(): boolean {
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i
    ];

    return toMatch.some(toMatchItem => navigator.userAgent.match(toMatchItem));
  }
}
