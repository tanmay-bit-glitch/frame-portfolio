const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, '../script.js');
let js = fs.readFileSync(scriptPath, 'utf8');

// 1. In setupLightboxListeners, add lbImage click-to-close
const oldSetupLb = `function setupLightboxListeners() {
    lbCloseBtn?.addEventListener('click', closeLightbox);
    lbBackdrop?.addEventListener('click', closeLightbox);`;

const newSetupLb = `function setupLightboxListeners() {
    lbCloseBtn?.addEventListener('click', closeLightbox);
    lbBackdrop?.addEventListener('click', closeLightbox);
    const lbImg = document.getElementById('lbImage');
    lbImg?.addEventListener('click', closeLightbox);`;

js = js.replace(oldSetupLb, newSetupLb);

// 2. Add Hero Video Showreel player logic
const heroPlayerLogic = `
  /* ==========================================================================
     HERO SHOWREEL VIDEO CONTROLLER (PHASE 4)
     ========================================================================== */
  function initHeroVideoPlayer() {
    const video = document.getElementById('heroShowreelVideo');
    const wrapper = document.querySelector('.hero-video-wrapper');
    const playBtn = document.getElementById('heroVideoPlayBtn');
    const audioToggle = document.getElementById('heroAudioToggle');
    const fullscreenBtn = document.getElementById('heroFullscreenBtn');

    if (!video || !wrapper) return;

    // Default muted per user requirements
    video.muted = true;

    function updatePlayState() {
      if (video.paused) {
        wrapper.classList.remove('is-playing');
        if (playBtn) playBtn.innerHTML = '<span class="play-icon">▶</span>';
      } else {
        wrapper.classList.add('is-playing');
        if (playBtn) playBtn.innerHTML = '<span class="play-icon">❚❚</span>';
      }
    }

    function togglePlay() {
      if (video.paused) {
        video.play().then(updatePlayState).catch(err => {
          console.log('Video play prevented:', err);
        });
      } else {
        video.pause();
        updatePlayState();
      }
      playSound('click');
    }

    playBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });

    video.addEventListener('click', () => {
      togglePlay();
    });

    video.addEventListener('play', updatePlayState);
    video.addEventListener('pause', updatePlayState);
    video.addEventListener('ended', () => {
      wrapper.classList.remove('is-playing');
    });

    // Audio Toggle (Muted by default)
    if (audioToggle) {
      audioToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        const icon = audioToggle.querySelector('.audio-icon');
        const label = audioToggle.querySelector('.audio-label');
        if (video.muted) {
          if (icon) icon.textContent = '🔇';
          if (label) label.textContent = 'SOUND OFF';
        } else {
          if (icon) icon.textContent = '🔊';
          if (label) label.textContent = 'SOUND ON';
        }
        playSound('click');
      });
    }

    // Fullscreen Toggle
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!document.fullscreenElement) {
          if (wrapper.requestFullscreen) {
            wrapper.requestFullscreen();
          } else if (video.requestFullscreen) {
            video.requestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
        playSound('click');
      });
    }

    // Auto-pause when scrolled out of view to save CPU/battery
    if ('IntersectionObserver' in window) {
      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting && !video.paused) {
            video.pause();
            updatePlayState();
          }
        });
      }, { threshold: 0.25 });
      videoObserver.observe(video);
    }
  }

  // Initialize hero video player on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroVideoPlayer);
  } else {
    initHeroVideoPlayer();
  }
`;

// Insert heroPlayerLogic right before the last closing `})();`
const lastClosing = js.lastIndexOf('})();');
if (lastClosing !== -1) {
  js = js.slice(0, lastClosing) + heroPlayerLogic + '\n})();';
}

fs.writeFileSync(scriptPath, js, 'utf8');
console.log('Successfully updated script.js with hero video player and minimal lightbox click-to-close!');
