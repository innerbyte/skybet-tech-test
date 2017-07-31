"use strict"

const cfg = require("./config/config");

class Feed {
    _properties() {
        this.app = null;

        this.msg_id = null;
        this.operation = null;
        this.type = null;
        this.timestamp = null;
    }

    constructor(app) {
        this._properties();
        this.app = app;
    }

    async init(fields) {
        this.msg_id = parseInt(fields.get(cfg.constants.fields.MSG_ID));
        this.operation = fields.get(cfg.constants.fields.OPERATION);
        this.timestamp = new Date(parseInt(fields.get(cfg.constants.fields.TIMESTAMP)));
        this.type = fields.get(cfg.constants.fields.TYPE);
    }
}

module.exports = Feed;