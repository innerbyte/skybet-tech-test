
import {Component, OnInit} from '@angular/core';
import {NavigationExtras, Router} from "@angular/router";

@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements  OnInit{
    public disabled: boolean = false;
    public status: {isopen: boolean} = {isopen: false};

    public router: Router;

    constructor(router: Router) {
        this.router = router;
    }

    public toggled(open: boolean): void {
        console.log('Dropdown is now: ', open);
    }

    public toggleDropdown($event: MouseEvent): void {
        $event.preventDefault();
        $event.stopPropagation();
        this.status.isopen = !this.status.isopen;
    }

    ngOnInit(): void {

    }
}