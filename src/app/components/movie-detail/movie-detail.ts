import { CurrencyPipe, DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faCalendarDays,
  faClock,
  faHeart,
  faHeartCircleCheck,
  faStar,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { catchError, of, switchMap, tap } from 'rxjs';
import { MovieService } from '../../services/movie-service';

@Component({
  imports: [CurrencyPipe, DatePipe, DecimalPipe, UpperCasePipe, FontAwesomeModule, RouterLink],
  selector: 'app-movie-detail',
  styleUrl: './movie-detail.css',
  templateUrl: './movie-detail.html',
})
export class MovieDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly movieService = inject(MovieService);

  readonly loading = signal(true);
  readonly error = signal(false);

  readonly faArrowLeft = faArrowLeft;
  readonly faCalendarDays = faCalendarDays;
  readonly faClock = faClock;
  readonly faHeart = faHeart;
  readonly faHeartCircleCheck = faHeartCircleCheck;
  readonly faStar = faStar;
  readonly faUsers = faUsers;

  readonly imageUrl = 'https://image.tmdb.org/t/p';

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        tap(() => {
          this.movieService.selectedMovie.set(null);
          this.loading.set(true);
          this.error.set(false);
        }),
        switchMap(params =>
          this.movieService.getMovieById(Number(params.get('id'))).pipe(
            catchError(() => {
              this.error.set(true);
              return of(null);
            })
          )
        )
      )
      .subscribe(movie => {
        this.movieService.selectedMovie.set(movie);
        this.loading.set(false);
      });
  }

  backToMovieList() {
    this.router.navigate(['/']);
  }

  addToWishlist() {
    const movie = this.movieService.selectedMovie();
    if (movie) this.movieService.toggleWishlist(movie);
  }

  formatRuntime(minutes: number): string {
    if (!minutes) return '—';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h ? `${h}h ${m.toString().padStart(2, '0')}min` : `${m}min`;
  }
}
