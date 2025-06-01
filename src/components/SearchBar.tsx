import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
    onSearch: (query: string) => void;
    className?: string;
}

export const SearchBar = ({ onSearch, className = "" }: SearchBarProps) => {
    const [query, setQuery] = useState("");

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            onSearch(query);
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [query, onSearch]);

    return (
        <div className={`relative ${className}`}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
                type="text"
                placeholder="Search movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-4"
            />
        </div>
    );
};
