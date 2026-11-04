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
| **Showreel (`#showreel`)** | In-page showreel player canvas placeholder (shot on S23) | Lines 247–275 | Lines 4805–4830 | Reel modal / play listener: 575–595 |
| **Disciplines (`#disciplines`)** | "What I Do" (Photography, Event Coverage, Reels, Video Editing) | Lines 278–322 | Lines 4832–4880 | Card fade-in observer: 660–670 |
| **Selected Work (`#work`)** | Category filter tabs, filmstrip carousel, inspect HUD, and embedded Aftermovie | Lines 325–855 | Lines 1250–1620 | Filtering: 345–380; Lightbox: 460–565 |
| **Aftermovie (`#aftermovie`)** | Vishwaconclave aftermovie embedded video with fallback link | Lines 830–854 | Lines 4885–4940 | Native iframe embedding |
| **Instagram (`#instagram`)** | Authentic profile card (@io.tanmay), feed filters, dynamic grid | Lines 857–926 | Lines 2740–3450 | Feed fetch & rendering: 670–880 |
| **Campus Experience (`#experience`)** | VIT Pune Multimedia roles (Vishwaconclave & SWD) | Lines 929–1059 | Lines 4070–4410 | Focus & hover styles |
| **About (`#about`)** | Personal story (2 short paragraphs), setup line, chapter laurels, portrait card | Lines 1062–1132 | Lines 1630–1770 | Scroll fade-in observer |
| **How I Create (`#skills`)** | Creative craft philosophy, quote, disciplines matrix | Lines 1135–1203 | Lines 1860–1985 | Card hover & focus |
| **Contact (`#contact`)** | Direct Email CTA button, 3-step project builder, coordinates, live IST clock | Lines 1205–1305 | Lines 1990–2180 | Concierge chip state & mailto generation: 590–640; Clock: 645–660 |
| **Footer** | Wordmark, minimal footer navigation, single mention of secondary accounts | Lines 1485–1515 | Lines 4015–4070 | Back to top anchor |
| **Lightbox (`#lightboxModal`)** | Shot inspection dialog, dynamic metadata, palette swatches, keyboard controls | Lines 1307–1375 | Lines 2185–2460 | Focus trap, Arrow/Esc keys: 460–565 |

---

## 4. Where Photos and Data Come From
1. **Portfolio Images:** Raw files stored in `assets/drive_photos/`. Responsive WebP exports generated into `assets/optimized/` via `scripts/optimize-images.js`. Referenced in `index.html` via `data-img`, `srcset`, and `sizes`.
2. **Instagram Feed:** Managed by `script.js` -> fetches from `/api/instagram/posts` (if live proxy configured in `.env`), otherwise gracefully falls back to `data/instagram-fallback.json` using local asset covers in `assets/ig_covers/`.
3. **Showreel:** Currently uses preview frame `assets/optimized/17812038516661_2-1280.webp`. Awaiting real video file from Tanmay.
4. **Vishwaconclave Aftermovie:** Directly embedded from Instagram URL `https://www.instagram.com/p/Dbst6qIMOa_/embed/`.

---

## 5. Assumptions & Clarifications

### Assumptions Being Made:
1. **Google Drive Access:** In a headless sandbox environment, Google Drive URLs cannot be downloaded directly without authenticated user OAuth tokens or exported files placed on disk. Therefore, local curation must occur on files downloaded into `/raw_photos` or existing files in `assets/drive_photos/`.
2. **Stack:** Vanilla HTML/CSS/JS without React or heavy dependencies will be maintained across all upcoming phases.
3. **Data-Driven Architecture:** In Phase 3, the hard-coded 16 photo articles will be replaced by dynamic JavaScript generation reading `/data/photos.json`.

### Questions & Items to Confirm with Tanmay:
1. **Photo Source for Phase 2:** For Phase 2 (about 250 files), since Google Drive links require browser authentication, should you download the Google Drive folder into a local directory named `raw_photos` in the project root, or is there an existing path where those 250 files currently live on your machine?
2. **Phase 1 Approval:** We are ready to proceed with Phase 1 removals according to the exact rules.
