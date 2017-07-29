
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { BrowserTransferStateModule } from '../modules/transfer-state/browser-transfer-state.module';

@NgModule({
    bootstrap: [ AppComponent ],
    imports: [
        BrowserModule.withServerTransition({
            appId: 'skybet-app'
        }),
        BrowserAnimationsModule,
        BrowserTransferStateModule,
        AppModule
    ],
    declarations: [
    ],
    entryComponents: [
    ]
})
export class BrowserAppModule {}
