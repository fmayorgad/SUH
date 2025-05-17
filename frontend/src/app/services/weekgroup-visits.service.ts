import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { TrackHttpError } from '@interfaces/general.interface';
import { map, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeekgroupVisitsService {
  url = `${environment.ivc.protocol + environment.ivc.server}:${
    environment.ivc.port
  }/v${environment.ivc.defaultVersion}`;

  mainModule = 'weekgroupvisits';

  constructor(private http: HttpClient) {}

  /**
   * Creates a new weekgroup visit
   * @param payload The visit data
   * @returns Promise with the creation result
   */
  async createWeekgroupVisit(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post<any>(`${this.url}/${this.mainModule}/create`, {
        description: data.description || 'Sin descripción',
        lead: data.lead || undefined,
        prestador: data.prestador || undefined,
        state: data.state || "ACTIVO",
        visitDate: data.visitDate,
        visitType: data.visitType,
        weekgroup: data.weekgroup,
        notes: data.notes || ''
      }).pipe(
        map((response) => {
          return {
            ok: true,
            data: response.data,
            description: `Se ha guardado correctamente la visita a grupo`
          };
        }),
        catchError((error) => {
          const errorResponse = {
            ok: false,
            description: error?.error?.message || 'Error al guardar la visita a grupo',
          };
          return of(errorResponse);
        })
      ).subscribe({
        next: (response) => {
          resolve(response);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  /**
   * Get visits by weekgroup ID
   * @param weekgroupId Weekgroup ID to filter visits
   * @returns Promise with the visits data
   */
  async getVisitsByWeekgroupId(weekgroupId: string, params?: any): Promise<any | TrackHttpError> {
    const controller = new AbortController();
    try {
      const request = await fetch(`${this.url}/${this.mainModule}/by-weekgroup/${weekgroupId}`, {
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
      console.error('Error getting visits by weekgroup ID:', error);
      return {
        ok: false,
        description: 'Error al obtener las visitas. Por favor, inténtelo de nuevo.'
      };
    } finally {
      controller.abort();
    }
  }

  async updateWeekgroupVisit(id: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.patch<any>(`${this.url}/${this.mainModule}/${id}`, {
        description: data.description || 'Sin descripción',
        lead: data.lead || undefined,
        prestador: data.prestador || undefined,
        state: data.state || "ACTIVO",
        visitDate: data.visitDate,
        visitType: data.visitType,
        weekgroup: data.weekgroup,
        notes: data.notes || ''
      }).pipe(
        map((response) => {
          return {
            ok: true,
            data: response.data,
            description: `Se ha actualizado correctamente la visita a grupo`
          };
        }),
        catchError((error) => {
          const errorResponse = {
            ok: false,
            description: error?.error?.message || 'Error al actualizar la visita a grupo',
          };
          return of(errorResponse);
        })
      ).subscribe({
        next: (response) => {
          resolve(response);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }
} 