import { useNavigate } from "react-router-dom";
import { Clock, Users } from "lucide-react";

const ScoringDashboard = () => {
  const navigate = useNavigate();

  // Phase 4: Updated mock data with availability slots
  const mockCreators = [
    { id: 1, name: "Creator A", category: "Fitness", baseScore: 85, isAvailableNow: true, availableSlots: 5, isFavorite: false },
    { id: 2, name: "Creator B", category: "Music", baseScore: 72, isAvailableNow: false, availableSlots: 0, isFavorite: true },
    { id: 3, name: "Creator C", category: "Finance", baseScore: 90, isAvailableNow: true, availableSlots: 3, isFavorite: true },
    { id: 4, name: "Creator D", category: "Gaming", baseScore: 65, isAvailableNow: false, availableSlots: 0, isFavorite: false },
    { id: 5, name: "Creator E", category: "Tech", baseScore: 78, isAvailableNow: true, availableSlots: 2, isFavorite: false },
    { id: 6, name: "Creator F", category: "Comedy", baseScore: 82, isAvailableNow: true, availableSlots: 4, isFavorite: false },
  ];

  // Similar creators for substitute recommendations
  const getSubstitutes = (category: string, excludeId: number) => {
    return mockCreators
      .filter(c => c.category === category && c.id !== excludeId && c.isAvailableNow && c.availableSlots > 0)
      .slice(0, 3);
  };

  // Phase 4: Updated formula - FinalScore = BaseScore × (1.5 if AvailableNow else 0.8)
  const calculateFinalScore = (baseScore: number, isAvailableNow: boolean) => {
    const availabilityMultiplier = isAvailableNow ? 1.5 : 0.8;
    return Math.round(baseScore * availabilityMultiplier);
  };

  return (
    <div className="min-h-screen bg-muted p-4">
      {/* Header */}
      <div className="border-2 border-dashed border-border bg-background p-4 mb-4">
        <div className="flex items-center justify-between">
          <span 
            className="text-sm text-muted-foreground cursor-pointer"
            onClick={() => navigate("/creator-hub")}
          >
            [← Back]
          </span>
          <span className="font-medium">[Scoring Dashboard]</span>
          <span className="text-sm text-muted-foreground">[Filter ▼]</span>
        </div>
      </div>

      {/* Phase 4: Updated Formula Legend */}
      <div className="border-2 border-dashed border-primary bg-primary/5 p-4 mb-4">
        <p className="text-sm font-medium mb-2 text-primary">[Phase 4: Availability Scoring]</p>
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-mono bg-muted px-2 py-1 inline-block">
            FinalScore = BaseScore × (1.5 if AvailableNow else 0.8)
          </p>
          <p className="mt-2">• BaseScore: Category match % (0-100)</p>
          <p>• Availability Multiplier: <span className="text-primary">1.5x</span> if online with slots, <span className="text-destructive">0.8x</span> if unavailable</p>
          <p>• Boosts creators who can actually take a call!</p>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {["All", "Available Now", "Has Slots", "Fitness", "Music", "Tech"].map((filter) => (
          <div
            key={filter}
            className="border-2 border-dashed border-border bg-background px-3 py-1 text-xs whitespace-nowrap"
          >
            [{filter}]
          </div>
        ))}
      </div>

      {/* Creator Scoring List */}
      <div className="space-y-3">
        {mockCreators
          .sort((a, b) => 
            calculateFinalScore(b.baseScore, b.isAvailableNow) - 
            calculateFinalScore(a.baseScore, a.isAvailableNow)
          )
          .map((creator, index) => {
            const finalScore = calculateFinalScore(creator.baseScore, creator.isAvailableNow);
            const availabilityMultiplier = creator.isAvailableNow ? 1.5 : 0.8;
            const substitutes = !creator.isAvailableNow ? getSubstitutes(creator.category, creator.id) : [];
            
            return (
              <div
                key={creator.id}
                className="border-2 border-dashed border-border bg-background p-4"
              >
                {/* Creator Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                    <div className="w-10 h-10 border-2 border-dashed border-border flex items-center justify-center text-xs">
                      [Av]
                    </div>
                    <div>
                      <p className="font-medium">[{creator.name}]</p>
                      <p className="text-xs text-muted-foreground">[{creator.category}]</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {creator.isAvailableNow ? (
                      <span className="text-xs border border-dashed border-green-500 text-green-600 px-2 py-0.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        [AVAILABLE]
                      </span>
                    ) : (
                      <span className="text-xs border border-dashed border-destructive text-destructive px-2 py-0.5">
                        [UNAVAILABLE]
                      </span>
                    )}
                    {creator.isFavorite && (
                      <span className="text-xs border border-dashed border-red-500 text-red-500 px-2 py-0.5">
                        [♥]
                      </span>
                    )}
                  </div>
                </div>

                {/* Score Breakdown - Phase 4 Formula */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="border border-dashed border-border p-2">
                    <p className="text-xs text-muted-foreground">Base Score</p>
                    <p className="font-bold">{creator.baseScore}</p>
                    <div className="h-1 bg-muted mt-1">
                      <div 
                        className="h-full bg-foreground/30" 
                        style={{ width: `${creator.baseScore}%` }}
                      />
                    </div>
                  </div>
                  <div className={`border border-dashed p-2 ${
                    creator.isAvailableNow 
                      ? "border-green-500/50 bg-green-500/5" 
                      : "border-destructive/50 bg-destructive/5"
                  }`}>
                    <p className="text-xs text-muted-foreground">Availability</p>
                    <p className={`font-bold ${creator.isAvailableNow ? "text-green-600" : "text-destructive"}`}>
                      {availabilityMultiplier}x
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      [{creator.availableSlots} slots]
                    </p>
                  </div>
                  <div className="border-2 border-dashed border-primary p-2 bg-primary/5">
                    <p className="text-xs text-muted-foreground">Final</p>
                    <p className="font-bold text-primary text-lg">{finalScore}</p>
                    <p className="text-xs text-muted-foreground">
                      {creator.baseScore} × {availabilityMultiplier}
                    </p>
                  </div>
                </div>

                {/* Phase 4: Substitute Recommendations for Unavailable Creators */}
                {!creator.isAvailableNow && substitutes.length > 0 && (
                  <div className="mt-3 border-t border-dashed border-border pt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-3 w-3 text-primary" />
                      <span className="text-xs text-primary font-medium">[SIMILAR & AVAILABLE]</span>
                    </div>
                    <div className="flex gap-2">
                      {substitutes.map(sub => (
                        <div 
                          key={sub.id}
                          className="flex-1 border border-dashed border-green-500/50 bg-green-500/5 p-2 text-center"
                        >
                          <p className="text-xs font-medium">[{sub.name}]</p>
                          <p className="text-xs text-green-600">{sub.availableSlots} slots open</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Phase 4: No Substitutes Message */}
                {!creator.isAvailableNow && substitutes.length === 0 && (
                  <div className="mt-3 border-t border-dashed border-border pt-3">
                    <p className="text-xs text-muted-foreground italic text-center">
                      [No similar creators available in {creator.category}]
                    </p>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Phase 4: Substitute Trigger Explanation */}
      <div className="mt-4 border-2 border-dashed border-border bg-background p-4">
        <p className="text-sm font-medium mb-2">[Substitute Recommendation Trigger]</p>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>When a user views a "Fully Booked" profile:</p>
          <p className="font-mono bg-muted px-2 py-1 mt-1">
            → API returns 3 similar creators with slots open in next 2 hours
          </p>
          <p className="mt-2">This reduces friction and increases conversion!</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="mt-6 space-y-2">
        <div 
          onClick={() => navigate("/creator-setup")}
          className="border-2 border-dashed border-border bg-background p-3 text-center cursor-pointer hover:bg-muted"
        >
          [Go to Profile Setup →]
        </div>
        <div 
          onClick={() => navigate("/analytics")}
          className="border-2 border-dashed border-border bg-background p-3 text-center cursor-pointer hover:bg-muted"
        >
          [Go to Analytics →]
        </div>
        <div 
          onClick={() => navigate("/feed")}
          className="border-2 border-dashed border-border bg-background p-3 text-center cursor-pointer hover:bg-muted"
        >
          [Back to Fan View →]
        </div>
      </div>
    </div>
  );
};

export default ScoringDashboard;
