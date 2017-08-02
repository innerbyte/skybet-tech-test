const App = require("./app").instance;
const expect = require("chai").expect;
const assert = require("chai").assert;
const sinon = require("sinon");

describe("Parser", () => {
    let setup_db_stub = null;
    let metadata_stub = null;
    let parse_metadata_stub = null;
    let connect_amqp_stub = null;
    let retrieve_data_stub = null;

    before(() => {
        App.amqp_channel = {
            sendToQueue: (q, buff, opts) => {

            }
        };

        metadata_stub = sinon.stub(App, "get_feed_metadata");
        parse_metadata_stub = sinon.stub(App, "parse_metadata");
        setup_db_stub = sinon.stub(App, "setup_db");
        connect_amqp_stub = sinon.stub(App, "connect_amqp");
        retrieve_data_stub = sinon.stub(App, "retrieve_data");
    });

    after(() => {
        setup_db_stub.restore();
        metadata_stub.restore();
        parse_metadata_stub.restore();
        connect_amqp_stub.restore();
        retrieve_data_stub.restore();
    });

    it("should try to connect to MongoDB", async () => {
        await App.start();

        assert(setup_db_stub.calledOnce, "setup_db was not called");
    });

    it("should try to connect to RabbitMQ", async () => {
        assert(connect_amqp_stub.calledOnce, "connect_amqp was not called");
    });

    it("should try to retrieve metadata", async () => {
        assert(metadata_stub.calledOnce, "get_feed_metadata was not called");
    });

    it("should try to parse metadata", async () => {
        assert(parse_metadata_stub.calledOnce, "parse_metadata was not called");
    });
});