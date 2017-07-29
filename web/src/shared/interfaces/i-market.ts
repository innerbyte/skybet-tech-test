
import { IOutcome } from "./i-outcome";

export interface IMarket {
    _id: string;
    event_id: string;
    name: string;
    displayed: boolean;
    suspended: boolean;
    outcomes: IOutcome[];
}