import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { type Observable, throwError } from 'rxjs';
import type {
  AppHttpResponse,
  TrackHttpError,
} from '@interfaces/general.interface';
import type { RepsResponse } from '@interfaces/external.interface';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class WeeksService {
  constructor(private http: HttpClient) {}

  url = `${environment.ivc.protocol + environment.ivc.server}:${
    environment.ivc.port
  }/v${environment.ivc.defaultVersion}`;

  mainModule = 'weeks';

  getWeeks(filter?: string): Observable<RepsResponse[] | TrackHttpError> {
    let url = this.url;
    if (filter) {
      url += `?text=${encodeURIComponent(filter)}`;
    }
    return this.http.get(url).pipe(
      map((data: any) => {
        return data;
      }),
      catchError((error) => this.handleHttpError(error))
    );
  }

  async createWeek(week: any): Promise< any | TrackHttpError> {
    const controller = new AbortController();
    try {
      const request = await fetch(`${this.url}/${this.mainModule}/create`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(week)
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

  async updateWeek(id: string, week: any): Promise< any | TrackHttpError> {
    const controller = new AbortController();
    try {
      const request = await fetch(`${this.url}/${this.mainModule}/update?id=${id}`, {
        method: 'PUT',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(week)
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


  async getAllWeeks(filters: any): Promise< any | TrackHttpError> {

    console.log('incoming filters :>> ', filters);
    const controller = new AbortController();
    try {
      const params = new URLSearchParams({
        ...filters
      });

      params.delete('lead')
      params.delete('verificadores')

      if(filters.lead){
        for(const [index, key] of filters.lead.entries() ) {
            params.append('lead', key.id);
        }
      } 

      if(filters.verificadores){
        for(const [index, key] of filters.verificadores.entries() ) {
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

  async getWeekById(id: string): Promise< any | TrackHttpError> {
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
      //this.authService.logoutToRefresh();
    } else {
      return throwError(() => new Error('test'));
    }
    return throwError(() => new Error('test')); // Add this line to return a value at the end of the function
  }
}
