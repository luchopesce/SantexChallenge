import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private playerCache: Map<
    string,
    { data: any; timestamp: number; ttl: number }
  > = new Map();

  constructor() {}

  handleError(error: any, context: string): string {
    console.error(`Error in ${context}:`, error);
    const errorMessage = `Problems in ${context}`;
    return errorMessage;
  }

  showToastWithMessage(
    component: any,
    message: string,
    size: string,
    duration: number = 1000
  ): void {
    component.toastMessage = message;
    component.toastSize = size;
    component.showToast = true;

    setTimeout(() => {
      component.showToast = false;
    }, duration);
  }

  isCacheValid(cacheKey: string): boolean {
    const cachedItem = this.playerCache[cacheKey];
    if (!cachedItem) return false;

    const currentTime = Date.now();
    const isValid = currentTime - cachedItem.timestamp < cachedItem.ttl;

    if (!isValid) {
      this.removeFromCache(cacheKey);
    }

    return isValid;
  }

  getPlayerFromCache(cacheKey: string): any {
    const cachedItem = this.playerCache[cacheKey];
    return cachedItem ? cachedItem.data : null;
  }

  setPlayerInCache(cacheKey: string, data: any): void {
    this.playerCache[cacheKey] = {
      data,
      timestamp: Date.now(),
      ttl: 5 * 60 * 1000,
    };
  }

  removeFromCache(cacheKey: string): void {
    delete this.playerCache[cacheKey];
  }
}
