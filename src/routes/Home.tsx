import { useState, useMemo } from "react";
import { usePopularMovies, useMoviesByGenre, useSearchMovies } from "@/hooks/useMovies";
import { useMovieStore } from "@/store/movieStore";

import { GenreFilter } from "@/components/GenreFilter";
import { MovieGrid } from "@/components/MovieGrid";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const Home = () => {

    const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
    const { searchQuery } = useMovieStore();

    const {
        data: searchData,
        fetchNextPage: fetchNextSearch,
        hasNextPage: hasNextSearch,
        isFetchingNextPage: isFetchingNextSearch,
        isLoading: isLoadingSearch,
    } = useSearchMovies(searchQuery);

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
        if (searchQuery) {
            return {
                movies: searchData?.pages.flatMap((page) => page.results) ?? [],
                fetchNextPage: fetchNextSearch,
                hasNextPage: hasNextSearch,
                isFetchingNextPage: isFetchingNextSearch,
            };
        }

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
    }, [searchQuery, selectedGenre, searchData, popularData, genreData]);

    const isLoading = isLoadingSearch || isLoadingPopular || isLoadingGenre;

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="p-4 space-y-6">
            <div className="flex flex-col space-y-4">
                <h1 className="text-2xl font-bold">
                    {searchQuery ? "Search Results" : selectedGenre ? "Movies by Genre" : "Popular Movies"}
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
                gridColumns={5}
            />
        </div>
    );
};

export default Home;

