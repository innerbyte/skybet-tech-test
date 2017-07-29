
import {IResponse} from "../../shared/interfaces/i-response";

export class ErrorStatus extends Error {
    public status: number;
    public message: string;

    constructor(message: string, status: number = 500) {
        super(message);

        this.status = status;
        this.message = message;
    }

    get_response(): IResponse {
        return {
            success: false,
            status: this.status,
            data: {
                message: this.message
            }
        };
    }
}