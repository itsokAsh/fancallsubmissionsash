# Fancall - Personalized Creator Discovery Platform

A TikTok-style video feed platform connecting fans with creators through personalized recommendations, implicit behavior tracking, and availability-aware ranking.

---

## 🎯 Project Overview

Fancall enables fans to discover and book video/audio calls with creators. The platform uses a multi-phase recommendation system that combines explicit preferences with implicit behavioral signals to optimize the feed for engagement and conversion.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        App Entry (/)                            │
│                      RoleSelection.tsx                          │
└─────────────────┬───────────────────────────┬───────────────────┘
                  │                           │
                  ▼                           ▼
┌─────────────────────────────┐   ┌─────────────────────────────┐
│      FAN JOURNEY            │   │    CREATOR JOURNEY          │
│  ┌───────────────────────┐  │   │  ┌───────────────────────┐  │
│  │ /onboarding           │  │   │  │ /creator-hub          │  │
│  │ Category Selection    │  │   │  │ Dashboard & Analytics │  │
│  │ (Phase 1: Cold Start) │  │   │  └───────────────────────┘  │
│  └───────────┬───────────┘  │   │  ┌───────────────────────┐  │
│              ▼              │   │  │ /creator-profile      │  │
│  ┌───────────────────────┐  │   │  │ Profile Setup         │  │
│  │ /feed                 │  │   │  └───────────────────────┘  │
│  │ Video Feed            │  │   │  ┌───────────────────────┐  │
│  │ (Phase 2 & 3)         │  │   │  │ /analytics            │  │
│  └───────────┬───────────┘  │   │  │ Performance Metrics   │  │
│              ▼              │   │  └───────────────────────┘  │
│  ┌───────────────────────┐  │   │  ┌───────────────────────┐  │
│  │ /favorites            │  │   │  │ /scoring              │  │
│  │ Saved Creators        │  │   │  │ Ranking Dashboard     │  │
│  └───────────────────────┘  │   │  │ (Phase 4)             │  │
└─────────────────────────────┘   │  └───────────────────────┘  │
                                  └─────────────────────────────┘
```

---

## 📊 Phase Implementations

### Phase 1: Cold Start Candidate Generator

**Location:** `src/pages/Onboarding.tsx` → `src/pages/VideoFeed.tsx`

**Purpose:** Solve the cold-start problem by collecting explicit user preferences to seed initial recommendations.

#### How It Works:

1. **Category Selection** (Onboarding)
   - User selects 5+ categories from 20 available options
   - Categories stored in `FanSessionContext.userCategories`
   - Skip option sets empty categories (pure exploration mode)

2. **Feed Ordering Algorithm** (VideoFeed)
   ```typescript
   getOrderedCreators():
     1. Filter creators matching userCategories → matchingCreators
     2. Filter non-matching → nonMatchingCreators  
     3. Return: [...matchingCreators, ...nonMatchingCreators]
   ```

3. **Exploration Injection**
   - Every 3rd video is an exploration video (non-matching category)
   - Visual indicator: "🔍 Exploring new categories..."
   - Prevents filter bubble, enables preference discovery

#### UI Indicators:
- "Personalized for: [categories]" banner on feed
- "✨ Matched!" badge on category-matching creators
- Exploration mode label for discovery videos

---

### Phase 2: Frictionless UI Overlay

**Location:** `src/pages/VideoFeed.tsx`

**Purpose:** Capture implicit engagement signals without requiring explicit user actions.

#### Components:

1. **Dwell Timer System**
   ```typescript
   dwellTime: number (0-100%)
   dwellStartTime: timestamp
   
   // Timer ticks every 100ms
   // Full video = 10 seconds = 100%
   ```

2. **Visual Progress Indicator**
   - Circular progress ring around watch icon
   - Shows real-time watch percentage
   - Color changes: gray → primary as engagement increases

3. **Implicit Interest Logging**
   ```typescript
   // At 50% dwell threshold:
   updateInterest(category, +0.3)  // Positive signal
   logWatch(creatorId, dwellPercent)
   ```

4. **Video Attribution in Booking**
   - Booking modal captures: `videoId`, `dwellPercent`, `category`
   - Enables conversion attribution analysis
   - Shows "Conversion Source" in booking confirmation

#### Metrics Captured:
| Signal | Trigger | Weight |
|--------|---------|--------|
| Dwell > 50% | Auto | +0.3 |
| Booking initiated | User action | +0.5 |
| Favorite added | User action | +0.5 |

---

### Phase 3: Implicit Pivot Brain

**Location:** `src/pages/VideoFeed.tsx` + `src/context/FanSessionContext.tsx`

**Purpose:** Dynamically adjust recommendations based on accumulated behavioral signals.

#### Session Interest Vector

```typescript
sessionInterests: Record<string, number>
// Example: { "Comedy": 1.2, "Music": 0.8, "Gaming": -0.3 }
```

#### Signal Processing:

| Action | Category Weight | Description |
|--------|-----------------|-------------|
| Swipe Right (Like) | +0.5 | Strong positive signal |
| Swipe Left (Skip) | -0.2 | Negative signal |
| Dwell > 50% | +0.3 | Implicit interest |
| Booking | +0.5 | Strongest conversion signal |
| Favorite | +0.5 | Explicit preference |

#### Pivot Trigger Logic:

```typescript
// Every 5 swipes:
if (swipeCount > 0 && swipeCount % 5 === 0) {
  shouldPivot = true
  // Feed re-ranks based on sessionInterests
  // Visual: "[🔄 Feed re-ranking...]"
}

