import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import type { Movie } from "@/services/api";
import { MovieCard } from "./MovieCard";

interface MovieGridProps {
    movies: Movie[];
    hasNextPage: boolean;
    fetchNextPage: () => void;
    isFetchingNextPage: boolean;
}

export const MovieGrid = ({ movies, hasNextPage, fetchNextPage, isFetchingNextPage }: MovieGridProps) => {
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (!movies.length) {
        return <div className="text-center text-gray-500">No movies found.</div>;
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
            {hasNextPage && (
                <div ref={ref} className="flex justify-center py-4">
                    {isFetchingNextPage ? (
                        <div className="text-gray-500">Loading more...</div>
                    ) : (
                        <div className="text-gray-400">Scroll for more</div>
                    )}
                </div>
            )}
        </div>
    );
};
