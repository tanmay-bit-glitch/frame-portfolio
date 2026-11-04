# FRAME Portfolio — Rebuild Changelog

All notable changes across each phase are documented here.

---

## [Phase 4 Update] — Full Archive Expansion to 61 Curated Frames & User Upload Ingestion
*Date: 2026-11-04*

### Added & Updated
1. **Full Archive Ingestion (All 40 Newly Uploaded Candidate Photos):**
   - Screened all 86 newly uploaded files in `raw_photos/` added by Tanmay at 22:28 IST.
   - Eliminated burst duplicates and non-image artifacts while preserving every distinct composition.
   - Identified 40 pristine, high-resolution original photos across automotive, street, night, architecture, and campus life.
   - Integrated all 40 new frames alongside the 21 existing approved frames, expanding the portfolio archive to **61 curated frames total**.
   - Sequentially copied and numbered all 61 full-resolution original files into [`curated_photos_review/`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/curated_photos_review/) (`01_` through `61_`).
   - Regenerated the interactive visual review catalog [`curated_photos_review/review_catalog.html`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/curated_photos_review/review_catalog.html) and `REVIEW_INDEX.json` showing all 61 items with real Samsung Galaxy S23 EXIF.

2. **WebP Generation & Gallery Markup Synchronization:**
   - Generated 120 responsive WebP variants across 640w, 1280w, and 1920w in `assets/photos/` with stripped GPS data and inline blur placeholders.
   - Updated [`data/photos.json`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/data/photos.json) with all 61 verified entries.
   - Updated [`index.html`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/index.html) gallery filter toolbar with exact counts:
     - `ALL [61]`
     - `MACHINES [20]`
     - `STREET [16]`
     - `NIGHT [10]`
     - `PEOPLE [06]`
     - `HERITAGE [04]`
     - `CULTURE [03]`
     - `WILDLIFE [02]`
   - Synchronized embedded `<script id="photosData">` in `index.html` with all 61 items so runtime filter transitions and minimal blur lightbox operate seamlessly.

3. **Multi-Viewport Visual Verification:**
   - Captured automated high-fidelity screenshots across viewports:
     - Gallery Grid (61 Frames): [`phase4-gallery-375.png`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/curation/screenshots/phase4-gallery-375.png), [`phase4-gallery-768.png`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/curation/screenshots/phase4-gallery-768.png), [`phase4-gallery-1440.png`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/curation/screenshots/phase4-gallery-1440.png)
     - Showreel Hero: [`phase4-showreel-375.png`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/curation/screenshots/phase4-showreel-375.png), [`phase4-showreel-768.png`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/curation/screenshots/phase4-showreel-768.png), [`phase4-showreel-1440.png`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/curation/screenshots/phase4-showreel-1440.png)
     - Reels Showcase: [`phase4-reels-375.png`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/curation/screenshots/phase4-reels-375.png), [`phase4-reels-768.png`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/curation/screenshots/phase4-reels-768.png), [`phase4-reels-1440.png`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/curation/screenshots/phase4-reels-1440.png)
     - Full Visual Catalog Overview: [`review-catalog-1440.png`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/curation/screenshots/review-catalog-1440.png)

---

## [Phase 4] — Hero Showreel Video Player, Embedded Reels Showcase, 21 Curated Frames & Minimal Lightbox
*Date: 2026-11-04*

### Added & Updated
1. **Curated Photo Selection & Titling Refinements (21 Approved Frames):**
   - Implemented Tanmay's specific curation removals (photos 2, 4, 5, 9, 10, 12, 23, 24, 25).
   - Re-numbered the top 21 pristine, visually verified frames sequentially from `01_...` to `21_...` in [`curated_photos_review/`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/curated_photos_review/).
   - Corrected Frame 11 subject and title to **Bajaj Pulsar NS400Z // Midnight Beam** (`pulsar-ns400z-midnight-beam`, Category: `Machines`).
   - Regenerated responsive WebP exports across 640w, 1280w, and 1920w (63 files) into `assets/photos/`.
   - Updated [`data/photos.json`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/data/photos.json) and gallery filter toolbar (`ALL [21]`, `MACHINES [06]`, `STREET [05]`, `HERITAGE [02]`, `CULTURE [01]`, `PEOPLE [02]`, `NIGHT [03]`, `WILDLIFE [02]`).

2. **Authentic Bio & Institutional Roles:**
   - Updated About section and role badges with Tanmay's real credentials:
     - **Volunteer at V-Click Production** (College Multimedia Club)
     - **Multimedia Head at SESA** (Software Engineering Student Association)
     - **Aftermovie Lead at Vishwaconclave**

