/**
 * Created by vlad on 12/06/17.
 */


import {AgentsService} from "../agents-service.spec";
import {Agent} from "../../app/shared/models/agent";
import {IResponse} from "../../shared/interfaces/i-response";
import {IAgent} from "../../shared/interfaces/i-agent";
import * as request from "request";
import {IPagination} from "../../shared/interfaces/i-pagination";
import {IBuilding} from "../../shared/interfaces/i-building";


describe("buildings module", () => {
    beforeAll((done) => {
            // login
        let agent: IAgent = {
            email: "vlad@innerbyte.uk",
            password: "vlad"
        };

        AgentsService.post("/api/login", agent).subscribe((res: IResponse) => {
                let agent = new Agent(res.data);
                AgentsService.agent = Object.assign({}, agent);

                done();
            },
            (err) => {
                done();
                console.log(`err is: ${err}`);
            });
    });

    describe("listing", () => {
        it("should return buildings list status 200 and body", (done) => {
            request.get({
                "url": `${AgentsService.url}/buildings`
            }, (err, resp, body) => {
                expect(err).toBeDefined();
                expect(resp.statusCode).toBe(200);
                done();
            });
        });

        it("should return 0 buildings", (done) => {
            let qs = {
                offset: 0,
                limit: 25,
                filter: null,
                sort_field: "name",
                sort_order: 1
            };

            AgentsService.get("/api/buildings", {qs: qs}).subscribe((res: IResponse) => {
                    expect(res).toBeDefined();
                    expect(res.status).toBe(200);

                    let list: IBuilding[] = res.data;
                    let pagination: IPagination = res.pagination;

                    expect(list).toBeDefined();
                    expect(list.length).toBe(0);

                    done();
                },
                (err) => {
                    done();
                    console.log(`err is: ${err}`);
                });
        });
    });

    describe("new building", () => {
        let building: IBuilding = {};

        it("should return 200 and create a new  building", (done) => {
            building = {
                name: "test building",
                slug: "test-building"
            };

            AgentsService.post("/api/buildings", building).subscribe((res: IResponse) => {
                    expect(res).toBeDefined();
                    expect(res.status).toBe(200);

                    building = res.data;

                    done();
                },
                (err) => {
                    done();
                    console.log(`err is: ${err}`);
                });
        });

        it("should return 200 and get body", (done) => {
            request.get({
                "url": `${AgentsService.url}/buildings/${building._id}`
            }, (err, resp, body) => {
                expect(err).toBeDefined();
                expect(resp.statusCode).toBe(200);
                done();
            });
        });

        it("should return 200 and get building details", (done) => {
            AgentsService.get(`/api/buildings/${building._id}`).subscribe((res: IResponse) => {
                    expect(res).toBeDefined();
                    expect(res.status).toBe(200);

                    done();
                },
                (err) => {
                    done();
                    console.log(`err is: ${err}`);
                });
        });

        it("should return 200 and update building name", (done) => {
            AgentsService.patch(`/api/buildings/${building._id}/name`, building).subscribe((res: IResponse) => {
                    expect(res).toBeDefined();
                    expect(res.status).toBe(200);

                    building = res.data;

                    done();
                },
                (err) => {
                    done();
                    console.log(`err is: ${err}`);
                });
        });

        it("should return 200 and update building content", (done) => {
            building.content = {
                features: "feature 1",
                amenities: "amenities 1",
                description: "description"
            };

            building.done = {
                description: true,
                meta: true,
                media: true,
                floorplans: true,
                features: true,
                amenities: true,
            };

            AgentsService.patch(`/api/buildings/${building._id}/content`, building).subscribe((res: IResponse) => {
                    expect(res).toBeDefined();
                    expect(res.status).toBe(200);

                    building = res.data;

                    done();
                },
                (err) => {
                    done();
                    console.log(`err is: ${err}`);
                });
        });

        it("should return 200 and update building meta", (done) => {
            building.meta = {
                title: "title",
                description: "description"
            };

            AgentsService.patch(`/api/buildings/${building._id}/meta`, building).subscribe((res: IResponse) => {
                    expect(res).toBeDefined();
                    expect(res.status).toBe(200);

                    building = res.data;

                    done();
                },
                (err) => {
                    done();
                    console.log(`err is: ${err}`);
                });
        });

        it("should return 200 and update building team", (done) => {
            building.team = {
                interiors: "interiors",
                public_spaces: "public spaces",
                architect: "arch",
                developer: "developer"
            };

            AgentsService.patch(`/api/buildings/${building._id}/team`, building).subscribe((res: IResponse) => {
                    expect(res).toBeDefined();
                    expect(res.status).toBe(200);

                    building = res.data;

                    done();
                },
                (err) => {
                    done();
                    console.log(`err is: ${err}`);
                });
        });

        it("should return 200 and find address", (done) => {
            building.address = {
                formatted: "2 Whimberry Close, M5 3WL, England"
            };

            AgentsService.post(`/api/buildings/${building._id}/address/find`, building).subscribe((res: IResponse) => {
                    expect(res).toBeDefined();
                    expect(res.status).toBe(200);

                    building = res.data;

                    done();
                },
                (err) => {
                    done();
                    console.log(`err is: ${err}`);
                });
        });

        it("should return 200 and update address", (done) => {
            AgentsService.patch(`/api/buildings/${building._id}/address`, building).subscribe((res: IResponse) => {
                    expect(res).toBeDefined();
                    expect(res.status).toBe(200);

                    building = res.data;

                    done();
                },
                (err) => {
                    done();
                    console.log(`err is: ${err}`);
                });
        });
    });
});
