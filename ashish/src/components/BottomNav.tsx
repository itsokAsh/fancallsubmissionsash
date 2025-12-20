import { useNavigate } from "react-router-dom";
import { Home, Search, Heart, User } from "lucide-react";

interface BottomNavProps {
  active: "feed" | "search" | "favorites" | "profile";
}

const BottomNav = ({ active }: BottomNavProps) => {
  const navigate = useNavigate();

  const items = [
    { key: "feed" as const, icon: Home, label: "Feed", path: "/feed" },
    { key: "search" as const, icon: Search, label: "Search", path: "/search" },
    { key: "favorites" as const, icon: Heart, label: "Favorites", path: "/favorites" },
    { key: "profile" as const, icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t-2 border-dashed border-border">
      <div className="flex justify-around py-3">
        {items.map(item => (
          <button
            key={item.key}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 px-4 py-1 ${
              active === item.key 
                ? 'text-primary' 
                : 'text-muted-foreground'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">[{item.label}]</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
