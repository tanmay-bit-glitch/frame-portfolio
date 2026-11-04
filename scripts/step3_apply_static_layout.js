const fs = require('fs');
const path = require('path');

const indexPath = path.resolve('index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Target hero section
const heroStartMarker = '    <!-- HERO SECTION -->';
const heroEndMarker = '    <!-- ABOUT / PHILOSOPHY SECTION -->';

const heroStart = html.indexOf(heroStartMarker);
const heroEnd = html.indexOf(heroEndMarker);

if (heroStart === -1 || heroEnd === -1) {
  throw new Error('Hero markers not found in index.html');
}

const newHeroMarkup = `    <!-- HERO SECTION (FLYING PORTRAIT CUTOUT HERO) -->
    <section class="hero hero-cutout-stage" id="hero" aria-labelledby="hero-title">
      <!-- Layer 1: Dark Backdrop & Subtle Vignette (no photo background, no video) -->
      <div class="hero-dark-backdrop" aria-hidden="true">
        <div class="hero-ambient-glow"></div>
        <div class="hero-vignette-overlay"></div>
      </div>

      <!-- Layer 4 (Part A): Corner HUD Texts -->
      <div class="hero-corner-hud" aria-hidden="true">
        <div class="corner-hud-item top-left">
          <span class="mono">Photographer · Videographer · Editor</span>
        </div>
        <div class="corner-hud-item top-right">
          <a href="#about" class="mono scroll-cue">SCROLL ↓</a>
        </div>
        <div class="corner-hud-item bottom-left">
          <span class="mono">Tanmay Chavan</span>
        </div>
        <div class="corner-hud-item bottom-right">
          <span class="mono">Pune, India</span>
        </div>
      </div>

      <!-- Layer 2: Giant Title BEHIND the cutout portrait -->
      <div class="hero-title-container">
        <h1 id="hero-title" class="giant-name-title">TANMAY</h1>
      </div>

      <!-- Layer 3: Cutout Portrait IN FRONT of the letters, anchored to bottom -->
      <div class="hero-cutout-wrapper" id="heroCutoutWrapper">
        <picture class="hero-cutout-picture">
          <source type="image/webp" srcset="assets/cutout/portrait_cutout_600.webp 600w, assets/cutout/portrait_cutout_1000.webp 1000w, assets/cutout/portrait_cutout_1600.webp 1600w" sizes="(max-width: 600px) 90vw, (max-width: 1024px) 70vw, 55vw">
          <img src="assets/cutout/portrait_cutout_1000.png"
               alt="Tanmay Chavan"
               id="travelingPortrait"
               class="hero-portrait-cutout"
               width="1024"
               height="1023">
        </picture>
      </div>

      <!-- Layer 4 (Part B): Subtitle & Action Buttons -->
      <div class="hero-bottom-controls">
        <p class="hero-tagline-subtitle">I STOP WHEN A FRAME FEELS RIGHT.</p>
        <div class="hero-actions-row">
          <a href="#showreel" class="btn-primary hero-btn">
            <span>WATCH THE REEL</span>
            <span class="play-icon-triangle">▶</span>
          </a>
          <a href="#work" class="btn-secondary hero-btn">
            <span>SEE MY PHOTOS</span>
            <span class="btn-arrow">↓</span>
          </a>
        </div>
      </div>
    </section>\n\n`;

html = html.slice(0, heroStart) + newHeroMarkup + html.slice(heroEnd);

// 2. Update About section portrait card to use cutout in the landing slot
const oldAboutPortrait = `<img src="assets/optimized/profile_tanmay_portrait-640.webp"
              srcset="assets/optimized/profile_tanmay_portrait-640.webp 1x, assets/optimized/profile_tanmay_portrait-1280.webp 2x"
              alt="Tanmay Chavan — Portrait"
              width="460"
              height="575"
              loading="lazy"
              decoding="async"
              class="portrait-img">`;

const newAboutPortrait = `<picture>
              <source type="image/webp" srcset="assets/cutout/portrait_cutout_600.webp 1x, assets/cutout/portrait_cutout_1000.webp 2x">
              <img src="assets/cutout/portrait_cutout_600.png"
                alt="Tanmay Chavan — Portrait"
                id="aboutPortraitDockImg"
                width="460"
                height="575"
                loading="lazy"
                decoding="async"
                class="portrait-img portrait-cutout-dock-img">
            </picture>`;

if (html.includes(oldAboutPortrait)) {
  html = html.replace(oldAboutPortrait, newAboutPortrait);
  console.log('About portrait card updated to cutout landing slot.');
} else {
  console.log('oldAboutPortrait target string differed slightly, checking normalized...');
  const normHtml = html.replace(/\r\n/g, '\n');
  const normOld = oldAboutPortrait.replace(/\r\n/g, '\n');
  const normNew = newAboutPortrait.replace(/\r\n/g, '\n');
  if (normHtml.includes(normOld)) {
    html = normHtml.replace(normOld, normNew);
    console.log('About portrait card replaced via normalized matching.');
  }
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('index.html updated for Step 3.');

// 3. Update styles.css
const cssPath = path.resolve('styles.css');
let css = fs.readFileSync(cssPath, 'utf8');

const heroCutoutCss = `
/* ==========================================================================
   HERO CUTOUT STAGE & FLYING PORTRAIT LAYOUT (STEP 3)
   ========================================================================== */
.hero-cutout-stage {
  min-height: 100svh;
  height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  overflow: hidden;
  background: #070706;
  padding: 0;
}

.hero-dark-backdrop {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.hero-vignette-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, transparent 45%, rgba(0, 0, 0, 0.75) 100%);
}

.hero-ambient-glow {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70vw;
  height: 70vw;
  max-width: 900px;
  max-height: 900px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(224, 93, 44, 0.14) 0%, rgba(224, 93, 44, 0.04) 45%, transparent 70%);
  filter: blur(80px);
  pointer-events: none;
}

/* Layer 2: Giant Name Title Behind Cutout */
.hero-title-container {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 96vw;
  z-index: 2;
  text-align: center;
  pointer-events: none;
}

.giant-name-title {
  font-family: var(--font-heading, 'Archivo Black', sans-serif);
  font-size: clamp(84px, 20vw, 290px);
  line-height: 0.82;
  letter-spacing: -0.04em;
  color: var(--accent, #e05d2c);
  text-transform: uppercase;
  margin: 0;
  user-select: none;
  filter: drop-shadow(0 0 35px rgba(224, 93, 44, 0.22));
}

/* Layer 3: Cutout Portrait In Front of Letters */
.hero-cutout-wrapper {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: clamp(380px, 70vh, 760px);
  z-index: 3;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  pointer-events: none;
}

.hero-cutout-picture {
  height: 100%;
  display: flex;
  align-items: flex-end;
}

.hero-portrait-cutout {
  height: 100%;
  width: auto;
  max-width: 92vw;
  object-fit: contain;
  object-position: bottom center;
  filter: drop-shadow(0 15px 45px rgba(0, 0, 0, 0.95));
}

/* Layer 4: Corner HUD */
.hero-corner-hud {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
}

.corner-hud-item {
  position: absolute;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 11px;
  letter-spacing: 0.1em;
  color: rgba(245, 242, 234, 0.6);
  text-transform: uppercase;
}

.corner-hud-item.top-left {
  top: 96px;
  left: 4vw;
}

.corner-hud-item.top-right {
  top: 96px;
  right: 4vw;
  pointer-events: auto;
}

.corner-hud-item.bottom-left {
  bottom: 24px;
  left: 4vw;
}

.corner-hud-item.bottom-right {
  bottom: 24px;
  right: 4vw;
}

.scroll-cue {
  color: var(--accent, #e05d2c);
  text-decoration: none;
  transition: opacity var(--dur-fast);
}

.scroll-cue:hover {
  opacity: 0.8;
}

/* Layer 4: Subtitle & Actions Row */
.hero-bottom-controls {
  position: relative;
  z-index: 5;
  margin-bottom: clamp(20px, 4vh, 40px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.hero-tagline-subtitle {
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: clamp(11px, 1.1vw, 13.5px);
  letter-spacing: 0.08em;
  color: #fff;
  background: rgba(8, 8, 7, 0.82);
  padding: 6px 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  backdrop-filter: blur(8px);
}

.hero-bottom-controls .hero-actions-row {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 0;
}

.hero-btn {
  padding: 11px 22px;
  font-size: 11.5px;
}

/* Landing Slot inside About */
.portrait-cutout-dock-img {
  background: #0a0a09;
  object-fit: contain;
}

@media (max-width: 768px) {
  .hero-cutout-wrapper {
    height: 58vh;
  }
  .giant-name-title {
    font-size: clamp(72px, 24vw, 140px);
  }
  .corner-hud-item.top-left,
  .corner-hud-item.bottom-left {
    display: none; /* Keep mobile view uncluttered */
  }
  .corner-hud-item.top-right {
    top: 80px;
    right: 5vw;
  }
  .corner-hud-item.bottom-right {
    bottom: 12px;
    right: 5vw;
  }
}
`;

if (!css.includes('.hero-cutout-stage')) {
  css += heroCutoutCss;
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('styles.css updated with hero cutout styles.');
}
