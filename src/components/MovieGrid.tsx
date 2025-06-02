import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import type { Movie, RatedTV, RatedTVEpisode } from "@/services/api";
import { MovieCard } from "./MovieCard";

type ContentItem = Movie | RatedTV | RatedTVEpisode;

interface MovieGridProps {
    movies: ContentItem[];
    hasNextPage: boolean;
    fetchNextPage: () => void;
    isFetchingNextPage: boolean;
    gridColumns: 2 | 3 | 4 | 5;
}

export const MovieGrid = ({ movies, gridColumns, hasNextPage, fetchNextPage, isFetchingNextPage }: MovieGridProps) => {
    const { ref, inView } = useInView();
    const colGrid: Record<2 | 3 | 4 | 5, string> = {
        2: "grid-cols-2",
        3: "grid-cols-2 sm:grid-cols-3",
        4: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
        5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
    }

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (!movies.length) {
        return <div className="text-center text-gray-500">No content found.</div>;
    }

    return (
        <div className="space-y-4">
            <div className={`grid ${colGrid[gridColumns]} gap-4`}>
                {movies.map((item) => (
                    <MovieCard key={item.id} movie={item} />
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
