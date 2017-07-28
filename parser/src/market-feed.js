"use strict"

const Feed = require("./feed");
const cfg = require("./config/config");
const mongo = require("mongodb");

class MarketFeed extends Feed {
    _properties() {
        super._properties();

        this._id = null;
        this.event_id = null;
        this.name = null;
        this.displayed = null;
        this.suspended = null;
    }

    constructor(app) {
        super(app);
    }

    async init(fields) {
        super.init(fields);

        this._id = (fields.get(cfg.constants.fields.MARKET_ID));
        this.event_id = (fields.get(cfg.constants.fields.EVENT_ID));
        this.name = fields.get(cfg.constants.fields.NAME);

        if (!this.name)
            return;

        this.name = this.name.replace(/\\\|/g , "");

        this.displayed = parseInt(fields.get(cfg.constants.fields.DISPLAYED)) === 1;
        this.suspended = parseInt(fields.get(cfg.constants.fields.SUSPENDED)) === 1;

        if (this.operation == cfg.constants.operations.CREATE)
            await this.create();
        else
            await this.update();
    }

    async create() {
        let col = this.app.db.collection("events");
        await col.updateOne({
            "_id": this.event_id
        },
        {
            $push: {
                "markets": {
                    "_id": this._id,
                    "name": this.name,
                    "displayed": this.displayed,
                    "suspended": this.suspended
                }
            }
        });

        await col.createIndex({ "markets._id": 1 });
    }

    async update() {
        let col = this.app.db.collection("events");
        await col.updateOne({
            "_id": this.event_id,
            "markets._id": this._id
        },
        {
            $set: {
                "markets.$": {
                    "_id": this._id,
                    "name": this.name,
                    "displayed": this.displayed,
                    "suspended": this.suspended
                }
            }
        });
    }
}

module.exports = MarketFeed;