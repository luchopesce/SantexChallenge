import { Component, OnInit } from '@angular/core';
import { PlayerEditComponent } from '../player-edit/player-edit.component';
import { CommonModule } from '@angular/common';
import { PlayerDetailComponent } from '../player-detail/player-detail.component';
import { AuthService } from '../../../core/services/auth.service';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { SearchService } from '../../../core/services/search.service';
import * as bootstrap from 'bootstrap';
import { UtilsService } from '../../../core/services/utils.service';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [
    PlayerEditComponent,
    CommonModule,
    PlayerDetailComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss'],
})
export class PlayerListComponent implements OnInit {
  isLoggedIn = false;
  isLoading: boolean = false;
  error: string | null = null;
  sortBy: string = '';
  playersList: any[] = [];
  selectedPlayer: any;
  totalResults: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  searchTerm: string = '';
  originalPlayer: any = null;
  private playerCache: { [cacheKey: string]: any } = {};

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private searchService: SearchService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.setupSearchListener();
    this.getAllPlayers();
  }

  setupSearchListener() {
    this.searchService.currentSearchTerm
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.searchTerm = value;
        this.currentPage = 1;
        this.getAllPlayers();
      });
  }

  getAllPlayers() {
    this.isLoading = true;
    this.error = null;

    this.apiService
      .getPlayers(
        this.currentPage,
        this.itemsPerPage,
        this.searchTerm,
        this.sortBy
      )
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: (res: any) => {
          this.playersList = res.data;
          this.totalResults = res.pagination.totalResults;
          this.totalPages = res.pagination.totalPages;
        },
        error: (error) => {
          const errorMessage = error?.message || 'Error desconocido';
          this.error = this.utilsService.handleError(
            errorMessage,
            'fetching list of players'
          );
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  getPlayerById(player: any) {
    this.isLoading = true;
    this.error = null;

    const cacheKey = `${player.player_id}-${player.fifa_version}-${player.updatedAt}`;

    if (this.playerCache[cacheKey]) {
      this.selectedPlayer = this.playerCache[cacheKey];
      this.isLoading = false;
      return;
    }

    this.apiService
      .getById(player)
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: (res: any) => {
          this.selectedPlayer = res.data;
          this.playerCache[cacheKey] = this.selectedPlayer;
        },
        error: (error) => {
          const errorMessage = error?.message || 'Error desconocido';
          this.error = this.utilsService.handleError(
            errorMessage,
            'fetching this player'
          );
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  updatePlayer(updatedPlayer: any) {
    if (!this.originalPlayer?.player_id || !this.originalPlayer?.fifa_version) {
      this.error = 'Jugador inválido o datos faltantes';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.apiService.updatePlayer(this.originalPlayer, updatedPlayer).subscribe({
      next: (res: any) => {
        const updatedPlayerData = res.data;
        const index = this.playersList.findIndex(
          (p) =>
            p.player_id === this.originalPlayer.player_id &&
            p.fifa_version === this.originalPlayer.fifa_version
        );
        if (index !== -1) {
          this.playersList[index] = updatedPlayerData;
        }

        this.closeModal('editModal');
      },
      error: (error) => {
        const errorMessage = error?.message || 'Error desconocido';
        this.error = this.utilsService.handleError(
          errorMessage,
          'updating players'
        );
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  deletePlayer(player: any) {
    this.isLoading = true;
    this.error = null;

    this.apiService.deletePlayer(player).subscribe({
      next: (res: any) => {
        const playerDeleted = res.data;
        const index = this.playersList.findIndex(
          (p) =>
            p.player_id === playerDeleted.player_id &&
            p.fifa_version === playerDeleted.fifa_version
        );
        if (index !== -1) {
          this.playersList.splice(index, 1);
        }
        this.closeModal('confirmDeleteModal');
      },
      error: (error) => {
        const errorMessage = error?.message || 'Error desconocido';
        this.error = this.utilsService.handleError(
          errorMessage,
          'deleted player'
        );
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.getAllPlayers();
  }

  updateItemsPerPage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newLimit = parseInt(target.value, 10);
    if (!isNaN(newLimit)) {
      this.itemsPerPage = newLimit;
      this.currentPage = 1;
      this.getAllPlayers();
    }
  }

  closeModal(modalId) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  openModal(modalId, player) {
    this.originalPlayer = JSON.parse(JSON.stringify(player));
    this.getPlayerById(player);
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}
