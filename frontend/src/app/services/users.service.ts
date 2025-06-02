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
import { User } from '@interfaces/users.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  url = `${environment.ivc.protocol + environment.ivc.server}:${
    environment.ivc.port
  }/v${environment.ivc.defaultVersion}`;

  mainModule = 'users';

  getVerificadores(filter?: string): Observable<User[] | TrackHttpError> {
    let url = `${this.url}/${this.mainModule}/verificadores`;
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

  private handleHttpError(error: any): Observable<TrackHttpError> {
    if (error.status === 401) {
      //this.authService.logoutToRefresh();
    } else {
      return throwError(() => new Error('test'))
    }
    return throwError(() => new Error('test')) // Add this line to return a value at the end of the function
  }

  async getAllverificadores(): Promise< any | TrackHttpError> {
    const controller = new AbortController();
    try {
      const request = await fetch(`${this.url}/${this.mainModule}/verificadores`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
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
  
  async getAllUsers(filters: any): Promise<any | TrackHttpError> {
    const controller = new AbortController();
    try {
      const params = new URLSearchParams();
      
      // Add general filters
      if (filters.searchText) {
        params.append('searchText', filters.searchText);
      }
      
      if (filters.take !== undefined) {
        params.append('take', filters.take.toString());
      }
      
      if (filters.skip !== undefined) {
        params.append('skip', filters.skip.toString());
      }
      
      // Add profile filter
      if (filters.profileId && filters.profileId.length > 0) {
        if (Array.isArray(filters.profileId)) {
          filters.profileId.forEach((profileId: any) => {
            params.append('profileId', profileId.id);
          });
        } else {
          params.append('profileId', filters.profileId);
        }
      }
      
      // Add state filter
      if (filters.state && filters.state.length > 0) {
        if (Array.isArray(filters.state)) {
          filters.state.forEach((state: any) => {
            params.append('state', state.id);
          });
        } else {
          params.append('state', filters.state);
        }
      }

      console.log(`Calling API: ${this.url}/${this.mainModule}?${params}`);
      
      const request = await fetch(`${this.url}/${this.mainModule}?${params}`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!request.ok) {
        console.error(`API Error: ${request.status} ${request.statusText}`);
        return {
          ok: false,
          message: `Error del servidor: ${request.status} ${request.statusText}`
        };
      }
      
      const data = await request.json();
      
      // Ensure proper structure even if API returns different format
      const result = {
        ok: true,
        data: Array.isArray(data) ? data : (data.data || []),
        total: data.total || (Array.isArray(data) ? data.length : 0)
      };
      
      console.log('API result structure:', result);
      
      return result;
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      return {
        ok: false,
        message: error instanceof Error ? error.message : 'Error desconocido al obtener usuarios'
      };
    } finally {
      controller.abort();
    }
  }

  async createUser(userData: any): Promise<any | TrackHttpError> {
    const controller = new AbortController();
    try {
      const request = await fetch(`${this.url}/${this.mainModule}`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(userData),
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

  async createUserWithSignature(formData: FormData): Promise<any | TrackHttpError> {
    const controller = new AbortController();
    try {
      const request = await fetch(`${this.url}/${this.mainModule}/create`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          // Don't set Content-Type header for FormData - browser will set it with boundary
        },
        body: formData,
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

  async updateUser(userId: string, userData: any): Promise<any | TrackHttpError> {
    const controller = new AbortController();
    try {
      const request = await fetch(`${this.url}/${this.mainModule}/${userId}`, {
        method: 'PUT',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(userData),
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

  async updateUserWithSignature(userId: string, formData: FormData): Promise<any | TrackHttpError> {
    const controller = new AbortController();
    try {
      const request = await fetch(`${this.url}/${this.mainModule}/${userId}`, {
        method: 'PUT',
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          // Don't set Content-Type header for FormData - browser will set it with boundary
        },
        body: formData,
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

  async updateUserState(userId: string, newState: string): Promise<any | TrackHttpError> {
    const controller = new AbortController();
    try {
      const request = await fetch(`${this.url}/${this.mainModule}/${userId}/state`, {
        method: 'PATCH',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ state: newState }),
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

  async deleteUser(userId: string): Promise<any | TrackHttpError> {
    const controller = new AbortController();
    try {
      const request = await fetch(`${this.url}/${this.mainModule}/${userId}`, {
        method: 'DELETE',
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
