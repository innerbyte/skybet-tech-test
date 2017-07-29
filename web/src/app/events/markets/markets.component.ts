/**
 * Created by vlad on 11/04/17.
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {LazyLoadEvent} from "primeng/primeng";
import {Pagination} from "../../../shared/interfaces/pagination";
import {Subject} from "rxjs/Subject";
import {ActivatedRoute, NavigationExtras, Route, Router} from "@angular/router";
import {EventsService} from "../../services/events.service";
import {IEvent} from "../../../shared/interfaces/i-event";

import * as moment from "moment";

@Component({
    selector: 'markets',
    templateUrl: './markets.component.html'
})
export class MarketsComponent implements  OnInit, OnDestroy{
    private service: EventsService;

    private rows_per_page: number = 20;
    public rows_per_page_opt: number[] = [5, 10, 20, 50];

    public cat: string = null;
    public sub_cat: string = null;

    public pagination: Pagination = new Pagination();
    private sort_field = "name";
    private sort_order = 1;
    private _filter: string = '';

    public _event: IEvent;

    // private filter_subj = new Subject<string>();
    private router: Router;
    private route: ActivatedRoute;

    constructor(service: EventsService, router: Router, route: ActivatedRoute) {
        this.service = service;
        this.router = router;
        this.route = route;
    }

    get event() {
        return this._event;
    }

    set event(value) {
        value.markets.forEach(m => {
            m.outcomes = [];

            Array.prototype.push.apply(m.outcomes, value.outcomes.filter((out) => {
                return out.displayed && out.market_id === m._id;
            }));
        });

        this._event = value;
    }

    // get filter() {
    //     return this._filter;
    // }

    // set filter(value) {
    //     this._filter = value;
    //     this.filter_subj.next(value);
    // }

    format_date(date: number): string {
        return moment(date).format("DD/MM/YYYY HH:mm");
    }

    load_markets() {
        this.service.get_markets(
            this.event._id,
            this.pagination.offset,
            this.pagination.limit,
            this._filter,
            this.sort_field,
            this.sort_order
        ).subscribe(res => {
            this.event = res.events[0] as IEvent;
            this.pagination = new Pagination(res.pagination);
        });
    }

    ngOnInit(): void {
        this.route.data.subscribe(data => {
            if (data.hasOwnProperty('res')) {
                this.event = data.res.events[0];
                this.pagination = data.res.pagination;
            } else {
                this.router.navigate(['/home']);
            }
        });

        // this.filter_subj.debounceTime(1200).subscribe((value) => {
        //     this.load_markets();
        // });
    }

    ngOnDestroy(): void {

    }
}