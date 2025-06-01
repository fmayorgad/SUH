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
export class VisitsService {
  constructor(private http: HttpClient) { }

  url = `${environment.ivc.protocol + environment.ivc.server}:${environment.ivc.port
    }/v${environment.ivc.defaultVersion}`;

  mainModule = 'visits';

  /**
   * Get visits by general state with pagination and filtering
   * @param generalState The general state to filter by (ALL, NOT_INITIATED, IN_PROCESS, FINISHED)
   * @param filters Additional filters like pagination, search text, date, etc.
   * @returns Promise with visits data or error
   */
  async getVisitsByGeneralState(generalState: string, filters: any = {}): Promise<any | TrackHttpError> {
    const controller = new AbortController();
    try {
      // Create URL parameters from filters
      const params = new URLSearchParams({
        ...filters,
        generalState // Add the generalState parameter
      });

      // Remove any null or undefined values
      Array.from(params.keys()).forEach(key => {
        if (params.get(key) === 'null' || params.get(key) === 'undefined') {
          params.delete(key);
        }
      });

      // Handle lead and verificadores arrays separately
      params.delete('lead');
      params.delete('verificadores');

      if (filters.lead) {
        for (const [index, key] of filters.lead.entries()) {
          params.append('lead', key.id);
        }
      }

      if (filters.verificadores) {
        for (const [index, key] of filters.verificadores.entries()) {
          params.append('verificadores', key.id);
        }
      }

      const request = await fetch(`${this.url}/${this.mainModule}?${params}`, {
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

  /**
   * Get all visits with optional filters
   * @param filters optional filter parameters
   * @returns Promise with visits data or error
   */
  async getAllVisits(filters: any = {}): Promise<any | TrackHttpError> {
    const controller = new AbortController();
    try {
      const params = new URLSearchParams({
        ...filters,
      });

      // Remove any null or undefined values
      Array.from(params.keys()).forEach(key => {
        if (params.get(key) === 'null' || params.get(key) === 'undefined') {
          params.delete(key);
        }
      });

      // Handle lead and verificadores arrays separately
      params.delete('lead');
      params.delete('verificadores');

      if (filters.lead) {
        for (const [index, key] of filters.lead.entries()) {
          params.append('lead', key.id);
        }
      }

      if (filters.verificadores) {
        for (const [index, key] of filters.verificadores.entries()) {
          params.append('verificadores', key.id);
        }
      }

      const request = await fetch(`${this.url}/${this.mainModule}?${params}`, {
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

  /**
   * Create a new visit
   * @param visitData The visit data to create (can be JSON or FormData)
   * @returns Promise with created visit data or error
   */
  async createVisit(visitData: any): Promise<any | TrackHttpError> {
    const controller = new AbortController();
    try {
      // Check if visitData is FormData (for file uploads) or regular JSON data
      const isFormData = visitData instanceof FormData;

      const request = await fetch(`${this.url}/${this.mainModule}/create`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          // Don't set Content-Type for FormData - browser will set it with boundary
          ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        // If it's FormData, send it directly, otherwise stringify the JSON
        body: isFormData ? visitData : JSON.stringify(visitData),
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

  /**
   * Get a visit by ID
   * @param id The visit ID to retrieve
   * @returns Promise with visit data or error
   */
  async getVisitById(id: string): Promise<any | TrackHttpError> {
    const controller = new AbortController();
    try {
      const request = await fetch(`${this.url}/${this.mainModule}/${id}`, {
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

  /**
   * Get visits by prestador ID
   * @param prestadorId The prestador ID to filter visits by
   * @returns Promise with visits data or error
   */
  async getVisitsByPrestador(prestadorId: string): Promise<any | TrackHttpError> {
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

  /**
   * Update an existing visit
   * @param id Visit ID to update
   * @param visitData Data to update the visit with
   * @returns Promise with updated visit data or error
   */
  async updateVisit(id: string, visitData: any): Promise<any | TrackHttpError> {
    const controller = new AbortController();
    try {
      const request = await fetch(`${this.url}/${this.mainModule}/update?id=${id}`, {
        method: 'PUT',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(visitData),
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

  /**
   * Complete a visit
   * @param id Visit ID to complete
   * @param completeData Data required to complete the visit
   * @returns Promise with completed visit data or error
   */
  async completeVisit(id: string, completeData: any): Promise<any | TrackHttpError> {
    const controller = new AbortController();
    try {
      // Check if completeData is FormData (for file uploads) or regular JSON data
      const isFormData = completeData instanceof FormData;

      const request = await fetch(`${this.url}/${this.mainModule}/complete?id=${id}`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          // Don't set Content-Type for FormData - browser will set it with boundary
          ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        // If it's FormData, send it directly, otherwise stringify the JSON
        body: isFormData ? completeData : JSON.stringify(completeData),
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

  /**
   * Get in-process visits with filters
   * @param filters optional filter parameters
   * @returns Promise with visits data or error
   */
  async getInProcessVisits(filters: any = {}): Promise<any | TrackHttpError> {
    return this.getVisitsByGeneralState('IN_PROCESS', filters);
  }

  /**
   * Get not initiated visits with filters
   * @param filters optional filter parameters
   * @returns Promise with visits data or error
   */
  async getNotInitiatedVisits(filters: any = {}): Promise<any | TrackHttpError> {
    return this.getVisitsByGeneralState('NOT_INITIATED', filters);
  }

  /**
   * Get finished visits with filters
   * @param filters optional filter parameters
   * @returns Promise with visits data or error
   */
  async getFinishedVisits(filters: any = {}): Promise<any | TrackHttpError> {
    return this.getVisitsByGeneralState('FINISHED', filters);
  }

  /**
   * Gets the comunicado PDF for a specific visit
   * @param id Visit ID
   * @returns PDF buffer data
   */
  async getComunicado(id: string): Promise<ArrayBuffer> {
    try {
      const response = await this.http.get(`${this.url}/${this.mainModule}/${id}/pdf`, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/pdf'
        }
      }).toPromise();

      if (!response) {
        throw new Error('No PDF data received');
      }

      return response;
    } catch (error) {
      console.error('Error fetching comunicado PDF:', error);
      throw error;
    }
  }

  /**
   * Updates visit data including SADE, representative info, etc.
   * @param id Visit ID
   * @param formData Form data to update
   * @returns Updated visit data
   */
  async updateVisitData(id: string, formData: any): Promise<any> {
    try {
      const response = await this.http.put(`${this.url}/${this.mainModule}/${id}`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).toPromise();

      return response;
    } catch (error) {
      console.error('Error updating visit data:', error);
      throw error;
    }
  }

  /**
   * Sends notification about the visit
   * @param id Visit ID
   * @returns Response from notification service
   */
  async sendVisitNotification(id: string): Promise<any> {
    try {
      const response = await this.http.get(`${this.url}/${this.mainModule}/${id}/sendToPrestador`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).toPromise();

      return response;
    } catch (error) {
      console.error('Error sending visit notification:', error);
      throw error;
    }
  }

  /**
   * Creates a new nota aclaratoria
   * @param notaData The nota aclaratoria data
   * @returns Promise with created nota data or error
   */
  async createNotaAclaratoria(notaData: any): Promise<any | TrackHttpError> {
    const controller = new AbortController();
    try {
      const request = await fetch(`${this.url}/${this.mainModule}/notas`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(notaData),
      });

      const data = await request.json();
      data.ok = request.ok;

      return data;
    } catch (error) {
      console.error('Error creating nota aclaratoria:', error);
      throw error;
    } finally {
      controller.abort();
    }
  }
} 