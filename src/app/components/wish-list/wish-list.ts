import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeartCrack, faTrash } from '@fortawesome/free-solid-svg-icons';
import { WishlistMovie } from '../../interfaces/wishlist-movie';
import { MovieService } from '../../services/movie-service';

@Component({
  imports: [FontAwesomeModule],
  selector: 'app-wish-list',
  styleUrl: './wish-list.css',
  templateUrl: './wish-list.html',
})
export class WishList {
  private readonly router = inject(Router);
  readonly movieService = inject(MovieService);

  readonly faTrash = faTrash;
  readonly faHeartCrack = faHeartCrack;

  navigateTo(movie: WishlistMovie) {
    this.router.navigate(['/', movie.id]);
  }

  backToMovieList() {
    this.router.navigate(['/']);
  }

  remove(event: Event, movie: WishlistMovie) {
    event.stopPropagation();
    this.movieService.removeFromWishlist(movie.id);
  }
}
