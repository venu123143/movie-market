import axios from "axios";

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
    page: number;
}

export interface Genre {
    id: number;
    name: string;
}

export interface ProductionCompany {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
}

export interface MovieDetails extends Movie {
    tagline: string;
    genres: Genre[];
    runtime: number;
    status: string;
    budget: number;
    revenue: number;
    original_language: string;
    backdrop_path: string;
    production_companies: ProductionCompany[];
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

export interface RatedMovie extends Movie {
    rating: number;
}

export interface RatedTV {
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    rating: number;
    first_air_date: string;
    vote_average: number;
}

export interface RatedTVEpisode {
    id: number;
    name: string;
    overview: string;
    still_path: string;
    rating: number;
    air_date: string;
    episode_number: number;
    season_number: number;
    show_id: number;
    show_name: string;
}

export interface RatedResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}

export const getRatedMovies = async (page: number = 1): Promise<RatedResponse<RatedMovie>> => {
    const { data } = await axiosInstance.get(`/account/16272812/rated/movies`, {
        params: { 
            page,
            language: 'en-US',
            sort_by: 'created_at.asc'
        }
    });
    return data;
};

export const getRatedTVShows = async (page: number = 1): Promise<RatedResponse<RatedTV>> => {
    const { data } = await axiosInstance.get(`/account/16272812/rated/tv`, {
        params: { 
            page,
            language: 'en-US',
            sort_by: 'created_at.asc'
        }
    });
    return data;
};

export const getRatedTVEpisodes = async (page: number = 1): Promise<RatedResponse<RatedTVEpisode>> => {
    const { data } = await axiosInstance.get(`/account/16272812/rated/tv/episodes`, {
        params: { 
            page,
            language: 'en-US',
            sort_by: 'created_at.asc'
        }
    });
    return data;
};

export const searchMovies = async (query: string, page: number = 1): Promise<MovieResponse> => {
    const { data } = await axiosInstance.get("/search/movie", {
        params: { query, page },
    });
    return data;
};

export const getGenres = async (): Promise<{ genres: Genre[] }> => {
    const { data } = await axiosInstance.get("/genre/movie/list");
    return data;
};

export const getMoviesByGenre = async (genreId: number, page: number = 1): Promise<MovieResponse> => {
    const { data } = await axiosInstance.get("/discover/movie", {
        params: { 
            with_genres: genreId,
            page,
            sort_by: "popularity.desc"
        },
    });
    return data;
};

export const getSimilarMovies = async (movieId: number, page: number = 1): Promise<MovieResponse> => {
    const { data } = await axiosInstance.get(`/movie/${movieId}/similar`, {
        params: { page },
    });
    return data;
};