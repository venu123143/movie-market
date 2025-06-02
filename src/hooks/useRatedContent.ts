import { useInfiniteQuery } from "@tanstack/react-query";
import { getRatedTVShows, getRatedTVEpisodes, type RatedResponse, type RatedTV, type RatedTVEpisode } from "@/services/api";

export const useRatedTVShows = () => {
    return useInfiniteQuery({
        queryKey: ["ratedTVShows"],
        queryFn: ({ pageParam }) => getRatedTVShows(pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.page < lastPage.total_pages) {
                return lastPage.page + 1;
            }
            return undefined;
        },
    });
};

export const useRatedEpisodes = () => {
    return useInfiniteQuery({
        queryKey: ["ratedEpisodes"],
        queryFn: ({ pageParam }) => getRatedTVEpisodes(pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.page < lastPage.total_pages) {
                return lastPage.page + 1;
            }
            return undefined;
        },
    });
}; 