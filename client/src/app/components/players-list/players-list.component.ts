import { Component, OnInit } from '@angular/core';
import { PlayersService } from '../../services/players.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-players-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './players-list.component.html',
  styleUrl: './players-list.component.scss',
})
export class PlayersListComponent implements OnInit {
  filterSubject: Subject<any> = new Subject();
  data: any;
  page = 1;
  limit = 10;
  totalPages = 0;
  filters = { name: '', club: '', position: '' };
  limits = [10, 20, 50, 100, 200];

  constructor(private playerService: PlayersService) {}

  ngOnInit(): void {
    this.filterSubject
      .pipe(
        debounceTime(200),
        switchMap((filters) =>
          this.playerService.getPlayers(this.page, this.limit, filters)
        )
      )
      .subscribe({
        next: (data) => {
          this.data = data.payload;
          console.log(this.data);
        },
        error: (error) => {
          console.error(error);
          this.data = { results: [], totalPages: 0 };
        },
      });

    this.loadPlayers();
  }

  loadPlayers(): void {
    this.filterSubject.next(this.filters);
  }

  onFilterChange(): void {
    this.page = 1;
    this.filterSubject.next(this.filters);
  }

  nextPage(): void {
    if (this.page < this.data?.totalPages) {
      this.page++;
      this.loadPlayers();
    }
  }

  previousPage(): void {
    if (this.page > 1) this.page--;
    this.loadPlayers();
  }

  onLimitChange(newLimit: number): void {
    this.limit = newLimit;
    this.page = 1;
    this.loadPlayers();
  }
}
