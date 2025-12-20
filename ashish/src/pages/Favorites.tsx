import { useNavigate } from "react-router-dom";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import { useFavorites } from "@/hooks/useFavorites";

const Favorites = () => {
  const navigate = useNavigate();
  const { data: favorites, isLoading } = useFavorites();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted flex flex-col pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <h1 className="text-xl font-bold text-foreground">My Favorites</h1>
        <p className="text-sm text-muted-foreground">{favorites?.length || 0} creators saved</p>
      </div>

      {/* Favorites List */}
      {favorites && favorites.length > 0 ? (
        <div className="flex-1 p-4 space-y-3">
          {favorites.map(fav => (
            <div 
              key={fav.favoriteId}
              className="border-2 border-dashed border-border bg-card p-4 flex items-center gap-4"
            >
              {/* Avatar */}
              <img 
                src={fav.creator?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fav.creator?.profile?.name}`}
                alt={fav.creator?.profile?.name}
                className="w-16 h-16 rounded-full border-2 border-border flex-shrink-0"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-foreground truncate">{fav.creator?.profile?.name}</div>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs border border-border px-2 py-0.5">[{fav.creator?.category}]</span>
                  <span className={`text-xs px-2 py-0.5 ${
                    fav.creator?.status === 'Live' ? 'bg-destructive/20 text-destructive' :
                    fav.creator?.status === 'Online' ? 'bg-primary/20 text-primary' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {fav.creator?.status}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">₹{fav.creator?.video_call_price_inr}/min</div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Button 
                  size="sm"
                  onClick={() => navigate(`/creator/${fav.creator?.id}?book=true`)}
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
