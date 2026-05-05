import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {


  mode: 'login' | 'forget' | 'verify' | 'reset' = 'login';
  email = '';
  password = '';
  otp = '';
  newPassword = '';
  tempToken = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  async onLogin() {
    if (!this.email || !this.password) {
      this.error = 'Email and password are required';
      return;
    }
    this.loading = true;
    this.error = '';
    try {
      console.log(this.email);

      const success = await this.auth.login(this.email, this.password);
      if (success) {
        this.router.navigate(['/ayaDashboard']);
      } else {
        this.error = 'Invalid email or password';
      }
    } catch (err) {
      this.error = 'Login failed';
    } finally {
      this.loading = false;
    }
  }

async onForget() {
  this.loading = true;
  this.error = '';
  try {
    const res: any = await this.auth.forgetPassword({ email: this.email });
    console.log(res);

    if (res && res.token) {
      this.tempToken = res.token;
      this.mode = 'verify';
      console.log('OTP sent successfully!');
    }
  } catch (err: any) {
    this.error = err.error?.message || 'Something went wrong';
    console.error('Error details:', err);
  } finally {
    this.loading = false;
  }
}

  async onVerify() {
    this.error = '';
    try {
      const res: any = await this.auth.verifyOtp({ token: this.tempToken, otp: this.otp });
      if (res.success) {
        this.mode = 'reset';
      }
    } catch (err) {
      this.error = 'Invalid OTP code';
    }
  }

  async onReset() {
    this.loading = true;
    this.error = '';
    try {
      await this.auth.resetPassword({
        token: this.tempToken,
        password: this.newPassword,
      });
      this.mode = 'login';
      this.password = '';
      this.otp = '';
    } catch (err) {
      this.error = 'Failed to update password';
    } finally {
      this.loading = false;
      this.router.navigateByUrl("/ayaDashBaord")
    }
  }
}
