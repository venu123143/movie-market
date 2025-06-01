import { useGenres } from "@/hooks/useMovies";
import { Button } from "@/components/ui/button";

interface GenreFilterProps {
    selectedGenre: number | null;
    onSelectGenre: (genreId: number | null) => void;
}

export const GenreFilter = ({ selectedGenre, onSelectGenre }: GenreFilterProps) => {
    const { data: genreData, isLoading } = useGenres();

    if (isLoading) {
        return <div className="text-gray-500">Loading genres...</div>;
    }

    return (
        <div className="flex flex-wrap gap-2">
            <Button
                variant={selectedGenre === null ? "default" : "secondary"}
                onClick={() => onSelectGenre(null)}
                size="sm"
            >
                All
            </Button>
            {genreData?.genres.map((genre) => (
                <Button
                    key={genre.id}
                    variant={selectedGenre === genre.id ? "default" : "secondary"}
                    onClick={() => onSelectGenre(genre.id)}
                    size="sm"
                >
                    {genre.name}
                </Button>
            ))}
        </div>
    );
};
