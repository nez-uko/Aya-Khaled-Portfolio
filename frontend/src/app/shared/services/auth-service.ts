import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { ForgetPassword, LoginResponse, ResetPassword, User, VerifyOTP } from '../interfaces/portfolio-interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiUrl;

  isLoggedIn = signal<boolean>(false);
  currentUser = signal<User | null>(null);

  constructor(private _httpClient:HttpClient,private router:Router) {
    this.checkToken();
  }

  private checkToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedIn.set(true);
      this.getProfile();
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this._httpClient.post<LoginResponse>(`${this.baseUrl}/auth/login`, { email, password })
      );

      localStorage.setItem('token', response.token);
      this.isLoggedIn.set(true);
      this.currentUser.set(response.user);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getProfile(): Promise<void> {
    try {
      const user = await firstValueFrom(
        this._httpClient.get<User>(`${this.baseUrl}/portfolio/`)
      );
      this.currentUser.set(user);
    } catch (error) {
      
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isLoggedIn.set(false);
    this.currentUser.set(null);
    this.router.navigateByUrl('/login');
  }

    async forgetPassword(emailForm:Partial<ForgetPassword>):Promise<any>{
      return await firstValueFrom(this._httpClient.post(`${this.baseUrl}/auth/forget-password`,emailForm));
  }

  async verifyOtp(otpForm:Partial<VerifyOTP>):Promise<any>{
      return await firstValueFrom(this._httpClient.post(`${this.baseUrl}/auth/verfiy-otp`,otpForm));
  }
  async resetPassword(passwordForm:Partial<ResetPassword>):Promise<any>{
      return await firstValueFrom(this._httpClient.post(`${this.baseUrl}/auth/forget-password`,passwordForm));
  }
  async refreshToken() {
  return await firstValueFrom(this._httpClient.post(`${this.baseUrl}/auth/refresh-token`, {}, {
    withCredentials: true
  }));
}
}
