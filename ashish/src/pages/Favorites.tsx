import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";

const MOCK_FAVORITES = [
  { id: 1, name: "John Fitness", category: "Fitness", status: "Online", price: 50 },
  { id: 2, name: "Sarah Music", category: "Music", status: "Live", price: 35 },
];

const Favorites = () => {
  const navigate = useNavigate();
  const favorites = MOCK_FAVORITES;

  return (
    <div className="min-h-screen bg-muted flex flex-col pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <h1 className="text-xl font-bold text-foreground">My Favorites</h1>
        <p className="text-sm text-muted-foreground">{favorites.length} creators saved</p>
      </div>

      {/* Favorites List */}
      {favorites.length > 0 ? (
        <div className="flex-1 p-4 space-y-3">
          {favorites.map(creator => (
            <div 
              key={creator.id}
              className="border-2 border-dashed border-border bg-card p-4 flex items-center gap-4"
            >
              {/* Avatar */}
              <div className="w-16 h-16 border-2 border-dashed border-border flex items-center justify-center text-xs text-muted-foreground flex-shrink-0">
                [AVATAR]
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-foreground truncate">{creator.name}</div>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs border border-border px-2 py-0.5">[{creator.category}]</span>
                  <span className={`text-xs px-2 py-0.5 ${
                    creator.status === 'Live' ? 'bg-destructive/20 text-destructive' :
                    creator.status === 'Online' ? 'bg-primary/20 text-primary' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {creator.status}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">${creator.price}/min</div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Button 
                  size="sm"
                  onClick={() => navigate(`/creator/${creator.id}?book=true`)}
                >
                  [Book]
                </Button>
                <button className="p-2 border border-destructive/50 text-destructive">
                  <Heart className="h-4 w-4 fill-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="border-2 border-dashed border-border bg-card p-8 text-center">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="font-semibold text-foreground mb-2">No favorites yet</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Start exploring creators and tap the heart icon to save them here
            </p>
            <Button onClick={() => navigate("/feed")}>
              [Explore Creators]
            </Button>
          </div>
        </div>
      )}

      <BottomNav active="favorites" />
    </div>
  );
};

export default Favorites;
