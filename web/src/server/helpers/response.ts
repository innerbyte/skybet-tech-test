
import {IResponse} from "../../shared/interfaces/i-response";
import {IPagination} from "../../shared/interfaces/i-pagination";

export class Response {
    static send_data(data: any, pagination?: IPagination, status: number = 200): IResponse {
        return {
            "status": status,
            "success": true,
            "data": data,
            "pagination": pagination
        };
    }

    static send_error(error: Error, status: number = 500): IResponse {
        return {
            "status": status,
            "success": false,
            "data": {
                "message": error.message
            }
        };
    }
}