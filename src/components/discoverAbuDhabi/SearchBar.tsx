import React, { useState } from "react";
import { SearchIcon, FilterIcon, XIcon } from "lucide-react";
interface SearchBarProps {
  onSearch: (query: string, filters: string[]) => void;
}
const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const categories = [
    "Technology",
    "Energy",
    "Finance",
    "Tourism",
    "Retail",
    "Healthcare",
  ];
  const handleSearch = () => {
    onSearch(query, selectedFilters);
  };
  const toggleFilter = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };
  return (
    <div className="w-full bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
      <div className="p-6 flex items-center">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search businesses, services, or keywords..."
            className="w-full py-4 pl-12 pr-4 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-base"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <SearchIcon
            size={20}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
        <button
          className={`ml-4 p-4 rounded-lg flex items-center justify-center transition-colors ${
            showFilters
              ? "bg-primary text-white"
              : "bg-gray-50 text-gray-500 hover:bg-gray-100"
          }`}
          onClick={() => setShowFilters(!showFilters)}
          aria-label="Toggle filters"
        >
          <FilterIcon size={20} />
        </button>
        <button
          className="ml-4 px-8 py-4 bg-primary text-white font-body font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-sm hover:shadow-md hidden md:block"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      {showFilters && (
        <div className="p-6 border-t border-gray-100 animate-fadeIn">
          <p className="font-body font-medium mb-4">Filter by category:</p>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => toggleFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-body transition-all ${
                  selectedFilters.includes(category)
                    ? "bg-primary text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category}
                {selectedFilters.includes(category) && (
                  <XIcon size={14} className="ml-2 inline" />
                )}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <button
              className="text-gray-500 text-sm font-body hover:text-primary transition-colors"
              onClick={() => setSelectedFilters([])}
            >
              Clear all filters
            </button>
            <button
              className="px-6 py-3 bg-primary text-white font-body font-medium rounded-lg hover:bg-primary-dark transition-colors md:hidden"
              onClick={handleSearch}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default SearchBar;
