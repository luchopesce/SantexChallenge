import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  constructor(private apiService: ApiService) {}

  getPlayers(params: {
    page: number;
    itemsPerPage: number;
    searchTerm: string;
    sortBy: string;
    sortDirection: any;
  }): Observable<any> {
    return this.apiService.getPlayers(
      params.page,
      params.itemsPerPage,
      params.searchTerm,
      params.sortBy,
      params.sortDirection
    );
  }

  getPlayerById(playerId: any): Observable<any> {
    return this.apiService.getById({ player_id: playerId });
  }

  getPlayerHistory(playerId: any): Observable<any> {
    return this.apiService.getPlayerHistory(playerId);
  }

  updatePlayer(originalPlayer: any, updatedPlayer: any): Observable<any> {
    return this.apiService.updatePlayer(originalPlayer, updatedPlayer);
  }

  deletePlayer(player: any): Observable<any> {
    return this.apiService.deletePlayer(player);
  }
}
