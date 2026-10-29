import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/env';
import { IAuthResponse, IUser, IAddress } from '../models/iuser';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _http = inject(HttpClient);
  private _router = inject(Router);
  private _apiURL = environment.apiURL;

  currentUser = signal<IUser | null>(this.getStoredUser());
  token = signal<string | null>(this.getStoredToken());

  private getStoredToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('hein_token');
    }
    return null;
  }

  private getStoredUser(): IUser | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = localStorage.getItem('hein_user');
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.token();
  }

  isAdmin(): boolean {
    const user = this.currentUser();
    return user?.role === 'admin';
  }

  login(credentials: { email: string; password?: string; passwordHash?: string }) {
    const payload = {
      email: credentials.email,
      password: credentials.password,
      passwordHash: credentials.passwordHash || credentials.password,
    };

    return this._http.post<IAuthResponse>(this._apiURL + 'auth/login', payload).pipe(
      tap((res) => {
        let tokenStr = '';
        let userData: IUser | null = null;

        if (typeof res.data === 'string') {
          tokenStr = res.data;

          try {
            const payloadPart = tokenStr.split('.')[1];
            const decoded = JSON.parse(atob(payloadPart));
            userData = {
              _id: decoded._id,
              firstName: decoded.firstName,
              lastName: decoded.lastName,
              email: decoded.email,
              role: decoded.role,
            };
          } catch (e) {
            console.error('Failed to parse token payload', e);
          }
        } else if (res.data && res.data.token) {
          tokenStr = res.data.token;
          userData = res.data.user;
        }

        if (tokenStr) {
          this.setSession(tokenStr, userData);
        }
      })
    );
  }

  register(userData: { firstName: string; lastName: string; email: string; password?: string; phone?: string }) {
    const payload = {
      ...userData,
      passwordHash: userData.password,
    };
    return this._http.post<{ message: string; data: IUser }>(this._apiURL + 'user', payload);
  }

  setSession(token: string, user: IUser | null) {
    this.token.set(token);
    this.currentUser.set(user);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('hein_token', token);
      if (user) {
        localStorage.setItem('hein_user', JSON.stringify(user));
      }
    }
  }

  logout() {
    this.token.set(null);
    this.currentUser.set(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('hein_token');
      localStorage.removeItem('hein_user');
    }
    this._router.navigate(['/home']);
  }

  getProfile() {
    return this._http.get<{ data: IUser }>(this._apiURL + 'user/profile').pipe(
      tap((res) => {
        if (res.data) {
          this.currentUser.set(res.data);
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('hein_user', JSON.stringify(res.data));
          }
        }
      })
    );
  }

  updateProfile(profile: { firstName: string; lastName: string; phone?: string }) {
    return this._http.put<{ message: string; data: IUser }>(this._apiURL + 'user/profile', profile).pipe(
      tap((res) => {
        if (res.data) {
          this.currentUser.set(res.data);
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('hein_user', JSON.stringify(res.data));
          }
        }
      })
    );
  }

  addAddress(address: IAddress) {
    return this._http.post<{ message: string; data: IAddress[] }>(this._apiURL + 'user/addresses', address);
  }

  deleteAddress(addressId: string) {
    return this._http.delete<{ message: string; data: IAddress[] }>(this._apiURL + 'user/addresses/' + addressId);
  }

  getAllUsers() {
    return this._http.get<{ message: string; data: IUser[] }>(this._apiURL + 'user');
  }
}
