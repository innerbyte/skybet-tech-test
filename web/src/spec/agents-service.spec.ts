/**
 * Created by vlad on 11/06/17.
 */

import {BaseServiceSpec} from "./base-service.spec";
import {Agent} from "../app/shared/models/agent";

class _AgentsServiceSpec extends BaseServiceSpec {
    public agent: Agent;

    constructor() {
        super();

        this.url = "http://agents.localhost:8080";
    }

    get_headers() {
        if (typeof this.agent !== "undefined" && this.agent !== null)
            this.headers["x-access-token"] = this.agent.jwt;

        return super.get_headers();
    }
}

let AgentsService = new _AgentsServiceSpec();
export {AgentsService};