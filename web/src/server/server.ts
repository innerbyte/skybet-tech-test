"use strict";

import * as http from 'http';
import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as mongo from 'mongodb';

import config from '../config/config';

import {router as events_router} from './routes/events-router';

class _Server {
    public config: any;
    public app: express.Application;
    public server: http.Server;
    public is_dev: boolean = false;
    public is_aot: boolean = false;
    public is_test: boolean = false;
    public num_cpus: number = 1;
    public db: mongo.Db;
    public root_path: string = path.resolve(__dirname, '../../');

    constructor() {
        this.config = config;
        this.app = express();
        this.num_cpus = os.cpus().length;
    }

    public async init() {
        this.setup_routes();
        this.setup_middleware();
        await this.setup_db();

        this.server = http.createServer(this.app);
        this.server.listen(this.config.port);

        console.log(`server listening on port ${this.config.port}`);
    }

    private setup_middleware(): void {
        this.app.set('view engine', 'html');
        this.app.set('views', './dist');

        this.app.use(events_router);
    }

    private setup_routes(): void {
        this.setup_static_routes();
    }

    private setup_static_routes(): void {
        this.app.use(express.static(path.join(this.root_path, 'dist')));
    }

    setup_db() {
        return new Promise(async (resolve, reject) => {
            let url     = this.config.get_mongo_cfg(this.is_dev, this.is_test);

            console.log(`Connecting to mongodb on ${url}...`);

            try {
                this.db = await mongo.MongoClient.connect(url);

                resolve(true);

                console.log(`Successfully connected to MongoDB on ${url}!`);
            } catch (err) {
                console.log(`MongoDB connection error: ${err}`);
                setTimeout(() => { this.setup_db(); }, 3000);
            }
        });
    }

    public close() {
        console.log("server is shutting down...");
        this.server.close();
        this.db.close();
        console.log("server shutdown complete");
    }
}

let Server = new _Server();

export { Server };
