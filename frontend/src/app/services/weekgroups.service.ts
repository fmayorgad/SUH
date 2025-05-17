import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { type Observable, throwError } from 'rxjs';
import type { RepsResponse } from '@interfaces/external.interface';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@env/environment';

import type {
AppHttpResponse,
TrackHttpError,
} from '@interfaces/general.interface';

@Injectable({
providedIn: 'root',
})
export class WeekGroupsService {
constructor(private http: HttpClient) {}

url = `${environment.ivc.protocol + environment.ivc.server}:${
    environment.ivc.port
}/v${environment.ivc.defaultVersion}`;

mainModule = 'weekgroups';

async createWeekGroup(weekGroup: any): Promise<any | TrackHttpError> {
    const controller = new AbortController();
    try {
        const request = await fetch(`${this.url}/${this.mainModule}/create`, {
            method: 'POST',
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(weekGroup),
        });

        const data = await request.json();
        data.ok = request.ok;

        return data;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        controller.abort();
    }
}

async updateWeekGroup(id: string, weekGroup: any): Promise<any | TrackHttpError> {
    const controller = new AbortController();
    try {
        const request = await fetch(`${this.url}/${this.mainModule}/update?id=${id}`, {
            method: 'PUT',
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(weekGroup),
        });

        const data = await request.json();
        data.ok = request.ok;

        return data;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        controller.abort();
    }
}

async getAllWeekGroups(filters: any): Promise<any | TrackHttpError> {
    const controller = new AbortController();
    try {
        const params = new URLSearchParams({
            ...filters,
        });

        params.delete('lead');
        params.delete('verificadores');

        if (filters.lead) {
            for (const key of filters.lead) {
                params.append('lead', key.id);
            }
        }

        if (filters.verificadores) {
            for (const key of filters.verificadores) {
                params.append('verificadores', key.id);
            }
        }

        const request = await fetch(`${this.url}/${this.mainModule}/all?${params}`, {
            method: 'GET',
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        const data = await request.json();
        data.ok = request.ok;

        return data;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        controller.abort();
    }
}

async getWeekGroupById(id: string): Promise<any | TrackHttpError> {
    const controller = new AbortController();
    try {
        const request = await fetch(`${this.url}/${this.mainModule}/findById?id=${id}`, {
            method: 'GET',
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        const data = await request.json();
        data.ok = request.ok;

        return data;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        controller.abort();
    }
}

private handleHttpError(error: any): Observable<TrackHttpError> {
    if (error.status === 401) {
        // Handle unauthorized error
    } else {
        return throwError(() => new Error('An error occurred'));
    }
    return throwError(() => new Error('An error occurred'));
}
}