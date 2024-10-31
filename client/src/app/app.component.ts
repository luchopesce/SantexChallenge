import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlayersListComponent } from './components/players-list/players-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PlayersListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
