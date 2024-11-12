import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlayerEditComponent } from '../player-edit/player-edit.component';
import { CommonModule } from '@angular/common';
import { PlayerDetailComponent } from '../player-detail/player-detail.component';
import { AuthService } from '../../../core/services/auth.service';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { SearchService } from '../../../core/services/search.service';
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
  private destroy$ = new Subject<void>();

  isLoggedIn: boolean = false;
  isLoading: boolean = false;
  error: any | null = null;

  showToast: boolean = false;
  toastMessage: string = '';
  toastSize: string = '';

  playersList: any[] = [];
  historyPlayer: any[] = [];
  originalPlayer: any = null;
  selectedPlayer: any;

  searchTerm: string = '';
  totalResults: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  sortBy: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private searchService: SearchService,
    private utilsService: UtilsService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    this.authService
      .getAuthStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn) => {
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
        const indexToDelete = this.playersList.findIndex(
          (p) => p.player_id === player.player_id
        );

        if (indexToDelete !== -1) {
          this.playersList.splice(indexToDelete, 1);
        }
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
      this.refreshPlayers(1);
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

  private getAllPlayers() {
    this.isLoading = true;
    this.error = null;

    this.apiService
      .getPlayers(
        this.currentPage,
        this.itemsPerPage,
        this.searchTerm,
        this.sortBy,
        this.sortDirection
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.playersList = res.data;
          this.totalResults = res.pagination.totalResults;
          this.totalPages = res.pagination.totalPages;
        },
        error: (error) => {
          this.error = error ? error : 'Problemas internos';
          this.handleError(this.error, 'fetching list of players');
          this.isLoading = false;
        },
        complete: () => (this.isLoading = false),
      });
  }

  private getPlayerById(player: any) {
    this.isLoading = true;
    this.error = null;

    const cacheKey = `${player.player_id}-${player.fifa_version}-${player.updatedAt}`;
    if (this.utilsService.isCacheValid(cacheKey)) {
      this.selectedPlayer = this.utilsService.getPlayerFromCache(cacheKey);
      this.isLoading = false;
      return;
    }

    this.apiService
      .getById(player)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          setTimeout(() => {
            this.selectedPlayer = res.data;
            this.utilsService.setPlayerInCache(cacheKey, this.selectedPlayer);
          }, 1000);
        },
        error: (error) => {
          this.error = error ? error : 'Problemas internos';
          this.handleError(this.error, 'fetching this player');
          this.isLoading = false;
        },
        complete: () => (this.isLoading = false),
      });
  }

  private getPlayerHistory(playerId: any) {
    this.isLoading = true;
    this.error = null;

    this.apiService
      .getPlayerHistory(playerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.historyPlayer = res.data;
        },
        error: (error) => {
          this.error = error ? error : 'Problemas internos';
          this.handleError(this.error, 'fetching history of player');
          this.isLoading = false;
        },
        complete: () => (this.isLoading = false),
      });
  }

  private refreshPlayers(page?: number, itemsPerPage?: number): void {
    this.currentPage = page ?? this.currentPage;
    this.itemsPerPage = itemsPerPage ?? this.itemsPerPage;
    this.getAllPlayers();
  }

  updatePlayer(updatedPlayer: any) {
    this.checkLoginStatus();
    this.isLoading = true;
    this.error = null;

    setTimeout(() => {
      this.apiService
        .updatePlayer(this.originalPlayer, updatedPlayer)
        .pipe(takeUntil(this.destroy$))
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
          error: (error) => {
            this.error = error ? error : 'Problemas internos';
            this.handleError(this.error, 'updating list of players');
            this.isLoading = false;
          },
          complete: () => (this.isLoading = false),
        });
    }, 3000);
  }

  deletePlayer(player: any) {
    this.checkLoginStatus();
    this.isLoading = true;
    this.error = null;

    setTimeout(() => {
      this.apiService
        .deletePlayer(player)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            this.utilsService.showToastWithMessage(
              this,
              res.message,
              'success',
              5000
            );
            this.closeModal('confirmDeleteModal');
          },
          error: (error) => {
            this.error = error ? error : 'Problemas internos';
            this.handleError(this.error, 'updating list of players');
            this.isLoading = false;
          },
          complete: () => (this.isLoading = false),
        });
    }, 3000);
  }

  toggleSort(field: string) {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDirection = 'asc';
    }
    this.refreshPlayers(1);
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

  openModal(modalId: string, player: any) {
    this.originalPlayer = JSON.parse(JSON.stringify(player));
    this.getPlayerById(player);
    this.getPlayerHistory(player.player_id);
    this.utilsService.openModal(modalId);
  }

  closeModal(modalId: string) {
    this.selectedPlayer = null;
    this.utilsService.closeModal(modalId);
  }

  private handleError(error: any, context: string) {
    const errorMessage = error?.message || 'Error desconocido';
    this.error = this.utilsService.handleError(errorMessage, context);
  }
}