3. **Minimalist Zoom Lightbox with Backdrop Blur:**
   - Overhauled lightbox modal per Tanmay's instruction: *"when i click on the photo dont show me the discription of the image just zoom the image and make the bg blur"*.
   - Removed technical metadata sidebar, camera EXIF, and palette color swatches.
   - Zoomed photo is centered with pure hardware-accelerated 28px backdrop blur (`backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px); background: rgba(3, 4, 7, 0.88)`).
   - Clicking either the zoomed photo or the blurred backdrop smoothly dismisses the modal.

4. **Hero Showreel In-Page Video Player (`#showreel`):**
   - Transferred Tanmay's Premiere Pro export `Sequence 04_2.mp4` to `assets/video/hero_showreel.mp4`.
   - Built custom HTML5 video player with poster frame, custom play/pause overlay, muted-by-default audio toggle, and fullscreen trigger.
   - Connected `IntersectionObserver` to automatically pause playback when scrolled out of view and resume when scrolled back into view.

5. **Motion Showcase & Embedded Reels Section (`#reels`):**
   - Created [`data/reels.json`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/data/reels.json) cataloging Tanmay's motion productions.
   - Added Featured 16:9 Production Card: **Vishwaconclave Official Podcast** (`https://youtu.be/kZRQnZmLlC4`) with responsive embedded iframe and fallback button.
   - Added Responsive 9:16 Vertical Reels Grid:
     - **SESA Department Aftermovie** (`https://www.instagram.com/p/DfBzMGPtoJJ/`)
     - **SWD Club Motion Reel** (`https://www.instagram.com/p/DeH4FCFsSzH/`)
     - **Vishwaconclave Official Aftermovie** (`https://www.instagram.com/p/Dbst6qIMOa_/`)
   - Removed old mock 01:45 reel placeholder.

6. **Multi-Viewport Evidence:**
   - Captured automated screenshots across 375px (Mobile), 768px (Tablet), and 1440px (Desktop):
     - Showreel: [`phase4-showreel-375.png`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/curation/screenshots/phase4-showreel-375.png), [`phase4-showreel-768.png`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/curation/screenshots/phase4-showreel-768.png), [`phase4-showreel-1440.png`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/curation/screenshots/phase4-showreel-1440.png)
     - Reels Showcase: [`phase4-reels-375.png`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/curation/screenshots/phase4-reels-375.png), [`phase4-reels-768.png`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/curation/screenshots/phase4-reels-768.png), [`phase4-reels-1440.png`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/curation/screenshots/phase4-reels-1440.png)
     - Gallery Grid: [`phase4-gallery-375.png`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/curation/screenshots/phase4-gallery-375.png), [`phase4-gallery-768.png`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/curation/screenshots/phase4-gallery-768.png), [`phase4-gallery-1440.png`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/curation/screenshots/phase4-gallery-1440.png)

---

## [Phase 2 Review & Correction] — Dedicated Photo Review Folder & Attractive Visual Titling
*Date: 2026-11-04*

### Critical Corrections & Visual Inspection
1. **Visual Grounding Audit:**
   - Performed complete visual inspection of all shortlisted frames directly in context.
   - Identified and eliminated previous hallucinated titles (e.g. photos of Ford Mustang Shelby GT500 and Audi Sport race cars previously mislabeled as fort valleys/mountain ridgelines; cats mislabeled as stunt bike swingarms; street intersections mislabeled as flower bazaars).
2. **Dedicated Review Folder (`curated_photos_review/`):**
   - Created standalone folder [`curated_photos_review/`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/curated_photos_review/) containing 30 full-resolution original frames (~120 MB total).
   - Renamed every photo with a clean, numbered, descriptive filename matching its actual subject (e.g., `01_mustang_shelby_gt500_cyberpunk.jpg`, `02_audi_sport_rally_spec.jpg`, `06_stunt_rider_rolling_endo.jpg`, etc.).
3. **Attractive Cinematic Titles:**
   - Formulated authentic, evocative display titles that accurately reflect Tanmay's real craft across automotive culture, street photography, candid portraiture, sacred heritage, and wildlife.
4. **Visual Review Catalog:**
   - Generated [`review_catalog.html`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/curated_photos_review/review_catalog.html) and `REVIEW_INDEX.json` in the review folder for seamless visual confirmation in any browser.

---

## [Phase 3] — Dynamic Masonry Scroll Gallery & Filtered Lightbox
*Date: 2026-11-04*

