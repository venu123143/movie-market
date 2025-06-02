import { useQuery } from "@tanstack/react-query";
import { getMovieDetails, getRatedTVShows, getRatedTVEpisodes } from "@/services/api";

export const useContentDetails = (id: number | null, type: 'movie' | 'tv' | 'episode') => {
    return useQuery({
        queryKey: ['contentDetails', id, type],
        queryFn: async () => {
            if (!id) return null;
            
            switch (type) {
                case 'movie':
                    return getMovieDetails(id);
                case 'tv':
                    const tvShows = await getRatedTVShows(1);
                    return tvShows.results.find(show => show.id === id) || null;
                case 'episode':
                    const episodes = await getRatedTVEpisodes(1);
                    return episodes.results.find(episode => episode.id === id) || null;
                default:
                    return null;
            }
        },
        enabled: !!id,
    });
}; 