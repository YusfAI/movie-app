import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MovieService } from './movie-service';
import { MovieDetails } from '../interfaces/movie-details';

describe('MovieService', () => {
  let service: MovieService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MovieService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('searches the TMDB catalogue with the query', () => {
    let titles: string[] = [];
    service.searchMovies('dune').subscribe((movies) => (titles = movies.map((m) => m.title)));

    const req = http.expectOne((r) => r.url.endsWith('/search/movie'));
    expect(req.request.params.get('query')).toBe('dune');
    req.flush({ page: 1, results: [{ id: 1, title: 'Dune' }], total_pages: 1, total_results: 1 });

    expect(titles).toEqual(['Dune']);
  });

  it('adds, detects and removes a wish-list movie, and persists it', () => {
    const movie = {
      id: 42,
      title: 'Test',
      poster_path: null,
      release_date: '2024-01-01',
      vote_average: 7,
    } as unknown as MovieDetails;

    service.toggleWishlist(movie);
    expect(service.isInWishlist(42)).toBe(true);
    expect(JSON.parse(localStorage.getItem('wishlist')!)[0].id).toBe(42);

    service.toggleWishlist(movie);
    expect(service.isInWishlist(42)).toBe(false);
  });
});
