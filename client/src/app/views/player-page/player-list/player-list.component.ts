import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlayerEditComponent } from '../player-edit/player-edit.component';
import { CommonModule } from '@angular/common';
import { PlayerDetailComponent } from '../player-detail/player-detail.component';
import { AuthService } from '../../../core/services/auth.service';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  Subject,
  takeUntil,
} from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { SearchService } from '../../../core/services/search.service';
import * as bootstrap from 'bootstrap';
import { UtilsService } from '../../../core/services/utils.service';
import { SocketService } from '../../../core/services/socket.service';
import { ToastComponent } from '../../../core/components/toast/toast.component';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [
    PlayerEditComponent,
    CommonModule,
    PlayerDetailComponent,
    ReactiveFormsModule,
    ToastComponent,
  ],
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss'],
})
export class PlayerListComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  isLoading: boolean = false;
  error: any | null = null;
  sortBy: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  playersList: any[] = [];
  historyPlayer: any[] = [];
  selectedPlayer: any;
  totalResults: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  searchTerm: string = '';
  originalPlayer: any = null;
  showToast: boolean = false;
  toastMessage: string = '';
  toastSize: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private searchService: SearchService,
    private utilsService: UtilsService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    this.authService.getAuthStatus().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
    this.setupSearchListener();
    this.getAllPlayers();
    this.setupSocketListeners();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updatePlayersList(
    player: any,
    action: 'create' | 'update' | 'delete'
  ) {
    switch (action) {
      case 'create':
        this.playersList.push(player);
        break;
      case 'update':
        const indexToUpdate = this.playersList.findIndex(
          (p) => p.player_id === player.player_id
        );
        if (indexToUpdate !== -1) {
          this.playersList[indexToUpdate] = {
            ...this.playersList[indexToUpdate],
            ...player,
          };
        }
        break;
      case 'delete':
        this.playersList = this.playersList.filter(
          (p) => p.player_id !== player.player_id
        );
        break;
    }
  }

  private setupSocketListeners() {
    this.socketService.onPlayerCreated((newPlayer) => {
      this.updatePlayersList(newPlayer, 'create');
    });

    this.socketService.onPlayerUpdated((updatedPlayer) => {
      this.updatePlayersList(updatedPlayer, 'update');
    });

    this.socketService.onPlayerDeleted((deletedPlayer) => {
      this.updatePlayersList(deletedPlayer, 'delete');
    });

    this.socketService.onPlayerImport(() => {
      this.getAllPlayers();
    });
  }

  private setupSearchListener() {
    this.searchService.currentSearchTerm
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.searchTerm = value;
        this.refreshPlayers(1);
      });
  }

  toggleSort(field: string) {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDirection = 'asc';
    }
    this.getAllPlayers();
  }

  private getAllPlayers() {
    this.setLoadingState(true);
    this.apiService
      .getPlayers(
        this.currentPage,
        this.itemsPerPage,
        this.searchTerm,
        this.sortBy,
        this.sortDirection
      )
      .pipe(finalize(() => this.setLoadingState(false)))
      .subscribe({
        next: (res: any) => {
          this.playersList = res.data;
          this.totalResults = res.pagination.totalResults;
          this.totalPages = res.pagination.totalPages;
        },
        error: (error) => this.handleError(error, 'fetching list of players'),
      });
  }

  private getPlayerById(player: any) {
    const cacheKey = `${player.player_id}-${player.fifa_version}-${player.updatedAt}`;
    this.setLoadingState(true);

    if (this.utilsService.isCacheValid(cacheKey)) {
      this.selectedPlayer = this.utilsService.getPlayerFromCache(cacheKey);
      this.setLoadingState(false);
      return;
    }

    this.apiService.getById(player).subscribe({
      next: (res: any) => {
        setTimeout(() => {
          this.selectedPlayer = res.data;
          this.utilsService.setPlayerInCache(cacheKey, this.selectedPlayer);
        }, 1000);
      },
      error: (error) => {
        this.handleError(error, 'fetching this player');
      },
      complete: () => {
        this.setLoadingState(false);
      },
    });
  }

  private getPlayerHistory(playerId: any) {
    this.setLoadingState(true);
    this.apiService.getPlayerHistory(playerId).subscribe({
      next: (res: any) => {
        this.historyPlayer = res.data;
      },
      error: (error) => {
        this.handleError(error, 'fetching this player');
      },
      complete: () => {
        this.setLoadingState(false);
      },
    });
  }

  updatePlayer(updatedPlayer: any) {
    this.setLoadingState(true);
    setTimeout(() => {
      this.apiService
        .updatePlayer(this.originalPlayer, updatedPlayer)
        .subscribe({
          next: (res: any) => {
            this.utilsService.showToastWithMessage(
              this,
              res.message,
              'success',
              5000
            );
            this.closeModal('editModal');
          },
          error: (error) => this.handleError(error, 'updating players'),
          complete: () => this.setLoadingState(false),
        });
    }, 3000);
  }

  deletePlayer(player: any) {
    this.setLoadingState(true);
    setTimeout(() => {
      this.apiService.deletePlayer(player).subscribe({
        next: (res: any) => {
          this.utilsService.showToastWithMessage(
            this,
            res.message,
            'success',
            5000
          );
          this.closeModal('confirmDeleteModal');
        },
        error: (error) => this.handleError(error, 'deleting player'),
        complete: () => this.setLoadingState(false),
      });
    }, 3000);
  }

  private refreshPlayers(page?: number, itemsPerPage?: number): void {
    this.currentPage = page ?? this.currentPage;
    this.itemsPerPage = itemsPerPage ?? this.itemsPerPage;
    this.getAllPlayers();
  }

  changePage(page: number): void {
    this.refreshPlayers(page);
  }

  updateItemsPerPage(event: Event): void {
    const newLimit = parseInt((event.target as HTMLSelectElement).value, 10);
    if (!isNaN(newLimit)) {
      this.refreshPlayers(1, newLimit);
    }
  }

  async openModal(modalId: string, player: any) {
    this.error = null;
    this.originalPlayer = JSON.parse(JSON.stringify(player));
    try {
      const modalElement = document.getElementById(modalId);
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
      await this.getPlayerById(player);
      await this.getPlayerHistory(player.player_id);
    } catch (error) {
      this.utilsService.handleError(error, 'in open modal');
    }
  }

  closeModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    const modalInstance = modalElement
      ? bootstrap.Modal.getInstance(modalElement)
      : null;
    modalInstance?.hide();
    this.setLoadingState(false);
    this.selectedPlayer = null;
  }

  private handleError(error: any, context: string) {
    const errorMessage = error?.message || 'Error desconocido';
    this.error = this.utilsService.handleError(errorMessage, context);
  }

  private setLoadingState(isLoading: boolean) {
    this.isLoading = isLoading;
  }
}
