
import 'zone.js/dist/zone';
import 'reflect-metadata';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAppModule } from './browser-app.module';

platformBrowserDynamic().bootstrapModule(BrowserAppModule);