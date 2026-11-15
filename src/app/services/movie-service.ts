import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable, shareReplay } from 'rxjs';
import { MovieResponse } from '../interfaces/movie-response';
import { Movie } from '../interfaces/movie';
import { MovieDetails } from '../interfaces/movie-details';
import { WishlistMovie } from '../interfaces/wishlist-movie';

const WISHLIST_KEY = 'wishlist';

@Injectable({
    providedIn:'root'
})
export class MovieService {

    private readonly http=inject(HttpClient)
    private readonly url=environment.url_api
    private readonly key=environment.api_key
    private readonly movieUrl=environment.url_movie_api
    private readonly searchUrl=environment.url_search_api


    public movieList=signal<Movie[]>([]);
    /** Current search text ('' = showing "now playing"). */
    public searchQuery=signal('');
    public loading=signal(false);
    public error=signal(false);
    public selectedMovie=signal<MovieDetails|null>(null);
    public wishlist=signal<WishlistMovie[]>(this.loadWishlist());

    getMovieList():Observable<Movie[]>{
        return this.http.get<MovieResponse>(`${this.url}?api_key=${this.key}`).pipe(map(response=>response.results),shareReplay({bufferSize:1,refCount:false}))  
    }

    /** Full-text search across the whole TMDB catalogue. */
    searchMovies(query:string):Observable<Movie[]>{
        const params=new HttpParams().set('api_key',this.key).set('query',query).set('include_adult','false')
        return this.http.get<MovieResponse>(this.searchUrl,{params}).pipe(map(response=>response.results))
    }

    getMovieById(id:number):Observable<MovieDetails>{
        return this.http.get<MovieDetails>(`${this.movieUrl}/${id}?api_key=${this.key}`)
    }

    isInWishlist(id:number):boolean{
        return this.wishlist().some(movie=>movie.id===id)
    }

    toggleWishlist(movie:MovieDetails|WishlistMovie){
        if(this.isInWishlist(movie.id)){
            this.wishlist.update(list=>list.filter(m=>m.id!==movie.id))
        } else {
            const { id, title, poster_path, release_date, vote_average } = movie
            this.wishlist.update(list=>[...list,{ id, title, poster_path, release_date, vote_average }])
        }
        this.saveWishlist()
    }

    removeFromWishlist(id:number){
        this.wishlist.update(list=>list.filter(m=>m.id!==id))
        this.saveWishlist()
    }

    private saveWishlist(){
        try {
            localStorage.setItem(WISHLIST_KEY, JSON.stringify(this.wishlist()))
        } catch {
            // storage unavailable (private mode / quota): keep the in-memory list only
        }
    }

    private loadWishlist():WishlistMovie[]{
        try {
            const stored = JSON.parse(localStorage.getItem(WISHLIST_KEY) ?? '[]')
            return Array.isArray(stored) ? stored : []
        } catch {
            return []
        }
    }
}
