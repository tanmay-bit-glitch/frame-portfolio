const fs = require('fs');
const path = require('path');

// 1. Update styles.css
const cssPath = path.resolve('styles.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Replace cutout wrapper and cutout styles with zoomed version
const oldCutoutCss = `.hero-cutout-wrapper {
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
}`;

const newCutoutCss = `.hero-cutout-wrapper {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: clamp(430px, 78vh, 880px);
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
  transform: scale(1.18);
  transform-origin: bottom center;
  filter: drop-shadow(0 20px 50px rgba(0, 0, 0, 0.95));
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Traveling Flying Portrait Flyer Element (Vanilla JS RAF) */
.hero-flying-flyer {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  pointer-events: none;
  display: none;
  will-change: transform, width, height;
}

.hero-flying-flyer .flyer-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: bottom center;
}`;

function replaceNormalized(fileContent, oldBlock, newBlock) {
  const norm = fileContent.replace(/\r\n/g, '\n');
  const normOld = oldBlock.replace(/\r\n/g, '\n');
  const normNew = newBlock.replace(/\r\n/g, '\n');
  if (norm.includes(normOld)) {
    return norm.replace(normOld, normNew);
  }
  return null;
}

const updatedCss = replaceNormalized(css, oldCutoutCss, newCutoutCss);
if (updatedCss) {
  css = updatedCss;
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('styles.css successfully updated with zoomed cutout and flyer styling.');
} else {
  console.error('Could not find oldCutoutCss in styles.css');
}

// 2. Update script.js with traveling and docking animation logic
const scriptPath = path.resolve('script.js');
let script = fs.readFileSync(scriptPath, 'utf8');

const targetSection5Marker = `  /* ==========================================================================
     5. 35MM ACADEMY COUNTDOWN LEADER (ARCHIVED / DISABLED IN HERO-FLY)
     ========================================================================== */`;

const flyingAnimationScript = `  /* ==========================================================================
     6. HERO FLYING PORTRAIT CUTOUT & DOCKING ANIMATION (STEP 4)
     ========================================================================== */
  const heroCutoutWrapper = document.getElementById('heroCutoutWrapper');
  const heroPortrait = document.getElementById('travelingPortrait');
  const aboutDockImg = document.getElementById('aboutPortraitDockImg');
  const aboutPortraitCard = document.querySelector('.about-portrait-card');

  if (heroPortrait && aboutDockImg && !prefersReduced.matches) {
    // Create floating traveling flyer element
    let flyer = document.getElementById('heroFlyingFlyer');
    if (!flyer) {
      flyer = document.createElement('div');
      flyer.id = 'heroFlyingFlyer';
      flyer.className = 'hero-flying-flyer';
      flyer.setAttribute('aria-hidden', 'true');
      flyer.innerHTML = '<img src="assets/cutout/portrait_cutout_1000.webp" class="flyer-img" alt="">';
      document.body.appendChild(flyer);
    }

    let heroDocRect = null;
    let dockDocRect = null;
    let isTicking = false;

    function measureRects() {
      const prevHeroVis = heroPortrait.style.visibility;
      const prevDockVis = aboutDockImg.style.visibility;
      heroPortrait.style.visibility = 'visible';
      aboutDockImg.style.visibility = 'visible';

      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const hr = heroPortrait.getBoundingClientRect();
      const dr = aboutDockImg.getBoundingClientRect();

      heroDocRect = {
        top: hr.top + scrollY,
        left: hr.left,
        width: hr.width,
        height: hr.height
      };

      dockDocRect = {
        top: dr.top + scrollY,
        left: dr.left,
        width: dr.width,
        height: dr.height
      };

      heroPortrait.style.visibility = prevHeroVis;
      aboutDockImg.style.visibility = prevDockVis;
    }

    function updateFlyer() {
      isTicking = false;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      if (!heroDocRect || !dockDocRect || heroDocRect.width === 0) {
        measureRects();
        if (!heroDocRect || !dockDocRect || heroDocRect.width === 0) return;
      }

      // Transition completes when the dock aligns into the middle of the viewport
      const targetScroll = Math.max(250, dockDocRect.top - (window.innerHeight - dockDocRect.height) * 0.45);
      const rawProgress = scrollY / targetScroll;
      const progress = Math.min(1, Math.max(0, rawProgress));

      if (progress <= 0.005) {
        // At exact top of hero
        flyer.style.display = 'none';
        heroPortrait.style.visibility = 'visible';
        aboutDockImg.style.visibility = 'hidden';
      } else if (progress >= 0.995) {
        // Fully docked in About section
        flyer.style.display = 'none';
        heroPortrait.style.visibility = 'hidden';
        aboutDockImg.style.visibility = 'visible';
      } else {
        // In flight: smooth traveling interpolation
        flyer.style.display = 'block';
        heroPortrait.style.visibility = 'hidden';
        aboutDockImg.style.visibility = 'hidden';

        // Smooth cubic easing curve
        const t = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const curHeroTopViewport = heroDocRect.top - scrollY;
        const curDockTopViewport = dockDocRect.top - scrollY;

        const curX = heroDocRect.left + (dockDocRect.left - heroDocRect.left) * t;
        const curY = curHeroTopViewport + (curDockTopViewport - curHeroTopViewport) * t;
        const curW = heroDocRect.width + (dockDocRect.width - heroDocRect.width) * t;
        const curH = heroDocRect.height + (dockDocRect.height - heroDocRect.height) * t;

        flyer.style.transform = 'translate3d(' + Math.round(curX) + 'px, ' + Math.round(curY) + 'px, 0)';
        flyer.style.width = Math.round(curW) + 'px';
        flyer.style.height = Math.round(curH) + 'px';

        const shadowBlur = Math.round(50 - 25 * t);
        flyer.style.filter = 'drop-shadow(0 ' + Math.round(20 - 10 * t) + 'px ' + shadowBlur + 'px rgba(0,0,0,0.92))';
      }
    }

    function onScroll() {
      if (!isTicking) {
        requestAnimationFrame(updateFlyer);
        isTicking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      measureRects();
      updateFlyer();
    }, { passive: true });

    // Initial setup after fonts and images settle
    window.addEventListener('load', () => {
      measureRects();
      updateFlyer();
    });
    setTimeout(() => {
      measureRects();
      updateFlyer();
    }, 200);
  }
`;

const normScript = script.replace(/\r\n/g, '\n');
const normMarker = targetSection5Marker.replace(/\r\n/g, '\n');

if (normScript.includes(normMarker)) {
  const insertIndex = normScript.indexOf(normMarker);
  const updatedScript = normScript.slice(0, insertIndex) + flyingAnimationScript + '\n' + normScript.slice(insertIndex);
  fs.writeFileSync(scriptPath, updatedScript, 'utf8');
  console.log('script.js successfully updated with scroll-driven travel and docking animation.');
} else {
  console.error('Could not find targetSection5Marker in script.js');
}
