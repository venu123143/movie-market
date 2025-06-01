import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useMovieDetails } from "@/hooks/useMovies";
import type { Movie } from "@/services/api";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

interface MovieCardProps {
    movie: Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const { data: movieDetails, isLoading: loadingDetails } = useMovieDetails(isHovered ? movie.id : null);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Card
                className="flex flex-col items-center border border-gray-200 bg-white rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-200 p-2 cursor-pointer"
            >
                <img
                    src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "/placeholder.jpg"}
                    alt={movie.title}
                    className="w-full h-44 object-cover rounded-md mb-2 transition-transform duration-200 group-hover:scale-105"
                    loading="lazy"
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
            {isHovered && (
                <div className="absolute z-20 top-0 left-0 w-full h-full bg-white/95 border border-yellow-400 rounded-lg shadow-2xl p-3 flex flex-col items-start animate-fade-in">
                    {loadingDetails ? (
                        <div className="w-full text-center text-xs text-gray-500">Loading details...</div>
                    ) : movieDetails ? (
                        <>
                            <h3 className="text-base font-bold mb-1">{movieDetails.title}</h3>
                            {movieDetails.tagline && (
                                <div className="italic text-xs text-gray-500 mb-1">"{movieDetails.tagline}"</div>
                            )}
                            <div className="text-xs mb-1">
                                <span className="font-semibold">Genres: </span>
                                {movieDetails.genres?.map((g) => g.name).join(", ") || "N/A"}
                            </div>
                            <div className="text-xs mb-1">
                                <span className="font-semibold">Runtime: </span>
                                {movieDetails.runtime ? `${movieDetails.runtime} min` : "N/A"}
                            </div>
                            <div className="text-xs mb-1">
                                <span className="font-semibold">Overview: </span>
                                {movieDetails.overview}
                            </div>
                        </>
                    ) : (
                        <div className="w-full text-center text-xs text-gray-500">No details found.</div>
                    )}
                </div>
            )}
        </div>
    );
};
