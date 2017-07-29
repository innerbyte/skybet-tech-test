import { IMarket } from "./i-market";
import { IOutcome } from "./i-outcome";

export interface IEvent {
    _id: string;
    cat: string;
    sub_cat: string;
    name: string;
    start_time: number;
    displayed: boolean;
    suspended: boolean;
    markets: IMarket[];
    outcomes: IOutcome[];
}