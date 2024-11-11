import { Component, OnInit, ViewChild } from '@angular/core';
import { PlayerListComponent } from './player-list/player-list.component';
import { ApiService } from '../../core/services/api.service';
import { SearchService } from '../../core/services/search.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { UtilsService } from '../../core/services/utils.service';
import * as bootstrap from 'bootstrap';
import { PlayerCreateComponent } from './player-create/player-create.component';
import { ToastComponent } from '../../core/components/toast/toast.component';

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
  @ViewChild(PlayerCreateComponent)
  playerCreateComponent!: PlayerCreateComponent;

  currentSearchTerm: string = '';
  isExporting: boolean = false;
  isImporting: boolean = false;
  showToast: boolean = false;
  toastMessage: string = '';
  toastSize: string = '';
  isLoggedIn = false;
  isLoading: boolean = false;
  error: any | null = null;

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
    this.authService.getAuthStatus().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  createPlayer(newPlayer: any) {
    if (!this.isLoggedIn) {
      this.utilsService.showToastWithMessage(
        this,
        'Error: Debes estar logueado para crear un jugador.',
        'danger'
      );
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      this.apiService.createPlayer(newPlayer).subscribe({
        next: (res: any) => {
          this.utilsService.showToastWithMessage(
            this,
            res.message,
            'success',
            5000
          );

          this.closeModalCreate();
        },
        error: (error) => {
          this.error = error.error.message
            ? error.error.message
            : 'Problemas internos';
          this.utilsService.showToastWithMessage(
            this,
            `Error: ${this.error}`,
            'danger',
            5000
          );
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }, 2000);
  }

  exportCSV() {
    if (!this.isLoggedIn) {
      this.utilsService.showToastWithMessage(
        this,
        'Error: Debes estar logueado para descargar el archivo.',
        'danger'
      );
      return;
    }

    this.isExporting = true;

    this.apiService.exportCSV(this.currentSearchTerm).subscribe({
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
        this.utilsService.showToastWithMessage(
          this,
          `Error: ${error.error.message}`,
          'danger'
        );
        this.isExporting = false;
      },
      complete: () => {
        this.isExporting = false;
      },
    });
  }

  importCSV(event: any) {
    if (!this.isLoggedIn) {
      this.utilsService.showToastWithMessage(
        this,
        'Error: Debes estar logueado para importar un archivo.',
        'danger'
      );
      return;
    }

    const file = event.target.files[0];
    if (!file) {
      this.utilsService.showToastWithMessage(
        this,
        'Error: No se ha seleccionado ningún archivo.',
        'danger'
      );
      return;
    }

    this.isImporting = true;
    const formData = new FormData();
    formData.append('file', file);

    this.apiService.importCSV(formData).subscribe({
      next: (res) => {
        this.utilsService.showToastWithMessage(
          this,
          res.message,
          'success',
          5000
        );
      },
      error: (error) => {
        this.utilsService.showToastWithMessage(
          this,
          `Error: ${error.error.message}`,
          'danger'
        );
        this.isImporting = false;
      },
      complete: () => {
        this.isImporting = false;
      },
    });
  }

  openModalCreate() {
    this.playerCreateComponent.resetForm();
    const modalElement = document.getElementById('createPlayerModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  closeModalCreate() {
    const modalElement = document.getElementById('createPlayerModal');
    const modalInstance = modalElement
      ? bootstrap.Modal.getInstance(modalElement)
      : null;
    modalInstance?.hide();
  }
}
