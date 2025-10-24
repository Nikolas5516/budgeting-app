import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpResponseService {

  /**
   * Handles HTTP response that might be a Blob or regular JSON
   * @param response - HTTP response
   * @returns Promise that resolves to parsed JSON data
   */
  async handleResponse<T>(response: any): Promise<T> {
    if (response instanceof Blob) {
      return this.parseBlobResponse<T>(response);
    }
    return response as T;
  }

  /**
   * Parses Blob response to JSON
   * @param blob - Blob response
   * @returns Promise that resolves to parsed JSON data
   */
  private async parseBlobResponse<T>(blob: Blob): Promise<T> {
    try {
      const text = await blob.text();
      return JSON.parse(text) as T;
    } catch (error) {
      console.error('Failed to parse Blob response:', error);
      throw new Error('Failed to parse server response');
    }
  }

  /**
   * Handles HTTP error response
   * @param error - HTTP error
   * @param fallbackMessage - Fallback error message
   * @returns Promise that resolves to error message
   */
  async handleError(error: any, fallbackMessage: string = 'An error occurred'): Promise<string> {
    // Handle Blob error responses
    if (error?.error instanceof Blob) {
      try {
        const text = await error.error.text();
        return text?.trim() || fallbackMessage;
      } catch {
        return fallbackMessage;
      }
    }

    // Handle string error messages
    if (typeof error?.error === 'string') {
      return error.error;
    }

    // Handle error objects with message property
    if (error?.message) {
      return error.message;
    }

    return fallbackMessage;
  }
}
