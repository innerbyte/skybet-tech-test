import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import 'rxjs/add/operator/filter';

@Component({
    selector: 'breadcrumbs',
    template: `
        <ng-container *ngFor="let breadcrumb of breadcrumbs; let last=last;">
            <li class="breadcrumb-item"
                *ngIf="breadcrumb.label && breadcrumb.url.substring(breadcrumb.url.length-1) == '/' || breadcrumb.label && last"
                [ngClass]="{active: last}">
                <a *ngIf="!last" [routerLink]="breadcrumb.url">{{breadcrumb.label}}</a>
                <span *ngIf="last" [routerLink]="breadcrumb.url">{{breadcrumb.label}}</span>
            </li>
        </ng-container>
        `
})
export class BreadcrumbsComponent implements OnInit {
    breadcrumbs: Array<Object>;

    constructor(private router: Router, private route: ActivatedRoute) {
        this.breadcrumbs = [];
    }

    ngOnInit(): void {
        this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
            this.breadcrumbs = [];
            let currentRoute = this.route.root,
                url = '';
            do {
                let childrenRoutes = currentRoute.children;
                currentRoute = null;
                childrenRoutes.forEach(route => {
                    if (route.outlet === 'primary') {
                        let routeSnapshot = route.snapshot;

                        let segments: string[] = routeSnapshot.url.filter(seg => {
                            return seg.path.trim().length > 0;
                        }).map(seg => seg.path);

                        if (segments.length > 0) {
                            url += '/' + segments.join('/');

                            let label = '';

                            if (route.snapshot.data && route.snapshot.data.bread)
                                label = route.snapshot.data.bread;

                            this.breadcrumbs.push({
                                label: label,
                                url: url
                            });
                        }

                        currentRoute = route;
                    }
                });
            } while (currentRoute);
        });
    }
}
