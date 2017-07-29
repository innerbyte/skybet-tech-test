import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {APP_BASE_HREF, CommonModule} from '@angular/common';
import {AppRoutingModule} from './app-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TransferHttpModule} from '../modules/transfer-http/transfer-http.module';

import { SIDEBAR_TOGGLE_DIRECTIVES } from './shared/sidebar.directive';
import { AsideToggleDirective } from './shared/aside.directive';
import { BreadcrumbsComponent } from './shared/breadcrumb.component';
import { NAV_DROPDOWN_DIRECTIVES } from './shared/nav-dropdown.directive';

import {AppComponent} from './app.component';

import {PNFComponent} from './pnf/pnf.component';
import {HttpModule} from "@angular/http";

import {HomeComponent} from './home/home.component';
import {HomeNavComponent} from './home/home-nav.component';
import {HomeSideComponent} from './home/home-side.component';
import {HomeDashboardComponent} from './home/home-dashboard.component';

import {EventsService} from "./services/events.service";


@NgModule({
    imports: [
        HttpModule,
        CommonModule,
        TransferHttpModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        PNFComponent,
        HomeComponent,
        HomeNavComponent,
        HomeSideComponent,
        HomeDashboardComponent,
        BreadcrumbsComponent,
        SIDEBAR_TOGGLE_DIRECTIVES,
        AsideToggleDirective,
        NAV_DROPDOWN_DIRECTIVES
    ],
    entryComponents: [
    ],
    providers: [
        {provide: APP_BASE_HREF, useValue: '/'},
        { provide: 'ORIGIN_URL', useValue: "http://localhost:8585" },
        EventsService
    ]
})
export class AppModule {

}