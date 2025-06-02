import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToFavorites, removeFromFavorites, addToWatchlist, removeFromWatchlist } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

export const useLists = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const addToFavoritesMutation = useMutation({
        mutationFn: ({ mediaId, mediaType }: { mediaId: number; mediaType: 'movie' | 'tv' }) =>
            addToFavorites(mediaId, mediaType),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
            toast({
                title: "Added to favorites",
                description: "The item has been added to your favorites.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to add to favorites. Please try again.",
                variant: "destructive",
            });
        },
    });

    const removeFromFavoritesMutation = useMutation({
        mutationFn: ({ mediaId, mediaType }: { mediaId: number; mediaType: 'movie' | 'tv' }) =>
            removeFromFavorites(mediaId, mediaType),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
            toast({
                title: "Removed from favorites",
                description: "The item has been removed from your favorites.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to remove from favorites. Please try again.",
                variant: "destructive",
            });
        },
    });

    const addToWatchlistMutation = useMutation({
        mutationFn: ({ mediaId, mediaType }: { mediaId: number; mediaType: 'movie' | 'tv' }) =>
            addToWatchlist(mediaId, mediaType),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['watchlist'] });
            toast({
                title: "Added to watchlist",
                description: "The item has been added to your watchlist.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to add to watchlist. Please try again.",
                variant: "destructive",
            });
        },
    });

    const removeFromWatchlistMutation = useMutation({
        mutationFn: ({ mediaId, mediaType }: { mediaId: number; mediaType: 'movie' | 'tv' }) =>
            removeFromWatchlist(mediaId, mediaType),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['watchlist'] });
            toast({
                title: "Removed from watchlist",
                description: "The item has been removed from your watchlist.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to remove from watchlist. Please try again.",
                variant: "destructive",
            });
        },
    });

    return {
        addToFavorites: addToFavoritesMutation.mutate,
        removeFromFavorites: removeFromFavoritesMutation.mutate,
        addToWatchlist: addToWatchlistMutation.mutate,
        removeFromWatchlist: removeFromWatchlistMutation.mutate,
        isAddingToFavorites: addToFavoritesMutation.isPending,
        isRemovingFromFavorites: removeFromFavoritesMutation.isPending,
        isAddingToWatchlist: addToWatchlistMutation.isPending,
        isRemovingFromWatchlist: removeFromWatchlistMutation.isPending,
    };
}; 