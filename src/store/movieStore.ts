import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Movie } from '@/services/api';

interface MovieStore {
    favorites: Movie[];
    watchlist: Movie[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    addToFavorites: (movie: Movie) => void;
    removeFromFavorites: (movieId: number) => void;
    addToWatchlist: (movie: Movie) => void;
    removeFromWatchlist: (movieId: number) => void;
    isInFavorites: (movieId: number) => boolean;
    isInWatchlist: (movieId: number) => boolean;
}

export const useMovieStore = create<MovieStore>()(
    persist(
        (set, get) => ({
            favorites: [],
            watchlist: [],
            searchQuery: "",
            setSearchQuery: (query) => set({ searchQuery: query }),
            addToFavorites: (movie) => {
                if (!get().isInFavorites(movie.id)) {
                    set((state) => ({
                        favorites: [...state.favorites, movie],
                    }));
                }
            },
            removeFromFavorites: (movieId) => {
                set((state) => ({
                    favorites: state.favorites.filter((m) => m.id !== movieId),
                }));
            },
            addToWatchlist: (movie) => {
                if (!get().isInWatchlist(movie.id)) {
                    set((state) => ({
                        watchlist: [...state.watchlist, movie],
                    }));
                }
            },
            removeFromWatchlist: (movieId) => {
                set((state) => ({
                    watchlist: state.watchlist.filter((m) => m.id !== movieId),
                }));
            },
            isInFavorites: (movieId) => {
                return get().favorites.some((m) => m.id === movieId);
            },
            isInWatchlist: (movieId) => {
                return get().watchlist.some((m) => m.id === movieId);
            },
        }),
        {
            name: 'movie-storage',
        }
    )
);
