import * as request from "request";

const URL = "http://localhost:8585";

describe("Web testing:", () => {
    beforeAll(() => {

    });

    describe("GET /home", () => {
        it("should have 200 status, body and no error", (done) => {
            request.get({
                "url": `${URL}/home`
            }, (err, resp, body) => {
                expect(err).toBeNull();
                expect(resp.statusCode).toBe(200);
                expect(body).toBeDefined();
                done();
            });
        });
    });
});