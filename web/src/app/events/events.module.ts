/**
 * Created by vlad on 11/04/17.
 */

import {NgModule} from '@angular/core';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {DataTableModule, SharedModule} from 'primeng/primeng';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
// import {UserDetailsComponent} from "./details/user-details.component";
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
        EventsComponent
        // UserDetailsComponent
    ],
    entryComponents: [
    ],
    providers: [
    ]
})
export class EventsModule {

}