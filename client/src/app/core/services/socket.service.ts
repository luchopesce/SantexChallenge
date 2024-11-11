import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: any;

  constructor() {
    this.socket = io(environment.serverUrl);
  }

  onPlayerUpdated(callback: (data: any) => void): void {
    this.socket.on('playerUpdated', (data: any) => {
      callback(data);
    });
  }

  onPlayerDeleted(callback: (data: any) => void): void {
    this.socket.on('playerDeleted', (data: any) => {
      callback(data);
    });
  }

  onPlayerCreated(callback: (data: any) => void): void {
    this.socket.on('playerCreated', (data: any) => {
      callback(data);
    });
  }

  onPlayerImport(callback: () => void): void {
    this.socket.on('playerImport', () => {
      callback();
    });
  }
  emitEvent(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }
}
