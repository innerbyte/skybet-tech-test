/**
 * Created by vlad on 11/04/17.
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {LazyLoadEvent} from "primeng/primeng";
import {Pagination} from "../../shared/interfaces/pagination";
import {Subject} from "rxjs/Subject";
import {ActivatedRoute, NavigationExtras, Route, Router} from "@angular/router";
import {EventsService} from "../services/events.service";
import {IEvent} from "../../shared/interfaces/i-event";

import * as moment from "moment";

@Component({
    selector: 'events',
    templateUrl: './events.component.html'
})
export class EventsComponent implements  OnInit, OnDestroy{
    private service: EventsService;

    private rows_per_page: number = 10;
    public rows_per_page_opt: number[] = [5, 10, 20, 50];

    public cat: string = null;
    public sub_cat: string = null;

    public pagination: Pagination = new Pagination();
    private sort_field = "name";
    private sort_order = 1;
    private _filter: string = '';

    public events: IEvent[];
    private _selected_event: IEvent;

    private filter_subj = new Subject<string>();
    private router: Router;
    private route: ActivatedRoute;

    constructor(service: EventsService, router: Router, route: ActivatedRoute) {
        this.service = service;
        this.router = router;
        this.route = route;
    }

    get filter() {
        return this._filter;
    }

    set filter(value) {
        this._filter = value;
        this.filter_subj.next(value);
    }

    set selected_event(value) {
        this._selected_event = value;
        this.router.navigate([`/events/${this._selected_event._id}`]);
    }

    on_lazy_load(event: LazyLoadEvent) {
        this.pagination.offset = event.first || 0;
        this.pagination.limit = event.rows || this.pagination.limit;

        this.sort_field = event.sortField;
        this.sort_order = event.sortOrder;

        this.load_events();
    }

    format_date(date: Date): string {
        return moment(date).format("L LT");
    }

    load_events() {
        this.service.get_events(
            this.cat,
            this.sub_cat,
            this.pagination.offset,
            this.pagination.limit,
            this._filter,
            this.sort_field,
            this.sort_order
        ).subscribe(res => {
            this.events = res.events as IEvent[];
            this.pagination = new Pagination(res.pagination);
        });
    }

    ngOnInit(): void {
        this.route.data.subscribe(data => {
            if (data.hasOwnProperty('res')) {
                this.events = data.res.events
                this.pagination = data.res.pagination
                this.cat = data.res.cat;
                this.sub_cat = data.res.sub_cat;
            } else {
                this.router.navigate(['/home']);
            }
        });

        this.filter_subj.debounceTime(1200).subscribe((value) => {
            this.load_events();
        });
    }

    ngOnDestroy(): void {

    }
}