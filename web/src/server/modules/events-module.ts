
import {Server} from "../server";
import {IEventList} from "../helpers/interfaces/i-event-list";
import {ErrorStatus} from "../helpers/error-status";
import * as mongo from 'mongodb';
import { IEvent } from "../../shared/interfaces/i-event";
import { ICategory } from "../../shared/interfaces/i-category";

export class EventsModule {

    constructor() {
    
    }

    async get_events(cat: string, sub_cat: string, offset: number, limit: number, filter: string, sort_field: string, sort_order: number): Promise<IEventList> {
        let event_list: IEventList = {
            "events": [],
            "pagination": {
                "offset": offset,
                "limit": limit,
                "total_records": 0
            }
        };

        let events_filter = {
            "cat_slug": cat,
            "sub_cat_slug": sub_cat
        };

        let events_cur = Server.db.collection("events").find({});

        if (filter && filter.length > 0) {
            events_filter["$or"] = [
                {
                    "name": {
                        $regex: `.*${filter}.*`,
                        $options: 'i'
                    }
                }
            ];
        }

        events_cur = events_cur.filter(events_filter);

        let sort_obj = {};
        sort_obj[sort_field] = sort_order;

        events_cur = events_cur.sort(sort_obj);

        event_list.pagination.total_records = await events_cur.count(false);

        events_cur = events_cur.skip(offset).limit(limit);

        event_list.events = await events_cur.toArray();

        return event_list;
    }

    async get_categories(): Promise<ICategory[]> {
        let cat_list: ICategory[] = [];

        let col = Server.db.collection("events");

        let pipeline = [
            {
                $group: {
                    _id: {
                        cat: "$cat",
                        sub_cat: "$sub_cat"
                    }
                }
            },
            {
                $sort: {
                    "_id.sub_cat": 1,
                    "_id.cat": 1
                }
            },
            {
                $group: {
                    _id: "$_id.cat",
                    sub_cats: {
                        $push: "$_id.sub_cat"
                    }
                }
            }
        ];

        let cur = col.aggregate(pipeline);

        let ret_list = await cur.toArray();

        ret_list.forEach((v) => {
            cat_list.push({
                name: v._id,
                sub_categories: v.sub_cats
            });
        });

        return cat_list;
    }

    // async get_details(user_id: string): Promise<User> {
    //     let users_cur = Server.db.collection("users");
    //     let iuser: IUser = await users_cur.findOne({
    //         "_id": new mongo.ObjectID(user_id)
    //     });

    //     let res_user = new User(iuser);
    //     return res_user;
    // }
}