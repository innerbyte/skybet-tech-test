"use strict"

let config = {
    get_provider_tcp(is_dev) {
        let host = is_dev ? "127.0.0.1" : "provider";
        let port = 8282;

        return { host, port };
    },
    get_amqp_url(is_dev) {
        let host = is_dev ? "127.0.0.1" : "rabbitmq";
        let port = 5672;
        
        return `amqp://${host}:${port}`;
    },
    get amqp_queue() {
        return "skybet";
    }
}

module.exports = config;