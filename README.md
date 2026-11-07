# The Spot — Discover. Connect. Experience.
> **PARTIES · GAMING · COMMUNITIES · PEOPLE**  
> Initial Launch Market: **Pune, India**

A production-quality social entertainment platform built for Gen Z and young adults connecting people through three equal pillars:
1. **PARTIES & EXPERIENCES** — Discover rooftop sundowners, secret warehouse raves, craft beer mixers, and indie gigs across Pune (Koregaon Park, Baner, Kalyani Nagar, Viman Nagar, FC Road).
2. **GAMING & COMPETITIONS** — Form squads, book LAN setups at Respawn, play competitive Valorant & BGMI scrims, book floodlit box cricket turfs, and compete in tournaments with real prize pools.
3. **SOCIAL CONNECTIONS** — Discover compatible squads with match % algorithms, join niche communities, chat in real-time, and host your own experiences.

---

## 🎨 Visual Design Direction & Design System

- **Primary Theme:** Premium Dark Consumer Interface
- **Background:** `#090711`
- **Elevated Background:** `#171126`
- **Surface 2:** `#211836`
- **Primary Accent:** `#8B3DFF` (Electric Violet)
- **Secondary Accent:** `#D65BFF` (Neon Orchid)
- **Supporting Accent:** `#FF7A59` (Sunset Coral)
- **Gaming Accent:** `#00F0FF` (Cyan Neon)
- **Primary Text:** `#F5F1FF`
- **Secondary Text:** `#AAA4B8`

---

## 📱 Navigation Architecture

The app uses **5 primary bottom-navigation tabs**:

1. **HOME (Discover)** — Personalized Pune greeting, neighborhood selector, search, featured experience hero banner, happening tonight horizontal slider, quick action pills, QuickPlay™ matchmaker, gaming sessions, squad recommendations, and community cards.
2. **EXPLORE** — Multi-category browsing (All, Parties & Events, Gaming & LANs, Squads, Communities), quick date pills (Anytime, Tonight, Weekend), search query filter, and budget/distance controls.
3. **CREATE (+)** — High-energy creation flow bottom sheet:
   - *Host a Party or Event* (Guided 4-step wizard: Basics, Date & Pune Venue, Pricing & Guest Screening, Preview & Publish)
   - *Create a Gaming Session* (Game, format, platform, slots, venue/Discord, fee)
   - *Organize a Tournament*
   - *Launch a Pune Community*
4. **INBOX** — Segmented chat threads (All, Direct Messages, Squad Coordination, Event Announcements), unread indicators, and interactive live messaging with auto-replies.
5. **PROFILE** — User avatar, handle, Pune location badge, verified badges, rating & reviews, interactive tabs for **Tickets & RSVPs** (with `#SPT-` ticket verification codes), **My Squads**, **Hosted Experiences**, and **Badges**. Includes direct access to the **Host Operations Dashboard**.

---

## 🛠 Tech Stack

- **Framework:** React Native + Expo (TypeScript)
- **Design Tokens:** Centralized theme tokens (`src/theme/`)
- **State Management:** Reactive Store Context (`AppContext.tsx` & `AuthContext.tsx`)
- **Icons:** Zero-dependency cross-platform vector icon system (`src/components/common/Icon.tsx`)
- **Components:** Modular, accessible, and reusable (`Button`, `Badge`, `Avatar`, `AvatarGroup`, `SearchBar`, `CategoryChip`, `ModalSheet`, `EventCard`, `GamingCard`, `SquadCard`, `CommunityCard`)

---

## 🚀 Running the Project

To start the development server:

```bash
# Start Expo bundler
npm start

# Run on Android emulator / device
npm run android

# Run in Web preview
npm run web
```
