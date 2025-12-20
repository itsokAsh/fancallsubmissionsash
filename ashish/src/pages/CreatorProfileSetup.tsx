import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatorProfileSetup = () => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Fitness"]);
  const [availability, setAvailability] = useState("online");

  const categories = ["Fitness", "Music", "Finance", "Gaming", "Tech", "Lifestyle", "Comedy", "Education"];

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
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
          <span className="font-medium">[Creator Profile Setup]</span>
          <span className="text-sm text-muted-foreground">[Save]</span>
        </div>
      </div>

      {/* Profile Preview */}
      <div className="border-2 border-dashed border-border bg-background p-4 mb-4">
        <p className="text-xs text-muted-foreground mb-2">[Profile Preview]</p>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 border-2 border-dashed border-border flex items-center justify-center">
            [Avatar]
          </div>
          <div className="flex-1">
            <p className="font-medium">[Your Name]</p>
            <div className="flex gap-1 mt-1 flex-wrap">
              {selectedCategories.map((cat) => (
                <span key={cat} className="text-xs border border-dashed border-border px-2 py-0.5">
                  [{cat}]
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              [{availability === "online" ? "🟢 Available" : availability === "busy" ? "🟡 Busy" : "⚫ Offline"}]
            </p>
          </div>
        </div>
      </div>

      {/* Form Sections */}
      <div className="space-y-4">
        {/* Category Selection */}
        <div className="border-2 border-dashed border-border bg-background p-4">
          <p className="font-medium mb-3">[Select Categories]</p>
          <p className="text-xs text-muted-foreground mb-3">Choose the categories that best describe your content</p>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <div
                key={category}
                onClick={() => toggleCategory(category)}
                className={`border-2 border-dashed p-3 text-center cursor-pointer transition-colors ${
                  selectedCategories.includes(category)
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-muted"
                }`}
              >
                <span className="text-sm">[{category}]</span>
                {selectedCategories.includes(category) && (
                  <span className="ml-2 text-primary">✓</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="border-2 border-dashed border-border bg-background p-4">
          <p className="font-medium mb-3">[Set Your Pricing]</p>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">[Video Call Rate (per minute)]</label>
              <div className="border-2 border-dashed border-border p-3 mt-1 flex items-center justify-between">
                <span>$</span>
                <span className="font-medium">5.00</span>
                <div className="flex gap-2">
                  <span className="border border-dashed border-border px-2">[-]</span>
                  <span className="border border-dashed border-border px-2">[+]</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground">[Audio Call Rate (per minute)]</label>
              <div className="border-2 border-dashed border-border p-3 mt-1 flex items-center justify-between">
                <span>$</span>
                <span className="font-medium">3.00</span>
                <div className="flex gap-2">
                  <span className="border border-dashed border-border px-2">[-]</span>
                  <span className="border border-dashed border-border px-2">[+]</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="border-2 border-dashed border-border bg-background p-4">
          <p className="font-medium mb-3">[Set Availability]</p>
          
          <div className="space-y-2">
            {[
              { value: "online", label: "Online - Available for calls", icon: "🟢" },
              { value: "busy", label: "Busy - Show as unavailable", icon: "🟡" },
              { value: "offline", label: "Offline - Hidden from feed", icon: "⚫" },
            ].map((option) => (
              <div
                key={option.value}
                onClick={() => setAvailability(option.value)}
                className={`border-2 border-dashed p-3 cursor-pointer flex items-center gap-3 ${
                  availability === option.value
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-muted"
                }`}
              >
                <span>{option.icon}</span>
                <span className="text-sm">[{option.label}]</span>
                {availability === option.value && (
                  <span className="ml-auto text-primary">✓</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div className="border-2 border-dashed border-border bg-background p-4">
          <p className="font-medium mb-3">[About You]</p>
          <div className="border-2 border-dashed border-border p-3 h-24 flex items-start">
            <span className="text-muted-foreground text-sm">[Enter your bio here...]</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">0/300 characters</p>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 border-2 border-dashed border-primary bg-primary/10 p-4 text-center">
        <span className="font-medium">[Save Profile]</span>
      </div>

      {/* Navigation Links */}
      <div className="mt-4">
        <div 
          onClick={() => navigate("/creator-hub")}
          className="border-2 border-dashed border-border bg-background p-3 text-center cursor-pointer hover:bg-muted"
        >
          [← Back to Creator Hub]
        </div>
      </div>
    </div>
  );
};

export default CreatorProfileSetup;
