const fs = require('fs');
const path = require('path');

// 1. Update index.html
const indexPath = path.resolve('index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Update menu-links
const oldMenuLinks = `<div class="menu-links">
        <a href="#work" data-num="01">
          <span class="link-meta">PHOTOGRAPHY & REELS</span>
          <span class="link-text">SELECTED WORKS</span>
        </a>
        <a href="#instagram" data-num="02">
          <span class="link-meta">DAILY VISUAL FEED</span>
          <span class="link-text">INSTAGRAM</span>
        </a>
        <a href="#experience" data-num="03">
          <span class="link-meta">COLLEGE PRODUCTION &amp; MEDIA</span>
          <span class="link-text">CAMPUS EXPERIENCE</span>
        </a>
        <a href="#about" data-num="04">
          <span class="link-meta">PHILOSOPHY &amp; PROFILE</span>
          <span class="link-text">ABOUT ME</span>
        </a>
        <a href="#skills" data-num="06">
          <span class="link-meta">APPROACH &amp; PACING</span>
          <span class="link-text">HOW I CREATE</span>
        </a>
        <a href="#contact" data-num="07">
          <span class="link-meta">CONVERSATIONS &amp; PROJECTS</span>
          <span class="link-text">GET IN TOUCH</span>
        </a>
      </div>`;

const newMenuLinks = `<div class="menu-links">
        <a href="#about" data-num="01">
          <span class="link-meta">PHILOSOPHY &amp; PROFILE</span>
          <span class="link-text">ABOUT ME</span>
        </a>
        <a href="#showreel" data-num="02">
          <span class="link-meta">2026 SHOWREEL</span>
          <span class="link-text">FRAMES IN MOTION</span>
        </a>
        <a href="#disciplines" data-num="03">
          <span class="link-meta">DISCIPLINES &amp; CRAFT</span>
          <span class="link-text">WHAT I DO</span>
        </a>
        <a href="#work" data-num="04">
          <span class="link-meta">PHOTOGRAPHY ARCHIVE</span>
          <span class="link-text">SELECTED WORKS</span>
        </a>
        <a href="#reels" data-num="05">
          <span class="link-meta">MOTION ARCHIVE &amp; AFTERMOVIES</span>
          <span class="link-text">REELS &amp; AFTERMOVIES</span>
        </a>
        <a href="#instagram" data-num="06">
          <span class="link-meta">DAILY VISUAL FEED</span>
          <span class="link-text">INSTAGRAM</span>
        </a>
        <a href="#experience" data-num="07">
          <span class="link-meta">COLLEGE PRODUCTION &amp; MEDIA</span>
          <span class="link-text">CAMPUS EXPERIENCE</span>
        </a>
        <a href="#skills" data-num="08">
          <span class="link-meta">APPROACH &amp; PACING</span>
          <span class="link-text">HOW I CREATE</span>
        </a>
        <a href="#contact" data-num="09">
          <span class="link-meta">CONVERSATIONS &amp; PROJECTS</span>
          <span class="link-text">GET IN TOUCH</span>
        </a>
      </div>`;

// Update footer-nav
const oldFooterNav = `<div class="footer-nav mono">
        <a href="#work">SELECTED WORK</a>
        <a href="#instagram">LIVE INSTAGRAM (@IO.TANMAY)</a>
        <a href="#experience">CAMPUS EXPERIENCE</a>
        <a href="#about">ABOUT ME</a>
        <a href="#skills">HOW I CREATE</a>
        <a href="#contact">CONTACT</a>
      </div>`;

const newFooterNav = `<div class="footer-nav mono">
        <a href="#about">ABOUT ME</a>
        <a href="#showreel">SHOWREEL</a>
        <a href="#disciplines">WHAT I DO</a>
        <a href="#work">SELECTED WORK</a>
        <a href="#reels">REELS &amp; AFTERMOVIES</a>
        <a href="#instagram">LIVE INSTAGRAM (@IO.TANMAY)</a>
        <a href="#experience">CAMPUS EXPERIENCE</a>
        <a href="#skills">HOW I CREATE</a>
        <a href="#contact">CONTACT</a>
      </div>`;

// Replace menu and footer
function replaceExactOrNormalized(target, replacement) {
  const normHtml = html.replace(/\r\n/g, '\n');
  const normTarget = target.replace(/\r\n/g, '\n');
  const normReplacement = replacement.replace(/\r\n/g, '\n');
  if (normHtml.includes(normTarget)) {
    html = normHtml.replace(normTarget, normReplacement);
    return true;
  }
  return false;
}

if (!replaceExactOrNormalized(oldMenuLinks, newMenuLinks)) {
  console.error('Failed to replace oldMenuLinks');
}
if (!replaceExactOrNormalized(oldFooterNav, newFooterNav)) {
  console.error('Failed to replace oldFooterNav');
}

// Update section eyebrow numbers in order
// 01: About
html = html.replace('PHILOSOPHY &amp; PROFILE // 04', 'PHILOSOPHY &amp; PROFILE // 01');
// 02: Showreel
html = html.replace('SHOWREEL // 2026', 'SHOWREEL // 02');
// 03: Disciplines
html = html.replace('DISCIPLINES // CRAFT', 'DISCIPLINES // 03');
// 04: Selected Works
html = html.replace('A GROWING ARCHIVE // 01', 'A GROWING ARCHIVE // 04');
// 05: Motion Archive / Reels
html = html.replace('MOTION ARCHIVE // 02', 'MOTION ARCHIVE // 05');
// 07: Campus Production
html = html.replace('CAMPUS PRODUCTION // 03', 'CAMPUS PRODUCTION // 07');
// 08: How I Create
html = html.replace('HOW I CREATE // 06', 'HOW I CREATE // 08');
// 09: Contact
html = html.replace('CONTACT // 07', 'CONTACT // 09');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('index.html navigation and section numbers updated.');

// 2. Update styles.css with scroll-padding-top and scroll-margin-top
const cssPath = path.resolve('styles.css');
let css = fs.readFileSync(cssPath, 'utf8');

const scrollOffsetCss = `
/* Smooth Scroll Offset for Sticky Header */
html {
  scroll-behavior: smooth;
  scroll-padding-top: 90px;
}

section[id],
main > section {
  scroll-margin-top: 90px;
}

@media (max-width: 768px) {
  html {
    scroll-padding-top: 80px;
  }
  section[id],
  main > section {
    scroll-margin-top: 80px;
  }
}
`;

if (!css.includes('scroll-margin-top: 90px')) {
  css += scrollOffsetCss;
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('styles.css scroll offset added.');
}

// 3. Update script.js pageSections
const scriptPath = path.resolve('script.js');
let script = fs.readFileSync(scriptPath, 'utf8');

const oldPageSections = `  const pageSections = [
    { id: 'top', label: 'HOME', elem: document.getElementById('top') || document.body },
    { id: 'work', label: 'WORK', elem: document.getElementById('work') },
    { id: 'instagram', label: 'FEED', elem: document.getElementById('instagram') },
    { id: 'experience', label: 'CAMPUS', elem: document.getElementById('experience') },
    { id: 'about', label: 'ABOUT', elem: document.getElementById('about') },
    { id: 'showreel', label: 'REEL', elem: document.getElementById('showreel') },
    { id: 'skills', label: 'CRAFT', elem: document.getElementById('skills') },
    { id: 'contact', label: 'CONTACT', elem: document.getElementById('contact') }
  ];`;

const newPageSections = `  const pageSections = [
    { id: 'top', label: 'HOME', elem: document.getElementById('top') || document.body },
    { id: 'about', label: 'ABOUT', elem: document.getElementById('about') },
    { id: 'showreel', label: 'REEL', elem: document.getElementById('showreel') },
    { id: 'disciplines', label: 'CRAFT', elem: document.getElementById('disciplines') },
    { id: 'work', label: 'WORK', elem: document.getElementById('work') },
    { id: 'reels', label: 'REELS', elem: document.getElementById('reels') },
    { id: 'instagram', label: 'FEED', elem: document.getElementById('instagram') },
    { id: 'experience', label: 'CAMPUS', elem: document.getElementById('experience') },
    { id: 'skills', label: 'CREATE', elem: document.getElementById('skills') },
    { id: 'contact', label: 'CONTACT', elem: document.getElementById('contact') }
  ];`;

const normScript = script.replace(/\r\n/g, '\n');
const normOldPageSections = oldPageSections.replace(/\r\n/g, '\n');
const normNewPageSections = newPageSections.replace(/\r\n/g, '\n');

if (normScript.includes(normOldPageSections)) {
  script = normScript.replace(normOldPageSections, normNewPageSections);
  fs.writeFileSync(scriptPath, script, 'utf8');
  console.log('script.js pageSections updated.');
} else {
  console.error('Could not find oldPageSections in script.js');
}

