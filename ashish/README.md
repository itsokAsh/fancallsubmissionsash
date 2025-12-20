# Creator-Fan Platform

A mobile-first video call platform connecting fans with creators for personalized audio/video calls. Built with React, TypeScript, and Supabase.

## 🎯 Project Overview

This platform enables fans to discover creators across various categories (Astrology, Acting, Comedy, etc.), view their video content in a TikTok-style feed, book audio/video calls, and save favorites. The system includes engagement scoring to understand user preferences.

## 🏗️ Architecture & Approach

### Frontend Architecture
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── BottomNav.tsx   # Mobile navigation
│   └── NavLink.tsx     # Navigation link component
├── context/
│   └── FanSessionContext.tsx  # User session & watch analytics
├── hooks/
│   ├── useCreators.ts  # Creator data fetching
│   ├── useFavorites.ts # Favorites management
│   └── useBookings.ts  # Booking operations
├── pages/
│   ├── Index.tsx       # Home/landing page
│   ├── VideoFeed.tsx   # TikTok-style video feed
│   ├── CreatorProfile.tsx    # Individual creator page
│   ├── Favorites.tsx   # User's saved creators
│   ├── Search.tsx      # Creator discovery
│   ├── ScoringDashboard.tsx  # Engagement analytics
│   └── ...
└── integrations/
    └── supabase/       # Auto-generated Supabase client & types
```

### Design Decisions

1. **Mobile-First Approach**: All UI is designed for mobile viewports with a sticky bottom navigation, optimized for touch interactions.

2. **TikTok-Style Video Feed**: Vertical swipeable video cards with creator info overlay, engagement tracking via dwell time.

3. **Real-time Data**: Uses React Query for efficient data fetching, caching, and automatic refetching.

4. **Session-based Analytics**: Tracks user watch behavior (dwell percentage, category preferences) without requiring authentication for the prototype.

5. **Edge Functions for Data Seeding**: Server-side function to parse CSV data and populate the database with creators and fans.

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────┐       ┌──────────────────┐       ┌─────────────┐
│  profiles   │       │     creators     │       │  categories │
├─────────────┤       ├──────────────────┤       ├─────────────┤
│ id (PK)     │◄──────│ profile_id (FK)  │       │ id (PK)     │
│ name        │       │ id (PK)          │       │ name        │
│ role        │       │ bio              │       │ icon        │
│ dob         │       │ avatar_url       │       └──────┬──────┘
│ city        │       │ status           │              │
│ state       │       │ video_call_price │              │
│ wallet_bal  │       │ audio_call_price │              │
│ original_id │       │ available_slots  │              │
└──────┬──────┘       │ is_trending      │              │
       │              └────────┬─────────┘              │
       │                       │                        │
       │              ┌────────┴─────────┐              │
       │              │                  │              │
       ▼              ▼                  ▼              ▼
┌─────────────┐  ┌──────────┐  ┌──────────────────┐  ┌─────────────────┐
│  favorites  │  │ bookings │  │ creator_categories│  │ user_categories │
├─────────────┤  ├──────────┤  ├──────────────────┤  ├─────────────────┤
│ id (PK)     │  │ id (PK)  │  │ creator_id (FK)  │  │ profile_id (FK) │
│ fan_id (FK) │  │ fan_id   │  │ category_id (FK) │  │ category_id (FK)│
│ creator_id  │  │creator_id│  └──────────────────┘  └─────────────────┘
└─────────────┘  │ call_type│
                 │ status   │        ┌─────────────┐
                 │ dwell_%  │        │   videos    │
                 │scheduled │        ├─────────────┤
                 └──────────┘        │ id (PK)     │
                                     │ creator_id  │
                                     │ video_url   │
                                     │ thumbnail   │
                                     └─────────────┘
```

### Tables Overview

| Table | Purpose |
|-------|---------|
| `profiles` | All users (fans & creators) with basic info |
| `creators` | Creator-specific data (pricing, status, bio) |
| `categories` | Content categories (Astrology, Comedy, etc.) |
| `creator_categories` | Many-to-many: creators ↔ categories |
| `user_categories` | Fan's preferred categories |
| `favorites` | Fan's saved/bookmarked creators |
| `bookings` | Call bookings with status tracking |
| `videos` | Creator video content |

### Enums

- `user_role`: `fan` | `creator`
- `creator_status`: `Live` | `Online` | `Busy` | `Offline`
- `call_type`: `video` | `audio`
- `booking_status`: `pending` | `confirmed` | `completed` | `cancelled`

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui |
| State Management | React Query (TanStack Query) |
| Routing | React Router v6 |
| Backend | Supabase (Postgres, Auth, Edge Functions) |
| Animations | Framer Motion (via shadcn) |

## ✨ Features

### For Fans
- **Video Feed**: Swipeable TikTok-style creator videos
- **Creator Discovery**: Search and filter by category
- **Creator Profiles**: View bio, pricing, availability
- **Favorites**: Save creators for quick access
- **Booking**: Schedule audio/video calls
- **Wallet**: Track balance for bookings

### For Creators
- **Profile Setup**: Configure bio, pricing, availability
- **Status Management**: Set Live/Online/Busy/Offline
- **Analytics Hub**: View engagement metrics

### Analytics
- **Dwell Time Tracking**: Measures engagement per video
- **Category Affinity**: Tracks preferred content types
- **Scoring Dashboard**: Visualizes user engagement patterns

## 🧠 Recommendation Algorithm (4 Phases)

### Phase 1: SQL Candidate Generator (Data Mapping)

