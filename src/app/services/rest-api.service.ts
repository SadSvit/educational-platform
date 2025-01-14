import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, EMPTY, Observable } from "rxjs";
import { RestApiData, RestApiMethod, RestApiOptions } from "../models/rest-api.model";
import { apiRoutes } from "../api/api.routes";

@Injectable({
    providedIn: "root"
})
export class RestApiService {

    constructor(private http: HttpClient) { }

    private static handleError(error: any): void {
        console.error(error);
    }

    private getRequestByType<T = unknown>(data: RestApiData): Observable<T> {
        const { method, route, body, options } = data ?? {};
        let path = `${apiRoutes.gateways.publicGateWay}/${apiRoutes.urls[route]}`;
        let request: Observable<T>;

        path = this.replaceUrlParameters(path, options?.urlParameters, options?.encodeUri);

        switch (method) {
            case RestApiMethod.GET:
                request = this.http.get<T>(path, options?.request);
                break;
            case RestApiMethod.POST:
                request = this.http.post<T>(path, body, options?.request);
                break;
            case RestApiMethod.PATCH:
                request = this.http.patch<T>(path, body, options?.request);
                break;
            case RestApiMethod.PUT:
                request = this.http.put<T>(path, body, options?.request);
                break;
            case RestApiMethod.DELETE:
                request = this.http.delete<T>(path, options?.request);
                break;
        }

        return request.pipe(
            catchError(error => (RestApiService.handleError(error), EMPTY))
        ) as Observable<T>;
    };

    private replaceUrlParameters(url: string, urlParameters: Record<string, string>, encodeUri: "encodeURIComponent" | "encodeURI"): string {
        urlParameters && Object.entries(urlParameters).forEach(([key, value]) => url = url.replace(`{${key}}`, value));
        return encodeUri === "encodeURIComponent" ? encodeURIComponent(url) : encodeURI(url);
    }

    public get<T = unknown>(route: string, options: RestApiOptions = {}): Observable<T> {
        return this.getRequestByType({
            method: RestApiMethod.GET,
            route,
            options
        });
    }

    public post<T = unknown>(route: string, body: unknown, options: RestApiOptions = {}): Observable<T> {
        return this.getRequestByType({
            method: RestApiMethod.POST,
            route,
            options,
            body
        });
    }

    public put<T = unknown>(route: string, body: unknown, options: RestApiOptions = {}): Observable<T> {
        return this.getRequestByType({
            method: RestApiMethod.POST,
            route,
            options,
            body
        });
    }

    public patch<T = unknown>(route: string, body: unknown, options: RestApiOptions = {}): Observable<T> {
        return this.getRequestByType({
            method: RestApiMethod.POST,
            route,
            options,
            body
        });
    }

    public delete<T = unknown>(route: string, options: RestApiOptions = {}): Observable<T> {
        return this.getRequestByType({
            method: RestApiMethod.POST,
            route,
            options
        });
    }
}
