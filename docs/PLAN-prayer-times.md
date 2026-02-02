# Plan: Ezan Vakitleri (Prayer Times) Feature

## 1. Context & Goal
Develop a premium, accurate, and user-friendly "Ezan Vakitleri" (Prayer Times) page. The feature must automatically detect the user's location and display accurate prayer times with a high-end visual aesthetic consistent with the "Asr Nesli" brand.

## 2. Requirements

### A. Functional Requirements
1.  **Location Detection:**
    *   Browser Geolocation API for automatic coordinates (Lat/Long).
    *   **Fallback:** Manual city/district selection (if permission denied).
2.  **Data Source:**
    *   Integrate with **Aladhan API** (or Diyanet compatible API) for accurate times.
3.  **Core Features:**
    *   **Daily View:** List of all 5 prayer times + Imsak & Sunrise.
    *   **Next Prayer Countdown:** Prominent timer showing time remaining to the next prayer.
    *   **Current Time Highlight:** Visually distinct indicator for the current time period.
    *   **Date Display:** Gregorian and Hijri dates.

### B. UI/UX & Design (Premium Aesthetic)
1.  **Dynamic Backgrounds:**
    *   Visual theme changes based on the time of day (Dawn, Noon, Sunset, Night).
    *   Subtle animations (e.g., moving clouds or sun/moon positions).
2.  **Cards & Layout:**
    *   Glassmorphism effects for time cards to blend with dynamic backgrounds.
    *   High-contrast typography for legibility.
    *   Mobile-first responsive design.

## 3. Implementation Steps

### Phase 1: Service & Logic
- [ ] create `src/services/prayerTimes.js` to handle API requests.
- [ ] Implement `useLocation` hook for managing Geolocation permissions and state.
- [ ] Implement `usePrayerTimes` hook to fetch data based on coordinates.

### Phase 2: User Interface
- [ ] Refactor `src/components/PrayerTimes.jsx`.
- [ ] Create `CountdownTimer` component.
- [ ] Build `TimeCard` component with "Active" state styles.
- [ ] Implement Dynamic Background wrapper.

### Phase 3: Polish & Testing
- [ ] Handle Loading skeletons and Error states (e.g., "Location denied").
- [ ] Verify time accuracy against Diyanet.
- [ ] ensure "Next Prayer" logic handles the day rollover (Isha to next day's Fajr).

## 4. Tech Stack
*   **API:** `http://api.aladhan.com/v1/timings` (Robust, widely used).
*   **State:** React `useState`, `useEffect`.
*   **Styling:** Tailwind CSS + Framer Motion.

## 5. Agent Assignment
*   **Primary:** `mobile-developer` (Logic & API).
*   **Review:** `frontend-specialist` (Visuals & Animation).

## 6. Socratic Questions (To Resolve during build)
*   **Manual Selection:** Do we need a full city/district selector now, or is "Auto + Simple Error Message" enough for MVP? -> *Plan assumes Auto first, simple searching later if needed.*
*   **Notifications:** Push notifications are out of scope for web for now, unless requested.

