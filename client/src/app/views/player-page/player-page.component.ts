import { Component, OnInit } from '@angular/core';
import { PlayerListComponent } from './player-list/player-list.component';
import { ApiService } from '../../core/services/api.service';
import { SearchService } from '../../core/services/search.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { UtilsService } from '../../core/services/utils.service';
import { PlayerCreateComponent } from './player-create/player-create.component';
import { ToastComponent } from '../../core/components/toast/toast.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-player-page',
  standalone: true,
  imports: [
    CommonModule,
    PlayerListComponent,
    PlayerCreateComponent,
    ToastComponent,
  ],
  templateUrl: './player-page.component.html',
  styleUrls: ['./player-page.component.scss'],
})
export class PlayerPageComponent implements OnInit {
  private destroy$ = new Subject<void>();

  isLoggedIn: boolean = false;
  isLoading: boolean = false;
  error: any | null = null;

  showToast: boolean = false;
  toastMessage: string = '';
  toastSize: string = '';
  currentSearchTerm: string = '';

  constructor(
    private searchService: SearchService,
    private apiService: ApiService,
    private authService: AuthService,
    private utilsService: UtilsService
  ) {
    this.searchService.currentSearchTerm.subscribe((term) => {
      this.currentSearchTerm = term;
    });
  }

  ngOnInit() {
    this.authService
      .getAuthStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkLoginStatus(): boolean {
    if (!this.isLoggedIn) {
      this.utilsService.showToastWithMessage(
        this,
        'Error: Debes estar logueado para crear un jugador.',
        'danger'
      );
      return false;
    }
    return true;
  }

  createPlayer(newPlayer: any) {
    this.checkLoginStatus();
    this.isLoading = true;
    this.error = null;

    setTimeout(() => {
      this.apiService
        .createPlayer(newPlayer)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            this.utilsService.showToastWithMessage(
              this,
              res.message,
              'success',
              5000
            );
            this.closeModal('createPlayerModal');
          },
          error: (error) => {
            this.error = error.error?.message || 'Problemas internos';
            this.utilsService.showToastWithMessage(
              this,
              `Error: ${this.error}`,
              'danger',
              5000
            );
            this.isLoading = false;
          },
          complete: () => (this.isLoading = false),
        });
    }, 2000);
  }

  exportCSV() {
    if (!this.checkLoginStatus()) return;

    this.isLoading = true;
    this.error = null;

    this.apiService
      .exportCSV(this.currentSearchTerm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Blob) => {
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'players.csv';
          a.click();
          window.URL.revokeObjectURL(url);
          this.utilsService.showToastWithMessage(
            this,
            'Archivo descargado con éxito.',
            'success',
            1500
          );
        },
        error: (error) => {
          this.error = error.error?.message || 'Problemas internos';
          this.utilsService.showToastWithMessage(
            this,
            `Error: ${this.error}`,
            'danger',
            5000
          );
          this.isLoading = false;
        },
        complete: () => (this.isLoading = false),
      });
  }

  importCSV(event: any) {
    if (!this.checkLoginStatus()) return;

    const file = event.target.files[0];
    if (!file) {
      this.utilsService.showToastWithMessage(
        this,
        'Error: No se ha seleccionado ningún archivo.',
        'danger'
      );
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.isLoading = true;
    this.error = null;

    this.apiService
      .importCSV(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.utilsService.showToastWithMessage(
            this,
            res.message,
            'success',
            5000
          );
        },
        error: (error) => {
          this.error = error.error?.message || 'Problemas internos';
          this.utilsService.showToastWithMessage(
            this,
            `Error: ${this.error}`,
            'danger',
            5000
          );
          this.isLoading = false;
        },
        complete: () => (this.isLoading = false),
      });
  }

  openModal(modalId: string) {
    this.utilsService.openModal(modalId);
  }

  closeModal(modalId: string) {
    this.utilsService.closeModal(modalId);
  }
}
