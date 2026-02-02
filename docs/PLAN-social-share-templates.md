# Plan: Social Media Share Templates for Share Studio

## 1. Context & Goal
The user wants to enhance the "Sharing Studio" (Paylaşım Stüdyosu) to support diverse card designs suitable for social media platforms like Instagram (Story/Post). The current implementation is limited to color changes on a fixed aspect ratio. The goal is to provide professional, varied layouts and proper size formats.

## 2. Requirements

### A. Functional Requirements
1.  **Aspect Ratio Switcher:**
    *   **9:16 (Story):** Full-screen mobile view.
    *   **4:5 (Portrait):** Standard Instagram post size.
    *   **1:1 (Square):** Compatible with all feeds.
2.  **Design Templates:**
    *   Create distinct layouts, not just color swaps.
    *   **Visual Nature:** Full background image support with overlay text.
    *   **Minimal Typography:** Clean solid/gradient background, large focus text.
    *   **Classic Islamic:** Borders, frame ornaments, paper textures.
    *   **Modern Gradient:** Bold, trendy gradients with sleek typography.
3.  **Content Editing:**
    *   Allow users to edit the text (Verse/Hadith) directly in the studio if it's not passed dynamically.

### B. Technical Implementation
*   **Component:** `src/components/ShareStudio.jsx`
*   **State Management:**
    *   `aspectRatio` state ('story', 'portrait', 'square').
    *   `template` state (instead of just `style`).
    *   `content` state for editable text.
*   **Libraries:** `framer-motion` for smooth layout transitions, `html2canvas` for export.

## 3. Phase 1: Structure & Controls
- [ ] Refactor `ShareStudio.jsx` to separate Layout Controls (Size) from Style Controls (Visuals).
- [ ] Implement `AspectRatioSelector` component.
- [ ] Convert the hardcoded text into an editable `textarea` or state-driven content.

## 4. Phase 2: Design Implementation (The "Templates")
- [ ] **Template 1: "Nur" (Light/Minimal):** Centered text, plenty of whitespace, subtle gold border.
- [ ] **Template 2: "Doğa" (Nature/Visual):** Unsplash/Local image background, glassmorphism card for text.
- [ ] **Template 3: "Hat" (Classic):** Traditional Islamic frame graphics, serif/calligraphy fonts.
- [ ] **Template 4: "Gece" (Night/Modern):** Dark mode default, neon/glow lowlight accents.

## 5. Phase 3: Export & Sharing
- [ ] Ensure `html2canvas` correctly captures the chosen aspect ratio without distortion.
- [ ] Verify "Share" vs "Download" functionality on mobile devices.

## 6. Socratic Questions (To Resolve)
1.  **Dynamic Content:** Should this page automatically load "Today's Verse" when opened? (Currently hardcoded).
2.  **Custom Backgrounds:** Should we allow users to upload their own photo?
3.  **Branding:** Should the "Asr Nesli" logo be togglable?

## 7. Agent Assignment
*   **Primary:** `frontend-specialist` (UI/UX implementation).
*   **Review:** `mobile-design` (Ensure touch targets are 44px+).

