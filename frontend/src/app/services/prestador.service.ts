import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { type Observable, throwError } from "rxjs";
import type {
	AppHttpResponse,
	TrackHttpError,
} from "@interfaces/general.interface";
import type { RepsResponse } from "@interfaces/external.interface";
import { catchError, map } from "rxjs/operators";
import { environment } from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class PrestadorService {
	constructor(private http: HttpClient) {}

	url = `${environment.ivc.protocol + environment.ivc.server}:${environment.ivc.port}/v${environment.ivc.defaultVersion}/prestadores`;

	getRepsPrestadores(
		filter?: string,
	): Observable<RepsResponse[] | TrackHttpError> {
        let url = this.url;
        if (filter) {
            url += `?text=${encodeURIComponent(filter)}`;
        }
        return this.http.get(url).pipe(
            map((data: any) => {
                return data;
            }),
            catchError((error) => this.handleHttpError(error)),
        );
	}

	private handleHttpError(error: any): Observable<TrackHttpError> {
		if (error.status === 401) {
			//this.authService.logoutToRefresh();
		} else {
			return throwError(error.error);
		}
		return throwError(error); // Add this line to return a value at the end of the function
	}
}
