
import { Injectable }             from '@angular/core';
import {
    Router, Resolve, RouterStateSnapshot,
    ActivatedRouteSnapshot
} from '@angular/router';

import {Observable} from "rxjs/Observable";
import {EventsService} from "../events.service";
import {IEvent} from "../../../shared/interfaces/i-event";
import {Pagination} from "../../../shared/interfaces/pagination";

@Injectable()
export class EventsResolver implements Resolve<any> {
    private router: Router;
    private service: EventsService;

    public pagination: Pagination = new Pagination();
    private sort_field = "name";
    private sort_order = 1;
    private _filter: string = '';

    constructor(service: EventsService, router: Router) {
        this.service = service;
        this.router = router;
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        let cat: string = null;
        let sub_cat: string = null;

        if (route.params.hasOwnProperty('cat') && route.params.hasOwnProperty('sub_cat')) {
            cat = route.params['cat'];
            sub_cat = route.params['sub_cat'];

            return this.service.get_events(
                cat,
                sub_cat,
                this.pagination.offset,
                this.pagination.limit,
                this._filter,
                this.sort_field,
                this.sort_order
            )
            .catch(error => {
                this.router.navigate(['/home']);
                return Observable.throw(error);
            })
            .map(res => {
                return {
                    events: res.events,
                    pagination: res.pagination,
                    cat: cat,
                    sub_cat: sub_cat
                };
            });
        } else {
            return Observable.of({events: [], pagination: new Pagination(), cat: cat, sub_cat: sub_cat} as any);
        }
    }
}