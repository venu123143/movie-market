import { useState, useMemo } from "react";
import { usePopularMovies, useSearchMovies, useMoviesByGenre } from "@/hooks/useMovies";
import { SearchBar } from "@/components/SearchBar";
import { GenreFilter } from "@/components/GenreFilter";
import { MovieGrid } from "@/components/MovieGrid";

const Home = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

    const {
        data: popularData,
        fetchNextPage: fetchNextPopular,
        hasNextPage: hasNextPopular,
        isFetchingNextPage: isFetchingNextPopular,
        isLoading: isLoadingPopular,
    } = usePopularMovies(!searchQuery && !selectedGenre);

    const {
        data: searchData,
        fetchNextPage: fetchNextSearch,
        hasNextPage: hasNextSearch,
        isFetchingNextPage: isFetchingNextSearch,
        isLoading: isLoadingSearch,
    } = useSearchMovies(searchQuery);

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
    }, [searchQuery, selectedGenre, popularData, searchData, genreData]);

    const isLoading = isLoadingPopular || isLoadingSearch || isLoadingGenre;

    if (isLoading) {
        return <div className="p-4">Loading...</div>;
    }

    return (
        <div className="p-4 space-y-6">
            <div className="flex flex-col space-y-4">
                <h1 className="text-2xl font-bold">
                    {searchQuery
                        ? `Search Results for "${searchQuery}"`
                        : selectedGenre
                        ? "Movies by Genre"
                        : "Popular Movies"}
                </h1>
                <div className="flex flex-col md:flex-row gap-4">
                    <SearchBar
                        onSearch={setSearchQuery}
                        className="md:w-96"
                    />
                    <GenreFilter
                        selectedGenre={selectedGenre}
                        onSelectGenre={(genreId) => {
                            setSelectedGenre(genreId);
                            setSearchQuery("");
                        }}
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

