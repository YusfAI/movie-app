import { Component, inject, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart, faStar } from '@fortawesome/free-solid-svg-icons';
import { Movie } from '../../interfaces/movie';
import { MovieService } from '../../services/movie-service';

@Component({
  imports: [DecimalPipe, FontAwesomeModule],
  selector: 'app-movie-list',
  styleUrl: './movie-list.css',
  templateUrl: './movie-list.html',
})
export class MovieList implements OnInit {
  readonly router = inject(Router);
  readonly movieService = inject(MovieService);

  readonly faStar = faStar;
  readonly faHeart = faHeart;

  ngOnInit(): void {
    // Keep the current search results when coming back from a detail page
    if (this.movieService.searchQuery() || this.movieService.movieList().length) return;

    this.movieService.loading.set(true);
    this.movieService.getMovieList().subscribe({
      next: movies => {
        this.movieService.movieList.set(movies);
        this.movieService.loading.set(false);
      },
      error: () => {
        this.movieService.error.set(true);
        this.movieService.loading.set(false);
      },
    });
  }

  navigateTo(movie: Movie) {
    this.router.navigate(['/', movie.id]);
  }
}
