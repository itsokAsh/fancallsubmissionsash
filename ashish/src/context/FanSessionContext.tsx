import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface SessionInterests {
  [category: string]: number;
}

interface WatchEvent {
  videoId: string | number;
  creatorId: string | number;
  category: string;
  dwellPercent: number;
  timestamp: number;
}

interface FanSessionContextType {
  // Phase 1: Onboarding categories
  userCategories: string[];
  setUserCategories: (categories: string[]) => void;
  
  // Phase 3: Session interest vector
  sessionInterests: SessionInterests;
  updateInterest: (category: string, weight: number) => void;
  
  // Phase 2-3: Swipe & watch tracking
  swipeCount: number;
  incrementSwipe: () => void;
  resetSwipeCount: () => void;
  
  // Phase 2: Watch history for attribution
  watchHistory: WatchEvent[];
  logWatch: (event: Omit<WatchEvent, "timestamp">) => void;
  
  // Phase 3: Pivot indicator
  shouldPivot: boolean;
  resetPivot: () => void;
  
  // Debug panel visibility
  showDebugPanel: boolean;
  toggleDebugPanel: () => void;
}

const FanSessionContext = createContext<FanSessionContextType | undefined>(undefined);

export const FanSessionProvider = ({ children }: { children: ReactNode }) => {
  // Phase 1: User's onboarding categories
  const [userCategories, setUserCategories] = useState<string[]>([]);
  
  // Phase 3: Real-time interest vector
  const [sessionInterests, setSessionInterests] = useState<SessionInterests>({});
  
  // Phase 2-3: Swipe tracking
  const [swipeCount, setSwipeCount] = useState(0);
  const [shouldPivot, setShouldPivot] = useState(false);
  
  // Phase 2: Watch history
  const [watchHistory, setWatchHistory] = useState<WatchEvent[]>([]);
  
  // Debug panel
  const [showDebugPanel, setShowDebugPanel] = useState(true);

  const updateInterest = useCallback((category: string, weight: number) => {
    setSessionInterests(prev => ({
      ...prev,
      [category]: (prev[category] || 0) + weight
    }));
  }, []);

  const incrementSwipe = useCallback(() => {
    setSwipeCount(prev => {
      const newCount = prev + 1;
      // Trigger pivot every 5 swipes
      if (newCount % 5 === 0) {
        setShouldPivot(true);
      }
      return newCount;
    });
  }, []);

  const resetSwipeCount = useCallback(() => {
    setSwipeCount(0);
  }, []);

  const resetPivot = useCallback(() => {
    setShouldPivot(false);
  }, []);

  const logWatch = useCallback((event: Omit<WatchEvent, "timestamp">) => {
    setWatchHistory(prev => [...prev, { ...event, timestamp: Date.now() }]);
  }, []);

  const toggleDebugPanel = useCallback(() => {
    setShowDebugPanel(prev => !prev);
  }, []);

  return (
    <FanSessionContext.Provider
      value={{
        userCategories,
        setUserCategories,
        sessionInterests,
        updateInterest,
        swipeCount,
        incrementSwipe,
        resetSwipeCount,
        watchHistory,
        logWatch,
        shouldPivot,
        resetPivot,
        showDebugPanel,
        toggleDebugPanel,
      }}
    >
      {children}
    </FanSessionContext.Provider>
  );
};

export const useFanSession = () => {
  const context = useContext(FanSessionContext);
  if (context === undefined) {
    throw new Error("useFanSession must be used within a FanSessionProvider");
  }
  return context;
};
