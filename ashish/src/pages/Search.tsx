import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";

const CATEGORIES = ["All", "Fitness", "Music", "Finance", "Gaming", "Tech", "Comedy"];
const PRICE_RANGES = ["Any", "$0-25", "$25-50", "$50-100", "$100+"];
const AVAILABILITY = ["Any", "Online Now", "Live", "Available Today"];

const MOCK_RESULTS = [
  { id: 1, name: "John Fitness", category: "Fitness", status: "Online", price: 50 },
  { id: 2, name: "Sarah Music", category: "Music", status: "Live", price: 35 },
  { id: 3, name: "Mike Gaming", category: "Gaming", status: "Busy", price: 45 },
  { id: 4, name: "Lisa Finance", category: "Finance", status: "Online", price: 75 },
];

const Search = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("Any");
  const [selectedAvailability, setSelectedAvailability] = useState("Any");

  const filteredResults = MOCK_RESULTS.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) &&
    (selectedCategory === "All" || c.category === selectedCategory)
  );

  return (
    <div className="min-h-screen bg-muted flex flex-col pb-20">
      {/* Search Header */}
      <div className="bg-card border-b border-border p-4 space-y-3">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="flex-1 border-2 border-dashed border-border bg-background flex items-center px-3">
            <SearchIcon className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search creators..."
              className="flex-1 p-3 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            />
            {query && (
              <button onClick={() => setQuery("")}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 border-2 border-dashed ${showFilters ? 'border-primary bg-primary/10' : 'border-border bg-card'}`}
          >
            <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="border-2 border-dashed border-border p-4 space-y-4">
            {/* Category Filter */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">CATEGORY</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 text-sm border ${
                      selectedCategory === cat 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-border text-muted-foreground'
                    }`}
                  >
                    [{cat}]
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">PRICE RANGE</label>
              <div className="flex flex-wrap gap-2">
                {PRICE_RANGES.map(price => (
                  <button
                    key={price}
                    onClick={() => setSelectedPrice(price)}
                    className={`px-3 py-1 text-sm border ${
                      selectedPrice === price 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-border text-muted-foreground'
                    }`}
                  >
                    [{price}]
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">AVAILABILITY</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABILITY.map(avail => (
                  <button
                    key={avail}
                    onClick={() => setSelectedAvailability(avail)}
                    className={`px-3 py-1 text-sm border ${
                      selectedAvailability === avail 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-border text-muted-foreground'
                    }`}
                  >
                    [{avail}]
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setSelectedCategory("All");
                setSelectedPrice("Any");
                setSelectedAvailability("Any");
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>

      {/* Sort Options */}
      <div className="bg-card border-b border-border px-4 py-2 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{filteredResults.length} results</span>
        <div className="flex gap-2 text-xs">
          <button className="px-2 py-1 border border-primary text-primary">[Relevance]</button>
          <button className="px-2 py-1 border border-border text-muted-foreground">[Price]</button>
          <button className="px-2 py-1 border border-border text-muted-foreground">[Available]</button>
        </div>
      </div>

      {/* Results Grid */}
      <div className="flex-1 p-4">
        {filteredResults.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredResults.map(creator => (
              <button
                key={creator.id}
                onClick={() => navigate(`/creator/${creator.id}`)}
                className="border-2 border-dashed border-border bg-card p-4 text-left hover:border-primary"
              >
                <div className="w-16 h-16 border-2 border-dashed border-border mx-auto mb-3 flex items-center justify-center text-xs text-muted-foreground">
                  [AVATAR]
                </div>
                <div className="font-semibold text-foreground text-sm truncate text-center">
                  {creator.name}
                </div>
                <div className="text-xs text-center mt-1">
                  <span className="border border-border px-1">[{creator.category}]</span>
                </div>
                <div className="flex justify-between items-center mt-2 text-xs">
                  <span className="text-muted-foreground">${creator.price}/min</span>
                  <span className={`${
                    creator.status === 'Live' ? 'text-destructive' :
                    creator.status === 'Online' ? 'text-primary' :
                    'text-muted-foreground'
                  }`}>
                    ● {creator.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-border bg-card p-8 text-center">
            <SearchIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="font-semibold text-foreground mb-2">No results found</h2>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>

      <BottomNav active="search" />
    </div>
  );
};

export default Search;
