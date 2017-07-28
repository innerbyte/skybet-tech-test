"use strict"

const Feed = require("./feed");
const cfg = require("./config/config");
const mongo = require("mongodb");

class EventFeed extends Feed {
    _properties() {
        super._properties();

        this._id = null;
        this.cat = null;
        this.sub_cat = null;
        this.name = null;
        this.start_time = null;
        this.displayed = null;
        this.suspended = null;
    }

    constructor(app) {
        super(app);
    }

    async init(fields) {
        super.init(fields);

        this._id = (fields.get(cfg.constants.fields.EVENT_ID));
        this.cat = fields.get(cfg.constants.fields.CATEGORY);
        this.sub_cat = fields.get(cfg.constants.fields.SUB_CATEGORY);
        this.name = fields.get(cfg.constants.fields.NAME);

        if (!this.name)
            return;

        this.name = this.name.replace(/\\\|/g , "");

        this.start_time = new Date(parseInt(fields.get(cfg.constants.fields.START_TIME)));

        this.displayed = parseInt(fields.get(cfg.constants.fields.DISPLAYED)) === 1;
        this.suspended = parseInt(fields.get(cfg.constants.fields.SUSPENDED)) === 1;

        if (this.operation == cfg.constants.operations.CREATE)
            await this.create();
        else
            await this.update();
    }

    async create() {
        let col = this.app.db.collection("events");
        await col.insertOne({
            "_id": this._id,
            "cat": this.cat,
            "sub_cat": this.sub_cat,
            "name": this.name,
            "start_time": this.start_time,
            "displayed": this.displayed,
            "suspended": this.suspended,
            "markets": [],
            "outcomes": []
        });

        await col.createIndex({ "cat": 1 });
        await col.createIndex({ "sub_cat": 1 });
    }

    async update() {
        let col = this.app.db.collection("events");
        await col.updateOne({
            "_id": this._id
        },
        {
            $set: {
                "cat": this.cat,
                "sub_cat": this.sub_cat,
                "name": this.name,
                "start_time": this.start_time,
                "displayed": this.displayed,
                "suspended": this.suspended
            }
        });
    }
}

module.exports = EventFeed;