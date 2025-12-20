import { useNavigate } from "react-router-dom";

const CreatorHub = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-muted p-4">
      {/* Header */}
      <div className="border-2 border-dashed border-border bg-background p-4 mb-4">
        <div className="flex items-center justify-between">
          <span 
            className="text-sm text-muted-foreground cursor-pointer"
            onClick={() => navigate("/")}
          >
            [← Exit]
          </span>
          <span className="font-medium">[Creator Hub]</span>
          <div className="w-8 h-8 border border-dashed border-border flex items-center justify-center text-xs">
            [Me]
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="border-2 border-dashed border-primary bg-primary/5 p-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 border-2 border-dashed border-border flex items-center justify-center">
            [AVT]
          </div>
          <div>
            <p className="font-bold">[Welcome, Creator!]</p>
            <p className="text-sm text-muted-foreground">Manage your Fancall presence</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="border-2 border-dashed border-border bg-background p-3 text-center">
          <p className="text-2xl font-bold">24</p>
          <p className="text-xs text-muted-foreground">[Views Today]</p>
        </div>
        <div className="border-2 border-dashed border-border bg-background p-3 text-center">
          <p className="text-2xl font-bold">3</p>
          <p className="text-xs text-muted-foreground">[Bookings]</p>
        </div>
        <div className="border-2 border-dashed border-border bg-background p-3 text-center">
          <p className="text-2xl font-bold">$85</p>
          <p className="text-xs text-muted-foreground">[Earned]</p>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="space-y-3">
        <div
          onClick={() => navigate("/creator-setup")}
          className="border-2 border-dashed border-border bg-background p-4 cursor-pointer hover:border-primary hover:bg-primary/5"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-2 border-dashed border-border flex items-center justify-center text-xl">
              ⚙️
            </div>
            <div className="flex-1">
              <p className="font-medium">[Profile Setup]</p>
              <p className="text-xs text-muted-foreground">Set categories, pricing & availability</p>
            </div>
            <span className="text-muted-foreground">[→]</span>
          </div>
        </div>

        <div
          onClick={() => navigate("/analytics")}
          className="border-2 border-dashed border-border bg-background p-4 cursor-pointer hover:border-primary hover:bg-primary/5"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-2 border-dashed border-border flex items-center justify-center text-xl">
              📊
            </div>
            <div className="flex-1">
              <p className="font-medium">[Analytics]</p>
              <p className="text-xs text-muted-foreground">View performance & earnings</p>
            </div>
            <span className="text-muted-foreground">[→]</span>
          </div>
        </div>

        <div
          onClick={() => navigate("/scoring")}
          className="border-2 border-dashed border-border bg-background p-4 cursor-pointer hover:border-primary hover:bg-primary/5"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-2 border-dashed border-border flex items-center justify-center text-xl">
              🏆
            </div>
            <div className="flex-1">
              <p className="font-medium">[Scoring Dashboard]</p>
              <p className="text-xs text-muted-foreground">See ranking algorithm breakdown</p>
            </div>
            <span className="text-muted-foreground">[→]</span>
          </div>
        </div>
      </div>

      {/* Preview Fan View */}
      <div className="mt-6 border-2 border-dashed border-muted-foreground/30 bg-background p-4">
        <p className="text-sm text-muted-foreground mb-3">[Preview how fans see you]</p>
        <div
          onClick={() => navigate("/feed")}
          className="border border-dashed border-border p-3 flex items-center gap-3 cursor-pointer hover:bg-muted"
        >
          <div className="w-10 h-10 border border-dashed border-border flex items-center justify-center text-xs">
            👀
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">[View Fan Experience →]</p>
            <p className="text-xs text-muted-foreground">See the video feed & discovery</p>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="mt-4 border-2 border-dashed border-border bg-background p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">[Your Status]</p>
            <p className="text-xs text-muted-foreground">Toggle your availability</p>
          </div>
          <div className="flex gap-2">
            <span className="text-xs border-2 border-dashed border-primary bg-primary/10 px-3 py-1">
              [🟢 Online]
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorHub;
