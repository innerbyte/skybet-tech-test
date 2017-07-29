
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {PNFComponent} from './pnf/pnf.component';
import {HomeComponent} from './home/home.component';
import {HomeDashboardComponent} from "./home/home-dashboard.component";

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/home'
    },
    {
        path: '',
        component: HomeComponent,
        children: [
            {
                path: '',
                children: [
                    {
                        path: 'home',
                        component: HomeDashboardComponent,
                        data: {
                            bread: 'Home'
                        }
                    },
                    {
                        path: ':cat/:sub_cat',
                        loadChildren: './events/events.module#EventsModule',
                        data: {
                            bread: 'Events'
                        }
                    }
                ]
            }
        ]
    },
    {
        path: '**',
        component: PNFComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        ReactiveFormsModule,
        CommonModule
    ],
    declarations: [
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}