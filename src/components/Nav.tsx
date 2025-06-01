import { Link, useNavigate } from "react-router-dom";
import { Heart, Search } from "lucide-react";
import { useSearchMovies } from "@/hooks/useMovies";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

export const Nav = () => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const { data: searchResults } = useSearchMovies(open ? search : "");

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const handleSelect = (movieId: number) => {
        setOpen(false);
        navigate(`/movie/${movieId}`);
    };

    return (
        <>
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="text-xl font-bold text-gray-900">
                            Movie Market
                        </Link>
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
                                onClick={() => setOpen(true)}
                            >
                                <Search className="h-4 w-4 xl:mr-2" />
                                <span className="hidden xl:inline-flex">Search movies...</span>
                                <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
                                    <span className="text-xs">⌘</span>K
                                </kbd>
                            </Button>
                            <Link
                                to="/my-lists"
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                            >
                                <Heart className="w-5 h-5" />
                                <span className="hidden sm:inline">My Lists</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Search movies..."
                    value={search}
                    onValueChange={setSearch}
                />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Movies">
                        {searchResults?.pages[0]?.results.slice(0, 10).map((movie) => (
                            <CommandItem
                                key={movie.id}
                                value={movie.title}
                                onSelect={() => handleSelect(movie.id)}
                            >
                                <div className="flex items-center gap-2">
                                    {movie.poster_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                            alt={movie.title}
                                            className="w-8 h-12 object-cover rounded"
                                        />
                                    ) : (
                                        <div className="w-8 h-12 bg-gray-200 rounded flex items-center justify-center">
                                            <Search className="w-4 h-4 text-gray-400" />
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="font-medium">{movie.title}</span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(movie.release_date).getFullYear()}
                                        </span>
                                    </div>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
};
