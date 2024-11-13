import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UtilsService } from '../../core/services/utils.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
})
export class SettingsPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  isLoggedIn: boolean = false;
  isLoading: boolean = false;
  error: any | null = null;
  userData: any;

  constructor(
    private authService: AuthService,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getUser() {
    this.isLoading = true;
    this.error = null;

    this.authService
      .getUserData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.userData = res.data;
          console.log(this.userData);
        },
        error: (error) => {
          this.error = error ? error : 'Problemas internos';
          this.handleError(this.error, 'fetching data of player');
          this.isLoading = false;
        },
        complete: () => (this.isLoading = false),
      });
  }

  private handleError(error: any, context: string) {
    const errorMessage = error?.message || 'Error desconocido';
    this.error = this.utilsService.handleError(errorMessage, context);
  }

  onSubmit(): void {
    if (this.newPassword === this.confirmPassword) {
      alert('Contraseña cambiada con éxito');
    } else {
      alert('Las contraseñas no coinciden');
    }
  }
}
