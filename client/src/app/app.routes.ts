import { Routes } from '@angular/router';
import { PlayerPageComponent } from './views/player-page/player-page.component';
import { LoginPageComponent } from './views/login-page/login-page.component';
import { SettingsPageComponent } from './views/settings-page/settings-page.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'players', component: PlayerPageComponent },
  { path: 'account', component: LoginPageComponent },
  {
    path: 'settings',
    component: SettingsPageComponent,
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'players',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'players',
    pathMatch: 'full',
  },
];
