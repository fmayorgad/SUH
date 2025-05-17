import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { TrackHttpError } from '@interfaces/general.interface';

@Injectable({
  providedIn: 'root'
})
export class WeekVisitsService {
  url = `${environment.ivc.protocol + environment.ivc.server}:${
    environment.ivc.port
  }/v${environment.ivc.defaultVersion}`;

  mainModule = 'weekgroup-visits';

  constructor() {}

  /**
   * Get all visits by week ID
   * @param weekId Week ID to filter visits
   * @returns Promise with the visits data
   */
  async getVisitsByWeekId(weekId: string): Promise<any | TrackHttpError> {
    const controller = new AbortController();
    try {
      const request = await fetch(`${this.url}/${this.mainModule}/by-week/${weekId}`, {
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
      console.error('Error getting visits by week ID:', error);
      return {
        ok: false,
        description: 'Error al obtener las visitas. Por favor, inténtelo de nuevo.'
      };
    } finally {
      controller.abort();
    }
  }

  /**
   * Get all visits by weekgroup ID
   * @param weekgroupId Weekgroup ID to filter visits
   * @returns Promise with the visits data
   */
  async getVisitsByWeekgroupId(weekgroupId: string): Promise<any | TrackHttpError> {
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
} 