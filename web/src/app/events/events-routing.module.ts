
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EventsComponent} from './events.component';
import {MarketsComponent} from './markets/markets.component';
import {EventsResolver} from "../services/resolvers/events-resolver.service";
import {MarketsResolver} from "../services/resolvers/markets-resolver.service";

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: EventsComponent,
                resolve: {
                    res: EventsResolver
                },
                data: {
                    bread: 'Events'
                }
            },
            {
                path: ':event_id',
                component: MarketsComponent,
                resolve: {
                    res: MarketsResolver
                },
                data: {
                    bread: 'Bets'
                }
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    declarations: [
    ],
    providers: [
        EventsResolver,
        MarketsResolver
    ],
    exports: [
        RouterModule
    ]
})
export class EventsRoutingModule {}