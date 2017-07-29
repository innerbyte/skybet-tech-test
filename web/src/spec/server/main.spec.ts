/**
 * Created by vlad on 05/06/17.
 */

import {Server} from "../../server/server";

// setup && specs
import "./shared.spec";
import "./boot.spec";
import "./auth.spec";
import "./agents.spec";
import "./users.spec";




// closing down
describe("closing... server", () => {
    it("should not be listening", () => {
        Server.close();
        expect(Server.server.listening).toBe(false);
    });
});