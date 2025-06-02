import { useQuery } from "@tanstack/react-query";
import { getFavorites, getWatchlist } from "@/services/api";
import { useAuth } from "./useAuth";
import type { Movie } from "@/services/api";

export const useUserLists = () => {
    const { isAuthenticated } = useAuth();

    const { data: favorites } = useQuery({
        queryKey: ['favorites'],
        queryFn: () => getFavorites(),
        enabled: isAuthenticated,
    });

    const { data: watchlist } = useQuery({
        queryKey: ['watchlist'],
        queryFn: () => getWatchlist(),
        enabled: isAuthenticated,
    });

    const isInFavorites = (mediaId: number, mediaType: 'movie' | 'tv') => {
        return favorites?.results.some((item: Movie & { media_type: string }) => item.id === mediaId && item.media_type === mediaType) ?? false;
    };

    const isInWatchlist = (mediaId: number, mediaType: 'movie' | 'tv') => {
        return watchlist?.results.some((item: Movie & { media_type: string }) => item.id === mediaId && item.media_type === mediaType) ?? false;
    };

    return {
        favorites,
        watchlist,
        isInFavorites,
        isInWatchlist,
    };
}; 