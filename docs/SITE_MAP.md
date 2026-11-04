# FRAME Portfolio — Site Map & Architecture Audit

## 1. Project Technology Stack
- **Frontend Core:** Vanilla Semantic HTML5, CSS3 (Modern Custom Properties, Flexbox, Grid), Vanilla JavaScript (ES6+ modular structure).
- **Tooling & Build:** Node.js (v24), `sharp` image optimization script (`scripts/optimize-images.js`). Zero heavy frontend runtime frameworks (no React, Vue, Angular).
- **Backend / Deployment:**
  - Local static development server with proxy: `local-server.js` (Node HTTP module).
  - Vercel serverless integration: `vercel.json` routing with `/api/instagram/*` endpoints.

---

## 2. File Tree Structure

```text
frame-portfolio/
├── .env.example                     # Environment variable template for Instagram Graph API
├── .gitignore                       # Git ignore rules
├── favicon.ico                      # Standard ICO favicon
├── index.html                       # Primary single-page portfolio layout & markup
├── local-server.js                  # Node development server and API proxy
├── package.json                     # NPM configuration & build scripts
├── package-lock.json                # NPM dependency lockfile
├── README-INSTAGRAM.md              # Documentation for Instagram Graph API integration
├── script.js                        # Client-side UI logic, filters, modal, and animations
├── styles.css                       # Global design system, typography, cinema styling, responsive rules
├── vercel.json                      # Vercel deployment routes and serverless configuration
├── api/
│   ├── _helpers.js                  # Shared serverless helper functions
│   └── instagram/
│       ├── all.js                   # Unified batch data endpoint
│       ├── posts.js                 # Recent posts endpoint
│       ├── profile.js               # Profile bio and stats endpoint
│       └── stories.js               # Active story items endpoint
├── assets/
│   ├── apple-touch-icon.png         # iOS home screen icon
│   ├── icon.svg                     # Vector brand icon
│   ├── icon-192.png                 # PWA web app icon
│   ├── hero_headphone_bg.png        # Ambient background visual layer
│   ├── hero_tanmay_headphone.jpg    # Raw hero alternative
│   ├── profile_tanmay_headphone_portrait.jpg # About section portrait
│   ├── profile_tanmay_bw.jpg        # B&W portrait alternate
│   ├── profile_tanmay_intern.jpg    # Intern portrait alternate
│   ├── drive_photos/                # Original source photographs from Tanmay's Galaxy S23 (24 photos)
│   ├── ig_covers/                   # Local fallback Instagram media covers (8 files)
│   └── optimized/                   # WebP optimized variants (640w, 1280w, 1920w) + manifest.json
├── content/                         # (Prepared for Phase 5 Learning Loop markdown entries)
├── curation/                        # (Prepared for Phase 2 Photo Curation decision logs)
├── data/
│   ├── instagram-fallback.json      # Structured fallback feed data for Instagram
│   └── photos.json                  # (Prepared for Phase 2/3 dynamic photo data)
├── docs/
│   ├── CHANGELOG.md                 # Running phase-by-phase change record
│   ├── SITE_MAP.md                  # This architecture and codebase audit document
│   └── TODO.md                      # Outstanding user-provided assets and questions
└── scripts/
    └── optimize-images.js           # Automated WebP export and metadata generation utility
```

---

## 3. Sections & Code Locations

