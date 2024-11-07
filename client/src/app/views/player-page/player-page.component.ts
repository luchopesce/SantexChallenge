import { Component, OnInit } from '@angular/core';
import { PlayerListComponent } from './player-list/player-list.component';
import { ApiService } from '../../core/services/api.service';
import { SearchService } from '../../core/services/search.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { UtilsService } from '../../core/services/utils.service';

@Component({
  selector: 'app-player-page',
  standalone: true,
  imports: [PlayerListComponent, CommonModule],
  templateUrl: './player-page.component.html',
  styleUrls: ['./player-page.component.scss'],
})
export class PlayerPageComponent implements OnInit {
  currentSearchTerm: string = '';
  isExporting: boolean = false;
  isImporting: boolean = false;
  showToast: boolean = false;
  toastMessage: string = '';
  toastSize: string = '';
  isLoggedIn = false;

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
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  exportCSV() {
    if (!this.authService.isLoggedIn()) {
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
        console.error('Error al exportar CSV:', error.message);
        this.utilsService.showToastWithMessage(
          this,
          `Error: ${error.message}`,
          'danger'
        );
      },
      complete: () => {
        this.isExporting = false;
      },
    });
  }

  importCSV(event: any) {
    if (!this.authService.isLoggedIn()) {
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
          `Error: ${error.message}`,
          'danger'
        );
      },
      complete: () => {
        this.isImporting = false;
      },
    });
  }
}
