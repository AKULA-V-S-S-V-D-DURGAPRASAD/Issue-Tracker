import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Issue } from '../models/issue.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:8000';
  constructor(private http: HttpClient) {}

  health(): Observable<any> { return this.http.get(`${this.base}/health`); }

  listIssues(opts: any = {}): Observable<Issue[]> {
    let params = new HttpParams();
    Object.keys(opts || {}).forEach(k => {
      if (opts[k] !== undefined && opts[k] !== null && opts[k] !== '') {
        params = params.set(k, opts[k]);
      }
    });
    return this.http.get<Issue[]>(`${this.base}/issues`, { params });
  }

  getIssue(id: number) { return this.http.get<Issue>(`${this.base}/issues/${id}`); }
  createIssue(payload: Issue) { return this.http.post<Issue>(`${this.base}/issues`, payload); }
  updateIssue(id: number, payload: Issue) { return this.http.put<Issue>(`${this.base}/issues/${id}`, payload); }
}
