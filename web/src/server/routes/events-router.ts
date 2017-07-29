
import * as express from 'express';
import {router as api_events_router} from './api/api-events-router';
import {ErrorStatus} from "../helpers/error-status";
import {IResponse} from "../../shared/interfaces/i-response";
import {Response} from '../helpers/response';

export let router = express.Router();

router.use((req: express.Request, response: express.Response, next: express.NextFunction) => {
    next();
});

router.use('/api', api_events_router);

router.get('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.render('skybetapp.index.html', {
        req: req,
        res: res
    });
});

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