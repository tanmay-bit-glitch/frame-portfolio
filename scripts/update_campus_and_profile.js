const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const userPhotoSrc = 'C:/Users/tchav/.gemini/antigravity/brain/6b458d8f-2018-4a6d-9c57-d77cfe956962/.user_uploaded/media_1793831700145_7fa0565b.jpg';

  // 1. Process profile photo WebP crops
  console.log('Generating profile photo WebP assets...');
  await sharp(userPhotoSrc)
    .resize(640, 800, { fit: 'cover', position: 'center' })
    .webp({ quality: 90 })
    .toFile('assets/optimized/profile_tanmay_portrait-640.webp');

  await sharp(userPhotoSrc)
    .resize(1024, 1280, { fit: 'cover', position: 'center' })
    .webp({ quality: 90 })
    .toFile('assets/optimized/profile_tanmay_portrait-1280.webp');

  fs.copyFileSync(userPhotoSrc, 'assets/photos/profile_tanmay_outdoor.jpg');
  console.log('Saved profile photos!');

  // 2. Prepare new Campus Experience Section HTML
  const campusSectionHtml = `    <!-- CAMPUS EXPERIENCE SECTION -->
    <section class="campus-section section-pad" id="experience" aria-labelledby="campus-heading">
      <div class="campus-container">

        <!-- Section Header -->
        <header class="campus-header">
          <div class="campus-header-meta">
            <div class="campus-eyebrow-row">
              <span class="mono eyebrow">CAMPUS PRODUCTION // 03</span>
              <div class="campus-status-badge">
                <span class="status-pulse-dot"></span>
                <span class="status-text mono">VIT PUNE • MULTIMEDIA</span>
              </div>
            </div>
            <h2 id="campus-heading" class="campus-main-heading">
              BEHIND THE<br>
              <span class="text-stroke">CAMPUS FRAME.</span>
            </h2>
            <p class="campus-header-subtitle">
              College wasn't just where I studied engineering. It became my first real production environment. Leading multimedia teams, directing official aftermovies, and pacing multi-cam recordings gave me hands-on narrative experience with live crowds and real event energy.
            </p>
          </div>

          <div class="campus-summary-card">
            <div class="summary-top mono">
              <span>CAMPUS MULTIMEDIA PORTFOLIO</span>
              <span class="pipeline-badge">VIT PUNE</span>
            </div>
            <div class="summary-stats-grid">
              <div class="campus-stat-col">
                <span class="stat-big">04</span>
                <span class="mono stat-lbl">CREWS &amp; BODIES</span>
              </div>
              <div class="campus-stat-divider">•</div>
              <div class="campus-stat-col">
                <span class="stat-big">02</span>
                <span class="mono stat-lbl">OFFICIAL AFTERMOVIES</span>
              </div>
              <div class="campus-stat-divider">•</div>
              <div class="campus-stat-col">
                <span class="stat-big">01</span>
                <span class="mono stat-lbl">MULTI-CAM PODCAST</span>
              </div>
            </div>
          </div>
        </header>

        <!-- Campus Experience Cards Grid (2x2 Balanced Grid) -->
        <div class="campus-grid">

          <!-- 01 — SESA (LEADERSHIP ROLE) -->
          <article class="campus-card campus-featured-card" tabindex="0">
            <div class="campus-card-header">
              <div class="campus-meta-tag mono">
                <span class="campus-num">01</span>
                <span class="campus-tag-badge">LEADERSHIP // STUDENT BODY</span>
              </div>
              <span class="campus-role-pill mono">MULTIMEDIA HEAD</span>
            </div>

            <div class="campus-card-body">
              <div class="campus-title-block">
                <span class="campus-team-kicker mono">DEPARTMENT OF COMPUTER ENGINEERING // SESA</span>
                <h3>Software Engineering Student Association (SESA)</h3>
                <p class="campus-lead-desc">
                  Serving as the Multimedia Head at SESA, leading visual direction, on-ground videography teams, social motion assets, and post-production for departmental events and technical fests.
                </p>
              </div>

              <!-- Major Contribution Highlight Box -->
              <div class="major-contribution-box">
                <div class="contribution-header mono">
                  <span class="star-icon">★</span>
                  <strong>MAJOR CONTRIBUTION // OFFICIAL AFTERMOVIE DIRECTOR &amp; EDITOR</strong>
                </div>
                <p class="contribution-body">
                  Directed and edited the official SESA Department Aftermovie, synchronizing high-energy beat-matched transitions, stage lighting, and crowd interaction into a cohesive department showcase.
                </p>
              </div>

              <!-- Direct CTA Action Button -->
              <div class="campus-action-row">
                <a href="https://www.instagram.com/p/DfBzMGPtoJJ/" target="_blank" rel="noopener noreferrer"
                  class="campus-primary-btn">
                  <span class="btn-play-icon">▶</span>
                  <span>WATCH SESA AFTERMOVIE</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </a>
              </div>
            </div>
          </article>

          <!-- 02 — VISHWACONCLAVE (FEATURED EXPERIENCE) -->
          <article class="campus-card campus-featured-card" tabindex="0">
            <div class="campus-card-header">
              <div class="campus-meta-tag mono">
                <span class="campus-num">02</span>
                <span class="campus-tag-badge">FLAGSHIP ANNUAL SUMMIT</span>
              </div>
              <span class="campus-role-pill mono">AFTERMOVIE LEAD &amp; EDITOR</span>
            </div>

            <div class="campus-card-body">
              <div class="campus-title-block">
                <span class="campus-team-kicker mono">CAMPUS FESTIVAL MULTIMEDIA // VIT PUNE</span>
                <h3>Vishwaconclave Multimedia Team</h3>
                <p class="campus-lead-desc">
                  Core video editor and aftermovie lead for Vishwaconclave—the flagship leadership and youth summit of Vishwakarma Institute of Technology, Pune.
                </p>
              </div>

              <!-- Major Contribution Highlight Box -->
              <div class="major-contribution-box">
                <div class="contribution-header mono">
                  <span class="star-icon">★</span>
                  <strong>MAJOR CONTRIBUTION // OFFICIAL AFTERMOVIE &amp; PODCAST</strong>
                </div>
                <p class="contribution-body">
                  Edited the official Vishwaconclave Aftermovie capturing concert headliners, auditorium discussions, and crowd energy. Additionally edited the multi-camera Vishwaconclave Official Podcast.
                </p>
              </div>

              <!-- Direct CTA Action Button -->
              <div class="campus-action-row">
                <a href="https://www.instagram.com/p/Dbst6qIMOa_/" target="_blank" rel="noopener noreferrer"
                  class="campus-primary-btn">
                  <span class="btn-play-icon">▶</span>
                  <span>WATCH AFTERMOVIE</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </a>
              </div>
            </div>
          </article>

          <!-- 03 — V-CLICK PRODUCTION (COLLEGE MULTIMEDIA CLUB) -->
          <article class="campus-card campus-companion-card" tabindex="0">
            <div class="campus-card-header">
              <div class="campus-meta-tag mono">
                <span class="campus-num">03</span>
                <span class="campus-tag-badge">OFFICIAL MULTIMEDIA CLUB</span>
              </div>
              <span class="campus-role-pill mono">PRODUCTION VOLUNTEER</span>
            </div>

            <div class="companion-card-body">
              <div class="companion-title-block">
                <span class="campus-team-kicker mono">VIT PUNE // V-CLICK PRODUCTION</span>
                <h3>V-Click Production</h3>
                <p class="campus-lead-desc">
                  Active member and volunteer at V-Click Production—the official photography, videography, and media coverage club at VIT Pune. Working across live multi-camera operations, event setups, and creative post-production workflows.
                </p>
              </div>

              <div class="companion-status-row">
                <div class="companion-meta-item">
                  <span class="meta-label mono">ROLE:</span>
                  <span class="meta-val mono">PRODUCTION VOLUNTEER</span>
                </div>
                <div class="companion-meta-item">
                  <span class="meta-label mono">FOCUS:</span>
                  <span class="meta-val mono">CINEMATOGRAPHY &amp; POST</span>
                </div>
              </div>
            </div>
          </article>

          <!-- 04 — SWD (STUDENT WELFARE & DEVELOPMENT) -->
          <article class="campus-card campus-companion-card" tabindex="0">
            <div class="campus-card-header">
              <div class="campus-meta-tag mono">
                <span class="campus-num">04</span>
                <span class="campus-tag-badge">STUDENT BODY MULTIMEDIA</span>
              </div>
              <span class="campus-role-pill mono">MULTIMEDIA TEAM</span>
            </div>

            <div class="companion-card-body">
              <div class="companion-title-block">
                <span class="campus-team-kicker mono">VIT PUNE // STUDENT WELFARE &amp; DEVELOPMENT</span>
                <h3>Student Welfare &amp; Development (SWD)</h3>
                <p class="campus-lead-desc">
                  Created social motion reels and visual announcements for the SWD student body at Vishwakarma Institute of Technology, engaging students across campus through fast visual storytelling.
                </p>
              </div>

              <div class="campus-action-row" style="margin-top: 18px;">
                <a href="https://www.instagram.com/p/DeH4FCFsSzH/" target="_blank" rel="noopener noreferrer"
                  class="campus-primary-btn" style="padding: 10px 18px; font-size: 11px;">
                  <span class="btn-play-icon">▶</span>
                  <span>WATCH SWD REEL</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </a>
              </div>
            </div>
          </article>

        </div>

      </div>
    </section>`;

  // 3. Prepare new About / Philosophy Section HTML with properly nested portrait card
  const aboutSectionHtml = `    <!-- ABOUT / PHILOSOPHY SECTION -->
    <section class="about section-pad" id="about" aria-labelledby="about-heading">
      <div class="about-grid">
        <div class="about-lead">
          <p class="eyebrow">PHILOSOPHY &amp; PROFILE // 04</p>
          <h2 id="about-heading">THE HUMAN<br><span class="text-stroke">BETWEEN TAKES.</span></h2>

          <div class="about-body">
            <p class="lead-paragraph">
              I’m <strong>Tanmay Chavan</strong>, a photographer, videographer and video editor based in Pune, Maharashtra with roots in Nagpur. I serve as the <strong>Multimedia Head at SESA</strong> (Software Engineering Student Association) and a <strong>Volunteer at V-Click Production</strong> (our college multimedia club).
            </p>
            <p>
              I shoot on my Samsung Galaxy S23 and edit across Adobe Premiere Pro and Lightroom. Whether it's high-octane car meets, bike culture, campus aftermovies, live concerts, or quiet street geometry, I focus on authentic visual rhythm and cinematic atmosphere.
            </p>
            <p class="about-setup-line mono">Shot on Galaxy S23. Cut in Premiere Pro. Graded in Lightroom.</p>
          </div>

          <!-- Accolades / Laurels Bar -->
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
        </div>

        <!-- Portrait Card (Properly Placed Inside Grid) -->
        <div class="about-portrait-card">
          <div class="portrait-frame">
            <div class="portrait-sprocket top" aria-hidden="true"></div>
            <img src="assets/optimized/profile_tanmay_portrait-640.webp"
              srcset="assets/optimized/profile_tanmay_portrait-640.webp 1x, assets/optimized/profile_tanmay_portrait-1280.webp 2x"
              alt="Tanmay Chavan — Portrait"
              width="460"
              height="575"
              loading="lazy"
              decoding="async"
              class="portrait-img">
            <div class="portrait-sprocket bottom" aria-hidden="true"></div>
          </div>
          <div class="camera-tag mono">TANMAY CHAVAN // PHOTOGRAPHY &amp; EDITING</div>
        </div>

      </div>
    </section>`;

  // Update index.html
  let indexHtml = fs.readFileSync('index.html', 'utf8');

  // Replace Campus Section
  const expMarkerStart = '<section class="campus-section';
  const expIdx = indexHtml.indexOf(expMarkerStart);
  const expEnd = indexHtml.indexOf('</section>', expIdx) + 10;
  if (expIdx !== -1 && expEnd !== -1) {
    indexHtml = indexHtml.slice(0, expIdx) + campusSectionHtml + indexHtml.slice(expEnd);
    console.log('Replaced campus section in index.html');
  }

  // Replace About Section
  const abMarkerStart = '<section class="about section-pad"';
  const abIdx = indexHtml.indexOf(abMarkerStart);
  const abEnd = indexHtml.indexOf('</section>', abIdx) + 10;
  if (abIdx !== -1 && abEnd !== -1) {
    indexHtml = indexHtml.slice(0, abIdx) + aboutSectionHtml + indexHtml.slice(abEnd);
    console.log('Replaced about section with proper portrait placement in index.html');
  }

  fs.writeFileSync('index.html', indexHtml, 'utf8');

  // 4. Update styles.css for font consistency and layout polish
  let styles = fs.readFileSync('styles.css', 'utf8');

  // Ensure :root has font variables
  if (!styles.includes('--font-main:')) {
    styles = styles.replace(
      ':root {',
      `:root {
  --font-main: 'Archivo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-heading: 'Archivo Black', 'Archivo', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;`
    );
  }

  // Replace any divergent font-family on headings
  styles = styles.replace(
    /\.campus-main-heading\s*\{[^}]*\}/g,
    `.campus-main-heading {
  font-family: var(--font-heading);
  font-size: clamp(32px, 5.5vw, 68px);
  text-transform: uppercase;
  letter-spacing: -0.03em;
  line-height: 0.96;
  margin-bottom: 24px;
}`
  );

  styles = styles.replace(
    /\.card-title\s*\{[^}]*font-family:\s*['"]Syne['"][^}]*\}/g,
    (match) => match.replace(/font-family:\s*['"]Syne['"],?\s*sans-serif;?/g, "font-family: var(--font-heading);")
  );

  // 2x2 grid for campus cards
  if (styles.includes('.campus-grid {')) {
    styles = styles.replace(
      /\.campus-grid\s*\{[^}]*\}/,
      `.campus-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
}`
    );
  }

  // Polish about-portrait-card positioning and sizing
  styles = styles.replace(
    /\.about-portrait-card\s*\{[^}]*\}/,
    `.about-portrait-card {
  position: relative;
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  align-self: center;
}`
  );

  styles = styles.replace(
    /\.about-grid\s*\{[^}]*\}/,
    `.about-grid {
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  gap: 50px;
  align-items: center;
}`
  );

  // Responsive adjustments for campus and about
  const responsiveAdditions = `
@media (max-width: 1024px) {
  .campus-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .about-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .about-portrait-card {
    max-width: 320px;
  }
}
`;
  if (!styles.includes('/* Responsive Campus & About Fix */')) {
    styles += `\n/* Responsive Campus & About Fix */\n${responsiveAdditions}\n`;
  }

  fs.writeFileSync('styles.css', styles, 'utf8');
  console.log('Successfully updated styles.css with font consistency and grid polish!');
}

main().catch(console.error);

