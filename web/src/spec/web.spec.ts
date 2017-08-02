import * as supertest from "supertest";
import * as chai from "chai";

import {Server} from "../server/server";
import {options} from "../main.server";
import { boot } from '../boot.server';
import {HTTPUtility} from "../shared/utilities/http-utility";

const expect = chai.expect;
const request = supertest.agent(Server.app);

describe("Server", () => {
    let cat = null;
    let sub_cat = null;
    let event_id = null;

    before(async () => {
        await boot(options);
    });

    describe("API", () => {
        it("should return list of categories and subcategories", async () => {
            const response = await request.get("/api/categories");
            expect(response.status).to.equal(200);
            
            const list = response.body.data;

            expect(list.length).above(0);

            if (list.length > 0) {
                cat = list[0].name;
                cat = HTTPUtility.slugify(cat);

                if (list[0].sub_categories.length > 0) {
                    sub_cat = list[0].sub_categories[0];
                    sub_cat = HTTPUtility.slugify(sub_cat);
                }
            }
        });

        it("should load event list", async () => {
            if (cat && sub_cat) {
                const response = await request.get("/api/events").query({
                    cat,
                    sub_cat,
                    offset: 0,
                    limit: 50,
                    filter: "",
                    sort_field: "start_time",
                    sort_order: 1
                });

                expect(response.status).to.equal(200);
                
                const events = response.body.data;

                expect(events).to.be.not.null;
                expect(events).to.be.instanceOf(Array);

                if (events.length > 0) {
                    event_id = events[0]._id;
                }
            }
        });

        it("should load bets", async () => {
            if (event_id) {
                const response = await request.get("/api/markets").query({
                    event_id,
                    offset: 0,
                    limit: 50,
                    filter: "",
                    sort_field: "start_time",
                    sort_order: 1
                });

                expect(response.status).to.equal(200);
                
                const bets = response.body.data;

                expect(bets).to.be.not.null;
                expect(bets).to.be.instanceOf(Array);
            }
        })
    })

    describe("GET /home", () => {
        it("should return status 200", async () => {
            const response = await request.get("/home");
            expect(response.status).to.equal(200);
        });
    });
});