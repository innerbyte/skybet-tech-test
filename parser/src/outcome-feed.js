"use strict"

const Feed = require("./feed");
const cfg = require("./config/config");
const mongo = require("mongodb");

class OutcomeFeed extends Feed {
    _properties() {
        super._properties();

        this._id = null;
        this.market_id = null;
        this.name = null;
        this.price = null;
        this.displayed = null;
        this.suspended = null;
    }

    constructor(app) {
        super(app);
    }

    async init(fields) {
        super.init(fields);

        this._id = (fields.get(cfg.constants.fields.OUTCOME_ID));
        this.market_id = (fields.get(cfg.constants.fields.MARKET_ID));
        this.name = fields.get(cfg.constants.fields.NAME);

        if (!this.name)
            return;

        this.name = this.name.replace(/\\\|/g , "");

        this.price = fields.get(cfg.constants.fields.PRICE);
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
            "markets": {
                $elemMatch: {
                    "_id": this.market_id
                }
            }
        },
        {
            $push: {
                "outcomes": {
                    "_id": this._id,
                    "name": this.name,
                    "price": this.price,
                    "displayed": this.displayed,
                    "suspended": this.suspended
                }
            }
        });

        await col.createIndex({ "outcomes._id": 1 });
    }

    async update() {
        let col = this.app.db.collection("events");
        await col.updateOne({
            "markets": {
                $elemMatch: {
                    "_id": this.market_id
                }
            },
            "outcome": {
                $elemMatch: {
                    "_id": this._id
                }
            }
        },
        {
            $set: {
                "outcomes.$": {
                    "_id": this._id,
                    "name": this.name,
                    "price": this.price,
                    "displayed": this.displayed,
                    "suspended": this.suspended
                }
            }
        });
    }
}

module.exports = OutcomeFeed;