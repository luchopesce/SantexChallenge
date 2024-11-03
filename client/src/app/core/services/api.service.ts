import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  getById(playerId: string = ''): Observable<any> {
    return this.http.get(`${this.apiUrl}/player/${playerId}`);
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
