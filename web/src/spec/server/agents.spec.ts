import {AgentsService} from "../agents-service.spec";
import {IResponse} from "../../shared/interfaces/i-response";
import {IAgent} from "../../shared/interfaces/i-agent";
import {IPagination} from "../../shared/interfaces/i-pagination";
import {Agent} from "../../app/shared/models/agent";
import {AgentScopes} from "../../shared/enums/agent-scopes";
import * as request from "request";
/**
 * Created by vlad on 11/06/17.
 */

describe("agents module", () => {
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
        it("should return agents list status 200 and body", (done) => {
            request.get({
                "url": `${AgentsService.url}/agents`
            }, (err, resp, body) => {
                expect(err).toBeDefined();
                expect(resp.statusCode).toBe(200);
                done();
            });
        });

        it("should return /me and status 200 and body", (done) => {
            request.get({
                "url": `${AgentsService.url}/me`
            }, (err, resp, body) => {
                expect(err).toBeDefined();
                expect(resp.statusCode).toBe(200);
                done();
            });
        });

        it("should return 1 agent", (done) => {
            let qs = {
                offset: 0,
                limit: 25,
                filter: null,
                sort_field: "email",
                sort_order: 1
            };

            AgentsService.get("/api/agents", {qs: qs}).subscribe((res: IResponse) => {
                    expect(res).toBeDefined();
                    expect(res.status).toBe(200);

                    let agent_list: IAgent[] = res.data;
                    let pagination: IPagination = res.pagination;

                    expect(agent_list).toBeDefined();
                    expect(agent_list.length).toBe(1);

                    done();
                },
                (err) => {
                    done();
                    console.log(`err is: ${err}`);
                });
        });
    });

    describe("new agent", () => {
        let new_agent: Agent = null;

        it("should return 200 and create new agent details", (done) => {
            let agent: IAgent = {
                first_name: "Vlad",
                last_name: "Isan",
                email: "vlad.isan@innerbytesolutions.com",
                mobile: "+44 7769 991 822",
                scopes: [AgentScopes.USERS, AgentScopes.FLOORPLANS, AgentScopes.AGENTS, AgentScopes.MEDIA, AgentScopes.CONTENT, AgentScopes.META]
            };

            AgentsService.post("/api/agents", agent).subscribe((res: IResponse) => {
                    expect(res).toBeDefined();
                    expect(res.status).toBe(200);

                    new_agent = new Agent(res.data);

                    done();
                },
                (err) => {
                    done();
                    console.log(`err is: ${err}`);
                });
        });

        it("should return 200 and get body", (done) => {
            request.get({
                "url": `${AgentsService.url}/agents/${new_agent._id}/validate/${new_agent.validation.code}`
            }, (err, resp, body) => {
                expect(err).toBeDefined();
                expect(resp.statusCode).toBe(200);
                done();
            });
        });

        it("should return 200 and validate account", (done) => {
            new_agent.password = "vlad";
            new_agent.old_password = "vlad";

            AgentsService.patch(`/api/agents/${new_agent._id}/validate/${new_agent.validation.code}`, new_agent).subscribe((res: IResponse) => {
                    expect(res).toBeDefined();
                    expect(res.status).toBe(200);

                    new_agent = new Agent(res.data);

                    done();
                },
                (err) => {
                    done();
                    console.log(`err is: ${err}`);
                });
        });

        it("should return 200 and send forget email", (done) => {
            AgentsService.patch(`/api/agents/${AgentsService.agent._id}/forget`, AgentsService.agent).subscribe((res: IResponse) => {
                    expect(res).toBeDefined();
                    expect(res.status).toBe(200);

                    let jwt = AgentsService.agent.jwt;
                    AgentsService.agent = new Agent(res.data);
                    AgentsService.agent.jwt = jwt;

                    done();
                },
                (err) => {
                    done();
                    console.log(`err is: ${err}`);
                });
        });

        it("should return 200 and get body", (done) => {
            request.get({
                "url": `${AgentsService.url}/agents/${AgentsService.agent._id}/reset/${AgentsService.agent.reset.code}`
            }, (err, resp, body) => {
                expect(err).toBeDefined();
                expect(resp.statusCode).toBe(200);
                done();
            });
        });

        it("should return 200 and reset email", (done) => {
            AgentsService.agent.password = "vlad";
            AgentsService.agent.old_password = "vlad";

            AgentsService.patch(`/api/agents/${AgentsService.agent._id}/reset/${AgentsService.agent.reset.code}`, AgentsService.agent).subscribe((res: IResponse) => {
                    expect(res).toBeDefined();
                    expect(res.status).toBe(200);

                    let jwt = AgentsService.agent.jwt;
                    AgentsService.agent = new Agent(res.data);
                    AgentsService.agent.jwt = jwt;

                    done();
                },
                (err) => {
                    done();
                    console.log(`err is: ${err}`);
                });
        });

        it("should return 200 and update agent details", (done) => {
            new_agent.first_name = "Vlad2";

            AgentsService.patch(`/api/agents/${new_agent._id}`, new_agent).subscribe((res: IResponse) => {
                    expect(res).toBeDefined();
                    expect(res.status).toBe(200);

                    new_agent = new Agent(res.data);

                    expect(new_agent.first_name).toBe("Vlad2");

                    done();
                },
                (err) => {
                    done();
                    console.log(`err is: ${err}`);
                });
        });

        it("should return 200 and suspend the agent", (done) => {
            AgentsService.patch(`/api/agents/${new_agent._id}/suspend`, new_agent).subscribe((res: IResponse) => {
                    expect(res).toBeDefined();
                    expect(res.status).toBe(200);

                    new_agent = new Agent(res.data);

                    done();
                },
                (err) => {
                    done();
                    console.log(`err is: ${err}`);
                });
        });

        it("should return 200 and reactivate the agent", (done) => {
            AgentsService.patch(`/api/agents/${new_agent._id}/activate`, new_agent).subscribe((res: IResponse) => {
                    expect(res).toBeDefined();
                    expect(res.status).toBe(200);

                    new_agent = new Agent(res.data);

                    done();
                },
                (err) => {
                    done();
                    console.log(`err is: ${err}`);
                });
        });

        it("should return status 200 and body", (done) => {
            request.get({
                "url": `${AgentsService.url}/agents/${new_agent._id}`
            }, (err, resp, body) => {
                expect(err).toBeDefined();
                expect(resp.statusCode).toBe(200);
                done();
            });
        });

        it("should return 200 and new agent details", (done) => {
            AgentsService.get(`/api/agents/${new_agent._id}`).subscribe((res: IResponse) => {
                    expect(res).toBeDefined();
                    expect(res.status).toBe(200);

                    done();
                },
                (err) => {
                    done();
                    console.log(`err is: ${err}`);
                });
        });

        it("should return 200 and delete agent", (done) => {
            AgentsService.delete(`/api/agents/${new_agent._id}`).subscribe((res: IResponse) => {
                    expect(res).toBeDefined();
                    expect(res.status).toBe(200);

                    done();
                },
                (err) => {
                    done();
                    console.log(`err is: ${err}`);
                });
        });
    });
});