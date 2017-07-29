
import { NgModule } from '@angular/core';

import { ServerAppModule as server_module } from './server-app.module';

@NgModule({
    imports: [
        server_module
    ],
    providers: [
        //   { provide: NgModuleFactoryLoader, useClass: ServerRouterLoader }
    ]
})
export class MainServerAppModule {

}