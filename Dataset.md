# Dataset Overview – Fancall Recommendation Hackathon

**Data Set Link →** [Data Set](https://docs.google.com/spreadsheets/d/1qsJK_42Kx2FWXXOpyZ1yUr9e5enPN_7tDfQgkyZugpk/edit?gid=1307753421#gid=1307753421)

To help participants build a realistic recommendation system, Fancall will provide structured datasets representing real user, creator, and interaction data from the platform. These datasets are designed to simulate actual product signals used in discovery and personalisation.

---

## User Data

### Table: `user_data`

This table contains core profile information for both fans and creators.

**Key Columns:**
- `id` – Unique user identifier
- `name` – User name
- `dob` – Date of birth (can be used to derive age)
- `video_call_price_inr_per_min` – Video call price (for creators)
- `audio_call_price_inr_per_min` – Audio call price (for creators)
- `role_id` – Identifies fan or creator
- `state` – User's state
- `city` – User's city
- `wallet_balance_inr` – Current wallet balance (optional signal for affordability)

**Usage in Recommendations:**
- Age-based personalisation
- Location-aware discovery
- Price sensitivity matching
- Fan vs creator identification

---

## Category Data

### Table: `category_data`

Represents all available content categories on Fancall.

**Key Columns:**
- `id` – Category ID
- `category_name` – Category/niche name (e.g., Fitness, Music, Finance)

**Usage in Recommendations:**
- Interest-based matching
- Category filtering
- Cold-start recommendations

---

## Creator Category Mapping

### Table: `creator_category`

Maps creators to their primary or multiple categories.

**Key Columns:**
- `id` – Record ID
- `member_id` – Creator ID (Linked to `id` column of `user_data` table, `role_id` 3 for creator)
- `channel_category_id` – Category ID (linked to `id` column of `category_data` table)

**Usage in Recommendations:**
- Matching fans with relevant creators
- Multi-category creator discovery
- Niche-based ranking

---

## User Category Preferences

### Table: `user_category`

Captures categories selected by fans during onboarding or later.

**Key Columns:**
- `id` – Record ID
- `user_id` – Fan ID (Linked to `id` column of `user_data` table, `role_id=2` for fan in `user_data` table)
- `category_id` – Category ID (Linked to `id` column of `category_data` table)

**Usage in Recommendations:**
- Initial preference signal
- Cold-start logic
- Interest-weighted scoring

---

## Creator Call Activity

### Table: `creator_call_data`

Logs historical call interactions between fans and creators.

**Key Columns:**
- `id` – Call record ID
- `user_id` – Fan ID (Linked to `id` column of `user_data` table)
- `celebrity_id` – Creator ID (Linked to `id` column of `user_data` table)
- `call_type` – Audio or Video
- `call_datetime` – Date & time of call
- `duration_seconds` – Length of call

**Usage in Recommendations:**
- Engagement strength
- Repeat interaction signals
- Recency and frequency scoring
- Preference for call type

---

## Fan Favourites

### Table: `fan_favourites`

Tracks creators that fans have explicitly favourited.

**Key Columns:**
- `id` – Record ID
- `user_id` – Fan ID (Linked to `id` column of `user_data` table)
- `creator_id` – Creator ID (Linked to `id` column of `user_data` table)

**Usage in Recommendations:**
- Strong preference signal
- Boosting similar creators
- Repeat engagement logic

---

## Fan Search & Profile Interaction

### Table: `fan_recent_search`

Represents fan intent and exploration behaviour.

**Key Columns:**
- `id` – Record ID
- `user_id` – Fan ID (Linked to `id` column of `user_data` table)
- `celebrity_id` – Creator searched/viewed (Linked to `id` column of `user_data` table)
- `search_count` – Number of searches
- `profile_visits_count` – Profile views
- `last_profile_visit_date` – Most recent visit

**Usage in Recommendations:**
- Intent-based ranking
- Recency-based boosts
- Search-to-conversion patterns

---

## How Participants Are Expected to Use This Data

Participants are encouraged to:

- ✅ Combine multiple signals (categories, calls, favourites, searches)
- ✅ Apply weights, scoring, or ranking logic
- ✅ Handle edge cases (new users, inactive users, new creators)
- ✅ Clearly explain why a creator is recommended

> **There is no single "correct" approach.**  
> We care more about how you think and justify decisions than the exact algorithm.

---

## Final Note on Data Usage

This dataset reflects real-world product constraints:

- Imperfect signals
- Sparse interactions
- Behaviour that changes over time

**Your goal is not perfection —**  
**your goal is to design a system that feels intentional, scalable, and user-first.**