// After 2 seconds, reset pivot flag
setTimeout(() => shouldPivot = false, 2000)
```

#### Enhanced Ranking:

```typescript
getOrderedCreators():
  // Sort by: userCategories match + sessionInterest score
  creators.sort((a, b) => {
    aBoost = sessionInterests[a.category] || 0
    bBoost = sessionInterests[b.category] || 0
    return bBoost - aBoost
  })
```

#### Debug Panel:

Toggle visibility with "🔬 Debug" button to view:
- Real-time session interest scores
- Category rankings
- Swipe count and pivot status

---

### Phase 4: Availability Scoring & Ranking

**Location:** `src/pages/ScoringDashboard.tsx`

**Purpose:** Prioritize available creators to maximize booking conversion.

#### Scoring Formula:

```
FinalScore = BaseScore × AvailabilityMultiplier

Where:
- BaseScore = Creator's engagement/quality score (0-100)
- AvailabilityMultiplier = 1.5 (if available) | 0.8 (if unavailable)
```

#### Example Calculations:

| Creator | Base Score | Available | Multiplier | Final Score |
|---------|------------|-----------|------------|-------------|
| Priya | 92 | ✅ Yes | 1.5 | 138.0 |
| Raj | 88 | ❌ No | 0.8 | 70.4 |
| Ananya | 75 | ✅ Yes | 1.5 | 112.5 |

#### Substitute Recommendations:

When a creator is unavailable:
1. Find available creators in same category
2. Sort by FinalScore descending
3. Show top 2 as "Try instead:" suggestions

```typescript
getSubstitutes(category, excludeId):
  return creators
    .filter(c => c.category === category && c.isAvailableNow && c.id !== excludeId)
    .sort((a, b) => calculateFinalScore(b) - calculateFinalScore(a))
    .slice(0, 2)
```

#### Dashboard Features:
- Category filter chips
- Score breakdown per creator
- Availability status badges
- Substitute recommendations for unavailable creators

---

## 🔄 Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                    FanSessionContext                             │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ State:                                                      │ │
│  │  • userCategories: string[]     ← From Onboarding          │ │
│  │  • sessionInterests: Record     ← Updated by signals       │ │
│  │  • swipeCount: number           ← Tracks pivots            │ │
│  │  • watchHistory: WatchEntry[]   ← Dwell logging            │ │
│  │  • shouldPivot: boolean         ← Triggers re-rank         │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Actions:                                                    │ │
│  │  • setUserCategories(cats)      → Phase 1                  │ │
│  │  • updateInterest(cat, delta)   → Phase 3                  │ │
│  │  • incrementSwipe()             → Phase 3 pivot            │ │
│  │  • logWatch(creatorId, %)       → Phase 2                  │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/context/FanSessionContext.tsx` | Global state for fan session, interests, and behavior tracking |
| `src/pages/Onboarding.tsx` | Category selection (Phase 1) |
| `src/pages/VideoFeed.tsx` | Main feed with Phases 2 & 3 implementation |
| `src/pages/ScoringDashboard.tsx` | Availability scoring (Phase 4) |
| `src/pages/RoleSelection.tsx` | Entry point - Fan/Creator selection |
| `src/pages/CreatorHub.tsx` | Creator dashboard and navigation |
| `src/pages/Favorites.tsx` | Saved creators list |

---

## 🛠️ Tech Stack

- **Framework:** React 18 + TypeScript
- **Routing:** React Router v6
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** React Context (FanSessionContext)
- **Backend:** Lovable Cloud (Supabase)
- **Build:** Vite

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Navigate to `http://localhost:5173`

### Testing the Full Flow:

1. **Start:** Go to `/` → Select "I'm a Fan"
2. **Phase 1:** Select 5+ categories → Continue
3. **Phase 2:** Watch videos, observe dwell timer
4. **Phase 3:** Toggle debug panel, swipe to see interest updates
5. **Phase 4:** Go to Creator Hub → Scoring Dashboard

---

## 📈 Future Enhancements

- [ ] Persist session interests to database
- [ ] A/B testing framework for algorithms
- [ ] Machine learning model integration
- [ ] Real-time availability updates
- [ ] Creator-side analytics dashboard
