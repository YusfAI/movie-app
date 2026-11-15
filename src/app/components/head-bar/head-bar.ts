import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { MovieService } from '../../services/movie-service';
@Component({
  imports: [FontAwesomeModule],
  selector: 'app-head-bar',
  styleUrl: './head-bar.css',
  templateUrl: './head-bar.html',
})
export class HeadBar {

  private readonly router = inject(Router);
  readonly movieService = inject(MovieService);

  faHeart=faHeart;

  navigateToWishList(){
    this.router.navigate(['/wishlist'])
  }

}
