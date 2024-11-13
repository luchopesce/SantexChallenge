import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  isSearchVisible = false;
  constructor(private router: Router, private searchService: SearchService) {}

  onSearchInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchService.changeSearchTerm(input.value);
  }

  ngOnInit() {
    this.updateSearchVisibility(this.router.url);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateSearchVisibility(this.router.url);
      });
  }

  updateSearchVisibility(url: string) {
    this.isSearchVisible = url.includes('/players');
  }
}
