import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useFanSession } from "@/context/FanSessionContext";

const CATEGORIES = [
  "Fitness", "Music", "Finance", "Gaming", "Tech", "Comedy",
  "Cooking", "Fashion", "Travel", "Art", "Sports", "Education"
];

const Onboarding = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const navigate = useNavigate();
  const { setUserCategories } = useFanSession();

  const toggleCategory = (cat: string) => {
    setSelected(prev => 
      prev.includes(cat) 
        ? prev.filter(c => c !== cat) 
        : [...prev, cat]
    );
  };

  const handleContinue = () => {
    // Store categories in global context for cold-start algorithm
    setUserCategories(selected);
    navigate("/feed");
  };

  const handleSkip = () => {
    // Use empty categories - feed will show trending/random
    setUserCategories([]);
    navigate("/feed");
  };

  return (
    <div className="min-h-screen bg-muted p-6 flex flex-col">
      {/* Header */}
      <div className="border-2 border-dashed border-border bg-card p-4 mb-6">
        <div className="text-lg font-bold text-foreground">[FANCALL LOGO]</div>
        <div className="text-sm text-muted-foreground mt-1">Welcome! Select your interests</div>
      </div>

      {/* Instructions */}
      <div className="border border-border bg-card p-3 mb-4 text-center">
        <span className="text-muted-foreground text-sm">Select at least 5 categories to personalize your feed</span>
      </div>

      {/* Counter */}
      <div className="text-center mb-4">
        <span className={`text-lg font-semibold ${selected.length >= 5 ? 'text-primary' : 'text-muted-foreground'}`}>
          {selected.length} of 5 selected
        </span>
        {selected.length >= 5 && <span className="text-primary ml-2">✓</span>}
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-3 gap-3 flex-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => toggleCategory(cat)}
            className={`border-2 border-dashed p-4 flex items-center justify-center text-sm font-medium transition-colors ${
              selected.includes(cat)
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-card text-muted-foreground hover:border-muted-foreground'
            }`}
          >
            [{cat}]
          </button>
        ))}
      </div>

      {/* Phase 1: Preview of how categories affect feed */}
      {selected.length > 0 && (
        <div className="mt-4 border border-dashed border-primary/50 bg-primary/5 p-3">
          <p className="text-xs text-primary font-medium">[COLD START PREVIEW]</p>
          <p className="text-xs text-muted-foreground mt-1">
            Your feed will prioritize: {selected.slice(0, 3).join(", ")}
            {selected.length > 3 && ` +${selected.length - 3} more`}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            + 1 trending video outside your categories (exploration)
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 space-y-3">
        <Button 
          onClick={handleContinue}
          disabled={selected.length < 5}
          className="w-full"
          variant={selected.length >= 5 ? "default" : "secondary"}
        >
          Continue ({selected.length}/5)
        </Button>
        <button 
          onClick={handleSkip}
          className="w-full text-sm text-muted-foreground underline"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
