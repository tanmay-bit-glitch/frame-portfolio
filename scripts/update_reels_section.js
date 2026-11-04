const fs = require('fs');

// 1. UPDATE styles.css
let styles = fs.readFileSync('styles.css', 'utf8');
const startMarker = '/* REELS SECTION */';
const endMarker = '/* MINIMALIST ZOOM LIGHTBOX';

const startIdx = styles.indexOf(startMarker);
const endIdx = styles.indexOf(endMarker);

const newReelsCSS = `/* ==========================================================================
   REELS & MOTION ARCHIVE: GALLERY-MATCHED FORMAT
   ========================================================================== */
.reels-section {
  position: relative;
}

.reels-container {
  max-width: var(--container-width, 1440px);
  margin: 0 auto;
  width: 100%;
}

.reels-filter-toolbar {
  margin-bottom: 28px;
}

/* Featured Podcast Cinema Card - Matches Gallery Card Language */
.reels-featured-podcast {
  margin-bottom: 32px;
  width: 100%;
}

.reels-featured-podcast .card-media-wrapper {
  aspect-ratio: 16 / 9;
  width: 100%;
  max-height: 580px;
  background: #000;
  position: relative;
  overflow: hidden;
  border-radius: 8px 8px 0 0;
}

.reels-featured-podcast iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

/* 3-Column Vertical Reels Grid - Exactly Matches Gallery 3-Column Rhythm */
.reels-gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  width: 100%;
  align-items: stretch;
}

@media (max-width: 1023px) {
  .reels-gallery-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 639px) {
  .reels-gallery-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

/* Motion Card - Shares Exact Styling of .gallery-card */
.motion-card {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-surface, #0d0d11);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: left;
  transition: transform 350ms cubic-bezier(0.16, 1, 0.3, 1),
              border-color 250ms ease,
              box-shadow 250ms ease;
}

.motion-card:hover {
  border-color: rgba(224, 93, 44, 0.85);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.85), 0 0 25px rgba(224, 93, 44, 0.25);
  transform: translateY(-4px) scale(1.012);
  z-index: 5;
}

.motion-card .card-media-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 9 / 16;
  min-height: 520px;
  background: #000;
  overflow: hidden;
  border-radius: 8px 8px 0 0;
}

.motion-card .card-media-wrapper iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  background: #000;
}

/* Integrated Gallery-Style Metadata Overlay on Motion Cards */
.motion-card .motion-card-bar {
  padding: 16px 20px;
  background: #0d0d11;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-radius: 0 0 8px 8px;
}

.motion-card .card-meta-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-mono, monospace);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  margin-bottom: 2px;
}

.motion-card .card-title {
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
}

.motion-card .card-exif {
  color: var(--text-muted, #a0a0b0);
  font-family: var(--font-mono, monospace);
  font-size: 0.72rem;
  margin: 0;
  letter-spacing: 0.04em;
}

.motion-card .motion-direct-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--accent, #e05d2c);
  font-family: var(--font-mono, monospace);
  font-size: 0.72rem;
  text-decoration: none;
  margin-top: 4px;
  letter-spacing: 0.06em;
  font-weight: 600;
  transition: color 200ms ease;
}

.motion-card .motion-direct-link:hover {
  color: #ff8d54;
  text-decoration: underline;
}

`;

if (startIdx !== -1 && endIdx !== -1) {
  styles = styles.slice(0, startIdx) + newReelsCSS + styles.slice(endIdx);
  fs.writeFileSync('styles.css', styles, 'utf8');
  console.log('Successfully updated styles.css with gallery-matched Reels layout!');
} else {
  console.error('Markers not found in styles.css');
}

// 2. UPDATE index.html with the gallery-matched Reels section markup
let html = fs.readFileSync('index.html', 'utf8');
const sectionStartMarker = '<!-- REELS & VIDEO SHOWCASE SECTION (PHASE 4) -->';
const sectionEndMarker = '<!-- INSTAGRAM FOLLOW STRIP -->';

const sStart = html.indexOf(sectionStartMarker);
const sEnd = html.indexOf(sectionEndMarker);

