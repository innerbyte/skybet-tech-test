"use strict"

let config = {
    get_mongo_url(is_dev) {
        let host = is_dev ? "127.0.0.1" : "mongo";
        let port = is_dev ? "27018" : "27017";
        let db = is_dev ? "skybet-feed" : "skybet-feed";

        return `mongodb://${host}:${port}/${db}`;
    },
    get_amqp_url(is_dev) {
        let host = is_dev ? "127.0.0.1" : "rabbitmq";
        let port = 5672;
        
        return `amqp://${host}:${port}`;
    },
    get_provider_metadata_url(is_dev) {
        let host = is_dev ? "127.0.0.1" : "provider";
        let port = 8181;

        return `http://${host}:${port}/types`;
    },
    get amqp_queue() {
        return "skybet";
    },
    get constants() {
        return {
            types: {
                EVENT: "event",
                MARKET: "market",
                OUTCOME: "outcome",
            },
            operations: {
                CREATE: "create",
                UPDATE: "update"
            },
            fields: {
                MSG_ID: "msgId",
                OPERATION: "operation",
                TYPE: "type",
                TIMESTAMP: "timestamp",
                EVENT_ID: "eventId",
                MARKET_ID: "marketId",
                OUTCOME_ID: "outcomeId",
                CATEGORY: "category",
                SUB_CATEGORY: "subCategory",
                NAME: "name",
                START_TIME: "startTime",
                PRICE: "price",
                DISPLAYED: "displayed",
                SUSPENDED: "suspended"
            }
        };
    }
}

module.exports = config;