import { Component } from '@angular/core';
import { PlayerListComponent } from './player-list/player-list.component';

@Component({
  selector: 'app-player-page',
  standalone: true,
  imports: [PlayerListComponent],
  templateUrl: './player-page.component.html',
  styleUrl: './player-page.component.scss',
})
export class PlayerPageComponent {}
