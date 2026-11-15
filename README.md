# 🎬 Movie App: My Movies Database

An **Angular 22** single-page app for exploring films with **The Movie Database (TMDB) API**. You can browse what's in cinemas now, search the whole TMDB catalogue, open a detailed page for each movie, and keep a personal wish list that persists in the browser.

## Features

- **Now playing:** the current cinema releases, loaded from TMDB on the home page
- **Live search:** searches the full TMDB catalogue as you type. It is debounced (350 ms), and a new keystroke cancels the previous request, so fast typing doesn't send a request per letter
- **Movie detail page** (`/:id`): backdrop hero, poster, tagline, genres, rating, runtime, release date, budget and revenue, languages, production countries and companies, collection, and IMDb / official site links
- **Wish list** (`/wishlist`): add or remove movies from the detail page; a counter in the header and a ♥ badge on cards. Saved in `localStorage`, so it survives a page refresh
- Loading, error and empty states, plus keyboard navigation on movie cards

## Tech stack

| | |
|---|---|
| Framework | Angular 22 (standalone components, **signals**, `@if` / `@for` control flow) |
| Data | TMDB REST API via `HttpClient` + RxJS (`debounceTime`, `switchMap`, `catchError`) |
| Routing | Angular Router: `/`, `/wishlist`, `/:id` |
| Icons | Font Awesome |
| Tests | Vitest (`ng test`) with `HttpTestingController` |

## Getting started

Requires **Node.js 20+** and a free **TMDB API key** ([create one here](https://www.themoviedb.org/settings/api)).

```bash
git clone https://github.com/YusfAI/movie-app.git
cd movie-app
npm install
```

Put your API key in `src/environments/environment.development.ts` (and `environment.ts` for production builds):

```ts
export const environment = {
  Production: false,
  api_key: 'YOUR_TMDB_API_KEY',
  url_api: 'https://api.themoviedb.org/3/movie/now_playing',
  url_movie_api: 'https://api.themoviedb.org/3/movie',
  url_search_api: 'https://api.themoviedb.org/3/search/movie',
};
```

Then:

```bash
npm start      # http://localhost:4200
npm test       # unit tests
npm run build  # production build in dist/movie-app
```

## Architecture

```
src/app/
├── services/movie-service.ts     # TMDB calls + shared state (signals) + wish list persistence
├── interfaces/                   # Movie, MovieDetails, MovieResponse, WishlistMovie
└── components/
    ├── head-bar/                 # title + wish-list button with counter
    ├── search-bar/               # debounced search (RxJS pipeline)
    ├── movie-list/               # "now playing" / search results grid
    ├── movie-detail/             # full movie page
    └── wish-list/                # saved movies
```

State is shared through **signals** in `MovieService` (`movieList`, `searchQuery`, `loading`, `wishlist`…), so components read the same data without passing inputs down the tree.

> **Note on the API key:** in a frontend-only app the TMDB key is always visible in the browser. That's acceptable for TMDB's read-only v3 keys, but use your own key, and use a small backend proxy if you deploy publicly.

## Possible next steps

- Pagination / infinite scroll on results
- Filter by genre and year
- Cast & trailers on the detail page (`/movie/{id}/credits`, `/videos`)

## Author

**Youssef**, Business Intelligence student at IHEC Carthage · [GitHub](https://github.com/YusfAI)
