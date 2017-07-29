import {Observable} from "rxjs";
import {IResponse} from "../shared/interfaces/i-response";
import * as request from "request";

/**
 * * Created by vlad on 11/06/17.
 */

export class BaseServiceSpec {
    public url: string;
    public headers: any;

    constructor() {
        this.url = "";
        this.headers = {};
    }

    get_headers(): any {
        return this.headers;
    }

    do_request(args: any): Observable<IResponse> {
        return Observable.create((observer) => {
            request(args, (err, resp, body) => {
                if (err != null) {
                    observer.error(err);
                }

                if (typeof body === "string")
                    body = JSON.parse(body);

                observer.next(body);
                observer.complete();
            });
        });
    }

    get(url: string, args?: any): Observable<IResponse> {
        if (!args)
            args = {};

        if (typeof args.headers === "undefined")
            args.headers = this.get_headers();

        args.method = "GET";
        args.url = this.url + url;

        return this.do_request(args)
            .map((res: IResponse) => {
                return res;
            })
            .catch(this.handle_error)
            .publishLast().refCount();
    }

    post(url: string, data: any, args?: any): Observable<IResponse> {
        if (!args)
            args = {};

        if (typeof args.headers === "undefined")
            args.headers = this.get_headers();

        args.method = "POST";
        args.url = this.url + url;
        args.json = data;

        return this.do_request(args)
            .map((res: IResponse) => {
                return res;
            })
            .catch(this.handle_error)
            .publishLast().refCount();
    }

    patch(url: string, data: any, args?: any): Observable<IResponse> {
        if (!args)
            args = {};

        if (typeof args.headers === "undefined")
            args.headers = this.get_headers();

        args.method = "PATCH";
        args.url = this.url + url;
        args.json = data;

        return this.do_request(args)
            .map((res: IResponse) => {
                return res;
            })
            .catch(this.handle_error)
            .publishLast().refCount();
    }

    delete(url: string, args?: any): Observable<IResponse> {
        if (!args)
            args = {};

        if (typeof args.headers === "undefined")
            args.headers = this.get_headers();

        args.method = "DELETE";
        args.url = this.url + url;

        return this.do_request(args)
            .map((res: IResponse) => {
                return res;
            })
            .catch(this.handle_error)
            .publishLast().refCount();
    }

    private handle_error(error: any) {
        // console.error(error);
        // return Observable.throw(error);

        console.log(`error is ${error}`);
        console.log(`error is ${typeof error}`);
        console.error(error);

        let message: string;

        // if (error instanceof Response) {
        //     let json: IResponse = null;
        //
        //     try {
        //         json = error.json() || '';
        //     } catch(err) {
        //
        //     }
        //
        //     let err = '';
        //
        //     if (json && json.data)
        //         err = json.data.message || '';
        //     else
        //         err = error.statusText || '';
        //
        //     // message = `${error.status} - [${error.statusText || ''}] ${err}`;
        //     message = err;
        // } else {
        //     message= error.message ? error.message : error.toString();
        // }

        return Observable.throw(message);
    }
}