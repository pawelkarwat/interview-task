import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GithubUser } from './github.interface';

@Injectable({
  providedIn: 'root',
})
export class GitHubService {
  private readonly GITHUB_URL = 'https://api.github.com';

  constructor(private readonly http: HttpClient) {}

  private getHeadersForGithubRequest(): HttpHeaders {
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/vnd.github+json');
    headers.append('X-GitHub-Api-Version', '2022-11-28');
    return headers;
  }

  getGithubUsers(search: string): Observable<GithubUser> {
    return this.http.get<GithubUser>(`${this.GITHUB_URL}/users/${search}`, { headers: this.getHeadersForGithubRequest() });
  }
}
