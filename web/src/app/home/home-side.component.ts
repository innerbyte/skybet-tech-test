
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {EventsService} from "../services/events.service";

import {ICategory} from "../../shared/interfaces/i-category";
import { HTTPUtility } from "../../shared/utilities/http-utility";

@Component({
    selector: 'home-side',
    templateUrl: './home-side.component.html'
})
export class HomeSideComponent implements  OnInit{
    private service: EventsService;
    public cat_list: ICategory[] = [];

    constructor(service: EventsService) {
        this.service = service;
    }

    format_cat(cat: string): string {
        return HTTPUtility.slugify(cat);
    }

    ngOnInit(): void {
        this.service.get_categories()
        .subscribe((res) => {
            this.cat_list = res.cat_list;
        });
    }
}