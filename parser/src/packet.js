"use strict"

const cfg = require("./config/config");

const EventFeed = require("./event-feed");
const MarketFeed = require("./market-feed");
const OutcomeFeed = require("./outcome-feed");

class Packet {
    _properties() {
        this.metadata = null;
        this.message = null;
    }

    constructor(metadata, message) {
        this._properties();

        this.metadata = metadata;
        this.message = message;
    }

    async parse_message(app) {
        let chunks = this.message.match(/((?:[^\\|]+|\\\|?)+)/g);

        if (!chunks)
            return false;

        let feed_type_index = this.metadata.get(cfg.constants.types.EVENT).get(cfg.constants.fields.TYPE);

        if (feed_type_index >= chunks.length)
            return false;

        let feed_type_name = chunks[feed_type_index];
        let FeedType = null;

        switch (feed_type_name) {
            case cfg.constants.types.EVENT:
                FeedType = EventFeed;
            break;
            case cfg.constants.types.MARKET:
                FeedType = MarketFeed;
            break;
            case cfg.constants.types.OUTCOME:
                FeedType = OutcomeFeed;
            break;
        }

        if (!FeedType)
            return;

        let feed = new FeedType(app);

        let metadata_type = this.metadata.get(feed_type_name);
        let fields = new Map();

        for (let field in cfg.constants.fields) {
            let index = metadata_type.get(cfg.constants.fields[field]);

            if (index >= chunks.length)
                continue;

            fields.set(cfg.constants.fields[field], chunks[index]);
        }
        try {
            await feed.init(fields);
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = Packet;