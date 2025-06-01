import { useState, useMemo } from "react";
import { usePopularMovies, useMoviesByGenre } from "@/hooks/useMovies";
import { useMovieStore } from "@/store/movieStore";

import { GenreFilter } from "@/components/GenreFilter";
import { MovieGrid } from "@/components/MovieGrid";

const Home = () => {

    const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
    const { searchQuery } = useMovieStore();

    const {
        data: popularData,
        fetchNextPage: fetchNextPopular,
        hasNextPage: hasNextPopular,
        isFetchingNextPage: isFetchingNextPopular,
        isLoading: isLoadingPopular,
    } = usePopularMovies(!searchQuery && !selectedGenre);



    const {
        data: genreData,
        fetchNextPage: fetchNextGenre,
        hasNextPage: hasNextGenre,
        isFetchingNextPage: isFetchingNextGenre,
        isLoading: isLoadingGenre,
    } = useMoviesByGenre(selectedGenre);

    const { movies, fetchNextPage, hasNextPage, isFetchingNextPage } = useMemo(() => {
        if (selectedGenre) {
            return {
                movies: genreData?.pages.flatMap((page) => page.results) ?? [],
                fetchNextPage: fetchNextGenre,
                hasNextPage: hasNextGenre,
                isFetchingNextPage: isFetchingNextGenre,
            };
        }

        return {
            movies: popularData?.pages.flatMap((page) => page.results) ?? [],
            fetchNextPage: fetchNextPopular,
            hasNextPage: hasNextPopular,
            isFetchingNextPage: isFetchingNextPopular,
        };
    }, [selectedGenre, popularData, genreData]);

    const isLoading = isLoadingPopular || isLoadingGenre;

    if (isLoading) {
        return <div className="p-4">Loading...</div>;
    }

    return (
        <div className="p-4 space-y-6">
            <div className="flex flex-col space-y-4">
                <h1 className="text-2xl font-bold">
                    {selectedGenre ? "Movies by Genre" : "Popular Movies"}
                </h1>
                <div className="flex flex-col md:flex-row gap-4">
                    <GenreFilter
                        selectedGenre={selectedGenre}
                        onSelectGenre={setSelectedGenre}
                    />
                </div>
            </div>
            <MovieGrid
                movies={movies}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
            />
        </div>
    );
};

export default Home;

