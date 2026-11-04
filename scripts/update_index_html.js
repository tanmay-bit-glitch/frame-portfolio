const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const indexPath = path.join(rootDir, 'index.html');
const photosJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/photos.json'), 'utf8'));
const reelsJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/reels.json'), 'utf8'));

let html = fs.readFileSync(indexPath, 'utf8');

// 1. Update filter tabs in #work
const oldFilterTabsRegex = /<div class="filter-tabs" role="tablist"[^>]*>[\s\S]*?<\/div>/;
const newFilterTabs = `<div class="filter-tabs" role="tablist" aria-label="Filter photography archive">
          <button class="filter-tab is-active" type="button" role="tab" aria-selected="true" data-filter="all">ALL [21]</button>
          <button class="filter-tab" type="button" role="tab" aria-selected="false" data-filter="Machines">MACHINES [06]</button>
          <button class="filter-tab" type="button" role="tab" aria-selected="false" data-filter="Street">STREET [05]</button>
          <button class="filter-tab" type="button" role="tab" aria-selected="false" data-filter="Heritage">HERITAGE [02]</button>
          <button class="filter-tab" type="button" role="tab" aria-selected="false" data-filter="Culture">CULTURE [01]</button>
          <button class="filter-tab" type="button" role="tab" aria-selected="false" data-filter="People">PEOPLE [02]</button>
          <button class="filter-tab" type="button" role="tab" aria-selected="false" data-filter="Night">NIGHT [03]</button>
          <button class="filter-tab" type="button" role="tab" aria-selected="false" data-filter="Wildlife">WILDLIFE [02]</button>
        </div>`;

html = html.replace(oldFilterTabsRegex, newFilterTabs);

// 2. Update embedded photosData JSON
const oldPhotosDataRegex = /<script id="photosData" type="application\/json">[\s\S]*?<\/script>/;
const newPhotosData = `<script id="photosData" type="application/json">\n${JSON.stringify(photosJson, null, 2)}\n      </script>`;
html = html.replace(oldPhotosDataRegex, newPhotosData);

// 3. Update Hero Showreel Video in #showreel
const oldShowreelRegex = /<div class="showreel-player-canvas in-page-player">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/;
const newShowreel = `<div class="showreel-player-canvas in-page-player">
          <div class="hero-video-wrapper">
            <video id="heroShowreelVideo" class="hero-showreel-video" playsinline loop preload="metadata" poster="assets/photos/shelby-gt500-cyberpunk-1280.webp">
              <source src="assets/video/hero_showreel.mp4" type="video/mp4">
              Your browser does not support HTML5 video.
            </video>
            <div class="hero-video-controls-overlay" id="heroVideoOverlay">
              <button class="hero-video-play-btn" id="heroVideoPlayBtn" type="button" aria-label="Play or Pause Showreel">
                <span class="play-icon">▶</span>
              </button>
              <div class="hero-video-bar">
                <span class="hero-video-title mono">TANMAY CHAVAN // SHOWREEL 2026</span>
                <div class="hero-video-actions">
                  <button type="button" class="btn-video-ctrl mono" id="heroAudioToggle" aria-label="Toggle Sound">
                    <span class="audio-icon">🔇</span>
                    <span class="audio-label">SOUND OFF</span>
                  </button>
                  <button type="button" class="btn-video-ctrl mono" id="heroFullscreenBtn" aria-label="Toggle Fullscreen">
                    <span>⛶ FULLSCREEN</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>`;

html = html.replace(oldShowreelRegex, newShowreel);

// 4. Update Lightbox Modal (Remove sidebar, zoom image only + blur background)
const oldLightboxRegex = /<!-- CINEMATIC LIGHTBOX MODAL -->[\s\S]*?<\/dialog>/;
const newLightbox = `<!-- CINEMATIC LIGHTBOX MODAL (ZOOM IMAGE ONLY + BLUR BACKDROP) -->
  <dialog class="lightbox-modal" id="lightboxModal" aria-modal="true" aria-label="Expanded Image View">
    <div class="lightbox-backdrop" id="lightboxBackdrop"></div>
    <div class="lightbox-container">
      <div class="lightbox-header-minimal">
        <div class="lightbox-meta-top mono">
          <span id="lbIndex">FRAME 01 // 21</span>
        </div>
        <button class="lightbox-close-minimal" id="lightboxCloseBtn" type="button" aria-label="Close view">✕</button>
      </div>

      <div class="lightbox-body">
        <div class="lightbox-media-wrapper" id="lbMediaWrapper">
          <img src="" alt="" id="lbImage" class="lightbox-img">
        </div>
      </div>

      <div class="lightbox-footer-minimal">
        <button type="button" class="lb-nav-btn" id="lbPrevBtn" aria-label="Previous frame">← PREV</button>
        <span class="mono lb-key-hint">USE [←] [→] ARROWS • TAP / [ESC] TO CLOSE</span>
        <button type="button" class="lb-nav-btn" id="lbNextBtn" aria-label="Next frame">NEXT →</button>
      </div>
    </div>
  </dialog>`;

