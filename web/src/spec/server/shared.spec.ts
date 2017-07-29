/**
 * Created by vlad on 05/06/17.
 */

import {Server} from "../../server/server";

class _Shared {
    public agents_url: string = "http://agents.localhost:8080";

    constructor() {

    }
}

let Shared = new _Shared();

export {Shared};