import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@env/environment';

import type {
  AppHttpResponse,
  TrackHttpError,
} from '@interfaces/general.interface';

@Injectable({
  providedIn: 'root',
})
export class ServiciosService {
  constructor(private http: HttpClient) {}

  url = `${environment.ivc.protocol + environment.ivc.server}:${
    environment.ivc.port
  }/v${environment.ivc.defaultVersion}`;

  mainModule = 'servicios';

  async getAllServicios(filters: any = {}): Promise<any | TrackHttpError> {
    const controller = new AbortController();
    try {
      const params = new URLSearchParams({
        ...filters,
      });

      const request = await fetch(`${this.url}/${this.mainModule}/getAll?${params}`, {
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

  async getServiciosByPrestador(prestadorId: string): Promise<any | TrackHttpError> {
    const controller = new AbortController();
    try {
      const request = await fetch(`${this.url}/${this.mainModule}/prestador?id=${prestadorId}`, {
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

} 