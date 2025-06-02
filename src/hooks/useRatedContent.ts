import { useInfiniteQuery } from "@tanstack/react-query";
import { getRatedTVShows, getRatedTVEpisodes } from "@/services/api";
import { useAuth } from "./useAuth";

export const useRatedTVShows = () => {
    const { isAuthenticated } = useAuth();

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
        enabled: isAuthenticated,
    });
};

export const useRatedEpisodes = () => {
    const { isAuthenticated } = useAuth();

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
        enabled: isAuthenticated,
    });
}; 