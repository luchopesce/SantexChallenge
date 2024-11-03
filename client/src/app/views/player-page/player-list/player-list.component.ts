import { Component, OnInit } from '@angular/core';
import { PlayerEditComponent } from '../player-edit/player-edit.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PlayerDetailComponent } from '../player-detail/player-detail.component';
import { AuthService } from '../../../core/services/auth.service';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { SearchService } from '../../../core/services/search.service';

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
  totalResults: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  searchTerm: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
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
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(
        (res: any) => {
          this.playersList = res.payload.payload;
          this.totalResults = res.payload.totalResults;
          this.totalPages = res.payload.totalPages;
        },
        (error) => {
          this.error = 'Problems in fetch';
          console.error('Error fetching players:', error);
        }
      );
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
}
