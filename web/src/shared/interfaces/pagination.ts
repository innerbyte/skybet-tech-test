
import {IPagination} from "./i-pagination";

export class Pagination implements IPagination {
    public offset: number = 0;
    public limit: number = 10;
    public total_records: number = 0;

    constructor(pagination?: IPagination) {
        Object.assign(this, pagination);
    }
}