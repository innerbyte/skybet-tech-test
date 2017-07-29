
import {NgModule} from '@angular/core';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {DataTableModule, SharedModule} from 'primeng/primeng';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MarketsComponent} from "./markets/markets.component";
import {EventsComponent} from "./events.component";
import {EventsRoutingModule} from "./events-routing.module";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        EventsRoutingModule,
        DataTableModule,
        SharedModule,
        NgbModule.forRoot()
    ],
    declarations: [
        EventsComponent,
        MarketsComponent
    ],
    entryComponents: [
    ],
    providers: [
    ]
})
export class EventsModule {

}