const newReelsMarkup = `<!-- REELS & VIDEO SHOWCASE SECTION (MATCHING GALLERY FORMAT) -->
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

        <!-- Reels Filter Toolbar (Matching Gallery Format) -->
        <div class="filter-toolbar reels-filter-toolbar" role="tablist" aria-label="Reels filter">
          <button class="filter-tab is-active" type="button" role="tab" aria-selected="true" data-reel-filter="all">ALL [04]</button>
          <button class="filter-tab" type="button" role="tab" aria-selected="false" data-reel-filter="aftermovie">AFTERMOVIES [02]</button>
          <button class="filter-tab" type="button" role="tab" aria-selected="false" data-reel-filter="reel">CLUB REELS [01]</button>
          <button class="filter-tab" type="button" role="tab" aria-selected="false" data-reel-filter="podcast">PODCAST [01]</button>
        </div>

        <!-- Featured Podcast (16:9 Cinema Card - Gallery Language) -->
        <article class="gallery-card motion-card reels-featured-podcast" data-type="podcast">
          <div class="card-media-wrapper">
            <iframe
              src="https://www.youtube-nocookie.com/embed/kZRQnZmLlC4"
              title="Vishwaconclave Official Podcast edited by Tanmay Chavan"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              loading="lazy">
            </iframe>
          </div>
          <div class="motion-card-bar">
            <div class="card-meta-top">
              <span class="card-num">PODCAST 01</span>
              <span class="card-category">VISHWACONCLAVE // MULTI-CAM</span>
            </div>
            <h3 class="card-title">Vishwaconclave Official Podcast</h3>
            <p class="card-exif">ROLE: VIDEO &amp; AUDIO EDITOR • TOOLS: PREMIERE PRO, SOUND DESIGN</p>
            <a href="https://youtu.be/kZRQnZmLlC4" target="_blank" rel="noopener noreferrer" class="motion-direct-link">
              <span>WATCH ON YOUTUBE ↗</span>
            </a>
          </div>
        </article>

        <!-- 3-Column Vertical Reels Grid (Gallery Language) -->
        <div class="reels-gallery-grid">

          <!-- Reel 1: SESA Aftermovie -->
          <article class="gallery-card motion-card" data-type="aftermovie">
            <div class="card-media-wrapper">
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
            <div class="motion-card-bar">
              <div class="card-meta-top">
                <span class="card-num">REEL 01</span>
                <span class="card-category">AFTERMOVIE // SESA</span>
              </div>
              <h3 class="card-title">SESA Department Aftermovie</h3>
              <p class="card-exif">ROLE: AFTERMOVIE EDITOR &amp; MULTIMEDIA HEAD</p>
              <a href="https://www.instagram.com/p/DfBzMGPtoJJ/" target="_blank" rel="noopener noreferrer" class="motion-direct-link">
                <span>WATCH ON INSTAGRAM ↗</span>
              </a>
            </div>
          </article>

          <!-- Reel 2: SWD Club Reel -->
          <article class="gallery-card motion-card" data-type="reel">
            <div class="card-media-wrapper">
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
            <div class="motion-card-bar">
              <div class="card-meta-top">
                <span class="card-num">REEL 02</span>
                <span class="card-category">MOTION // SWD CLUB</span>
              </div>
              <h3 class="card-title">SWD Club Motion Reel</h3>
              <p class="card-exif">ROLE: REEL EDITOR • TOOLS: PREMIERE PRO</p>
              <a href="https://www.instagram.com/p/DeH4FCFsSzH/" target="_blank" rel="noopener noreferrer" class="motion-direct-link">
                <span>WATCH ON INSTAGRAM ↗</span>
              </a>
            </div>
          </article>

          <!-- Reel 3: Vishwaconclave Aftermovie -->
          <article class="gallery-card motion-card" data-type="aftermovie">
            <div class="card-media-wrapper">
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
            <div class="motion-card-bar">
              <div class="card-meta-top">
                <span class="card-num">REEL 03</span>
                <span class="card-category">CAMPUS // VISHWACONCLAVE</span>
              </div>
              <h3 class="card-title">Vishwaconclave Official Aftermovie</h3>
              <p class="card-exif">ROLE: AFTERMOVIE EDITOR • TOOLS: PREMIERE PRO</p>
              <a href="https://www.instagram.com/p/Dbst6qIMOa_/" target="_blank" rel="noopener noreferrer" class="motion-direct-link">
                <span>WATCH ON INSTAGRAM ↗</span>
              </a>
            </div>
          </article>

        </div>
      </div>
    </section>\n\n    `;

if (sStart !== -1 && sEnd !== -1) {
  html = html.slice(0, sStart) + newReelsMarkup + html.slice(sEnd);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('Successfully updated index.html with gallery-matched Reels section!');
} else {
  console.error('Section markers not found in index.html');
}

// 3. UPDATE script.js to support reels filtering
let script = fs.readFileSync('script.js', 'utf8');
if (!script.includes('initReelsFilter')) {
  const reelsFilterCode = `
  /* ==========================================================================
     REELS FILTER FUNCTIONALITY (MATCHING GALLERY FORMAT)
     ========================================================================== */
  function initReelsFilter() {
    const reelTabs = document.querySelectorAll('.reels-filter-toolbar .filter-tab');
    const motionCards = document.querySelectorAll('.motion-card');
    if (!reelTabs.length || !motionCards.length) return;

    reelTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        reelTabs.forEach(t => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');

        const filter = tab.dataset.reelFilter;
        motionCards.forEach(card => {
          if (filter === 'all' || card.dataset.type === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
        playSound('click');
      });
    });
  }

  // Initialize reels filter on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReelsFilter);
  } else {
    initReelsFilter();
  }
`;
  script += reelsFilterCode;
  fs.writeFileSync('script.js', script, 'utf8');
  console.log('Added initReelsFilter to script.js');
}
