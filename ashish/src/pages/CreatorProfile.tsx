import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Video, Phone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import { useCreator, useSimilarCreators } from "@/hooks/useCreators";

const CreatorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: creator, isLoading, error } = useCreator(id || "");
  const { data: similarCreators } = useSimilarCreators(
    creator?.category || "", 
    creator?.id || ""
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground">Creator not found</p>
        <Button onClick={() => navigate("/feed")}>Back to Feed</Button>
      </div>
    );
  }

  const isAvailable = creator.status !== "Busy" && creator.status !== "Offline";

  return (
    <div className="min-h-screen bg-muted flex flex-col pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 border border-border">
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <span className="font-semibold text-foreground">Creator Profile</span>
      </div>

      {/* Profile Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <img 
            src={creator.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.profile?.name}`}
            alt={creator.profile?.name}
            className="w-20 h-20 rounded-full border-2 border-border"
          />

          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">{creator.profile?.name}</h1>
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
            <p className="text-xs text-muted-foreground mt-1">
              {creator.available_slots} slots available
            </p>
          </div>

          {/* Favorite Button */}
          <button className="p-2 border-2 border-dashed border-border">
            <Heart className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-card border-b border-border p-4">
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">PRICING (per minute)</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="border-2 border-dashed border-border p-4 text-center">
            <Video className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
            <div className="font-bold text-foreground">₹{creator.video_call_price_inr}</div>
            <div className="text-xs text-muted-foreground">Video Call</div>
          </div>
          <div className="border-2 border-dashed border-border p-4 text-center">
            <Phone className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
            <div className="font-bold text-foreground">₹{creator.audio_call_price_inr}</div>
            <div className="text-xs text-muted-foreground">Audio Call</div>
          </div>
        </div>
      </div>

      {/* Book Buttons */}
      <div className="bg-card border-b border-border p-4">
        <div className="grid grid-cols-2 gap-3">
          <Button 
            disabled={!isAvailable}
            className="w-full"
          >
            [Book Video]
          </Button>
          <Button 
            variant="secondary"
            disabled={!isAvailable}
            className="w-full"
          >
            [Book Audio]
          </Button>
        </div>
      </div>

      {/* Unavailable Banner + Substitute Recommendations */}
      {!isAvailable && similarCreators && similarCreators.length > 0 && (
        <div className="bg-destructive/10 border-2 border-dashed border-destructive/30 m-4 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 border-2 border-dashed border-destructive/50 flex items-center justify-center text-destructive">
              ⏳
            </div>
            <div>
              <p className="font-medium text-foreground">[Creator Unavailable]</p>
              <p className="text-xs text-muted-foreground">
                {creator.profile?.name} is currently {creator.status?.toLowerCase()}. Try these similar creators instead!
              </p>
            </div>
          </div>

          {/* Substitute Creators */}
          <div className="space-y-2">
            {similarCreators.map((sc) => (
              <div
                key={sc.id}
                onClick={() => navigate(`/creator/${sc.id}`)}
                className="border-2 border-dashed border-primary/50 bg-background p-3 flex items-center gap-3 cursor-pointer hover:bg-primary/5"
              >
                <img 
                  src={sc.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${sc.profile?.name}`}
                  alt={sc.profile?.name}
                  className="w-12 h-12 rounded-full border border-border"
                />
                <div className="flex-1">
                  <p className="font-medium text-foreground">[{sc.profile?.name}]</p>
                  <p className="text-xs text-muted-foreground">[{sc.category}] • ₹{sc.video_call_price_inr}/min</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 ${
                    sc.status === 'Live' ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'
                  }`}>
                    [{sc.status === 'Live' ? '🔴 LIVE' : '🟢 Available'}]
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">[Book Now →]</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* About Section */}
      <div className="bg-card border-b border-border p-4">
        <h2 className="text-sm font-semibold text-muted-foreground mb-2">ABOUT</h2>
        <div className="border border-border p-3 text-sm text-foreground">
          {creator.bio || "No bio available"}
        </div>
      </div>

      {/* Similar Creators (shown when available too, but less prominent) */}
      {isAvailable && similarCreators && similarCreators.length > 0 && (
        <div className="bg-card border-b border-border p-4">
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">
            [SIMILAR CREATORS]
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {similarCreators.map(sc => (
              <button
                key={sc.id}
                onClick={() => navigate(`/creator/${sc.id}`)}
                className="flex-shrink-0 w-32 border-2 border-dashed border-border p-3 text-left hover:border-primary"
              >
                <img 
                  src={sc.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${sc.profile?.name}`}
                  alt={sc.profile?.name}
                  className="w-12 h-12 rounded-full border border-border mb-2"
                />
                <div className="font-medium text-foreground text-sm truncate">{sc.profile?.name}</div>
                <div className="text-xs text-muted-foreground">₹{sc.video_call_price_inr}/min</div>
                <div className={`text-xs mt-1 ${
                  sc.status === 'Live' ? 'text-destructive' : 'text-primary'
                }`}>
                  ● {sc.status}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <BottomNav active="feed" />
    </div>
  );
};

export default CreatorProfile;
