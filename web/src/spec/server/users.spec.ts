import {AgentsService} from "../agents-service.spec";
import {IResponse} from "../../shared/interfaces/i-response";
import {IPagination} from "../../shared/interfaces/i-pagination";
import * as request from "request";
import {IUser} from "../../shared/interfaces/i-user";


/**
 * Created by vlad on 11/06/17.
 */

describe("users module", () => {
    describe("listing", () => {
        it("should return status 200 and body", (done) => {
            request.get({
                "url": `${AgentsService.url}/users`
            }, (err, resp, body) => {
                expect(err).toBeDefined();
                expect(resp.statusCode).toBe(200);
                done();
            });
        });

        it("should return 0 users", (done) => {
            let qs = {
                offset: 0,
                limit: 25,
                filter: null,
                sort_field: "email",
                sort_order: 1
            };

            AgentsService.get("/api/users", {qs: qs}).subscribe((res: IResponse) => {
                    expect(res).toBeDefined();
                    expect(res.status).toBe(200);

                    let user_list: IUser[] = res.data;
                    let pagination: IPagination = res.pagination;

                    expect(user_list).toBeDefined();
                    expect(user_list.length).toBe(0);

                    done();
                },
                (err) => {
                    done();
                    console.log(`err is: ${err}`);
                });
        });
    });

    describe("new user", () => {
        let new_user: IUser = null;

        it("should return 200 and create new user details", (done) => {
            let user: IUser = {
                first_name: "Vlad",
                last_name: "Isan",
                email: "vlad@innerbyte.uk"
            };

            AgentsService.post("/api/users", user).subscribe((res: IResponse) => {
                    expect(res).toBeDefined();
                    expect(res.status).toBe(200);

                    new_user = res.data;

                    done();
                },
                (err) => {
                    done();
                    console.log(`err is: ${err}`);
                });
        });

        it("should return 200 and update user details", (done) => {
            new_user.first_name = "Vlad2";

            AgentsService.patch(`/api/users/${new_user._id}`, new_user).subscribe((res: IResponse) => {
                    expect(res).toBeDefined();
                    expect(res.status).toBe(200);

                    new_user = res.data;

                    expect(new_user.first_name).toBe("Vlad2");

                    done();
                },
                (err) => {
                    done();
                    console.log(`err is: ${err}`);
                });
        });

        it("should return status 200 and body", (done) => {
            request.get({
                "url": `${AgentsService.url}/users/${new_user._id}`
            }, (err, resp, body) => {
                expect(err).toBeDefined();
                expect(resp.statusCode).toBe(200);
                done();
            });
        });

        it("should return 200 and new user details", (done) => {
            AgentsService.get(`/api/agents/${new_user._id}`).subscribe((res: IResponse) => {
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