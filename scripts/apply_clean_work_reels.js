const fs = require('fs');
const path = require('path');

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

const workReels = [
  {
    id: "reel-vishwaconclave-aftermovie",
    shortcode: "Dbst6qIMOa_",
    tag: "REEL // AFTERMOVIE",
    date: "FEB 2026",
    title: "Vishwaconclave Official Aftermovie",
    caption: "Official Aftermovie edited for Vishwaconclave at VIT Pune. Bringing together event footage, stage performances, crowd interactions, and campus atmosphere into a continuous visual narrative.",
    cover: "assets/ig_covers/Dbst6qIMOa_.jpg",
    url: "https://www.instagram.com/p/Dbst6qIMOa_/"
  },
  {
    id: "reel-sesa-aftermovie",
    shortcode: "DfBzMGPtoJJ",
    tag: "REEL // SESA",
    date: "JAN 2026",
    title: "SESA Department Official Aftermovie",
    caption: "Official Aftermovie edited for Software Engineering Student Association (SESA). Beat-matched dynamic cuts, stage lighting shifts, and high-energy festival atmosphere.",
    cover: "assets/ig_covers/DfBzMGPtoJJ.jpg",
    url: "https://www.instagram.com/p/DfBzMGPtoJJ/"
  },
  {
    id: "reel-swd-club",
    shortcode: "DeH4FCFsSzH",
    tag: "REEL // SWD CLUB",
    date: "2026",
    title: "SWD Club Motion Reel",
    caption: "Social Welfare Development (SWD) Motion Reel at VIT Pune. Fast-paced visual hooks, kinetic transitions, and campus community engagement.",
    cover: "assets/ig_covers/DeH4FCFsSzH.jpg",
    url: "https://www.instagram.com/p/DeH4FCFsSzH/"
  }
];

function generateReelCardsHtml() {
  return workReels.map(reel => `
          <a href="${reel.url}" target="_blank" rel="noopener noreferrer" class="reel-card" data-shortcode="${reel.shortcode}" aria-label="Watch ${reel.title} on Instagram">
            <div class="reel-card-media">
              <img src="${reel.cover}" alt="${escapeHTML(reel.title)}" loading="lazy" class="reel-card-thumb">
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
            Short-form visual pacing, dynamic camera movement, event narratives, and multi-cam podcast editing. Official video editing and aftermovie productions by Tanmay Chavan.
          </p>
        </div>

        <!-- 3-Column Reels Grid With Original Thumbnails -->
        <div class="reels-grid-custom reels-grid-work" id="reelsGrid">
${generateReelCardsHtml()}
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
  console.log('Successfully updated index.html with clean work reels!');
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

// 3. Update styles.css for 3-column work grid
let styles = fs.readFileSync('styles.css', 'utf8');
if (!styles.includes('.reels-grid-work')) {
  styles += `
.reels-grid-work {
  grid-template-columns: repeat(3, 1fr) !important;
}
@media (max-width: 900px) {
  .reels-grid-work {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
@media (max-width: 600px) {
  .reels-grid-work {
    grid-template-columns: 1fr !important;
  }
}
`;
  fs.writeFileSync('styles.css', styles, 'utf8');
  console.log('Updated styles.css with .reels-grid-work!');
}
