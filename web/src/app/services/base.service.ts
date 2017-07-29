
import {Injectable} from '@angular/core';

import {
    Http, Response, Request, Headers, RequestOptions,
    RequestOptionsArgs, RequestMethod
} from '@angular/http';

import {Observable} from "rxjs/Observable";
import {IResponse} from "../../shared/interfaces/i-response";

@Injectable()
export class BaseService {
    protected url: string;
    protected http: Http;
    protected headers: Headers;

    constructor(http: Http, origin_url: string) {
        this.http = http;
        this.headers = new Headers();
        // this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');

        this.url = origin_url + '/api';
    }

    get_headers(): Headers {
        return this.headers;
    }

    get(url: string, args?: RequestOptionsArgs): Observable<IResponse> {
        if (args == null)
            args = {};

        if (args.headers == null)
            args.headers = this.get_headers();

        return this.http.get(this.url + url, args)
            .map((res: Response) => {
                return res.json() as IResponse
            })
            .catch(this.handle_error)
            .publishLast().refCount();
    }

    post(url: string, data: any, args?: RequestOptionsArgs): Observable<IResponse> {
        if (args == null)
            args = {};

        if (args.headers === undefined)
            args.headers = this.get_headers();

        return this.http.post(this.url + url, JSON.stringify(data), args)
            .map((res: Response) => res.json() as IResponse)
            .catch(this.handle_error)
            .publishLast().refCount();
    }

    patch(url: string, data: any, args?: RequestOptionsArgs): Observable<IResponse> {
        if (args == null)
            args = {};

        if (args.headers === undefined)
            args.headers = this.get_headers();

        return this.http.patch(this.url + url, JSON.stringify(data), args)
            .map((res: Response) => res.json() as IResponse)
            .catch(this.handle_error)
            .publishLast().refCount();
    }

    delete(url: string, data?: any, args?: RequestOptionsArgs): Observable<IResponse> {
        if (args == null)
            args = {};

        if (args.headers == null)
            args.headers = this.get_headers();

        let params: URLSearchParams = new URLSearchParams();

        if (typeof data !== "undefined" && data) {
            for (let key in Object.keys(data)) {
                params.set(key.toString(), data[key]);
            }
        }

        args.params = params;

        // args.body = data ? JSON.stringify(data) : null;

        return this.http.delete(this.url + url, args)
            .map((res: Response) => res.json() as IResponse)
            .catch(this.handle_error)
            .publishLast().refCount();
    }

    private static json(res: Response): any {
        return res.text() === "" ? res : res.json();
    }

    private handle_error(error: Response | any) {
        // console.error(error);
        // return Observable.throw(error);

        let message: string;

        if (error instanceof Response) {
            let json: IResponse = null;

            try {
                json = error.json() || '';
            } catch(err) {

            }

            let err = '';

            if (json && json.data)
                err = json.data.message || '';
            else
                err = error.statusText || '';

            // message = `${error.status} - [${error.statusText || ''}] ${err}`;
            message = err;
        } else {
            message= error.message ? error.message : error.toString();
        }

        return Observable.throw(message);
    }
}