const fs = require('fs');
const path = require('path');

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

const reelsData = [
  {
    id: "reel-sai-abhyankkar",
    shortcode: "DYCdoAwtKY7",
    tag: "REEL // EDIT",
    date: "AUG 26, 2026",
    caption: "🥰.....#saiabhyankkar❣️ #edit #viralreels #postviral",
    cover: "assets/ig_covers/DYCdoAwtKY7.jpg",
    url: "https://www.instagram.com/reel/DYCdoAwtKY7/"
  },
  {
    id: "reel-bombay-dreams",
    shortcode: "DYZ1gZKIZWy",
    tag: "REEL // MUMBAI",
    date: "AUG 15, 2026",
    caption: "Bombay-The City of Dreams........@vineet_04t @io.tanmay @atharv__.24 @san.ika_16 @its_saloni_core ....#fyp #viralreels #mumbaikar #edit #mumbai",
    cover: "assets/ig_covers/DYZ1gZKIZWy.jpg",
    url: "https://www.instagram.com/reel/DYZ1gZKIZWy/"
  },
  {
    id: "reel-korigad-trek",
    shortcode: "DcMQt-6MD_U",
    tag: "REEL // TREK",
    date: "AUG 10, 2026",
    caption: "“Views were good, company was better 🫶”.....Korigad Fort 🏔️ | Trekking, cousins, crazy laughs & unforgettable memories ❤️‍🔥From the climb to the views, every step was worth it! 🌿✨#Korigad #KorigadFort #Trekking #cousintrip #maharashtra",
    cover: "assets/ig_covers/DcMQt-6MD_U.jpg",
    url: "https://www.instagram.com/reel/DcMQt-6MD_U/"
  },
  {
    id: "reel-ganpati-arrival",
    shortcode: "DaTQf3tTpDx",
    tag: "REEL // GANPATI",
    date: "AUG 4, 2026",
    caption: "Can't wait for him to arrive 🥹.... ...@haram_khor_ video credits.....#ganpatibappamorya #ganpati #viralreels #edit",
    cover: "assets/ig_covers/DaTQf3tTpDx.jpg",
    url: "https://www.instagram.com/reel/DaTQf3tTpDx/"
  },
  {
    id: "reel-aagman-2026",
    shortcode: "DavkCQ0gsPQ",
    tag: "REEL // AAGMAN 2026",
    date: "JUL 28, 2026",
    caption: "POV:it's the first aagman of 2026..........#ganpatibappamorya #viralreels #edit #aagman",
    cover: "assets/ig_covers/DavkCQ0gsPQ.jpg",
    url: "https://www.instagram.com/reel/DavkCQ0gsPQ/"
  },
  {
    id: "reel-college-memories",
    shortcode: "DZpBLeFMxH3",
    tag: "REEL // FRIENDS",
    date: "JUL 20, 2026",
    caption: "its first year already this is to all my friends ✌️.......@chopadepayal_27 @sanchita19__ @flash.y07 @rucha_d09 @bhakti_ugale27 @asmita.1728 @shreyaa__d @prajwal_dhage_17 @dhanashreekirpal7 w love 🫶✨️✨️....#college #viralreels #ppl",
    cover: "assets/ig_covers/DZpBLeFMxH3.jpg",
    url: "https://www.instagram.com/reel/DZpBLeFMxH3/"
  },
  {
    id: "reel-vishwaconclave-aftermovie",
    shortcode: "Dbst6qIMOa_",
    tag: "REEL // AFTERMOVIE",
    date: "FEB 2026",
    caption: "Vishwaconclave Official Aftermovie edited by Tanmay Chavan. Live concert energy, crowd interactions, and campus narrative arc.",
    cover: "assets/ig_covers/Dbst6qIMOa_.jpg",
    url: "https://www.instagram.com/p/Dbst6qIMOa_/"
  },
  {
    id: "reel-sesa-aftermovie",
    shortcode: "DfBzMGPtoJJ",
    tag: "REEL // SESA",
    date: "JAN 2026",
    caption: "SESA Department Official Aftermovie edited by Tanmay Chavan & Multimedia Head. Dynamic beat-matched cuts & festival atmosphere.",
    cover: "assets/ig_covers/DfBzMGPtoJJ.jpg",
    url: "https://www.instagram.com/p/DfBzMGPtoJJ/"
  }
];

