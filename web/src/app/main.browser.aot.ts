
import 'zone.js/dist/zone';
import 'reflect-metadata';

import {enableProdMode} from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';
import { BrowserAppModuleNgFactory } from './browser-app.module.ngfactory';

enableProdMode();

platformBrowser().bootstrapModuleFactory(BrowserAppModuleNgFactory);