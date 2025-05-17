import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GeneralUtilities } from '@utils/general.utils';

interface LoginResponse {
  token: string;
  userModules: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private generalUtilities: GeneralUtilities
  ) {}

  private apiUrl = this.generalUtilities.createMainUrl({});

  login(username: string, password: string): Observable<LoginResponse> {
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = JSON.stringify({ login: username, password });

    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, body, { headers })
      .pipe(
        map((response) => {
          if (response?.token) {
            localStorage.setItem('currentUser', JSON.stringify(response));
          }
          return response;
        })
      );
  }

  logout(): void {
    // Remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }

  public get loggedIn(): boolean {
    return localStorage.getItem('currentUser') !== null;
  }
}