function generateReelCardsHtml() {
  return reelsData.map(reel => `
          <a href="${reel.url}" target="_blank" rel="noopener noreferrer" class="reel-card" data-shortcode="${reel.shortcode}" aria-label="Watch ${reel.tag} on Instagram">
            <div class="reel-card-media">
              <img src="${reel.cover}" alt="${escapeHTML(reel.caption.slice(0, 60))}" loading="lazy" class="reel-card-thumb">
              <div class="reel-type-badge">
                <span class="badge-icon">▶</span>
                <span>REEL</span>
              </div>
              <div class="reel-play-btn" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <polygon points="6,3 20,12 6,21"></polygon>
                </svg>
              </div>
            </div>
            <div class="reel-card-info">
              <div class="reel-card-meta">
                <span class="reel-card-tag">${reel.tag}</span>
                <span class="reel-card-date">${reel.date}</span>
              </div>
              <p class="reel-card-caption">${escapeHTML(reel.caption)}</p>
            </div>
          </a>`).join('\n');
}

const reelsSectionHtml = `    <!-- REELS & MOTION ARCHIVE -->
    <section class="reels-section section-pad" id="reels" aria-labelledby="reels-heading">
      <div class="reels-section-container">
        <div class="section-header-split">
          <div>
            <p class="eyebrow">MOTION ARCHIVE // 02</p>
            <h2 id="reels-heading">REELS &amp;<br><span class="text-stroke">AFTERMOVIES.</span></h2>
          </div>
          <p class="section-intro-text">
            Short-form visual pacing, dynamic camera movement, event narratives, and multi-cam podcast editing. Featuring edits and stories from @io.tanmay.
          </p>
        </div>

        <!-- 4-Column Reels Grid Matching User Screenshot -->
        <div class="reels-grid-custom" id="reelsGrid">
${generateReelCardsHtml()}
        </div>

        <!-- Direct CTA Bar -->
        <div class="reels-cta-bar">
          <a href="https://instagram.com/io.tanmay" target="_blank" rel="noopener noreferrer" class="btn-primary follow-strip-btn">
            <span>SEE ALL WORK ON INSTAGRAM (@IO.TANMAY)</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
        </div>

        <!-- Featured Multi-Cam Podcast Highlight -->
        <div class="podcast-highlight-block">
          <div class="podcast-block-header">
            <span class="mono eyebrow">LONG-FORM // MULTI-CAM</span>
            <h3 class="podcast-block-title">Vishwaconclave Official Podcast</h3>
            <p class="podcast-block-desc">Pacing multi-camera dialogues, dynamic cuts, and balancing speech clarity with ambient audio in Premiere Pro.</p>
          </div>
          <div class="podcast-player-wrapper">
            <iframe
              src="https://www.youtube-nocookie.com/embed/kZRQnZmLlC4"
              title="Vishwaconclave Official Podcast edited by Tanmay Chavan"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              loading="lazy">
            </iframe>
          </div>
        </div>

      </div>
    </section>`;

// 1. UPDATE index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');
const reelsStart = indexHtml.indexOf('<section class="reels-section');
const reelsEnd = indexHtml.indexOf('</section>', reelsStart) + 10;

if (reelsStart !== -1 && reelsEnd !== -1) {
  indexHtml = indexHtml.slice(0, reelsStart) + reelsSectionHtml + indexHtml.slice(reelsEnd);
  fs.writeFileSync('index.html', indexHtml, 'utf8');
  console.log('Successfully updated index.html with new Reels section!');
} else {
  console.error('Could not find reels section in index.html');
}

