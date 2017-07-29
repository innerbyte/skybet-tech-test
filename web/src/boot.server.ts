'use strict';

import { Server } from './server/server';
import * as  cluster from 'cluster';
import {ngExpressEngine, NgSetupOptions} from './modules/ng-express-engine/express-engine';

export async function boot(options: NgSetupOptions) {
    if(cluster.isMaster && !Server.is_dev) {
        console.log("setting up " + Server.num_cpus + " workers");

        for(let i = 0; i < Server.num_cpus; ++i) {
            cluster.fork();
        }

        cluster.on("online", (worker) => {
            console.log("worker " + worker.process.pid + " is now online");
        });

        cluster.on('exit', (worker, code, signal) => {
            console.log('worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
            console.log("starting a new worker...");

            // spawn another worker when one dies
            cluster.fork();
        });
    } else {
        Server.app.engine('html', ngExpressEngine(options));

        await Server.init();
    }
}