To decide which video plays first, we join `user_categories` (the fan's intent) with `creator_categories` (the creator's niche).

**The Query:** Select creators where `creator_categories.category_id` matches `user_categories.category_id`.

**Availability Layer:** We check `creators` table status and recent booking activity. If a creator hasn't had a call in 7 days, they are de-prioritized in the initial "Cold Start" feed.

```sql
SELECT c.* FROM creators c
JOIN creator_categories cc ON c.id = cc.creator_id
JOIN user_categories uc ON cc.category_id = uc.category_id
WHERE uc.profile_id = :fan_profile_id
  AND c.available_slots > 0
ORDER BY c.created_at DESC;
```

---

### Phase 2 & 3: Implicit Feedback Loop

We use **dwell time tracking** as a proxy to build the Interest Vector.

**The Signal:** Every time a user watches a video, we track `dwellPercent` in the session context:
```typescript
{"category_id": +1, "dwellPercent": 85}
```

**The Pivot:** If a user watches creators in a specific category multiple times but hasn't booked, we identify that category and override the initial onboarding preferences.

**Session Data Structure:**
```typescript
interface WatchEvent {
  videoId: string | number;
  creatorId: string | number;
  category: string;
  dwellPercent: number;  // 0-100
  timestamp: number;
}
```

---

### Phase 3: "Instant Conversion" & Ranking Formula

**Goal:** Maximize liquidity by showing creators who are physically present to take calls right now.

#### The "Live Now" Multiplier (The New Engine)

Instead of checking a wallet, we check the creator's `status`.

**The Logic:** Query the live session or online status.

**The Formula:**

```
FinalScore = BaseScore × (2.0 if Status = "Live/Online" else 1.0)
```

**Why this wins:** A user seeing a "Live" badge feels urgency. A 2.0x boost pushes these creators to the top of the feed.

#### Loyalty Boost

**The Logic:** If `creator_id` exists in the `favorites` table for this user.

**The Multiplier:** 3.0x Boost

**Result:** Even if a favorite creator isn't live, they stay near the top. If they ARE live:
```
2.0 × 3.0 = 6.0x boost → Mathematically guaranteed first result
```

---

### Phase 4: The Substitute Logic (Fail-Safe)

**Trigger:** User lands on a profile where `status = "Busy"` or `"Offline"`.

**The Query:**
1. Find creators in the same `category_id`
2. Filter: Must have `status = "Live"` or `"Online"` AND `available_slots > 0`
3. Sort: By `video_call_price_inr` (closest match to original creator)

**The Output:** A "Similar & Available" tray showing 3 specific substitutes.

```typescript
// useSimilarCreators hook implementation
const { data: similarCreators } = useSimilarCreators(
  creator.category,     // Same category
  creator.id            // Exclude current creator
);
```

### Scoring Summary Table

| Factor | Multiplier | Condition |
|--------|------------|-----------|
| Base Score | 1.0x | All creators |
| Live/Online Status | 2.0x | `status = "Live" OR "Online"` |
| Favorite Creator | 3.0x | Exists in `favorites` table |
| Category Match | Priority | Matches user's preferred categories |
| Available Slots | Filter | `available_slots > 0` |

**Maximum Combined Boost:** 6.0x (Live + Favorite)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or bun

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd <project-name>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

The project uses Lovable Cloud (Supabase) with auto-configured environment variables:

```env
VITE_SUPABASE_URL=<auto-configured>
VITE_SUPABASE_PUBLISHABLE_KEY=<auto-configured>
```

## 📊 Data Seeding

### Using the Edge Function

The `seed-data` edge function imports CSV data into the database:

```bash
# CSV format expected:
# id,Name,Date of Birth,City,State,role_id
# 1,John Doe,1990-01-15,Mumbai,Maharashtra,1

# Call the edge function with CSV data
curl -X POST \
  'https://<project-id>.supabase.co/functions/v1/seed-data' \
  -H 'Content-Type: application/json' \
  -d '{"csvData": "<csv-content>"}'
```

The function:
1. Parses CSV rows
2. Separates fans (role_id=1) and creators (role_id=2)
3. Inserts profiles with proper UUID generation
4. Creates creator records with mock data (status, pricing, bio)
5. Assigns random categories to creators

## 🔒 Security

### Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

| Table | Policy |
|-------|--------|
| `profiles` | Publicly readable |
| `creators` | Publicly readable |
| `categories` | Publicly readable |
| `favorites` | Users can manage their own |
| `bookings` | Users can manage their own |
| `user_categories` | Users can manage their own |

## 📱 Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Index | Landing page |
| `/onboarding` | Onboarding | New user flow |
| `/role-selection` | RoleSelection | Fan/Creator choice |
| `/video-feed` | VideoFeed | Main video feed |
| `/search` | Search | Creator discovery |
| `/favorites` | Favorites | Saved creators |
| `/creator/:id` | CreatorProfile | Creator detail page |
| `/creator-hub` | CreatorHub | Creator dashboard |
| `/scoring` | ScoringDashboard | Analytics view |

## 🎨 Design System

Built with shadcn/ui components and Tailwind CSS with custom theming:

- **Primary**: Brand accent color
- **Secondary**: Supporting UI elements
- **Muted**: Subtle backgrounds
- **Semantic tokens**: All colors use HSL via CSS variables

## 📈 Future Enhancements

- [ ] Real-time video/audio calls (WebRTC)
- [ ] Payment integration for bookings
- [ ] Push notifications
- [ ] Creator content upload
- [ ] Advanced recommendation engine
- [ ] User authentication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using [Lovable](https://lovable.dev)