// 2. UPDATE preview-reels.html
const previewHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>FRAME — Reels &amp; Motion Archive Preview</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=Archivo+Black&family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Syne:wght@700;800&display=swap"
    rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
  <style>
    body { background: #030407 !important; color: #f4f4f7 !important; padding: 32px 24px; min-height: 100vh; }
    .reels-section { padding: 0 !important; }
  </style>
</head>
<body>
${reelsSectionHtml}
<script src="script.js"></script>
</body>
</html>
`;
fs.writeFileSync('preview-reels.html', previewHtml, 'utf8');
console.log('Successfully updated preview-reels.html!');

// 3. ADD CSS IN styles.css
let styles = fs.readFileSync('styles.css', 'utf8');

const newReelCSS = `
/* ==========================================================================
   PIXEL-PERFECT REEL CARDS (MATCHING USER INSTAGRAM SCREENSHOT)
   ========================================================================== */
.reels-section-container {
  max-width: 1400px;
  margin: 0 auto;
}

.reels-grid-custom {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 36px;
}

.reel-card {
  background: #0e1015;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  position: relative;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.25s ease,
              box-shadow 0.25s ease;
}

.reel-card:hover,
.reel-card:focus-visible {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.22);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.7);
  outline: none;
}

.reel-card-media {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: #000;
}

.reel-card-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.reel-card:hover .reel-card-thumb {
  transform: scale(1.04);
}

.reel-type-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  color: #ffffff;
  font-family: var(--font-mono, monospace);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 4px 9px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  pointer-events: none;
}

.reel-type-badge .badge-icon {
  font-size: 9px;
  display: inline-block;
}

.reel-play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.52);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.55);
  pointer-events: none;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              background 0.25s ease,
              border-color 0.25s ease;
}

.reel-play-btn svg {
  width: 18px;
  height: 18px;
  fill: #ffffff;
  margin-left: 2px;
}

.reel-card:hover .reel-play-btn {
  transform: translate(-50%, -50%) scale(1.12);
  background: rgba(0, 0, 0, 0.75);
  border-color: rgba(255, 255, 255, 0.4);
}

.reel-card-info {
  padding: 14px 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #0e1015;
  flex-grow: 1;
}

.reel-card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.reel-card-tag {
  color: var(--amber, #f59e0b);
  font-weight: 700;
}

.reel-card-date {
  color: #8b8f9e;
  font-weight: 500;
}

.reel-card-caption {
  font-size: 12.5px;
  line-height: 1.5;
  color: #cfd3dc;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}

.reels-cta-bar {
  margin-top: 36px;
  display: flex;
  justify-content: center;
}

/* Featured Podcast Block */
.podcast-highlight-block {
  margin-top: 60px;
  padding-top: 40px;
  border-top: 1px solid var(--border);
}

.podcast-block-header {
  margin-bottom: 24px;
}

.podcast-block-title {
  font-size: clamp(24px, 3.5vw, 36px);
  margin: 8px 0 12px;
}

.podcast-block-desc {
  color: var(--text-muted);
  font-size: 15px;
  max-width: 720px;
  line-height: 1.6;
}

.podcast-player-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-bright);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
}

.podcast-player-wrapper iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

@media (max-width: 1150px) {
  .reels-grid-custom {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 600px) {
  .reels-grid-custom {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
`;

// Replace old reels CSS or append
const oldMarker = '/* ==========================================================================\n   REELS & MOTION ARCHIVE';
const oldIdx = styles.indexOf(oldMarker);

if (oldIdx !== -1) {
  styles = styles.slice(0, oldIdx) + newReelCSS + '\n';
  fs.writeFileSync('styles.css', styles, 'utf8');
  console.log('Successfully updated styles.css with exact Reel card styling!');
} else {
  styles += '\n' + newReelCSS;
  fs.writeFileSync('styles.css', styles, 'utf8');
  console.log('Appended new Reel card styling to styles.css!');
}

