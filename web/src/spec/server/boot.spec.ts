/**
 * Created by vlad on 05/06/17.
 */

import {options} from "../../main.server";
import {boot} from "../../boot.server";


// close server
describe("starting testing. server", () => {
    it("should boot", async (done) => {
        await boot(options);
        expect(true).toBe(true);
        done();
    });
});