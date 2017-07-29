
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EventsComponent} from './events.component';
// import {UserDetailsComponent} from './details/user-details.component';
import {EventsResolver} from "../services/resolvers/events-resolver.service";

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
            }
            // {
            //     path: 'new',
            //     component: UserDetailsComponent,
            //     resolve: {
            //         user: UserDetailsResolver
            //     },
            //     data: {
            //         bread: 'User Details',
            //         is_new: true
            //     }
            // },
            // {
            //     path: 'me',
            //     component: UserDetailsComponent,
            //     resolve: {
            //         user: UserDetailsResolver
            //     },
            //     data: {
            //         bread: 'User Details',
            //         is_me: true
            //     }
            // },
            // {
            //     path: ':id',
            //     component: UserDetailsComponent,
            //     resolve: {
            //         user: UserDetailsResolver
            //     },
            //     data: {
            //         bread: 'User Details'
            //     }
            // }
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
        EventsResolver
    ],
    exports: [
        RouterModule
    ]
})
export class EventsRoutingModule {}