### Added & Updated
1. **Dynamic Gallery from `/data/photos.json`:**
   - Removed 500 lines of obsolete hardcoded project HTML from `index.html`.
   - Gallery cards are constructed dynamically from [`/data/photos.json`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/data/photos.json) (with inline fallback for offline/zero-latency contexts).
   - Rendered with true aspect ratios (`style="aspect-ratio: W / H"`), explicit `width` and `height` attributes, and zero Cumulative Layout Shift (CLS).

2. **Responsive Masonry Layout (Pure CSS, 0 Heavy Libraries):**
   - 3 columns on desktop (viewport $\ge$ 1024px).
   - 2 columns on tablet (viewport 640px – 1023px).
   - 1 column on mobile (viewport < 640px).

3. **Scroll Reveal with `IntersectionObserver`:**
   - Cards begin at `opacity: 0` and `transform: translateY(32px)`.
   - Triggered at 15% visibility threshold with ~80ms stagger between adjacent cards.
   - Smooth 700ms `cubic-bezier(0.16, 1, 0.3, 1)` easing, unobserved once revealed.
   - Animate strictly hardware-accelerated composite properties (`transform` and `opacity`).

4. **Progressive Blur-Up Image Loading:**
   - Inline blurred 20px WebP data URI rendered immediately behind image.
   - Cross-fades to high-resolution WebP upon `load` event.
   - First 3 frames marked `loading="eager"`, subsequent marked `loading="lazy"` with `decoding="async"` and responsive `srcset` (640w, 1280w, 1920w) and `sizes`.

5. **Desktop Hover Captions & Frame Indexing:**
   - Cinematic gradient overlay reveals on card hover / `:focus-visible`.
   - Displays frame number (`01 / 30`), category tag, image title, and authentic camera EXIF specs (`f/1.8 • 1/2100s • ISO 25`).
   - Adapted with elegant touch-friendly lower gradient on mobile devices (`@media (hover: none)`).

6. **Interactive Category Filtering:**
   - Filter toolbar with 7 authentic categories + All (`ALL [30]`, `MACHINES [04]`, `STREET [04]`, `PEOPLE [04]`, `NIGHT [04]`, `LANDSCAPES & TRAVEL [05]`, `WILDLIFE [04]`, `DETAILS [05]`).
   - Dynamic counter status updates in real-time (`SHOWING: 04 / 30 FRAMES (MACHINES)`).
   - Dynamic frame indices re-number to reflect active set (`01 / 04`).

7. **Lightbox Synchronized with Filtered Set:**
   - Lightbox modal tracks `activeFilteredPhotos`.
   - Left/Right keyboard arrows (`ArrowLeft`, `ArrowRight`) and navigation buttons cycle strictly within the active filtered subset.
   - Displays real S23 camera metadata, lens model, focal length, aperture, shutter speed, ISO, and curatorial reason.
   - Focus management: traps focus inside modal while open, restores focus to the invoking card upon close (`Escape` or close button).

8. **Accessibility & Reduced Motion:**
   - Fully accessible via keyboard (`Tab`, `Enter`, `Space`, `ArrowLeft`, `ArrowRight`, `Escape`).
   - `@media (prefers-reduced-motion: reduce)` disables all translates, delays, and opacity transitions, providing immediate rendering.

9. **Verification Evidence:**
   - Captured automated screenshots across 3 viewport widths:
     - 375px (Mobile): [`curation/screenshots/gallery-work-375.png`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/curation/screenshots/gallery-work-375.png)
     - 768px (Tablet): [`curation/screenshots/gallery-work-768.png`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/curation/screenshots/gallery-work-768.png)
     - 1440px (Desktop): [`curation/screenshots/gallery-work-1440.png`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/curation/screenshots/gallery-work-1440.png)
   - Executed automated browser assertion suite in Chrome headless verifying 30 initial cards, filter counts, and lightbox cycling.

---

## [Phase 2] — Photo Curation & WebP Optimization
*Date: 2026-11-04*

### Added & Processed
1. **Full 249-Photo Inventory & Inspection:**
   - Ingested 249 original photos from Tanmay's Google Drive folder into `raw_photos/`.
   - Extracted complete technical specifications, aspect ratios, color/luminance statistics, and authentic EXIF tags into `/curation/inventory.json` and `/curation/analysis.json`.
   - Generated visual contact catalog at `/curation/catalog.html` with preview thumbnails.

