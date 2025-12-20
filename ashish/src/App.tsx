import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Context
import { FanSessionProvider } from "./context/FanSessionContext";

// Entry
import RoleSelection from "./pages/RoleSelection";

// Fan Screens
import Onboarding from "./pages/Onboarding";
import VideoFeed from "./pages/VideoFeed";
import CreatorProfile from "./pages/CreatorProfile";
import Favorites from "./pages/Favorites";
import Search from "./pages/Search";

// Creator Screens
import CreatorHub from "./pages/CreatorHub";
import CreatorProfileSetup from "./pages/CreatorProfileSetup";
import AnalyticsView from "./pages/AnalyticsView";
import ScoringDashboard from "./pages/ScoringDashboard";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FanSessionProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Entry Point */}
            <Route path="/" element={<RoleSelection />} />

            {/* Fan Journey */}
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/feed" element={<VideoFeed />} />
            <Route path="/creator/:id" element={<CreatorProfile />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/search" element={<Search />} />

            {/* Creator Journey */}
            <Route path="/creator-hub" element={<CreatorHub />} />
            <Route path="/creator-setup" element={<CreatorProfileSetup />} />
            <Route path="/analytics" element={<AnalyticsView />} />
            <Route path="/scoring" element={<ScoringDashboard />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FanSessionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
