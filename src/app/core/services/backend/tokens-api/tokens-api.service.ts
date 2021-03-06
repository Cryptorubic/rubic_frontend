import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { List } from 'immutable';
import { FROM_BACKEND_BLOCKCHAINS } from 'src/app/shared/constants/blockchain/BACKEND_BLOCKCHAINS';
import { Token } from 'src/app/shared/models/tokens/Token';
import { map } from 'rxjs/operators';
import { HttpService } from '../../http/http.service';
import { BackendToken } from './models/BackendToken';

@Injectable({
  providedIn: 'root'
})
export class TokensApiService {
  private readonly getTokensUrl = 'tokens/';

  constructor(private readonly httpService: HttpService) {}

  private static prepareTokens(tokens: BackendToken[]): List<Token> {
    return List(
      tokens
        .map((token: BackendToken) => ({
          ...token,
          blockchain: FROM_BACKEND_BLOCKCHAINS[token.blockchain_network],
          price: token.usd_price,
          usedInIframe: token.used_in_iframe
        }))
        .filter(token => token.address && token.blockchain)
    );
  }

  public getTokensList(): Observable<List<Token>> {
    return this.httpService
      .get(this.getTokensUrl)
      .pipe(map((backendTokens: BackendToken[]) => TokensApiService.prepareTokens(backendTokens)));
  }
}