2. **Organized Rejection without File Deletion (Preserving All Originals):**
   - Corrupt files moved to `/rejects/corrupt/` (1 file: 0-byte `20260214_101223 (1).jpg`).
   - Screenshots moved to `/rejects/screenshots/` (1 file: `Screenshot_20260513_022247_Instagram.jpg`).
   - WhatsApp-compressed files moved to `/rejects/whatsapp/` (8 files: low-res `IMG-*-WA*` assets).
   - Duplicate/burst losers moved to `/rejects/duplicates/` (83 files: lower resolution crops, secondary burst frames).
   - Quality rejects moved to `/rejects/quality/` (6 files: blurry/motion-blurred frames, pitch-dark dusk test shots).
   - Total files moved to `/rejects/`: 99. Remaining unique quality originals in `raw_photos/`: 150.

3. **Curation Decisions Documentation:**
   - Authored [`/curation/decisions.md`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/curation/decisions.md) detailing all 62 evaluated duplicate/burst groups, the selected winner, and one-line reasons based on sharpness, native resolution, exposure, and composition.

4. **Curated Final Top 30 Selection:**
   - Categorized into the 7 official buckets:
     - `Machines`: 4 photos
     - `Street`: 4 photos
     - `People`: 4 photos
     - `Night`: 4 photos
     - `Landscapes and Travel`: 5 photos
     - `Wildlife`: 4 photos *(fixed existing site mismatch where the leopard was incorrectly placed under Forts & Landscapes)*
     - `Details`: 5 photos
   - Balanced orientation: 25 Portrait, 5 Landscape.
   - Identified 7 top featured hero frames (`featured: true`).

5. **Optimized WebP Export (90 Files + Placeholders):**
   - Exported each of the 30 curated photos in 3 responsive variants (640px, 1280px, 1920px longer edge) to `assets/photos/`.
   - Stripped all GPS / coordinate metadata for privacy.
   - Generated 20px blurred WebP placeholders (data URI base64) for instant progressive loading.

6. **Authentic Data Schema Generation:**
   - Generated [`/data/photos.json`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/data/photos.json) with strict authentic Samsung Galaxy S23 EXIF data (no fake specs or empty badges).

---

## [Phase 1] — Remove Fake and Unfinished Content
*Date: 2026-11-04*

### Removals & Replacements (Before / After)

1. **Film-Stock Badges:**
   - *Before:* Film-stock badges (`ILFORD HP5 PLUS 400`, `KODAK VISION3 500T`, `FUJI VELVIA 50`, `CINESTILL 800T`, `KODAK PORTRA 800`, `KODAK GOLD 200`, `ILFORD DELTA 3200`, `KODAK EKTAR 100`, etc.) and `35MM SMPTE // 5219` tags.
   - *After:* Authentically labeled as `SAMSUNG S23` across all 16 photo frame rebate edges and attributes.
2. **Technical & Sound Claims:**
   - *Before:* `"Original score by Frame Sound Labs"`, `"DCI 4K Master"`, `"ACES Color"`, `"48kHz 24-bit"`, `"Reel in progress"`.
   - *After:* All fake studio and audio mastering claims removed from showreel headers, modals, and metadata.
3. **API & Privacy Badges:**
   - *Before:* `"API: CONNECTED"` pulsing dot badge and `"OFFICIAL API PROXY // STRICT PRIVACY COMPLIANT"` disclaimer.
   - *After:* Completely removed.
4. **Mock Instagram Live Feed:**
   - *Before:* Hard-coded profile stats (`14 posts / 529 followers / 722 following`), mock `"Note..."` bubble, dynamic grid fetching mock API, and modal popup viewer (`#igPostModal`).
   - *After:* Clean, high-impact `instagram-follow-strip` (`FROM THE FEED. @IO.TANMAY`) with real direct external link to `@io.tanmay`.
5. **Placeholders:**
   - *Before:* `"Note..."` in avatar, `"Shot breakdown log..."` in lightbox description, `"Caption description..."` in IG viewer.
   - *After:* Empty/neutral initial states populated dynamically only when true data exists.
6. **Empty EXIF Fields:**
   - *Before:* `EMULSION / STOCK: -` in shot inspection sidebar.
   - *After:* Row removed. Only genuine camera information displayed.
7. **Personal Phone Number:**
   - *Before:* `+91 86686 40565` displayed in fullscreen navigation directory and contact panel.
   - *After:* Removed completely with user authorization. Direct email `tchavan265@gmail.com` preserved and highlighted.

---

## [Phase 0] — Audit & Repository Site Map
*Date: 2026-11-04*

### Added
- Created git branch `frame-rebuild`.
- Produced comprehensive repository architecture and code audit in [`/docs/SITE_MAP.md`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/docs/SITE_MAP.md).
- Initialized [`/docs/CHANGELOG.md`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/docs/CHANGELOG.md).
