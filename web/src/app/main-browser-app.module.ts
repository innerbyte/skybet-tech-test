
// import 'zone.js/dist/zone';
// import 'reflect-metadata';

import { NgModule } from '@angular/core';

import { BrowserAppModule as browser_module } from './browser-app.module';

@NgModule({
    imports: [
        browser_module
    ],
    providers: [
        //   { provide: NgModuleFactoryLoader, useClass: ServerRouterLoader }
    ]
})
export class MainBrowserAppModule {

}