import { useQuery } from "@tanstack/react-query";
import { getPopularMovies, getMovieDetails } from "@/services/api";
import type { MovieDetails } from "@/services/api";

export const usePopularMovies = (page: number = 1) => {
    return useQuery({
        queryKey: ["popularMovies", page],
        queryFn: () => getPopularMovies(page),
        retry: false,
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