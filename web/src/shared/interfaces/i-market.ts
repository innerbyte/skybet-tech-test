
import { IOutcome } from "./i-outcome";

export interface IMarket {
    _id: string;
    market_id: string;
    name: string;
    price: string;
    displayed: boolean;
    suspended: boolean;
    outcomes: IOutcome[];
}