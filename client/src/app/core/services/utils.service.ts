import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  handleError(error: any, context: string): string {
    const errorMessage = `Problems in ${context}`;
    console.error(`Error in ${context}:`, error);
    return errorMessage;
  }
}
