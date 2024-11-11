import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilsService } from '../../core/services/utils.service';
import { ToastComponent } from '../../core/components/toast/toast.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  username: string = '';
  password: string = '';
  isLogin: boolean = true;
  isLoggedIn: boolean = false;
  error: string | null = null;
  showToast: boolean = false;
  toastMessage: string = '';
  toastSize: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.authService.getAuthStatus().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      if (this.isLoggedIn) {
        this.isLogin = true;
      } else {
        this.isLogin = false;
      }
    });
  }

  onLogin(): void {
    this.authService.login(this.username, this.password).subscribe(
      (res) => {
        this.utilsService.showToastWithMessage(
          this,
          res.message,
          'success',
          5000
        );
        this.router.navigate(['/settings']);
      },
      (error) => {
        this.error = error.error.message || 'An unexpected error occurred.';
      }
    );
  }

  onRegister() {
    this.authService.register(this.username, this.password).subscribe(
      (res) => {
        this.utilsService.showToastWithMessage(
          this,
          res.message,
          'success',
          5000
        );
        this.toggleForm();
      },
      (error) => {
        this.error = error.error.message || 'An unexpected error occurred.';
      }
    );
  }

  toggleForm() {
    this.isLogin = !this.isLogin;
  }

  clearError(): void {
    this.error = null;
  }
}
