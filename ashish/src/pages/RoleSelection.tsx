import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-muted flex flex-col items-center justify-center p-6">
      {/* App Logo/Title */}
      <div className="border-2 border-dashed border-border bg-background p-6 mb-8 text-center">
        <div className="w-20 h-20 border-2 border-dashed border-primary mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">[LOGO]</span>
        </div>
        <h1 className="text-2xl font-bold">[FANCALL]</h1>
        <p className="text-sm text-muted-foreground mt-1">[Connect with your favorites]</p>
      </div>

      {/* Role Selection */}
      <div className="w-full max-w-sm space-y-4">
        <p className="text-center text-muted-foreground mb-6">[Who are you?]</p>

        {/* Fan Option */}
        <div
          onClick={() => navigate("/onboarding")}
          className="border-2 border-dashed border-border bg-background p-6 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 border-2 border-dashed border-border flex items-center justify-center text-2xl">
              🎉
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold">[I'm a Fan]</h2>
              <p className="text-sm text-muted-foreground">
                Discover & book calls with your favorite creators
              </p>
            </div>
            <span className="text-muted-foreground">[→]</span>
          </div>
          <div className="mt-4 pt-4 border-t border-dashed border-border">
            <p className="text-xs text-muted-foreground">
              • Browse creator videos<br />
              • Book video & audio calls<br />
              • Save favorites
            </p>
          </div>
        </div>

        {/* Creator Option */}
        <div
          onClick={() => navigate("/creator-hub")}
          className="border-2 border-dashed border-border bg-background p-6 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 border-2 border-dashed border-border flex items-center justify-center text-2xl">
              ⭐
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold">[I'm a Creator]</h2>
              <p className="text-sm text-muted-foreground">
                Set up your profile & manage bookings
              </p>
            </div>
            <span className="text-muted-foreground">[→]</span>
          </div>
          <div className="mt-4 pt-4 border-t border-dashed border-border">
            <p className="text-xs text-muted-foreground">
              • Set your pricing & availability<br />
              • View analytics & earnings<br />
              • See your ranking score
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          [Fancall Wireframe Demo]
        </p>
      </div>
    </div>
  );
};

export default RoleSelection;
