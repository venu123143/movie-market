import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMovieStore } from "@/store/movieStore";
import { MovieGrid } from "@/components/MovieGrid";
import { Button } from "@/components/ui/button";
import { Heart, BookmarkPlus } from "lucide-react";

const MyLists = () => {
    const { tab = "favorites" } = useParams();
    const navigate = useNavigate();
    const { favorites, watchlist } = useMovieStore();

    useEffect(() => {
        if (tab !== "favorites" && tab !== "watchlist") {
            navigate("/my-lists/favorites", { replace: true });
        }
    }, [tab, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <div className="flex justify-center gap-4 mb-8">
                    <Button
                        size="lg"
                        variant={tab === "favorites" ? "default" : "outline"}
                        onClick={() => navigate("/my-lists/favorites")}
                        className="gap-2"
                    >
                        <Heart className={tab === "favorites" ? "fill-current" : ""} />
                        Favorites
                    </Button>
                    <Button
                        size="lg"
                        variant={tab === "watchlist" ? "default" : "outline"}
                        onClick={() => navigate("/my-lists/watchlist")}
                        className="gap-2"
                    >
                        <BookmarkPlus className={tab === "watchlist" ? "fill-current" : ""} />
                        Watchlist
                    </Button>
                </div>

                {tab === "favorites" ? (
                    favorites.length > 0 ? (
                        <MovieGrid
                            gridColumns={5}
                            movies={favorites}
                            hasNextPage={false}
                            fetchNextPage={() => { }}
                            isFetchingNextPage={false}
                        />
                    ) : (
                        <div className="text-center text-gray-500">
                            <p className="text-lg">No favorites yet</p>
                            <p className="text-sm">Start adding movies to your favorites list!</p>
                        </div>
                    )
                ) : watchlist.length > 0 ? (
                    <MovieGrid
                        gridColumns={5}
                        movies={watchlist}
                        hasNextPage={false}
                        fetchNextPage={() => { }}
                        isFetchingNextPage={false}
                    />
                ) : (
                    <div className="text-center text-gray-500">
                        <p className="text-lg">Your watchlist is empty</p>
                        <p className="text-sm">Add movies you want to watch later!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyLists;
