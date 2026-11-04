# FRAME Portfolio — Rebuild Changelog

All notable changes across each phase are documented here.

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
