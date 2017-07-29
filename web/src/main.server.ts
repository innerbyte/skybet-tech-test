/**
 * Created by vlad on 03/04/17.
 */

"use strict";

import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import 'rxjs/Rx';

import { enableProdMode } from '@angular/core'

import { ServerAppModule as server_module } from './app/server-app.module';

import { boot } from './boot.server';
import { Server } from './server/server';
import {NgSetupOptions} from './modules/ng-express-engine/express-engine';

declare const webpack: {
    is_prod: boolean,
    is_aot: boolean,
    is_test: boolean
};

Server.is_dev = !webpack.is_prod;
Server.is_aot = webpack.is_aot;
Server.is_test = webpack.is_test;

if (!Server.is_dev)
    enableProdMode();

let options: NgSetupOptions = {
    aot: Server.is_aot,
    bootstrap: server_module
};

export {options};

if (!Server.is_test)
    boot(options);

console.log(`Server booted with options: dev: ${Server.is_dev}, AoT: ${Server.is_aot}`);