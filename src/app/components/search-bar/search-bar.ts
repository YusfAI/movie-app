import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { catchError, debounceTime, distinctUntilChanged, of, Subject, switchMap, tap } from 'rxjs';
import { MovieService } from '../../services/movie-service';

@Component({
  imports: [FontAwesomeModule],
  selector: 'app-search-bar',
  styleUrl: './search-bar.css',
  templateUrl: './search-bar.html',
})
export class SearchBar implements OnInit {
  readonly faMagnifyingGlass = faMagnifyingGlass;
  readonly faXmark = faXmark;

  readonly movieService = inject(MovieService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly search$ = new Subject<string>();

  ngOnInit(): void {
    this.search$
      .pipe(
        debounceTime(350),
        distinctUntilChanged(),
        tap(query => {
          this.movieService.searchQuery.set(query);
          this.movieService.loading.set(true);
          this.movieService.error.set(false);
          // Results are shown on the home page, wherever the search started
          if (this.router.url !== '/') this.router.navigate(['/']);
        }),
        // Empty query: back to "now playing"; otherwise search the whole TMDB catalogue.
        // switchMap cancels the previous request while the user keeps typing.
        switchMap(query =>
          (query ? this.movieService.searchMovies(query) : this.movieService.getMovieList()).pipe(
            catchError(() => {
              this.movieService.error.set(true);
              return of([]);
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(movies => {
        this.movieService.movieList.set(movies);
        this.movieService.loading.set(false);
      });
  }

  onSearch(title: string) {
    this.search$.next(title.trim());
  }

  clear(input: HTMLInputElement) {
    input.value = '';
    this.onSearch('');
    input.focus();
  }
}
