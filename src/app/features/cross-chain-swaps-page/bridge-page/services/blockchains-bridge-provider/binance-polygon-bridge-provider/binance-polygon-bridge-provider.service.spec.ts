import { TestBed } from '@angular/core/testing';

import { BinancePolygonBridgeProviderService } from './binance-polygon-bridge-provider.service';

describe('BinancePolygonBridgeProviderService', () => {
  let service: BinancePolygonBridgeProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BinancePolygonBridgeProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
