/**
 * Created by vlad on 05/06/17.
 */

import {Shared} from "./shared.spec";
import * as request from "request";
import {AgentsService} from "../agents-service.spec";
import {IResponse} from "../../shared/interfaces/i-response";
import {IAgent} from "../../shared/interfaces/i-agent";
import {Agent} from "../../app/shared/models/agent";

describe("Auth testing:", () => {
    beforeAll(() => {

    });

    describe("GET without access", () => {
       describe("/agents /users /buildings", ()=> {
          it("should have 403 status", (done) => {
              request.get({
                  "url": `${AgentsService.url}/agents`
              }, (err, resp, body) => {
                  expect(err).toBeDefined();
                  expect(resp.statusCode).toBe(200);
                  done();
              });
          });

           it("should have 403 status", (done) => {
               request.get({
                   "url": `${AgentsService.url}/users`
               }, (err, resp, body) => {
                   expect(err).toBeDefined();
                   expect(resp.statusCode).toBe(200);
                   done();
               });
           });

           it("should have 403 status", (done) => {
               request.get({
                   "url": `${AgentsService.url}/buildings`
               }, (err, resp, body) => {
                   expect(err).toBeDefined();
                   expect(resp.statusCode).toBe(200);
                   done();
               });
           });
       });

       describe("Unauthorised API access", () => {
            describe("agents module", () => {
                it("should throw 403" , (done) => {
                    AgentsService.get("/api/agents").subscribe((res: IResponse) => {
                            expect(res).toBeDefined();
                            expect(res.status).toBe(403);
                            done();
                        },
                        (err) => {
                            done();
                            console.log(`err is: ${err}`);
                        });
                });
            });

           describe("users module", () => {
               it("should throw 403" , (done) => {
                   AgentsService.get("/api/users").subscribe((res: IResponse) => {
                           expect(res).toBeDefined();
                           expect(res.status).toBe(403);
                           done();
                       },
                       (err) => {
                           done();
                           console.log(`err is: ${err}`);
                       });
               });
           });

           describe("buildings module", () => {
               it("should throw 403" , (done) => {
                   AgentsService.get("/api/buildings").subscribe((res: IResponse) => {
                           expect(res).toBeDefined();
                           expect(res.status).toBe(403);
                           done();
                       },
                       (err) => {
                           done();
                           console.log(`err is: ${err}`);
                       });
               });
           });
       });
    });

    describe("GET /login", () => {
        it("should have 200 status, body and no error", (done) => {
            request.get({
                "url": `${Shared.agents_url}/login`
            }, (err, resp, body) => {
                expect(err).toBeNull();
                expect(resp.statusCode).toBe(200);
                expect(body).toBeDefined();
                done();
            });
        });
    });

    describe("Login", () => {
       describe("Wrong login", () => {
          it("should not log in", (done) => {
              let agent: IAgent = {
                  email: "vlad@innerbyte.uk",
                  password: "vlad2"
              };

              AgentsService.post("/api/login", agent).subscribe((res: IResponse) => {
                      expect(res).toBeDefined();
                      expect(res.status).toBe(401);
                      done();
                  },
                  (err) => {
                      done();
                      console.log(`err is: ${err}`);
                  });
          });
       });

        describe("Valid login", () => {
            let agent: IAgent = {
                email: "vlad@innerbyte.uk",
                password: "vlad"
            };

            it("should be a valid log in", (done) => {
                AgentsService.post("/api/login", agent).subscribe((res: IResponse) => {
                        expect(res).toBeDefined();
                        expect(res.status).toBe(200);

                        agent = res.data;
                        AgentsService.agent = new Agent(agent);;

                        done();
                    },
                    (err) => {
                        done();
                        console.log(`err is: ${err}`);
                    });
            });

            it("should change password", (done) => {
                agent.old_password = "vlad";
                agent.password = "vlad";

                AgentsService.patch(`/api/agents/${agent._id}/password`, agent).subscribe((res: IResponse) => {
                        expect(res).toBeDefined();
                        expect(res.status).toBe(200);

                        let agent = new Agent(res.data);
                        AgentsService.agent = Object.assign({}, agent);

                        done();
                    },
                    (err) => {
                        done();
                        console.log(`err is: ${err}`);
                    });
            });

            it("should have 200 status", (done) => {
                request.get({
                    "url": `${AgentsService.url}/home`
                }, (err, resp, body) => {
                    expect(err).toBeDefined();
                    expect(resp.statusCode).toBe(200);
                    done();
                });
            });
        });
    });
});