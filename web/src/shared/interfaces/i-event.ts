import { IMarket } from "./i-market";

export interface IEvent {
    _id: string;
    cat: string;
    sub_cat: string;
    name: string;
    start_time: Date;
    displayed: boolean;
    suspended: boolean;
    markets: IMarket[];
}