import { useState } from "react";
import { useMovieStore } from "@/store/movieStore";
import { MovieGrid } from "@/components/MovieGrid";
import { Button } from "@/components/ui/button";
import { Heart, BookmarkPlus } from "lucide-react";

const MyLists = () => {
    const [activeTab, setActiveTab] = useState<"favorites" | "watchlist">("favorites");
    const { favorites, watchlist } = useMovieStore();

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <div className="flex justify-center gap-4 mb-8">
                    <Button
                        size="lg"
                        variant={activeTab === "favorites" ? "default" : "outline"}
                        onClick={() => setActiveTab("favorites")}
                        className="gap-2"
                    >
                        <Heart className={activeTab === "favorites" ? "fill-current" : ""} />
                        Favorites
                    </Button>
                    <Button
                        size="lg"
                        variant={activeTab === "watchlist" ? "default" : "outline"}
                        onClick={() => setActiveTab("watchlist")}
                        className="gap-2"
                    >
                        <BookmarkPlus className={activeTab === "watchlist" ? "fill-current" : ""} />
                        Watchlist
                    </Button>
                </div>

                {activeTab === "favorites" ? (
                    favorites.length > 0 ? (
                        <MovieGrid
                            movies={favorites}
                            hasNextPage={false}
                            fetchNextPage={() => {}}
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
                        movies={watchlist}
                        hasNextPage={false}
                        fetchNextPage={() => {}}
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
