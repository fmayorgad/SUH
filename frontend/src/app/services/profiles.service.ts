import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@env/environment';
import { TrackHttpError } from '@interfaces/general.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfilesService {
  constructor(private http: HttpClient) {}

  url = `${environment.ivc.protocol + environment.ivc.server}:${
    environment.ivc.port
  }/v${environment.ivc.defaultVersion}`;

  mainModule = 'profile';
  associateModule = 'AssociateProfiles';

  async getAllProfiles(filters: any = {}): Promise<any | TrackHttpError> {
    const controller = new AbortController();
    try {
      const params = new URLSearchParams();
      
      if (filters.searchText) {
        params.append('searchText', filters.searchText);
      }
      
      if (filters.take !== undefined) {
        params.append('take', filters.take.toString());
      }
      
      if (filters.skip !== undefined) {
        params.append('skip', filters.skip.toString());
      }
      
      const request = await fetch(`${this.url}/${this.mainModule}?${params}`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!request.ok) {
        return {
          ok: false,
          message: `Error del servidor: ${request.status} ${request.statusText}`
        };
      }
      
      const data = await request.json();
      
      return {
        ok: true,
        data: data.profiles || data,
        total: data.total || (Array.isArray(data.profiles) ? data.profiles.length : 0)
      };
    } catch (error) {
      console.error('Error in getAllProfiles:', error);
      return {
        ok: false,
        message: error instanceof Error ? error.message : 'Error desconocido al obtener perfiles'
      };
    } finally {
      controller.abort();
    }
  }
  
  async getProfilePermissions(profileId: string): Promise<any | TrackHttpError> {
    const controller = new AbortController();
    try {
      const request = await fetch(`${this.url}/${this.mainModule}/${profileId}`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (request.ok) {
        const profileData = await request.json();
        console.log('Profile data:', profileData);
        
        if (profileData && profileData.role) {
          return {
            ok: true,
            data: profileData.role
          };
        }
      }
      
      console.log('Falling back to AssociateProfiles endpoint');
      
      // Fallback to the AssociateProfiles endpoint
      const associationsRequest = await fetch(`${this.url}/${this.associateModule}/${profileId}`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!associationsRequest.ok) {
        return {
          ok: false,
          message: `Error del servidor: ${associationsRequest.status} ${associationsRequest.statusText}`
        };
      }
      
      const data = await associationsRequest.json();
      console.log('Associations data:', data);
      
      return {
        ok: true,
        data: data.associate || []
      };
    } catch (error) {
      console.error('Error in getProfilePermissions:', error);
      return {
        ok: false,
        message: error instanceof Error ? error.message : 'Error desconocido al obtener permisos del perfil'
      };
    } finally {
      controller.abort();
    }
  }

  async getAllModules(): Promise<any | TrackHttpError> {
    const controller = new AbortController();
    try {
      const request = await fetch(`${this.url}/modules`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!request.ok) {
        return {
          ok: false,
          message: `Error del servidor: ${request.status} ${request.statusText}`
        };
      }
      
      const data = await request.json();
      
      return {
        ok: true,
        data: data.modules || []
      };
    } catch (error) {
      console.error('Error in getAllModules:', error);
      return {
        ok: false,
        message: error instanceof Error ? error.message : 'Error desconocido al obtener módulos'
      };
    } finally {
      controller.abort();
    }
  }

  async getAllPermissions(): Promise<any | TrackHttpError> {
    const controller = new AbortController();
    try {
      const request = await fetch(`${this.url}/permissions`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!request.ok) {
        return {
          ok: false,
          message: `Error del servidor: ${request.status} ${request.statusText}`
        };
      }
      
      const data = await request.json();
      
      return {
        ok: true,
        data: data.permissions || []
      };
    } catch (error) {
      console.error('Error in getAllPermissions:', error);
      return {
        ok: false,
        message: error instanceof Error ? error.message : 'Error desconocido al obtener permisos'
      };
    } finally {
      controller.abort();
    }
  }

  async saveProfilePermissions(profileId: string, associations: any[]): Promise<any | TrackHttpError> {
    const controller = new AbortController();
    try {
      const request = await fetch(`${this.url}/${this.associateModule}/associate-modules-permissions?ProfileId=${profileId}`, {
        method: 'PUT',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(associations),
      });
      
      if (!request.ok) {
        return {
          ok: false,
          message: `Error del servidor: ${request.status} ${request.statusText}`
        };
      }
      
      const data = await request.json();
      
      return {
        ok: true,
        data: data.data || data
      };
    } catch (error) {
      console.error('Error in saveProfilePermissions:', error);
      return {
        ok: false,
        message: error instanceof Error ? error.message : 'Error desconocido al guardar permisos del perfil'
      };
    } finally {
      controller.abort();
    }
  }
} 