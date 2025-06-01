import { useParams } from "react-router-dom";
import { useMovieStore } from "@/store/movieStore";
import { useMovieDetails, useSimilarMovies } from "@/hooks/useMovies";
import { MovieGrid } from "@/components/MovieGrid";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock, Star, PlayCircle, Heart, BookmarkPlus } from "lucide-react";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

const MovieDetails = () => {
    const { addToFavorites, removeFromFavorites, isInFavorites, addToWatchlist, removeFromWatchlist, isInWatchlist } = useMovieStore();
    const { id } = useParams<{ id: string }>();
    const { data: movie, isLoading } = useMovieDetails(id ? parseInt(id) : null);
    const {
        data: similarMoviesData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useSimilarMovies(id ? parseInt(id) : null);

    const similarMovies = similarMoviesData?.pages.flatMap((page) => page.results) ?? [];

    if (isLoading) {
        return <div className="p-8">Loading...</div>;
    }

    if (!movie) {
        return <div className="p-8">Movie not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            {/* Hero Section with Backdrop */}
            <div
                className="relative h-[60vh] bg-cover bg-center"
                style={{
                    backgroundImage: `url(${IMAGE_BASE_URL}${movie.backdrop_path})`,
                }}
            >
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50" />
                <div className="container mx-auto h-full relative">
                    <div className="flex flex-col md:flex-row items-center md:items-end h-full pb-16 gap-8 px-4 sm:px-6 lg:px-8">
                        {/* Poster */}
                        <img
                            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                            alt={movie.title}
                            className="w-64 rounded-lg shadow-xl border-4 border-white"
                        />
                        {/* Movie Info */}
                        <div className="text-white flex-1 space-y-4 text-center md:text-left">
                            <h1 className="text-4xl font-bold">{movie.title}</h1>
                            {movie.tagline && (
                                <p className="text-xl italic text-gray-300">"{movie.tagline}"</p>
                            )}
                            <div className="flex gap-4">
                                <Badge variant="secondary" className="flex gap-1">
                                    <CalendarIcon className="w-4 h-4" />
                                    {new Date(movie.release_date).getFullYear()}
                                </Badge>
                                <Badge variant="secondary" className="flex gap-1">
                                    <Clock className="w-4 h-4" />
                                    {movie.runtime} min
                                </Badge>
                                <Badge variant="secondary" className="flex gap-1">
                                    <Star className="w-4 h-4" />
                                    {movie.vote_average.toFixed(1)}
                                </Badge>
                            </div>
                            <div className="flex gap-2">
                                {movie.genres.map((genre) => (
                                    <Badge key={genre.id}>{genre.name}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Overview */}
                        <section className="bg-white rounded-lg p-6 md:p-8 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
                            <p className="text-gray-700 leading-relaxed">{movie.overview}</p>
                        </section>

                        {/* Similar Movies */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">Similar Movies</h2>
                            <MovieGrid
                                movies={similarMovies}
                                hasNextPage={hasNextPage}
                                fetchNextPage={fetchNextPage}
                                isFetchingNextPage={isFetchingNextPage}
                            />
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <Button
                                className="flex-1"
                                size="lg"
                                variant={isInFavorites(movie.id) ? "destructive" : "secondary"}
                                onClick={() => isInFavorites(movie.id) ? removeFromFavorites(movie.id) : addToFavorites(movie)}
                            >
                                <Heart className={`mr-2 h-5 w-5 ${isInFavorites(movie.id) ? 'fill-current' : ''}`} />
                                {isInFavorites(movie.id) ? 'Remove' : 'Favorite'}
                            </Button>
                            <Button
                                className="flex-1"
                                size="lg"
                                variant={isInWatchlist(movie.id) ? "destructive" : "secondary"}
                                onClick={() => isInWatchlist(movie.id) ? removeFromWatchlist(movie.id) : addToWatchlist(movie)}
                            >
                                <BookmarkPlus className={`mr-2 h-5 w-5 ${isInWatchlist(movie.id) ? 'fill-current' : ''}`} />
                                {isInWatchlist(movie.id) ? 'Remove' : 'Watchlist'}
                            </Button>
                        </div>
                        {/* Watch Now Button */}
                        <Button className="w-full" size="lg">
                            <PlayCircle className="mr-2 h-5 w-5" />
                            Watch Now
                        </Button>

                        {/* Movie Stats */}
                        <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm space-y-4 border border-gray-100">
                            <h3 className="font-semibold text-lg">Movie Stats</h3>
                            <Separator />
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status</span>
                                    <span className="font-medium">{movie.status}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Budget</span>
                                    <span className="font-medium">
                                        ${movie.budget?.toLocaleString() ?? "N/A"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Revenue</span>
                                    <span className="font-medium">
                                        ${movie.revenue?.toLocaleString() ?? "N/A"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Original Language</span>
                                    <span className="font-medium uppercase">{movie.original_language}</span>
                                </div>
                            </div>
                        </div>

                        {/* Production Companies */}
                        {movie.production_companies && movie.production_companies.length > 0 && (
                            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm space-y-4 border border-gray-100">
                                <h3 className="font-semibold text-lg">Production</h3>
                                <Separator />
                                <div className="space-y-4">
                                    {movie.production_companies.map((company) => (
                                        <div key={company.id} className="flex items-center gap-3">
                                            {company.logo_path ? (
                                                <img
                                                    src={`${IMAGE_BASE_URL}${company.logo_path}`}
                                                    alt={company.name}
                                                    className="h-8 object-contain"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                                                    {company.name[0]}
                                                </div>
                                            )}
                                            <span className="text-sm">{company.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
