
import {Server} from "../../server";
import * as express from 'express';
import * as mongo from 'mongodb';
import {IResponse} from "../../../shared/interfaces/i-response";
import {Response} from '../../helpers/response';
import {ErrorStatus} from "../../helpers/error-status";
import {EventsModule} from "../../modules/events-module";
import {IEventList} from "../../helpers/interfaces/i-event-list";
import {ICategory} from "../../../shared/interfaces/i-category";
import * as path from "path";
import * as mkdirp from "mkdirp";
import * as fs from "fs";

import {IEvent} from "../../../shared/interfaces/i-event";

export let router = express.Router();


router.get('/events', async (req: express.Request | any, res: express.Response, next: express.NextFunction) => {
    let module = new EventsModule();

    let cat = req.query.cat;
    let sub_cat = req.query.sub_cat;
    let offset = parseInt(req.query.offset, 10);
    let limit = parseInt(req.query.limit, 10);
    let filter = req.query.filter;
    let sort_field = req.query.sort_field;
    let sort_order = parseInt(req.query.sort_order, 10);

    let event_list: IEventList = await module.get_events(cat, sub_cat, offset, limit, filter, sort_field, sort_order);

    res.json(Response.send_data(event_list.events, event_list.pagination));
});

router.get('/markets', async (req: express.Request | any, res: express.Response, next: express.NextFunction) => {
    let module = new EventsModule();

    let event_id = req.query.event_id;
    let offset = parseInt(req.query.offset, 10);
    let limit = parseInt(req.query.limit, 10);
    let filter = req.query.filter;
    let sort_field = req.query.sort_field;
    let sort_order = parseInt(req.query.sort_order, 10);

    let event_list: IEventList = await module.get_markets(event_id, offset, limit, filter, sort_field, sort_order);

    res.json(Response.send_data(event_list.events, event_list.pagination));
});

router.get('/categories', async (req: express.Request | any, res: express.Response, next: express.NextFunction) => {
    let module = new EventsModule();

    let cat_list: ICategory[] = await module.get_categories();

    res.json(Response.send_data(cat_list));
});

// router.get('/:id', async (req: express.Request | any, res: express.Response, next: express.NextFunction) => {
//     let agent: Agent = req.agent;
//     let users_module = new UsersModule(agent);

//     let user_id: string = req.params.id;

//     let res_user = await users_module.get_details(user_id);

//     res.json(Response.send_data(res_user.sanitise_for_client()));
// });


router.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(`Error: ${err.message}`);
    console.log(`Error stack: ${err.stack}`);

    if (err instanceof ErrorStatus) {
        res.status(err.status).json(err.get_response());
    } else {
        let resp_data: IResponse = {
            status: err.status || 500,
            success: false,
            data: {
                message: err.message
            }
        };

        res.status(resp_data.status).json(resp_data);
    }
});