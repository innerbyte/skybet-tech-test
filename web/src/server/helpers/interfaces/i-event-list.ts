
import { IEvent } from "../../../shared/interfaces/i-event";
import { IPagination } from "../../../shared/interfaces/i-pagination";

export interface IEventList {
    events: IEvent[],
    pagination: IPagination
}