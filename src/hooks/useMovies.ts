import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { 
    getPopularMovies,
    getRatedMovies,
    getRatedTVShows,
    getRatedTVEpisodes,
    getGenres,
    getMoviesByGenre,
    getSimilarMovies,
    getMovieDetails,
    searchMovies,
    type MovieDetails,
    type MovieResponse,
    type RatedResponse,
    type RatedMovie,
    type RatedTV,
    type RatedTVEpisode,
    type Genre
} from "../services/api";

export const usePopularMovies = (enabled: boolean = true) => {
    return useInfiniteQuery<MovieResponse>({
        queryKey: ["popularMovies"],
        queryFn: ({ pageParam = 1 }) => getPopularMovies(pageParam as number),
        getNextPageParam: (lastPage) =>
            lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
        enabled,
        retry: false,
        initialPageParam: 1
    });
};

export const useMovieDetails = (movieId: number | null) => {
    return useQuery<MovieDetails | null>({
        queryKey: ["movieDetails", movieId],
        queryFn: () => movieId ? getMovieDetails(movieId) : Promise.resolve(null),
        enabled: !!movieId,
        retry: false,
    });
};

export const useRatedMovies = () => {
    return useInfiniteQuery<RatedResponse<RatedMovie>, Error>({ 
        queryKey: ["rated-movies"],
        queryFn: ({ pageParam = 1 }) => getRatedMovies(pageParam as number),
        getNextPageParam: (lastPage: RatedResponse<RatedMovie>) =>
            lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
        initialPageParam: 1
    });
};

export const useRatedTVShows = () => {
    return useInfiniteQuery<RatedResponse<RatedTV>, Error>({ 
        queryKey: ["rated-tv"],
        queryFn: ({ pageParam = 1 }) => getRatedTVShows(pageParam as number),
        getNextPageParam: (lastPage: RatedResponse<RatedTV>) =>
            lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
        initialPageParam: 1
    });
};

export const useRatedTVEpisodes = () => {
    return useInfiniteQuery<RatedResponse<RatedTVEpisode>, Error>({ 
        queryKey: ["rated-tv-episodes"],
        queryFn: ({ pageParam = 1 }) => getRatedTVEpisodes(pageParam as number),
        getNextPageParam: (lastPage: RatedResponse<RatedTVEpisode>) =>
            lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
        initialPageParam: 1
    });
};

export const useSearchMovies = (query: string) => {
    return useInfiniteQuery<MovieResponse>({
        queryKey: ["searchMovies", query],
        queryFn: ({ pageParam = 1 }) => searchMovies(query, pageParam as number),
        getNextPageParam: (lastPage) =>
            lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
        enabled: !!query,
        retry: false,
        initialPageParam: 1
    });
};
 
export const useGenres = () => {
    return useQuery<{ genres: Genre[] }>({ 
        queryKey: ["genres"],
        queryFn: getGenres,
        retry: false,
    });
};

export const useMoviesByGenre = (genreId: number | null) => {
    return useInfiniteQuery<MovieResponse, Error>({
        queryKey: ["moviesByGenre", genreId],
        queryFn: ({ pageParam = 1 }) =>
            genreId ? getMoviesByGenre(genreId, pageParam as number) : getPopularMovies(pageParam as number),
        getNextPageParam: (lastPage) =>
            lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
        enabled: !!genreId,
        retry: false,
        initialPageParam: 1
    });
};

export const useSimilarMovies = (movieId: number | null) => {
    return useInfiniteQuery<MovieResponse, Error>({
        queryKey: ["similarMovies", movieId],
        queryFn: ({ pageParam = 1 }) =>
            movieId ? getSimilarMovies(movieId, pageParam as number) : Promise.reject("No movie ID"),
        getNextPageParam: (lastPage) =>
            lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
        enabled: !!movieId,
        retry: false,
        initialPageParam: 1
    });
};