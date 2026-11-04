# FRAME Portfolio — Rebuild Changelog

All notable changes across each phase are documented here.

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
