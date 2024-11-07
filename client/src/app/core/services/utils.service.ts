import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
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
}