| Section ID | Heading / Purpose | Markup Location (`index.html`) | Styles (`styles.css`) | Script Logic (`script.js`) |
|---|---|---|---|---|
| **Header** | Sticky navigation bar, wordmark, 24 FPS REC timecode pill, theme switcher, index trigger | Lines 56–99 | Lines 330–480 | Theme switcher: 110–140; Sound FX: 150–190; Timecode: 600–640 |
| **Menu Overlay** | Fullscreen primary navigation overlay (`#site-menu`) | Lines 102–160 | Lines 500–750 | Menu toggle: 270–320 |
| **Hero (`#top`)** | 35mm Academy countdown leader, main headline, call-to-actions, location tags | Lines 164–244 | Lines 780–1180 | Leader countdown: 200–260 |
| **Showreel (`#showreel`)** | In-page showreel player with Premiere Pro MP4 export, audio toggle, fullscreen | Lines 247–297 | Lines 5015–5095 | In-page video controls, autoplay pause-on-scroll: 1680–1755 |
| **Disciplines (`#disciplines`)** | "What I Do" (Photography, Event Coverage, Reels, Video Editing) | Lines 299–337 | Lines 4832–4880 | Card fade-in observer |
| **Selected Work (`#work`)** | Category filter tabs, responsive masonry gallery from `photos.json` | Lines 339–390 | Lines 1250–1620 | Dynamic render & filtering: 380–510 |
| **Instagram Strip (`#instagram`)** | Clean follow strip linking to official account @io.tanmay | Lines 990–1016 | Lines 2740–2800 | Direct link CTA |
| **Reels Showcase (`#reels`)** | Motion archive: 16:9 podcast embed + 9:16 Instagram reels grid | Lines 1018–1120 | Lines 5100–5220 | Responsive aspect ratios & iframe loading |
| **Campus Experience (`#experience`)** | College multimedia roles (V-Click, SESA, Vishwaconclave, SWD) | Lines 1122–1215 | Lines 4070–4410 | Focus & hover styles |
| **About (`#about`)** | Personal story, V-Click & SESA credentials, setup line, portrait card | Lines 1218–1295 | Lines 1630–1770 | Scroll fade-in observer |
| **How I Create (`#skills`)** | Creative craft philosophy, quote, disciplines matrix | Lines 1298–1365 | Lines 1860–1985 | Card hover & focus |
| **Contact (`#contact`)** | Direct Email CTA button, 3-step project builder, coordinates, live IST clock | Lines 1368–1470 | Lines 1990–2180 | Concierge chip state & mailto generation |
| **Footer** | Wordmark, minimal footer navigation, secondary handles | Lines 1475–1505 | Lines 4015–4070 | Back to top anchor |
| **Lightbox (`#lightboxModal`)** | Minimalist zoom-only view with centered photo & 28px backdrop blur | Lines 1510–1545 | Lines 5340–5400 | Click-to-close backdrop & photo, Esc/Arrow keys |

---

## 4. Where Photos and Data Come From
1. **Portfolio Images:** Raw files stored in `curated_photos_review/` (21 approved full-res frames) and `raw_photos/`. Responsive WebP exports generated into `assets/photos/` (640w, 1280w, 1920w) with clean slugs and base64 blur placeholders. Dynamic catalog configured in [`data/photos.json`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/data/photos.json).
2. **Showreel Video:** `assets/video/hero_showreel.mp4` (Premiere Pro export `Sequence 04_2.mp4` by Tanmay).
3. **Reels & Motion Archive:** Configured in [`data/reels.json`](file:///c:/Users/tchav/Documents/Workspace/protfolio/frame/frame-portfolio/data/reels.json):
   - Vishwaconclave Official Podcast (`https://youtu.be/kZRQnZmLlC4`)
   - SESA Department Aftermovie (`https://www.instagram.com/p/DfBzMGPtoJJ/`)
   - SWD Club Motion Reel (`https://www.instagram.com/p/DeH4FCFsSzH/`)
   - Vishwaconclave Official Aftermovie (`https://www.instagram.com/p/Dbst6qIMOa_/`)
4. **Instagram Feed:** Clean external follow strip linking directly to @io.tanmay.

---

## 5. Assumptions & Clarifications

### Assumptions Being Made:
1. **Google Drive Access:** In a headless sandbox environment, Google Drive URLs cannot be downloaded directly without authenticated user OAuth tokens or exported files placed on disk. Therefore, local curation must occur on files downloaded into `/raw_photos` or existing files in `assets/drive_photos/`.
2. **Stack:** Vanilla HTML/CSS/JS without React or heavy dependencies will be maintained across all upcoming phases.
3. **Data-Driven Architecture:** In Phase 3, the hard-coded 16 photo articles will be replaced by dynamic JavaScript generation reading `/data/photos.json`.

### Questions & Items to Confirm with Tanmay:
1. **Photo Source for Phase 2:** For Phase 2 (about 250 files), since Google Drive links require browser authentication, should you download the Google Drive folder into a local directory named `raw_photos` in the project root, or is there an existing path where those 250 files currently live on your machine?
2. **Phase 1 Approval:** We are ready to proceed with Phase 1 removals according to the exact rules.
