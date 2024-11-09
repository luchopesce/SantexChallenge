import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPlayers(
    page: number = 1,
    limit: number = 10,
    searchTerm: string = '',
    sortBy: string = ''
  ): Observable<any> {
    const params: any = {
      page: page.toString(),
      limit: limit.toString(),
    };

    if (searchTerm) {
      params.searchTerm = searchTerm;
    }

    if (sortBy) {
      params.sortBy = sortBy;
    }

    return this.http.get(`${this.apiUrl}/player`, { params });
  }

  getById(player: any): Observable<any> {
    const playerId = player?.player_id || null;
    const fifaVersion = player?.fifa_version || null;
    console.log(fifaVersion);

    return this.http.get(`${this.apiUrl}/player/${playerId}/${fifaVersion}`);
  }

  updatePlayer(originalPlayer: any, updatedPlayer: any): Observable<any> {
    console.log(this.apiUrl);
    const playerId = originalPlayer.player_id;
    const fifaVersion = originalPlayer.fifa_version;
    return this.http.put(
      `${this.apiUrl}/player/${playerId}/${fifaVersion}`,
      updatedPlayer
    );
  }

  deletePlayer(player: any): Observable<any> {
    const playerId = player.player_id;
    const fifaVersion = player.fifa_version;
    return this.http.delete(`${this.apiUrl}/player/${playerId}/${fifaVersion}`);
  }

  importCSV(fileData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/player/import-csv`, fileData);
  }

  exportCSV(searchTerm: string = ''): Observable<Blob> {
    const params: any = {};
    if (searchTerm) {
      params.searchTerm = searchTerm;
    }

    return this.http.get(`${this.apiUrl}/player/export-csv`, {
      params,
      responseType: 'blob',
    });
  }
}
