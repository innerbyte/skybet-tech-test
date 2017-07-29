/**
 * Created by vlad on 07/04/17.
 */

import { IPagination } from "./i-pagination";

export interface IResponse {
    success?: boolean;
    status?: number;
    data?: any;
    pagination?: IPagination;
}