html = html.replace(oldLightboxRegex, newLightbox);

// 5. Update About & Campus Experience with real roles
// Volunteer at V-Click Production & Multimedia Head at SESA
const oldAccoladesRegex = /<!-- Accolades \/ Laurels Bar -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
const newAccolades = `<!-- Accolades / Laurels Bar -->
          <div class="accolades-shelf">
            <span class="shelf-label mono">ROLES &amp; MULTIMEDIA CREW</span>
            <div class="laurels-list">
              <div class="laurel-item">
                <span class="laurel-branch">🙠</span>
                <div class="laurel-text">
                  <strong>MULTIMEDIA HEAD // SESA</strong>
                  <span>Software Engineering Student Association</span>
                </div>
                <span class="laurel-branch">🙡</span>
              </div>
              <div class="laurel-item">
                <span class="laurel-branch">🙠</span>
                <div class="laurel-text">
                  <strong>VOLUNTEER // V-CLICK PRODUCTION</strong>
                  <span>College Multimedia Club</span>
                </div>
                <span class="laurel-branch">🙡</span>
              </div>
              <div class="laurel-item">
                <span class="laurel-branch">🙠</span>
                <div class="laurel-text">
                  <strong>AFTERMOVIE LEAD // VISHWACONCLAVE</strong>
                  <span>Main Campus Event Video Production</span>
                </div>
                <span class="laurel-branch">🙡</span>
              </div>
            </div>
          </div>
        </div>`;

html = html.replace(oldAccoladesRegex, newAccolades);

// 6. Update About Lead text
const oldAboutLeadRegex = /<div class="about-body">[\s\S]*?<\/div>/;
const newAboutLead = `<div class="about-body">
            <p class="lead-paragraph">
              I’m <strong>Tanmay Chavan</strong>, a photographer, videographer and video editor based in Pune, Maharashtra with roots in Nagpur. I serve as the <strong>Multimedia Head at SESA</strong> (Software Engineering Student Association) and a <strong>Volunteer at V-Click Production</strong> (our college multimedia club).
            </p>
            <p>
              I shoot on my Samsung Galaxy S23 and edit across Adobe Premiere Pro and Lightroom. Whether it's high-octane car meets, bike culture, campus aftermovies, live concerts, or quiet street geometry, I focus on authentic visual rhythm and cinematic atmosphere.
            </p>
            <p class="about-setup-line mono">Shot on Galaxy S23. Cut in Premiere Pro. Graded in Lightroom.</p>
          </div>`;

html = html.replace(oldAboutLeadRegex, newAboutLead);

