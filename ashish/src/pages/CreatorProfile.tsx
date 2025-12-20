import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Video, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";

const MOCK_CREATOR = {
  id: 1,
  name: "John Fitness",
  category: "Fitness",
  status: "Busy",
  videoPrice: 50,
  audioPrice: 30,
  bio: "Professional fitness coach with 10+ years experience",
};

const SIMILAR_CREATORS = [
  { id: 4, name: "Alex Gym", category: "Fitness", status: "Online", price: 45 },
  { id: 5, name: "Lisa Yoga", category: "Fitness", status: "Live", price: 40 },
  { id: 6, name: "Tom CrossFit", category: "Fitness", status: "Online", price: 55 },
];

const CreatorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const creator = MOCK_CREATOR;

  const isAvailable = creator.status !== "Busy";

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
          <div className="w-20 h-20 border-2 border-dashed border-border flex items-center justify-center text-muted-foreground">
            [AVATAR]
          </div>

          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">{creator.name}</h1>
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
            <div className="font-bold text-foreground">${creator.videoPrice}</div>
            <div className="text-xs text-muted-foreground">Video Call</div>
          </div>
          <div className="border-2 border-dashed border-border p-4 text-center">
            <Phone className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
            <div className="font-bold text-foreground">${creator.audioPrice}</div>
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
      {!isAvailable && (
        <div className="bg-destructive/10 border-2 border-dashed border-destructive/30 m-4 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 border-2 border-dashed border-destructive/50 flex items-center justify-center text-destructive">
              ⏳
            </div>
            <div>
              <p className="font-medium text-foreground">[Creator Unavailable]</p>
              <p className="text-xs text-muted-foreground">
                {creator.name} is currently {creator.status.toLowerCase()}. Try these similar creators instead!
              </p>
            </div>
          </div>

          {/* Substitute Creators */}
          <div className="space-y-2">
            {SIMILAR_CREATORS.map((sc) => (
              <div
                key={sc.id}
                onClick={() => navigate(`/creator/${sc.id}`)}
                className="border-2 border-dashed border-primary/50 bg-background p-3 flex items-center gap-3 cursor-pointer hover:bg-primary/5"
              >
                <div className="w-12 h-12 border-2 border-dashed border-border flex items-center justify-center text-xs">
                  [AVT]
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">[{sc.name}]</p>
                  <p className="text-xs text-muted-foreground">[{sc.category}] • ${sc.price}/min</p>
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
          {creator.bio}
        </div>
      </div>

      {/* Similar Creators (shown when available too, but less prominent) */}
      {isAvailable && (
        <div className="bg-card border-b border-border p-4">
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">
            [SIMILAR CREATORS]
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {SIMILAR_CREATORS.map(sc => (
              <button
                key={sc.id}
                onClick={() => navigate(`/creator/${sc.id}`)}
                className="flex-shrink-0 w-32 border-2 border-dashed border-border p-3 text-left hover:border-primary"
              >
                <div className="w-12 h-12 border border-border mb-2 flex items-center justify-center text-xs text-muted-foreground">
                  [AVT]
                </div>
                <div className="font-medium text-foreground text-sm truncate">{sc.name}</div>
                <div className="text-xs text-muted-foreground">${sc.price}/min</div>
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
