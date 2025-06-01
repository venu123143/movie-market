import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
}

export interface MovieResponse {
    results: Movie[];
    total_pages: number;
    total_results: number;
}

export interface Genre {
    id: number;
    name: string;
}

export interface MovieDetails extends Movie {
    tagline: string;
    genres: Genre[];
    runtime: number;
}

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${API_KEY}`,
        accept: "application/json",
    }

});

export const getPopularMovies = async (page: number = 1): Promise<MovieResponse> => {
    const { data } = await axiosInstance.get("/movie/popular", {
        params: { page },
    });
    return data;
};

export const getMovieDetails = async (movieId: number): Promise<MovieDetails> => {
    const { data } = await axiosInstance.get(`/movie/${movieId}`);
    return data;
};

export const searchMovies = async (query: string, page: number = 1): Promise<MovieResponse> => {
    const { data } = await axiosInstance.get("/search/movie", {
        params: { query, page },
    });
    return data;
};

export const useSearchMovies = (query: string, page: number = 1) => {
    return useQuery({
        queryKey: ["searchMovies", query, page],
        queryFn: () => searchMovies(query, page),
        enabled: !!query,
        retry: false,
    });
}; 