import { useState, useMemo, useEffect } from "react";
import { usePopularMovies, useMoviesByGenre, useSearchMovies } from "@/hooks/useMovies";
import { useRatedTVShows, useRatedEpisodes } from "@/hooks/useRatedContent";
import { useMovieStore } from "@/store/movieStore";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { GenreFilter } from "@/components/GenreFilter";
import { MovieGrid } from "@/components/MovieGrid";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Film, Tv, ListVideo, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Home = () => {
    const { tab = "movies" } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
    const { searchQuery } = useMovieStore();
    const { isAuthenticated, startAuth, completeAuth } = useAuth();

    // Handle authentication callback
    useEffect(() => {
        const approved = searchParams.get('approved');
        if (approved === 'true') {
            completeAuth();
        }
    }, [searchParams, completeAuth]);

    // Movies data
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

    // TV Shows data
    const {
        data: tvShowsData,
        fetchNextPage: fetchNextTVShows,
        hasNextPage: hasNextTVShows,
        isFetchingNextPage: isFetchingNextTVShows,
        isLoading: isLoadingTVShows,
    } = useRatedTVShows();

    // Episodes data
    const {
        data: episodesData,
        fetchNextPage: fetchNextEpisodes,
        hasNextPage: hasNextEpisodes,
        isFetchingNextPage: isFetchingNextEpisodes,
        isLoading: isLoadingEpisodes,
    } = useRatedEpisodes();

    const { content, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useMemo(() => {
        if (tab === "tv") {
            return {
                content: tvShowsData?.pages.flatMap((page) => page.results) ?? [],
                fetchNextPage: fetchNextTVShows,
                hasNextPage: hasNextTVShows,
                isFetchingNextPage: isFetchingNextTVShows,
                isLoading: isLoadingTVShows,
            };
        }

        if (tab === "episodes") {
            return {
                content: episodesData?.pages.flatMap((page) => page.results) ?? [],
                fetchNextPage: fetchNextEpisodes,
                hasNextPage: hasNextEpisodes,
                isFetchingNextPage: isFetchingNextEpisodes,
                isLoading: isLoadingEpisodes,
            };
        }

        if (searchQuery) {
            return {
                content: searchData?.pages.flatMap((page) => page.results) ?? [],
                fetchNextPage: fetchNextSearch,
                hasNextPage: hasNextSearch,
                isFetchingNextPage: isFetchingNextSearch,
                isLoading: isLoadingSearch,
            };
        }

        if (selectedGenre) {
            return {
                content: genreData?.pages.flatMap((page) => page.results) ?? [],
                fetchNextPage: fetchNextGenre,
                hasNextPage: hasNextGenre,
                isFetchingNextPage: isFetchingNextGenre,
                isLoading: isLoadingGenre,
            };
        }

        return {
            content: popularData?.pages.flatMap((page) => page.results) ?? [],
            fetchNextPage: fetchNextPopular,
            hasNextPage: hasNextPopular,
            isFetchingNextPage: isFetchingNextPopular,
            isLoading: isLoadingPopular,
        };
    }, [
        tab,
        searchQuery,
        selectedGenre,
        searchData,
        popularData,
        genreData,
        tvShowsData,
        episodesData,
    ]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if ((tab === "tv" || tab === "episodes") && !isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <h2 className="text-xl font-semibold">Authentication Required</h2>
                <p className="text-gray-600">Please log in to view your rated content.</p>
                <Button onClick={startAuth} className="gap-2">
                    <LogIn className="w-4 h-4" />
                    Log in with TMDB
                </Button>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-6">
            <div className="flex flex-col space-y-4">
                <div className="flex justify-center gap-4 mb-8">
                    <Button
                        size="lg"
                        variant={tab === "movies" ? "default" : "outline"}
                        onClick={() => navigate("/movies")}
                        className="gap-2"
                    >
                        <Film className={tab === "movies" ? "fill-current" : ""} />
                        Movies
                    </Button>
                    <Button
                        size="lg"
                        variant={tab === "tv" ? "default" : "outline"}
                        onClick={() => navigate("/tv")}
                        className="gap-2"
                    >
                        <Tv className={tab === "tv" ? "fill-current" : ""} />
                        TV Shows
                    </Button>
                    <Button
                        size="lg"
                        variant={tab === "episodes" ? "default" : "outline"}
                        onClick={() => navigate("/episodes")}
                        className="gap-2"
                    >
                        <ListVideo className={tab === "episodes" ? "fill-current" : ""} />
                        Episodes
                    </Button>
                </div>
                <h1 className="text-2xl font-bold">
                    {searchQuery 
                        ? "Search Results" 
                        : selectedGenre 
                            ? "Movies by Genre" 
                            : tab === "tv" 
                                ? "TV Shows" 
                                : tab === "episodes" 
                                    ? "Episodes" 
                                    : "Popular Movies"}
                </h1>
                {tab === "movies" && (
                    <div className="flex flex-col md:flex-row gap-4">
                        <GenreFilter
                            selectedGenre={selectedGenre}
                            onSelectGenre={setSelectedGenre}
                        />
                    </div>
                )}
            </div>
            <MovieGrid
                movies={content}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                gridColumns={5}
            />
        </div>
    );
};

export default Home;

