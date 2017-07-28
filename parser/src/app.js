"use strict"

const cfg = require("./config/config");
const EOL = require("os").EOL;
const net = require("net");
const amqp = require("amqplib");
const request = require("request");
const parse_string = require("xml2js").parseString;
const Packet = require("./packet");
const mongo = require("mongodb");

class _App {
    _properties() {
        this.is_dev = (process.env.NODE_ENV === "dev");
        
        this.db = null;
        this.mongo_url = null;
        this.metadata_url = null;

        this.amqp_url = null;
        this.amqp_conn = null;
        this.amqp_channel = null;
        this.amqp_q = null;

        this.metadata = new Map();
    }

    constructor() {
        this._properties();
        this.load_cfg();
    }

    async start() {
        console.log(`Parser launched with: ${this.is_dev ? "dev" : "release"}`);

        await this.setup_db();

        let metadata = await this.get_feed_metadata();
        await this.parse_metadata(metadata);

        await this.connect_amqp();
    }

    load_cfg() {
        this.amqp_url = cfg.get_amqp_url(this.is_dev);
        this.amqp_q = cfg.amqp_queue;

        this.mongo_url = cfg.get_mongo_url(this.is_dev);
        this.metadata_url = cfg.get_provider_metadata_url(this.is_dev);
    }

    setup_db() {
        return new Promise(async (resolve, reject) => {
            console.log(`Connecting to mongodb on ${this.mongo_url}...`);

            try {
                this.db = await mongo.MongoClient.connect(this.mongo_url);

                resolve(true);

                console.log(`Successfully connected to MongoDB on ${this.mongo_url}!`);
            } catch (err) {
                console.log(`MongoDB connection error: ${err}`);
                setTimeout(() => { this.setup_db(); }, 3000);
            }
        });
    }

    get_feed_metadata() {
        return new Promise((resolve, reject) => {
            request(this.metadata_url, (error, res, body) => {
                if (!error && res.statusCode == 200) {
                    resolve(body);
                } else {
                    reject(error);
                }
            });
        });
    }

    parse_metadata(metadata) {
        return new Promise((resolve, reject) => {
            parse_string(metadata, { explicitArray: false, mergeAttrs: true }, (err, data) => {
                if (err)
                    reject(err)
                else {
                    this.metadata = new Map();

                    for (let type in cfg.constants.types) {
                        let met_type    = data.types[cfg.constants.types[type]];
                        let met_fields  = met_type.header.field.concat(met_type.body.field);

                        let fields = new Map();

                        for (let field in cfg.constants.fields) {
                            let met_field = met_fields.find((v) => {
                                return v.name === cfg.constants.fields[field];
                            });

                            if (!met_field)
                                continue;

                            fields.set(cfg.constants.fields[field], parseInt(met_field.index));
                        }

                        this.metadata.set(cfg.constants.types[type], fields);
                    }

                    resolve(true);
                }
            });
        });
    }

    async connect_amqp() {
        try {
            this.amqp_conn = await amqp.connect(this.amqp_url);
        } catch (err) {
            console.error(`amqp Connection error: ${err}`);
            console.log("Retrying...");

            setTimeout(() => { this.connect_amqp(); }, 3000);
            return;
        }

        console.log(`Parser connected to RabbitMQ: ${this.amqp_url}`);

        try {
            this.amqp_channel = await this.amqp_conn.createChannel();
            await this.amqp_channel.assertQueue(this.amqp_q, { durable: false });
            await this.amqp_channel.prefetch(1);
        } catch(err) {
            console.error(err);
        }

        // ready to retrieve data
        await this.retrieve_messages();
    }

    /**
     * 
     * @param {string} data 
     */
    async retrieve_messages() {
        this.amqp_channel.consume(this.amqp_q, async (msg) => {
            let pack = new Packet(this.metadata, msg.content.toString());
            await pack.parse_message(this);
            
            this.amqp_channel.ack(msg);
        }, { noAck: false });
    }
}

let App = new _App();

module.exports = {
    instance: App
};