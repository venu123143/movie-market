import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getPopularMovies, getMovieDetails, searchMovies, getGenres, getMoviesByGenre, getSimilarMovies } from "@/services/api";
import type { MovieDetails, MovieResponse } from "@/services/api";

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
    return useQuery({
        queryKey: ["genres"],
        queryFn: getGenres,
        retry: false,
    });
};

export const useMoviesByGenre = (genreId: number | null) => {
    return useInfiniteQuery<MovieResponse>({
        queryKey: ["moviesByGenre", genreId],
        queryFn: ({ pageParam = 1 }) =>
            genreId ? getMoviesByGenre(genreId, pageParam as number) : getPopularMovies(pageParam as number),
        getNextPageParam: (lastPage) =>
            lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
        enabled: true,
        retry: false,
        initialPageParam: 1
    });
};

export const useSimilarMovies = (movieId: number | null) => {
    return useInfiniteQuery<MovieResponse>({
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