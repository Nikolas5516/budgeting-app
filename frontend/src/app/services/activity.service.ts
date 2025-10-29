import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity } from '../models/activity.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private baseUrl = '/api/activities';

  constructor(private http: HttpClient) {}

  getRecentActivities(limit: number = 20): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.baseUrl}/recent?limit=${limit}`);
  }
}
