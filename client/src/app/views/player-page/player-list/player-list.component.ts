import { Component, OnInit } from '@angular/core';
import { PlayerEditComponent } from '../player-edit/player-edit.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PlayerDetailComponent } from '../player-detail/player-detail.component';
import { AuthService } from '../../../core/services/auth.service';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
    RouterLink,
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
  private playerCache: { [id: string]: any } = {};

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private searchService: SearchService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.setupSearchListener();
    this.getAllPlayerList();
  }

  setupSearchListener() {
    this.searchService.currentSearchTerm
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.searchTerm = value;
        this.currentPage = 1;
        this.getAllPlayerList();
      });
  }

  getAllPlayerList() {
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
          this.playersList = res.payload.payload;
          this.totalResults = res.payload.totalResults;
          this.totalPages = res.payload.totalPages;
        },
        error: (error) => {
          this.error = this.utilsService.handleError(error, 'fetching players');
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  saveChanges() {
    if (this.selectedPlayer) {
      this.isLoading = true;
      this.error = null;

      this.apiService.updatePlayer(this.selectedPlayer).subscribe({
        next: (res: any) => {
          const updatedPlayer = res.payload;
          const index = this.playersList.findIndex(
            (p) => p.id === updatedPlayer.id
          );
          if (index !== -1) {
            this.playersList[index] = updatedPlayer;
          }
          this.closeModal('editModal');
        },
        error: (error) => {
          this.error = this.utilsService.handleError(error, 'updating players');
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }

  getPlayerById(playerId) {
    if (this.playerCache[playerId]) {
      this.selectedPlayer = this.playerCache[playerId];
      return;
    }
    this.isLoading = true;
    this.error = null;

    this.apiService
      .getById(playerId)
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: (res: any) => {
          this.selectedPlayer = res.payload;

          this.playerCache[playerId] = this.selectedPlayer;
          console.log(this.selectedPlayer.skills);
        },
        error: (error) => {
          this.error = this.utilsService.handleError(error, 'fetching players');
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  deletePlayer(playerId) {
    this.isLoading = true;
    this.error = null;

    if (playerId !== null) {
      this.apiService.deletePlayer(playerId).subscribe({
        next: (res: any) => {
          this.getAllPlayerList();
          this.closeModal('confirmDeleteModal');
        },
        error: (error) => {
          this.error = this.utilsService.handleError(error, 'delete players');
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.getAllPlayerList();
  }

  updateItemsPerPage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newLimit = parseInt(target.value, 10);
    if (!isNaN(newLimit)) {
      this.itemsPerPage = newLimit;
      this.currentPage = 1;
      this.getAllPlayerList();
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

  openModal(modalId, playerId) {
    this.getPlayerById(playerId);
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}
