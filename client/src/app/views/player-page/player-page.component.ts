import { Component, OnInit } from '@angular/core';
import { PlayerListComponent } from './player-list/player-list.component';
import { ApiService } from '../../core/services/api.service';
import { SearchService } from '../../core/services/search.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

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
  showToast: boolean = false;
  toastMessage: string = '';
  toastSize: string = '';
  isLoggedIn = false;

  constructor(
    private searchService: SearchService,
    private apiService: ApiService,
    private authService: AuthService
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
      this.toastMessage =
        'Error: Debes estar logueado para descargar el archivo.';
      this.toastSize = 'danger';
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 1000);
      return;
    }

    this.isExporting = true;
    this.showToast = true;
    this.toastMessage = `Descargando...`;
    this.toastSize = 'success';

    this.apiService.exportCSV(this.currentSearchTerm).subscribe({
      next: (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'players.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error al exportar CSV:', error);
        this.toastMessage = 'Error al descargar el archivo.';
        this.toastSize = 'danger';
      },
      complete: () => {
        setTimeout(() => {
          this.showToast = false;
        }, 1000);
        setTimeout(() => {
          this.isExporting = false;
        }, 3000);
      },
    });
  }
}
