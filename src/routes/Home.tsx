import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { usePopularMovies, useMovieDetails } from "@/hooks/useMovies";
import { Card } from "@/components/ui/card";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const Home = () => {
    const [page, setPage] = useState(1);
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const { data, isLoading, error, refetch } = usePopularMovies(page);
    const { data: hoveredMovie, isLoading: loadingDetails } = useMovieDetails(hoveredId);

    if (isLoading) {
        return <div className="p-4">Loading...</div>;
    }

    if (error) {
        return (
            <div className="p-4 space-y-4">
                <div className="text-red-500">Failed to load movies. Please try again.</div>
                <Button
                    onClick={() => {
                        refetch();
                        toast({
                            title: "Retrying",
                            description: "Attempting to fetch movies again",
                            variant: "warning",
                        });
                    }}
                >
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Popular Movies</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {data?.results.map((movie) => (
                    <div
                        key={movie.id}
                        className="relative"
                        onMouseEnter={() => setHoveredId(movie.id)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        <Card
                            className="flex flex-col items-center border border-gray-200 bg-white rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-200 p-2 cursor-pointer"
                        >
                            <img
                                src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "/placeholder.jpg"}
                                alt={movie.title}
                                className="w-full h-44 object-cover rounded-md mb-2 transition-transform duration-200 group-hover:scale-105"
                            />
                            <div className="w-full flex flex-col items-start px-1">
                                <h2 className="text-sm font-semibold truncate w-full" title={movie.title}>
                                    {movie.title}
                                </h2>
                                <span className="text-xs text-gray-500 mb-1">
                                    {new Date(movie.release_date).getFullYear()}
                                </span>
                                <p className="text-xs text-gray-700 line-clamp-2 mb-1">{movie.overview}</p>
                                <span className="text-xs font-medium text-yellow-600">
                                    ★ {movie.vote_average.toFixed(1)}
                                </span>
                            </div>
                        </Card>
                        {/* Hover Overlay */}
                        {hoveredId === movie.id && (
                            <div className="absolute z-20 top-0 left-0 w-full h-full bg-white/95 border border-yellow-400 rounded-lg shadow-2xl p-3 flex flex-col items-start animate-fade-in">
                                {loadingDetails ? (
                                    <div className="w-full text-center text-xs text-gray-500">Loading details...</div>
                                ) : hoveredMovie ? (
                                    <>
                                        <h3 className="text-base font-bold mb-1">{hoveredMovie.title}</h3>
                                        {hoveredMovie.tagline && (
                                            <div className="italic text-xs text-gray-500 mb-1">"{hoveredMovie.tagline}"</div>
                                        )}
                                        <div className="text-xs mb-1">
                                            <span className="font-semibold">Genres: </span>
                                            {hoveredMovie.genres?.map((g: any) => g.name).join(", ") || "N/A"}
                                        </div>
                                        <div className="text-xs mb-1">
                                            <span className="font-semibold">Runtime: </span>
                                            {hoveredMovie.runtime ? `${hoveredMovie.runtime} min` : "N/A"}
                                        </div>
                                        <div className="text-xs mb-1">
                                            <span className="font-semibold">Overview: </span>
                                            {hoveredMovie.overview}
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full text-center text-xs text-gray-500">No details found.</div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="flex justify-center items-center gap-4 mt-6">
                <Button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    variant="secondary"
                >
                    Previous
                </Button>
                <span className="font-semibold">Page {page}</span>
                <Button
                    onClick={() => setPage((p) => (data?.total_pages && p < data.total_pages ? p + 1 : p))}
                    disabled={data && page >= data.total_pages}
                    variant="secondary"
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default Home;

