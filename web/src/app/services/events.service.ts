
import {Injectable, Inject} from '@angular/core';
import {BaseService} from "./base.service";
import {Http, Headers, RequestOptionsArgs, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import {IResponse} from "../../shared/interfaces/i-response";

import {Pagination} from "../../shared/interfaces/pagination";
import { IEvent } from "../../shared/interfaces/i-event";
import { ICategory } from "../../shared/interfaces/i-category";

@Injectable()
export class EventsService extends BaseService {
    constructor(http: Http, @Inject('ORIGIN_URL') origin_url: string) {
        super(http, origin_url);
    }

    public get_events(cat: string, sub_cat: string, offset: number, limit: number, filter: string, sort_field: string, sort_order: number): Observable<any> {
        let args: RequestOptionsArgs = {};

        args.headers = this.get_headers();

        let params = new URLSearchParams();
        params.set('cat', cat);
        params.set('sub_cat', sub_cat);
        params.set('limit', limit.toString(10));
        params.set('offset', offset.toString(10));
        params.set('filter', filter);
        params.set('sort_field', sort_field);
        params.set('sort_order', sort_order.toString(10));

        args.params = params;

        return this.get('/events', args)
            .map((res: IResponse) => {
                return {
                    events: res.data as IEvent[],
                    pagination: res.pagination as Pagination
                };
            })
            .catch(error => {
                return Observable.throw(error);
            });
    }

    public get_categories(): Observable<any> {
        return this.get('/categories')
            .map((res: IResponse) => {
                return {
                    cat_list: res.data as ICategory[]
                };
            })
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // public get_user_details(user_id: string): Observable<IUser> {
    //     return this.get(`/users/${user_id}`)
    //         .map((res: IResponse) => {
    //             let user = res.data as IUser;

    //             return res.data as IUser
    //         })
    //         .catch(err => {
    //             return Observable.throw(err);
    //         });
    // }
}