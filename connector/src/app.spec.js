const _App = require("./app");
const expect = require("chai").expect;
const assert = require("chai").assert;
const sinon = require("sinon");

describe("Connector", () => {
    let App = null;
    let connect_amqp_stub = null;
    let retrieve_data_stub = null;

    before(() => {
        App = new _App();

        App.amqp_channel = {
            sendToQueue: (q, buff, opts) => {

            }
        };

        connect_amqp_stub = sinon.stub(App, "connect_amqp");
        retrieve_data_stub = sinon.stub(App, "retrieve_data");
    });

    after(() => {
        connect_amqp_stub.restore();
        retrieve_data_stub.restore();
    });

    it("should try to connect to RabbitMQ", async () => {
        await App.start();

        assert(connect_amqp_stub.calledOnce, "connect_amqp was not called once");
    });

    it("should produce the entire packet", () => {
        const packet = "1|2|3|4|5\n";

        let send_queue_spy = sinon.spy(App.amqp_channel, "sendToQueue");

        App.parse_data(packet);

        assert(send_queue_spy.called, "The packet was not produced");
        assert.equal(packet.slice(0, packet.length - 1), send_queue_spy.getCall(0).args[1].toString(), "App did not produce the provided packet");

        expect(App.chunk_tmp).to.be.null;

        send_queue_spy.restore();
    });

    it("should produce the chunked packet", () => {
        const packet1 = "1|2|";
        const packet2 = "3|4|5\n";
        
        const packet_full = packet1 + packet2;

        let send_queue_spy = sinon.spy(App.amqp_channel, "sendToQueue");

        App.parse_data(packet1);

        assert(!send_queue_spy.called, "The packet should not produce chunked data");

        expect(App.chunk_tmp).to.equal(packet1);

        App.parse_data(packet2);

        assert(send_queue_spy.called, "The packet was not produced");
        
        assert.equal(packet_full.slice(0, packet_full.length - 1), send_queue_spy.getCall(0).args[1].toString(), "App did not produce the provided packet");

        expect(App.chunk_tmp).to.be.null;

        send_queue_spy.restore();
    });
});