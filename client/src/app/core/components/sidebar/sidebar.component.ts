import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NavigationItem } from '../../models/navigation-items.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  navigationItems: NavigationItem[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getAuthStatus().subscribe((isLoggedIn) => {
      this.updateNavigationItems(isLoggedIn);
    });
  }

  private updateNavigationItems(isLoggedIn: boolean) {
    this.navigationItems = [
      {
        icon: 'bi-house-fill',
        name: 'Home',
        route: '/home',
      },
      {
        icon: 'bi-people',
        name: 'Players',
        route: '/players',
      },
      ...(isLoggedIn
        ? [
            {
              icon: 'bi-gear-wide-connected',
              name: 'Settings',
              route: '/settings',
            },
          ]
        : []),
      {
        icon: isLoggedIn ? 'bi-door-open' : 'bi-door-closed',
        name: isLoggedIn ? 'Sign out' : 'Sign in',
        route: isLoggedIn ? '/logout' : '/login',
      },
    ];
  }

  onLogout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
