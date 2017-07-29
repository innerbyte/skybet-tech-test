/**
 * Created by vlad on 22/04/17.
 */

import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {EventsService} from "../../services/events.service";
import {IEvent} from "../../../shared/interfaces/i-event";

@Component({
    selector: 'markets',
    templateUrl: './markets.component.html'
})
export class UserDetailsComponent implements OnInit, OnDestroy {
    private route: ActivatedRoute;
    private router: Router;

    private service: EventsService;

    constructor(service: EventsService,
                route: ActivatedRoute,
                router: Router) {
        this.service = service;
        this.route = route;
        this.router = router;
    }

    ngOnInit(): void {
        // this.route.data.subscribe(data => {
        //     if (data.hasOwnProperty('user')) {
        //         this.is_new = data.hasOwnProperty('is_new') && data.is_new;
        //         this.user = new User(data.user as IUser);

        //         this.set_form_values();
        //     } else {
        //         if (!data.hasOwnProperty('is_new'))
        //             this.router.navigate(['users']);
        //         else {
        //             this.is_new = true;
        //             this.user = new User();
        //         }
        //     }
        // });
    }

    ngOnDestroy(): void {

    }
}