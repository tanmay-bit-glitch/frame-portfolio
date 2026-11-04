const fs = require('fs');

// 1. UPDATE index.html and preview-showreel.html
function updateShowreelHtml(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace video tag: remove poster, add autoplay, muted, loop, playsinline, preload="auto"
  content = content.replace(
    /<video id="heroShowreelVideo"[^>]*>/,
    '<video id="heroShowreelVideo" class="hero-showreel-video" autoplay muted loop playsinline preload="auto">'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated showreel video tag in ${filePath}`);
}

updateShowreelHtml('index.html');
updateShowreelHtml('preview-showreel.html');

// 2. RESTORE and ENHANCE CSS in styles.css
let styles = fs.readFileSync('styles.css', 'utf8');

const restoredCSS = `
/* ==========================================================================
   SHOWREEL VIDEO PLAYER (16:9 RATIO, CONTINUOUS PLAYBACK)
   ========================================================================== */
.showreel-section {
  position: relative;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: var(--bg-surface);
}

.showreel-section-container {
  max-width: 1400px;
  margin: 0 auto;
}

.showreel-player-canvas.in-page-player {
  margin-top: 36px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-bright);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.85);
}

.hero-video-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}

.hero-showreel-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero-video-controls-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 24px;
  background: linear-gradient(180deg, transparent 65%, rgba(0, 0, 0, 0.85) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.hero-video-wrapper:hover .hero-video-controls-overlay {
  opacity: 1;
}

.hero-video-play-btn {
  display: none !important; /* Video plays continuously */
}

.hero-video-bar {
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
  gap: 12px;
}

.hero-video-title {
  font-size: 12px;
  letter-spacing: 0.1em;
  color: #fff;
  font-weight: 600;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.9);
}

.hero-video-actions {
  display: flex;
  gap: 12px;
}

.btn-video-ctrl {
  background: rgba(18, 20, 26, 0.85);
  border: 1px solid var(--border);
  color: var(--text);
  font-size: 11px;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  backdrop-filter: blur(8px);
}

.btn-video-ctrl:hover {
  border-color: var(--accent);
  color: var(--accent);
}

/* Direct Email Button */
.direct-email-bar {
  margin-bottom: 32px;
}

.direct-email-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 28px;
  background: var(--accent);
  color: #ffffff;
  font-family: var(--font-mono);
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  border-radius: 4px;
  text-decoration: none;
  box-shadow: 0 8px 24px var(--accent-glow);
  transition: all var(--dur-fast) var(--ease-cinema);
}

.direct-email-btn:hover {
  background: #ffffff;
  color: #000000;
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(255, 255, 255, 0.2);
}

/* Instagram Follow Strip */
.instagram-follow-strip {
  position: relative;
  background: linear-gradient(180deg, var(--bg) 0%, var(--bg-surface) 50%, var(--bg) 100%);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.follow-strip-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  flex-wrap: wrap;
}

.follow-strip-content {
  max-width: 720px;
}

.follow-strip-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  letter-spacing: 0.14em;
  color: var(--accent);
  margin-bottom: 16px;
}

.follow-strip-heading {
  font-size: clamp(32px, 5.5vw, 64px);
  margin-bottom: 16px;
}

.follow-strip-desc {
  color: var(--text-muted);
  font-size: 16px;
  line-height: 1.6;
}

.follow-strip-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 18px 36px;
  font-size: 13px;
  letter-spacing: 0.1em;
}
`;

const insertMarker = '/* ==========================================================================\n   REELS & MOTION ARCHIVE';
const insertIdx = styles.indexOf(insertMarker);

if (insertIdx !== -1) {
  styles = styles.slice(0, insertIdx) + restoredCSS + '\n' + styles.slice(insertIdx);
  fs.writeFileSync('styles.css', styles, 'utf8');
  console.log('Successfully updated styles.css with 16:9 continuous showreel styling!');
} else {
  console.error('Could not find insert marker in styles.css');
}

// 3. UPDATE script.js so the video plays continuously on load
let script = fs.readFileSync('script.js', 'utf8');

script = script.replace(
  /\/\/ Default muted per user requirements[\s\S]*?video\.muted = true;/,
  `// Continuous autoplay playback per user requirements
    video.muted = true;
    video.loop = true;
    video.play().catch(err => {
      console.log('Video autoplay waiting for interaction:', err);
    });`
);

// Remove intersection observer pause so it plays continuously
script = script.replace(
  /\/\/ Auto-pause when scrolled out of view[\s\S]*?videoObserver\.observe\(video\);\s*\}/,
  `// Continuous loop: re-trigger on ended
    video.addEventListener('ended', () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    });`
);

fs.writeFileSync('script.js', script, 'utf8');
console.log('Updated script.js for continuous loop playback!');
