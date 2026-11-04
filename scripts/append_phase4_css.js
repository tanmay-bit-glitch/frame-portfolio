const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, '../styles.css');
let css = fs.readFileSync(stylesPath, 'utf8');

const phase4Css = `
/* ==========================================================================
   PHASE 4 & LIGHTBOX MINIMAL REDESIGN
   ========================================================================== */
.hero-video-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 80vh;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-bright);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
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
  justify-content: space-between;
  padding: 24px;
  background: linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.85) 100%);
  opacity: 1;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.hero-video-wrapper.is-playing:not(:hover) .hero-video-controls-overlay {
  opacity: 0;
}

.hero-video-play-btn {
  pointer-events: auto;
  align-self: center;
  margin: auto;
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: rgba(229, 169, 60, 0.95);
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  border: none;
  cursor: pointer;
  box-shadow: 0 0 40px rgba(229, 169, 60, 0.5);
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s;
}

.hero-video-play-btn:hover {
  transform: scale(1.1);
  background: #ffb833;
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
}

.btn-video-ctrl:hover {
  border-color: var(--accent);
  color: var(--accent);
}

/* REELS SECTION */
.reels-section {
  position: relative;
}

.podcast-feature-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-bright);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 40px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.6);
}

.podcast-feature-header {
  padding: 24px;
  border-bottom: 1px solid var(--border);
}

.feature-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--accent);
  margin-bottom: 8px;
}

.podcast-feature-title {
  font-size: 22px;
  color: #fff;
  margin-bottom: 6px;
}

.podcast-feature-meta {
  font-size: 12px;
  color: var(--text-muted);
}

.podcast-video-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
}

.podcast-video-wrapper iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.podcast-feature-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.lesson-badge {
  font-size: 12px;
  color: var(--accent);
  background: rgba(229, 169, 60, 0.1);
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid rgba(229, 169, 60, 0.2);
}

.reels-vertical-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

@media (max-width: 1023px) {
  .reels-vertical-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .reels-vertical-grid {
    grid-template-columns: 1fr;
  }
}

.reel-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, border-color 0.2s;
}

.reel-card:hover {
  transform: translateY(-3px);
  border-color: var(--accent);
}

.reel-card-meta {
  padding: 18px 20px;
  border-bottom: 1px solid var(--border);
}

.reel-tag {
  font-size: 10px;
  color: var(--accent);
  letter-spacing: 0.1em;
}

.reel-card-title {
  font-size: 16px;
  color: #fff;
  margin: 4px 0;
}

.reel-card-role {
  font-size: 11px;
  color: var(--text-muted);
}

.reel-embed-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 9 / 16;
  min-height: 480px;
  background: #000;
  overflow: hidden;
}

.reel-embed-frame iframe {
  width: 100%;
  height: 100%;
  border: none;
  overflow: hidden;
}

.reel-card-footer {
  padding: 12px 20px;
  border-top: 1px solid var(--border);
  background: var(--bg);
}

.btn-reel-link {
  font-size: 11px;
  color: var(--text-muted);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s;
}

.btn-reel-link:hover {
  color: var(--accent);
}

/* MINIMALIST ZOOM LIGHTBOX (ZOOM ONLY, NO DESCRIPTION, HEAVY BLUR) */
.lightbox-modal {
  position: fixed;
  inset: 0;
  width: 100vw !important;
  height: 100vh !important;
  max-width: none !important;
  max-height: none !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  background: transparent !important;
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 99999 !important;
}

.lightbox-modal[open] {
  display: flex !important;
}

.lightbox-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(3, 4, 7, 0.88) !important;
  backdrop-filter: blur(28px) !important;
  -webkit-backdrop-filter: blur(28px) !important;
  z-index: 1 !important;
}

.lightbox-container {
  position: relative;
  z-index: 2;
  width: 100vw !important;
  height: 100vh !important;
  max-width: none !important;
  max-height: none !important;
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
}

.lightbox-header-minimal {
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  width: 100%;
}

.lightbox-header-minimal .lightbox-meta-top {
  color: var(--accent);
  font-size: 12px;
  letter-spacing: 0.1em;
}

.lightbox-close-minimal {
  font-size: 24px;
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.lightbox-close-minimal:hover {
  background: rgba(229, 169, 60, 0.25);
  border-color: var(--accent);
  color: var(--accent);
  transform: scale(1.05);
}

.lightbox-body {
  pointer-events: auto;
  flex: 1;
  display: flex !important;
  grid-template-columns: none !important;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
}

.lightbox-media-wrapper {
  background: transparent !important;
  max-width: 95vw;
  max-height: 84vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-img {
  max-width: 92vw;
  max-height: 82vh;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.95);
  cursor: zoom-out;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.lightbox-img:hover {
  transform: scale(1.02);
}

.lightbox-sidebar {
  display: none !important;
}

.lightbox-footer-minimal {
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 32px;
  width: 100%;
}

@media (max-width: 640px) {
  .lightbox-header-minimal,
  .lightbox-footer-minimal {
    padding: 16px 20px;
  }
}
`;

css += '\n' + phase4Css;
fs.writeFileSync(stylesPath, css, 'utf8');
console.log('Appended Phase 4 and minimalist lightbox CSS to styles.css');
