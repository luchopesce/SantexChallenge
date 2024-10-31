import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  private apiUrl = 'http://localhost:3000/player';

  constructor(private http: HttpClient) {}

  getPlayers(page: number, limit: number, filters: any): Observable<any> {
    let params = new HttpParams().set('page', page).set('limit', limit);

    if (filters.name) params = params.set('name', filters.name);
    if (filters.club) params = params.set('club', filters.club);
    if (filters.position) params = params.set('position', filters.position);

    return this.http.get<any>(this.apiUrl, { params });
  }
}