// 7. Add dedicated Reels & Motion Section right after #work and before #instagram
const reelsSectionHtml = `
    <!-- REELS & VIDEO SHOWCASE SECTION (PHASE 4) -->
    <section class="reels-section section-pad" id="reels" aria-labelledby="reels-heading">
      <div class="reels-container">
        <div class="section-header-split">
          <div>
            <p class="eyebrow">MOTION ARCHIVE // 02</p>
            <h2 id="reels-heading">REELS &amp;<br><span class="text-stroke">AFTERMOVIES.</span></h2>
          </div>
          <p class="section-intro-text">
            Short-form visual pacing, dynamic camera movement, event narratives, and multi-cam podcast editing. Embedded directly from YouTube and Instagram.
          </p>
        </div>

        <!-- Featured 16:9 Podcast Embed -->
        <div class="podcast-feature-card">
          <div class="podcast-feature-header">
            <div class="feature-tag mono">
              <span class="rec-dot"></span>
              <span>FEATURED PRODUCTION // PODCAST EDIT</span>
            </div>
            <h3 class="podcast-feature-title">Vishwaconclave Official Podcast</h3>
            <p class="podcast-feature-meta mono">ROLE: VIDEO &amp; AUDIO EDITOR • TOOLS: PREMIERE PRO, SOUND DESIGN • CLIENT: VISHWACONCLAVE</p>
          </div>
          <div class="podcast-video-wrapper">
            <iframe
              src="https://www.youtube-nocookie.com/embed/kZRQnZmLlC4"
              title="Vishwaconclave Official Podcast edited by Tanmay Chavan"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              loading="lazy">
            </iframe>
          </div>
          <div class="podcast-feature-footer">
            <span class="lesson-badge mono">LESSON: Multi-cam rhythm balancing speech clarity with ambient tone</span>
            <a href="https://youtu.be/kZRQnZmLlC4" target="_blank" rel="noopener noreferrer" class="btn-video-fallback mono">
              <span>WATCH ON YOUTUBE ↗</span>
            </a>
          </div>
        </div>

        <!-- Vertical Reels Grid (9:16 Responsive Embeds) -->
        <div class="reels-vertical-grid">

          <!-- Reel 1: SESA Aftermovie -->
          <div class="reel-card">
            <div class="reel-card-meta">
              <span class="mono reel-tag">AFTERMOVIE // SESA</span>
              <h4 class="reel-card-title">SESA Department Aftermovie</h4>
              <p class="reel-card-role mono">ROLE: AFTERMOVIE EDITOR &amp; MULTIMEDIA HEAD</p>
            </div>
            <div class="reel-embed-frame">
              <iframe
                src="https://www.instagram.com/p/DfBzMGPtoJJ/embed/"
                title="SESA Department Aftermovie edited by Tanmay Chavan"
                allowtransparency="true"
                allowfullscreen="true"
                frameborder="0"
                scrolling="no"
                loading="lazy">
              </iframe>
            </div>
            <div class="reel-card-footer">
              <a href="https://www.instagram.com/p/DfBzMGPtoJJ/" target="_blank" rel="noopener noreferrer" class="btn-reel-link mono">
                <span>VIEW REEL ON INSTAGRAM ↗</span>
              </a>
            </div>
          </div>

          <!-- Reel 2: SWD Club Reel -->
          <div class="reel-card">
            <div class="reel-card-meta">
              <span class="mono reel-tag">MOTION REEL // SWD</span>
              <h4 class="reel-card-title">SWD Club Motion Reel</h4>
              <p class="reel-card-role mono">ROLE: REEL EDITOR • TOOLS: PREMIERE PRO</p>
            </div>
            <div class="reel-embed-frame">
              <iframe
                src="https://www.instagram.com/p/DeH4FCFsSzH/embed/"
                title="SWD Club Reel edited by Tanmay Chavan"
                allowtransparency="true"
                allowfullscreen="true"
                frameborder="0"
                scrolling="no"
                loading="lazy">
              </iframe>
            </div>
            <div class="reel-card-footer">
              <a href="https://www.instagram.com/p/DeH4FCFsSzH/" target="_blank" rel="noopener noreferrer" class="btn-reel-link mono">
                <span>VIEW REEL ON INSTAGRAM ↗</span>
              </a>
            </div>
          </div>

          <!-- Reel 3: Vishwaconclave Aftermovie -->
          <div class="reel-card">
            <div class="reel-card-meta">
              <span class="mono reel-tag">CAMPUS EVENT // VISHWACONCLAVE</span>
              <h4 class="reel-card-title">Vishwaconclave Official Aftermovie</h4>
              <p class="reel-card-role mono">ROLE: AFTERMOVIE EDITOR • TOOLS: PREMIERE PRO</p>
            </div>
            <div class="reel-embed-frame">
              <iframe
                src="https://www.instagram.com/p/Dbst6qIMOa_/embed/"
                title="Vishwaconclave Official Aftermovie edited by Tanmay Chavan"
                allowtransparency="true"
                allowfullscreen="true"
                frameborder="0"
                scrolling="no"
                loading="lazy">
              </iframe>
            </div>
            <div class="reel-card-footer">
              <a href="https://www.instagram.com/p/Dbst6qIMOa_/" target="_blank" rel="noopener noreferrer" class="btn-reel-link mono">
                <span>VIEW REEL ON INSTAGRAM ↗</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
`;

// Insert reelsSectionHtml before `<section class="instagram-follow-strip`
if (html.includes('<!-- INSTAGRAM FOLLOW STRIP -->')) {
  html = html.replace('<!-- INSTAGRAM FOLLOW STRIP -->', reelsSectionHtml + '\n    <!-- INSTAGRAM FOLLOW STRIP -->');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully updated index.html with new filters, hero video, reels section, bio, and minimal lightbox!');

