import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { RouterModule } from '@angular/router';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { WarningModalComponent } from 'src/app/features/cross-chain-swaps-page/bridge-page/components/modals/warning-modal/warning-modal.component';
import { MaintenanceComponent } from './header/components/maintenance/maintenance.component';
import { HeaderComponent } from './header/components/header/header.component';
import { HeaderModule } from './header/header.module';
import { SharedModule } from '../shared/shared.module';
import { configLoader, httpLoaderFactory } from './app.loaders';
import { ContentLoaderService } from './services/content-loader/content-loader.service';
import { HTTPInterceptor } from './interceptors/http-interceptor';
import { WalletsModalComponent } from './header/components/header/components/wallets-modal/wallets-modal.component';

@NgModule({
  declarations: [MaintenanceComponent],
  providers: [
    CookieService,
    {
      provide: APP_INITIALIZER,
      useFactory: configLoader,
      deps: [ContentLoaderService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HTTPInterceptor,
      multi: true
    }
  ],
  entryComponents: [WalletsModalComponent, WarningModalComponent],
  imports: [
    CommonModule,
    HeaderModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [MaintenanceComponent, RouterModule, HeaderComponent]
})
export class CoreModule {}
