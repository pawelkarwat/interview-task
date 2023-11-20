import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { GithubUser } from 'src/app/github/github.interface';
import { GitHubService } from 'src/app/github/github.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  private readonly debounceTimeMs = 500;
  private searchSubject$ = new Subject<void>();
  private onDestroy$ = new Subject<void>();

  searchForm!: FormGroup;
  result: GithubUser | null = null;
  notFound = false;
  error = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly githubService: GitHubService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.searchSubject$.pipe(debounceTime(this.debounceTimeMs)).subscribe(() => {
      this.performSearch();
    })
  }

  private createForm(): void {
    this.searchForm = this.formBuilder.group({
      search: [''],
    });
  }

  onSearch(): void {
    this.searchSubject$.next();
  }

  private performSearch(): void {
    this.result = null;
    this.notFound = false;
    this.error = false;

    this.githubService
      .getGithubUsers(this.searchForm.get('search')?.value)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (result) => (this.result = result),
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status === 404) {
            this.notFound = true;
          } else {
            this.error = true;
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.searchSubject$.complete();
  }
}
