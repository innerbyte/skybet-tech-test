"use strict"

const cfg = require("./config/config");
const EOL = require("os").EOL;
const net = require("net");
const amqp = require("amqplib");

class App {
    _properties() {
        this.is_dev = (process.env.NODE_ENV === "dev");
        this.tcp_server = null;
        this.amqp_url = null;
        this.chunk_tmp = null;

        this.amqp_conn = null;
        this.amqp_channel = null;
        this.amqp_q = null;
    }

    constructor() {
        this._properties();
        this.load_cfg();
    }

    async start() {
        console.log(`Connector launched with: ${this.is_dev ? "dev" : "release"}`);

        await this.connect_amqp();
    }

    load_cfg() {
        this.tcp_server = cfg.get_provider_tcp(this.is_dev);
        this.amqp_url = cfg.get_amqp_url(this.is_dev);
        this.amqp_q = cfg.amqp_queue;
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

        console.log(`Connector connected to RabbitMQ: ${this.amqp_url}`);

        try {
            this.amqp_channel = await this.amqp_conn.createChannel();
            await this.amqp_channel.assertQueue(this.amqp_q, { durable: false });
        } catch(err) {
            console.error(err);
        }

        // ready to retrieve data
        this.retrieve_data();
    }

    retrieve_data() {
        let client = new net.createConnection(this.tcp_server.port, this.tcp_server.host, () => {
            console.log("Connected to TCP server!");
        });
        
        client.setEncoding("utf8");

        client.on("data", (data) => {
            this.parse_data(data);
        });

        client.on("error", (e) => {
            console.error(e);
            
            if (!client.destroyed) {
                client.end();
                client.destroy();
            }

            console.log("Retrying...");

            setTimeout(() => { this.retrieve_data(); }, 3000);
        });

        client.on("end", (had_error) => {
            console.log("ON END!");
        });

        client.on("close", (had_error) => {
            console.log("Connection closed!");

            if (this.amqp_conn)
                this.amqp.close();
        });
    }

    /**
     * 
     * @param {string} packet 
     */
    parse_data(packet) {
        let data = packet.toString();

        if (data.length === 0)
            return;

        // check if we have chunked data
        let is_chunk = data.charAt(data.length - 1) !== EOL;
        let list = data.split(EOL);

        if (list.length === 0 || list[0] == data) {
            this.chunk_tmp = (this.chunk_tmp || "") + data;
            return;
        }

        // append prev chunk
        if (this.chunk_tmp !== null) {
            if (list.length > 1 || !is_chunk) {
                list[0] = this.chunk_tmp + list[0];
                this.chunk_tmp = null;
            } else {
                this.chunk_tmp += list.splice(0, 1);
            }
        }

        // process items
        for (let item of list) {
            if (item.trim() === "")
                continue;

            try {
                this.amqp_channel.sendToQueue(this.amqp_q, new Buffer(item), { persistent: true });
            } catch(err) {
                console.error(err);
            }
        }
    }
}

module.exports = App;