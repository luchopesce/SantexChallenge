import { Component, OnInit } from '@angular/core';
import { PlayerEditComponent } from '../player-edit/player-edit.component';
import * as bootstrap from 'bootstrap';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PlayerDetailComponent } from '../player-detail/player-detail.component';
import { RadarChartComponent } from '../../../core/components/radar-chart/radar-chart.component';
import { AuthService } from '../../../core/services/auth.service';

interface Player {
  id: number;
  name: string;
  club: string;
  position: string;
  details: string;
  skills: { [key: string]: number };
}

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [
    PlayerEditComponent,
    CommonModule,
    RouterLink,
    PlayerDetailComponent,
    RadarChartComponent,
  ],
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss'],
})
export class PlayerListComponent implements OnInit {
  isLoggedIn = false;
  players: Player[] = [];
  selectedPlayer: Player;
  sortField: keyof Player | null = null;
  sortAsc: boolean = true;

  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(private authService: AuthService) {
    this.players = [
      {
        id: 1,
        name: 'Player 1',
        club: 'Club A',
        position: 'Forward',
        details: 'Some details',
        skills: {
          speed: 80,
          strength: 75,
          agility: 90,
          stamina: 85,
          skill: 70,
        },
      },
      {
        id: 2,
        name: 'Player 2',
        club: 'Club B',
        position: 'Midfielder',
        details: 'Some details',
        skills: {
          speed: 80,
          strength: 75,
          agility: 90,
          stamina: 85,
          skill: 70,
        },
      },
      {
        id: 3,
        name: 'Player 3',
        club: 'Club C',
        position: 'Defender',
        details: 'Some details',
        skills: {
          speed: 80,
          strength: 75,
          agility: 90,
          stamina: 85,
          skill: 70,
        },
      },
      {
        id: 4,
        name: 'Player 4',
        club: 'Club D',
        position: 'Goalkeeper',
        details: 'Some details',
        skills: {
          speed: 80,
          strength: 75,
          agility: 90,
          stamina: 85,
          skill: 70,
        },
      },
      {
        id: 5,
        name: 'Player 5',
        club: 'Club E',
        position: 'Forward',
        details: 'Some details',
        skills: {
          speed: 80,
          strength: 75,
          agility: 90,
          stamina: 85,
          skill: 70,
        },
      },
      {
        id: 6,
        name: 'Player 6',
        club: 'Club F',
        position: 'Midfielder',
        details: 'Some details',
        skills: {
          speed: 80,
          strength: 75,
          agility: 90,
          stamina: 85,
          skill: 70,
        },
      },
      {
        id: 7,
        name: 'Player 7',
        club: 'Club G',
        position: 'Defender',
        details: 'Some details',
        skills: {
          speed: 80,
          strength: 75,
          agility: 90,
          stamina: 85,
          skill: 70,
        },
      },
      {
        id: 8,
        name: 'Player 8',
        club: 'Club H',
        position: 'Goalkeeper',
        details: 'Some details',
        skills: {
          speed: 80,
          strength: 75,
          agility: 90,
          stamina: 85,
          skill: 70,
        },
      },
      {
        id: 9,
        name: 'Player 9',
        club: 'Club I',
        position: 'Forward',
        details: 'Some details',
        skills: {
          speed: 80,
          strength: 75,
          agility: 90,
          stamina: 85,
          skill: 70,
        },
      },
      {
        id: 10,
        name: 'Player 10',
        club: 'Club J',
        position: 'Midfielder',
        details: 'Some details',
        skills: {
          speed: 80,
          strength: 75,
          agility: 90,
          stamina: 85,
          skill: 70,
        },
      },
    ];

    this.selectedPlayer = {
      id: 0,
      name: '',
      club: '',
      position: '',
      details: '',
      skills: {},
    };
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn(); // Verifica el estado de inicio de sesión
  }
  openDetailModal(player: Player): void {
    this.selectedPlayer = player;
    const modalElement = document.getElementById('detailModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  toggleSort(field: keyof Player) {
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortField = field;
      this.sortAsc = true;
    }
    this.sort();
  }

  sort() {
    this.players.sort((a, b) => {
      if (a[this.sortField!] < b[this.sortField!]) return this.sortAsc ? -1 : 1;
      if (a[this.sortField!] > b[this.sortField!]) return this.sortAsc ? 1 : -1;
      return 0;
    });
  }

  openEditModal(player: Player) {
    this.selectedPlayer = { ...player };
    const modalElement = document.getElementById('editModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  saveChanges() {
    const index = this.players.findIndex(
      (p) => p.id === this.selectedPlayer.id
    );
    if (index !== -1) {
      this.players[index] = { ...this.selectedPlayer };
    }
    this.closeModal();
  }

  closeModal() {
    const modalElement = document.getElementById('editModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  closeModalDetail() {
    const modalElement = document.getElementById('detailModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  get paginatedPlayers(): Player[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.players.slice(start, start + this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  get totalPages(): number {
    return Math.ceil(this.players.length / this.itemsPerPage);
  }

  updateItemsPerPage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newLimit = parseInt(target.value, 10);
    if (!isNaN(newLimit)) {
      this.itemsPerPage = newLimit;
      this.currentPage = 1;
    }
  }
}
