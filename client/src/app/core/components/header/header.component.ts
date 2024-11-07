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
    this.searchService.changeSearchTerm(input.value); // Envía el término de búsqueda al servicio
  }

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateSearchVisibility(event.url);
      });
  }

  updateSearchVisibility(url: string) {
    this.isSearchVisible = url.includes('/players');
  }
}
