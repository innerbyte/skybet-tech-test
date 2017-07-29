
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
export class MarketsResolver implements Resolve<any> {
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
        let event_id: string = null;

        if (route.params.hasOwnProperty('event_id')) {
            event_id = route.params['event_id'];

            this.pagination.limit = 20;

            return this.service.get_markets(
                event_id,
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
                    pagination: res.pagination
                };
            });
        } else {
            return Observable.of({events: [], pagination: new Pagination()} as any);
        }
    }
}