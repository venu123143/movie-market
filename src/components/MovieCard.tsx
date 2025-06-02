import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useContentDetails } from "@/hooks/useContentDetails";
import { useLists } from "@/hooks/useLists";
import { useAuth } from "@/hooks/useAuth";
import type { Movie, RatedTV, RatedTVEpisode } from "@/services/api";
import { Heart, BookmarkPlus } from "lucide-react";
import { Button } from "./ui/button";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

type ContentItem = Movie | RatedTV | RatedTVEpisode;

interface MovieCardProps {
    movie: ContentItem;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const { isAuthenticated } = useAuth();
    const { addToFavorites, addToWatchlist } = useLists();

    const contentType = 'title' in movie ? 'movie' : 'episode_number' in movie ? 'episode' : 'tv';
    const { data: contentDetails, isLoading: loadingDetails } = useContentDetails(
        isHovered ? movie.id : null,
        contentType
    );

    const title = 'title' in movie ? movie.title : movie.name;
    const releaseDate = 'release_date' in movie
        ? movie.release_date
        : 'first_air_date' in movie
            ? movie.first_air_date
            : movie.air_date;
    const posterPath = 'poster_path' in movie
        ? movie.poster_path
        : movie.still_path;
    const voteAverage = 'vote_average' in movie
        ? movie.vote_average
        : movie.rating;

    const handleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated) return;
        // TODO: Check if already in favorites
        addToFavorites({ mediaId: movie.id, mediaType: contentType === 'episode' ? 'tv' : contentType });
    };

    const handleWatchlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated) return;
        // TODO: Check if already in watchlist
        addToWatchlist({ mediaId: movie.id, mediaType: contentType === 'episode' ? 'tv' : contentType });
    };

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Card
                className="flex flex-col items-center border border-gray-200 bg-white rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-200 p-2 cursor-pointer"
                onClick={() => navigate(`/movie/${movie.id}`)}
            >
                <div className="relative aspect-[2/3]">
                    <img
                        src={`${IMAGE_BASE_URL}${posterPath}`}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                    {isHovered && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 p-4 flex flex-col justify-between">
                            <div className="flex justify-end gap-2">
                                {isAuthenticated && (
                                    <>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 bg-white/20 hover:bg-white/30"
                                            onClick={handleFavorite}
                                        >
                                            <Heart className="h-4 w-4 text-white" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 bg-white/20 hover:bg-white/30"
                                            onClick={handleWatchlist}
                                        >
                                            <BookmarkPlus className="h-4 w-4 text-white" />
                                        </Button>
                                    </>
                                )}
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">{title}</h3>
                                <p className="text-gray-300 text-sm">{releaseDate}</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="w-full flex flex-col items-start px-1">
                    <h2 className="text-sm font-semibold truncate w-full" title={title}>
                        {title}
                    </h2>
                    <span className="text-xs text-gray-500 mb-1">
                        {new Date(releaseDate).getFullYear()}
                    </span>
                    <p className="text-xs text-gray-700 line-clamp-2 mb-1">{movie.overview}</p>
                    <span className="text-xs font-medium text-yellow-600">
                        ★ {voteAverage.toFixed(1)}
                    </span>
                </div>
            </Card>
            {isHovered && (
                <div className="absolute z-20 top-0 left-0 w-full h-full bg-white/95 border border-yellow-400 rounded-lg shadow-2xl p-3 overflow-y-auto animate-fade-in cursor-pointer" onClick={() => navigate(`/movie/${movie.id}`)}>
                    {loadingDetails ? (
                        <div className="w-full text-center text-xs text-gray-500">Loading details...</div>
                    ) : contentDetails ? (
                        <>
                            <h3 className="text-base font-bold mb-1 truncate" title={title}>{title}</h3>
                            {'tagline' in contentDetails && contentDetails.tagline && (
                                <div className="italic text-xs text-gray-500 mb-1">"{contentDetails.tagline}"</div>
                            )}
                            {'genres' in contentDetails && (
                                <div className="text-xs mb-1">
                                    <span className="font-semibold">Genres: </span>
                                    <span className="truncate">{contentDetails.genres?.map((g) => g.name).join(", ") || "N/A"}</span>
                                </div>
                            )}
                            {'runtime' in contentDetails && (
                                <div className="text-xs mb-1">
                                    <span className="font-semibold">Runtime: </span>
                                    {contentDetails.runtime ? `${contentDetails.runtime} min` : "N/A"}
                                </div>
                            )}
                            <div className="text-xs mb-1">
                                <span className="font-semibold">Overview: </span>
                                <span className="line-clamp-4">{movie.overview}</span>
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
