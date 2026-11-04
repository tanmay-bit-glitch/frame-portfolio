const fs = require('fs');
const path = require('path');

const cssPath = path.resolve('styles.css');
let css = fs.readFileSync(cssPath, 'utf8');

const targetStr = `/* ==========================================================================
   ABOUT / DIRECTOR'S PHILOSOPHY SECTION
   ========================================================================== */
.about-grid {
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  gap: 50px;
  align-items: center;
}

.about-body {
  margin: 32px 0 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: var(--text-muted);
  font-size: clamp(16px, 1.35vw, 18px);
  line-height: 1.75;
}

.lead-paragraph {
  color: var(--text);
  font-size: clamp(18px, 1.6vw, 22px);
  font-weight: 500;
  line-height: 1.6;
}

/* Accolades & Laurels */
.accolades-shelf {
  border-top: 1px solid var(--border);
  padding-top: 24px;
}

.shelf-label {
  color: var(--accent);
  font-size: 10px;
  letter-spacing: 0.15em;
  display: block;
  margin-bottom: 16px;
}

.laurels-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.laurel-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 18px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  transition: border-color var(--dur-fast), transform var(--dur-fast);
}

.laurel-item:hover {
  border-color: var(--border-hover);
  transform: translateX(6px);
}

.laurel-branch {
  font-size: 24px;
  color: var(--amber);
  opacity: 0.75;
}

.laurel-text strong {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.1em;
  color: var(--text);
}

.laurel-text span {
  font-size: 12px;
  color: var(--text-muted);
}

/* Portrait Card with Film Sprockets */
.about-portrait-card {
  position: relative;
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  align-self: center;
}`;

const replacementStr = `/* ==========================================================================
   ABOUT / DIRECTOR'S PHILOSOPHY SECTION (COMPACT AT TOP)
   ========================================================================== */
.about.section-pad {
  padding-top: clamp(40px, 4.5vw, 64px);
  padding-bottom: clamp(40px, 4.5vw, 64px);
  position: relative;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.about-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: clamp(32px, 4vw, 56px);
  align-items: center;
}

.about-body {
  margin: 18px 0 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: var(--text-muted);
  font-size: clamp(15px, 1.2vw, 17px);
  line-height: 1.68;
}

.lead-paragraph {
  color: var(--text);
  font-size: clamp(16px, 1.35vw, 19px);
  font-weight: 500;
  line-height: 1.58;
}

.about-setup-line {
  color: var(--accent);
  font-size: 12.5px;
  letter-spacing: 0.06em;
  margin-top: 2px;
}

/* Accolades & Laurels / Compact Role Chips */
.about-roles-shelf,
.accolades-shelf {
  border-top: 1px solid var(--border);
  padding-top: 16px;
  margin-bottom: 20px;
}

.shelf-label {
  color: var(--accent);
  font-size: 10px;
  letter-spacing: 0.15em;
  display: block;
  margin-bottom: 10px;
}

.role-chips-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 10px;
  align-items: center;
}

.role-chip {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--text);
  background: var(--bg-surface);
  border: 1px solid var(--border);
  padding: 6px 12px;
  border-radius: 4px;
  transition: border-color var(--dur-fast), transform var(--dur-fast), background var(--dur-fast);
}

.role-chip:hover {
  border-color: var(--accent);
  color: #fff;
  transform: translateY(-1px);
  background: rgba(224, 93, 44, 0.1);
}

/* Action Buttons Under Text */
.about-actions-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-top: 6px;
}

.about-actions-row .about-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  padding: 10px 18px;
}

/* Portrait Card with Film Sprockets */
.about-portrait-card {
  position: relative;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  align-self: center;
}`;

// Normalize line breaks for matching
const normalize = str => str.replace(/\r\n/g, '\n');
const normalizedCss = normalize(css);
const normalizedTarget = normalize(targetStr);

if (!normalizedCss.includes(normalizedTarget)) {
  console.error('Target not found in normalized CSS');
  process.exit(1);
}

const updatedNormalized = normalizedCss.replace(normalizedTarget, normalize(replacementStr));

// Also let's ensure responsive rule stacks portrait on top on mobile
const mobileRuleTarget = normalize(`.about-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .about-portrait-card {
    max-width: 320px;
  }`);

const mobileRuleReplacement = normalize(`.about-grid {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
  .about-portrait-card {
    order: -1; /* Portrait on top on mobile */
    max-width: 270px;
    margin: 0 auto;
  }`);

let finalCss = updatedNormalized;
if (finalCss.includes(mobileRuleTarget)) {
  finalCss = finalCss.replace(mobileRuleTarget, mobileRuleReplacement);
  console.log('Mobile portrait-on-top rule successfully updated');
} else {
  console.log('mobileRuleTarget not found directly, appending dedicated media query');
  finalCss += `\n\n@media (max-width: 900px) {\n  .about-grid {\n    display: flex !important;\n    flex-direction: column !important;\n    gap: 28px !important;\n  }\n  .about-portrait-card {\n    order: -1 !important;\n    max-width: 270px !important;\n    margin: 0 auto !important;\n  }\n}\n`;
}

// Convert back to CRLF if file was CRLF
if (css.includes('\r\n')) {
  finalCss = finalCss.replace(/\n/g, '\r\n');
}

fs.writeFileSync(cssPath, finalCss, 'utf8');
console.log('Step 2: styles.css successfully updated');
