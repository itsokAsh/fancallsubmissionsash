import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ChevronUp, ChevronDown, User, X, Check, Eye, EyeOff, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import { useFanSession } from "@/context/FanSessionContext";

// Expanded mock data for all phases
const MOCK_CREATORS = [
  { id: 1, videoId: 101, name: "John Fitness", category: "Fitness", status: "Live", videoPrice: 5, audioPrice: 3, availableSlots: 5, isTrending: false },
  { id: 2, videoId: 102, name: "Sarah Tech", category: "Tech", status: "Online", videoPrice: 8, audioPrice: 5, availableSlots: 3, isTrending: false },
  { id: 3, videoId: 103, name: "Mike Gaming", category: "Gaming", status: "Busy", videoPrice: 4, audioPrice: 2, availableSlots: 0, isTrending: false },
  { id: 4, videoId: 104, name: "Lisa Music", category: "Music", status: "Live", videoPrice: 6, audioPrice: 4, availableSlots: 2, isTrending: true },
  { id: 5, videoId: 105, name: "Tom Finance", category: "Finance", status: "Online", videoPrice: 10, audioPrice: 7, availableSlots: 4, isTrending: false },
  { id: 6, videoId: 106, name: "Emma Comedy", category: "Comedy", status: "Online", videoPrice: 5, audioPrice: 3, availableSlots: 6, isTrending: false },
  { id: 7, videoId: 107, name: "Alex Cooking", category: "Cooking", status: "Live", videoPrice: 7, audioPrice: 4, availableSlots: 1, isTrending: true },
  { id: 8, videoId: 108, name: "Maya Fashion", category: "Fashion", status: "Busy", videoPrice: 9, audioPrice: 6, availableSlots: 0, isTrending: false },
];

type BookingStep = "closed" | "select" | "confirm" | "success";

const VideoFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [bookingStep, setBookingStep] = useState<BookingStep>("closed");
  const [selectedCallType, setSelectedCallType] = useState<"video" | "audio">("video");
  const navigate = useNavigate();
  
  // Phase 2: Dwell timer state
  const [watchStartTime, setWatchStartTime] = useState<number>(Date.now());
  const [currentDwellPercent, setCurrentDwellPercent] = useState(0);
  const [interestLogged, setInterestLogged] = useState(false);
  const dwellTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Phase 3: Swipe timing
  const [lastSwipeAnnotation, setLastSwipeAnnotation] = useState<string | null>(null);
  
  // Context for all phases
  const { 
    userCategories, 
    sessionInterests, 
    updateInterest, 
    swipeCount, 
    incrementSwipe, 
    shouldPivot, 
    resetPivot,
    logWatch,
    showDebugPanel,
    toggleDebugPanel
  } = useFanSession();

  // Determine which creators to show based on categories
  const getOrderedCreators = () => {
    let creators = [...MOCK_CREATORS];
    
    // Phase 1: Sort by category match
    if (userCategories.length > 0) {
      creators.sort((a, b) => {
        const aMatch = userCategories.includes(a.category) ? 1 : 0;
        const bMatch = userCategories.includes(b.category) ? 1 : 0;
        return bMatch - aMatch;
      });
    }
    
    // Phase 3: If we should pivot, re-sort by session interests
    if (Object.keys(sessionInterests).length > 0) {
      creators.sort((a, b) => {
        const aInterest = sessionInterests[a.category] || 0;
        const bInterest = sessionInterests[b.category] || 0;
        return bInterest - aInterest;
      });
    }
    
    return creators;
  };

  const orderedCreators = getOrderedCreators();
  const creator = orderedCreators[currentIndex];
  
  // Check if current video is outside user's categories (exploration)
  const isExplorationVideo = userCategories.length > 0 && !userCategories.includes(creator.category);
  const isFullyBooked = creator.availableSlots === 0;

  // Phase 2: Dwell timer effect
  useEffect(() => {
    setWatchStartTime(Date.now());
    setCurrentDwellPercent(0);
    setInterestLogged(false);
    
    // Simulate video duration of 15 seconds
    const videoDuration = 15000;
    
    dwellTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - watchStartTime;
      const percent = Math.min((elapsed / videoDuration) * 100, 100);
      setCurrentDwellPercent(percent);
      
      // Phase 2: Log implicit interest at 50%
      if (percent >= 50 && !interestLogged) {
        setInterestLogged(true);
        updateInterest(creator.category, 1);
        logWatch({
          videoId: creator.videoId,
          creatorId: creator.id,
          category: creator.category,
          dwellPercent: percent
        });
      }
    }, 100);

    return () => {
      if (dwellTimerRef.current) {
        clearInterval(dwellTimerRef.current);
      }
    };
  }, [currentIndex]);

  const handleSwipe = (direction: "up" | "down") => {
    const swipeTime = Date.now() - watchStartTime;
    
    // Phase 3: Negative signal for quick swipes (<3 seconds)
    if (swipeTime < 3000) {
      updateInterest(creator.category, -1);
      setLastSwipeAnnotation(`[-1 to ${creator.category}] Quick skip`);
    } else if (currentDwellPercent >= 50) {
      setLastSwipeAnnotation(`[+1 to ${creator.category}] Engaged view`);
    } else {
      setLastSwipeAnnotation(null);
    }
    
    incrementSwipe();
    
    // Clear annotation after 2 seconds
    setTimeout(() => setLastSwipeAnnotation(null), 2000);
    
    if (direction === "up") {
      setCurrentIndex(prev => (prev + 1) % orderedCreators.length);
    } else {
      setCurrentIndex(prev => (prev - 1 + orderedCreators.length) % orderedCreators.length);
    }
  };

  const toggleFavorite = () => {
    setFavorites(prev => 
      prev.includes(creator.id) 
        ? prev.filter(id => id !== creator.id)
        : [...prev, creator.id]
    );
  };

  const handleBookNow = () => {
    setBookingStep("select");
  };

  const handleConfirmBooking = () => {
    setBookingStep("success");
  };

  const closeModal = () => {
    setBookingStep("closed");
    setSelectedCallType("video");
  };

  // Phase 3: Handle pivot reset
  useEffect(() => {
    if (shouldPivot) {
      // Auto-reset after showing message
      const timer = setTimeout(() => resetPivot(), 3000);
      return () => clearTimeout(timer);
    }
  }, [shouldPivot, resetPivot]);

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* Phase 1: Personalization Banner */}
      <div className="bg-card border-b border-border p-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">[Personalized for:</span>
          {userCategories.length > 0 ? (
            <span className="text-primary font-medium">
              {userCategories.slice(0, 3).join(", ")}
              {userCategories.length > 3 && ` +${userCategories.length - 3}`}
            </span>
          ) : (
            <span className="text-muted-foreground italic">All categories</span>
          )}
          <span className="text-muted-foreground">]</span>
        </div>
        <div className="text-xs text-muted-foreground">
          [Swipe {swipeCount % 5}/5 until pivot]
        </div>
      </div>

      {/* Phase 3: Pivot Indicator */}
      {shouldPivot && (
        <div className="bg-primary/10 border-b border-primary p-2 text-center">
          <span className="text-xs text-primary font-medium">
            [🔄 Feed re-ranking based on session interests...]
          </span>
        </div>
      )}

      {/* Main Video Area */}
      <div className="flex-1 relative">
        {/* Video Placeholder */}
        <div className="absolute inset-0 border-2 border-dashed border-border bg-card m-4 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="text-4xl mb-2">[VIDEO]</div>
            <div className="text-sm">Creator content plays here</div>
            <div className="text-xs mt-1">Video {currentIndex + 1} of {orderedCreators.length}</div>
            
            {/* Phase 2: Dwell percentage */}
            <div className="mt-3 flex items-center justify-center gap-2">
              <Clock className="h-3 w-3" />
              <span className="text-xs">[Watched: {Math.round(currentDwellPercent)}%]</span>
            </div>
            
            {/* Phase 2: Interest logged indicator */}
            {interestLogged && (
              <div className="mt-2 text-xs text-primary border border-primary/30 bg-primary/10 px-2 py-1 inline-block">
                [+1 interest logged for {creator.category}]
              </div>
            )}
          </div>
        </div>

        {/* Phase 2: Dwell Timer Progress Circle */}
        <div className="absolute top-6 left-6">
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-border"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={`${currentDwellPercent * 1.26} 126`}
                className={currentDwellPercent >= 50 ? "text-primary" : "text-muted-foreground"}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
              {Math.round(currentDwellPercent)}%
            </div>
          </div>
        </div>

        {/* Exploration / Trending / Availability Badges */}
        <div className="absolute top-6 right-6 flex flex-col gap-2">
          {creator.isTrending && (
            <div className="flex items-center gap-1 text-xs border border-dashed border-orange-500 bg-orange-500/10 text-orange-600 px-2 py-1">
              <TrendingUp className="h-3 w-3" />
              [🔥 TRENDING]
            </div>
          )}
          {isExplorationVideo && (
            <div className="text-xs border border-dashed border-blue-500 bg-blue-500/10 text-blue-600 px-2 py-1">
              [Outside your categories]
            </div>
          )}
          {isFullyBooked && (
            <div className="text-xs border border-dashed border-destructive bg-destructive/10 text-destructive px-2 py-1">
              [Fully Booked]
            </div>
          )}
        </div>

        {/* Phase 3: Swipe Annotation */}
        {lastSwipeAnnotation && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10">
            <div className={`text-xs px-3 py-1 border border-dashed ${
              lastSwipeAnnotation.includes("-1") 
                ? "border-destructive bg-destructive/10 text-destructive" 
                : "border-primary bg-primary/10 text-primary"
            }`}>
              {lastSwipeAnnotation}
            </div>
          </div>
        )}

        {/* Creator Info Overlay */}
        <div className="absolute bottom-24 left-4 right-20">
          <div className="border border-border bg-card/90 p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-10 h-10 border-2 border-dashed border-border flex items-center justify-center text-xs">
                [AVT]
              </div>
              <div>
                <div className="font-semibold text-foreground">{creator.name}</div>
                <div className="flex gap-2 text-xs">
                  <span className="border border-border px-2 py-0.5">[{creator.category}]</span>
                  <span className={`px-2 py-0.5 ${
                    creator.status === 'Live' ? 'bg-destructive/20 text-destructive' :
                    creator.status === 'Online' ? 'bg-primary/20 text-primary' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {creator.status}
                  </span>
                  <span className="text-muted-foreground">
                    [{creator.availableSlots} slots]
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Actions */}
        <div className="absolute bottom-24 right-4 flex flex-col gap-3">
          <button
            onClick={toggleFavorite}
            className={`w-12 h-12 border-2 border-dashed flex items-center justify-center ${
              favorites.includes(creator.id) 
                ? 'border-destructive bg-destructive/10' 
                : 'border-border bg-card'
            }`}
          >
            <Heart className={`h-5 w-5 ${favorites.includes(creator.id) ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
          </button>
          <button
            onClick={() => navigate(`/creator/${creator.id}`)}
            className="w-12 h-12 border-2 border-dashed border-border bg-card flex items-center justify-center"
          >
            <User className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Swipe Indicators */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          <button 
            onClick={() => handleSwipe("down")}
            className="w-8 h-8 border border-border bg-card flex items-center justify-center"
          >
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          </button>
          <button 
            onClick={() => handleSwipe("up")}
            className="w-8 h-8 border border-border bg-card flex items-center justify-center"
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Book Now FAB */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
          <Button 
            onClick={handleBookNow}
            className="px-8 py-6 text-lg shadow-lg"
            disabled={isFullyBooked}
          >
            {isFullyBooked ? "[FULLY BOOKED]" : "[BOOK NOW]"}
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 pb-2">
        <div className="h-1 bg-border">
          <div 
            className="h-1 bg-primary transition-all"
            style={{ width: `${((currentIndex + 1) / orderedCreators.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Phase 3: Debug Panel Toggle */}
      <button
        onClick={toggleDebugPanel}
        className="fixed bottom-20 right-4 z-40 w-10 h-10 border-2 border-dashed border-border bg-card flex items-center justify-center"
      >
        {showDebugPanel ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>

      {/* Phase 3: Session Interest Debug Panel */}
      {showDebugPanel && (
        <div className="fixed bottom-32 right-4 z-40 w-48 border-2 border-dashed border-primary bg-card p-3">
          <p className="text-xs font-medium text-primary mb-2">[SESSION INTERESTS]</p>
          <div className="space-y-1">
            {Object.entries(sessionInterests).length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No data yet...</p>
            ) : (
              Object.entries(sessionInterests)
                .sort(([, a], [, b]) => b - a)
                .map(([category, weight]) => (
                  <div key={category} className="flex items-center gap-2 text-xs">
                    <span className="w-16 truncate">{category}:</span>
                    <span className={weight >= 0 ? "text-primary" : "text-destructive"}>
                      {weight >= 0 ? "+" : ""}{weight}
                    </span>
                    <div className="flex-1 h-1 bg-muted">
                      <div 
                        className={`h-1 ${weight >= 0 ? "bg-primary" : "bg-destructive"}`}
                        style={{ width: `${Math.min(Math.abs(weight) * 20, 100)}%` }}
                      />
                    </div>
                  </div>
                ))
            )}
          </div>
          <div className="mt-2 pt-2 border-t border-dashed border-border text-xs text-muted-foreground">
            Swipes: {swipeCount}
          </div>
        </div>
      )}

      <BottomNav active="feed" />

      {/* Booking Modal Overlay */}
      {bookingStep !== "closed" && (
        <div className="fixed inset-0 bg-background/80 z-50 flex items-end justify-center">
          <div className="w-full max-w-md border-2 border-dashed border-border bg-background p-4 m-4 mb-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">
                {bookingStep === "select" && "[Select Call Type]"}
                {bookingStep === "confirm" && "[Confirm Booking]"}
                {bookingStep === "success" && "[Booking Confirmed!]"}
              </span>
              <button 
                onClick={closeModal}
                className="w-8 h-8 border border-dashed border-border flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Step 1: Select Call Type */}
            {bookingStep === "select" && (
              <div className="space-y-4">
                {/* Creator Info */}
                <div className="flex items-center gap-3 border border-dashed border-border p-3">
                  <div className="w-12 h-12 border-2 border-dashed border-border flex items-center justify-center text-xs">
                    [AVT]
                  </div>
                  <div>
                    <p className="font-medium">[{creator.name}]</p>
                    <p className="text-xs text-muted-foreground">[{creator.category}]</p>
                  </div>
                  <span className={`ml-auto text-xs px-2 py-1 ${
                    creator.status === 'Live' ? 'bg-destructive/20 text-destructive' :
                    creator.status === 'Online' ? 'bg-primary/20 text-primary' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    [{creator.status}]
                  </span>
                </div>

                {/* Phase 2: Conversion Source Attribution */}
                <div className="border border-dashed border-primary/50 bg-primary/5 p-2">
                  <p className="text-xs text-primary font-medium">[CONVERSION SOURCE]</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Video #{creator.videoId} • Dwell: {Math.round(currentDwellPercent)}%
                  </p>
                </div>

                {/* Call Type Options */}
                <div className="space-y-2">
                  <div
                    onClick={() => setSelectedCallType("video")}
                    className={`border-2 border-dashed p-4 cursor-pointer flex items-center justify-between ${
                      selectedCallType === "video" ? "border-primary bg-primary/10" : "border-border"
                    }`}
                  >
                    <div>
                      <p className="font-medium">[Video Call]</p>
                      <p className="text-xs text-muted-foreground">Face-to-face conversation</p>
                    </div>
                    <p className="font-bold">${creator.videoPrice}/min</p>
                  </div>
                  <div
                    onClick={() => setSelectedCallType("audio")}
                    className={`border-2 border-dashed p-4 cursor-pointer flex items-center justify-between ${
                      selectedCallType === "audio" ? "border-primary bg-primary/10" : "border-border"
                    }`}
                  >
                    <div>
                      <p className="font-medium">[Audio Call]</p>
                      <p className="text-xs text-muted-foreground">Voice-only conversation</p>
                    </div>
                    <p className="font-bold">${creator.audioPrice}/min</p>
                  </div>
                </div>

                {/* Continue Button */}
                <button
                  onClick={() => setBookingStep("confirm")}
                  className="w-full border-2 border-dashed border-primary bg-primary/10 p-4 font-medium"
                >
                  [Continue →]
                </button>
              </div>
            )}

            {/* Step 2: Confirm Booking */}
            {bookingStep === "confirm" && (
              <div className="space-y-4">
                {/* Booking Summary */}
                <div className="border border-dashed border-border p-4 space-y-3">
                  <p className="text-sm text-muted-foreground">[Booking Summary]</p>
                  
                  <div className="flex justify-between">
                    <span>Creator</span>
                    <span className="font-medium">[{creator.name}]</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Call Type</span>
                    <span className="font-medium">[{selectedCallType === "video" ? "Video Call" : "Audio Call"}]</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate</span>
                    <span className="font-medium">
                      ${selectedCallType === "video" ? creator.videoPrice : creator.audioPrice}/min
                    </span>
                  </div>
                  
                  <div className="border-t border-dashed border-border pt-3">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Minimum charge (1 min)</span>
                      <span>${selectedCallType === "video" ? creator.videoPrice : creator.audioPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Phase 2: Attribution in confirm */}
                <div className="border border-dashed border-muted-foreground/30 p-2 text-xs text-muted-foreground">
                  [Attribution: Video #{creator.videoId} → Booking]
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setBookingStep("select")}
                    className="flex-1 border-2 border-dashed border-border bg-background p-4 font-medium"
                  >
                    [← Back]
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    className="flex-1 border-2 border-dashed border-primary bg-primary/10 p-4 font-medium"
                  >
                    [Confirm Booking]
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {bookingStep === "success" && (
              <div className="space-y-4 text-center">
                {/* Success Icon */}
                <div className="w-16 h-16 border-2 border-dashed border-primary bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Check className="h-8 w-8 text-primary" />
                </div>

                <div>
                  <p className="font-medium text-lg">[Booking Confirmed!]</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your {selectedCallType} call with {creator.name} is being connected...
                  </p>
                </div>

                {/* Booking Details */}
                <div className="border border-dashed border-border p-3 text-left">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Creator</span>
                    <span>[{creator.name}]</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Type</span>
                    <span>[{selectedCallType === "video" ? "Video" : "Audio"} Call]</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Rate</span>
                    <span>${selectedCallType === "video" ? creator.videoPrice : creator.audioPrice}/min</span>
                  </div>
                </div>

                {/* Phase 2: Full Attribution Data */}
                <div className="border border-dashed border-primary/50 bg-primary/5 p-3 text-left">
                  <p className="text-xs text-primary font-medium mb-2">[CONVERSION ATTRIBUTION]</p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Video ID: #{creator.videoId}</p>
                    <p>Dwell Time: {Math.round(currentDwellPercent)}%</p>
                    <p>Category: {creator.category}</p>
                    <p>Session Swipes: {swipeCount}</p>
                  </div>
                </div>

                {/* Done Button */}
                <button
                  onClick={closeModal}
                  className="w-full border-2 border-dashed border-primary bg-primary/10 p-4 font-medium"
                >
                  [Done]
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoFeed;
