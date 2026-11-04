const fs = require('fs');
const path = require('path');

const reviewDir = path.join(__dirname, '../curated_photos_review');
const index = JSON.parse(fs.readFileSync(path.join(reviewDir, 'REVIEW_INDEX.json'), 'utf8'));

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FRAME // Curated Photos Review (30 Frames)</title>
  <style>
    :root {
      --bg: #090a0d;
      --card-bg: #12141a;
      --border: #232733;
      --accent: #e5a93c;
      --text: #e2e8f0;
      --text-muted: #8b949e;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 40px 24px;
      line-height: 1.5;
    }
    header {
      max-width: 1400px;
      margin: 0 auto 40px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 24px;
    }
    h1 {
      font-size: 28px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #fff;
    }
    p.lead {
      color: var(--text-muted);
      margin-top: 8px;
      font-size: 15px;
    }
    .grid {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 28px;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s, border-color 0.2s;
    }
    .card:hover {
      border-color: var(--accent);
      transform: translateY(-2px);
    }
    .img-wrap {
      width: 100%;
      height: 380px;
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .img-wrap img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    .info {
      padding: 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .badge-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .badge {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 3px 8px;
      border-radius: 4px;
      background: rgba(229, 169, 60, 0.15);
      color: var(--accent);
      font-weight: 600;
    }
    .num {
      color: var(--text-muted);
      font-size: 12px;
      font-family: monospace;
    }
    .title {
      font-size: 17px;
      font-weight: 600;
      color: #fff;
    }
    .file {
      font-family: monospace;
      font-size: 12px;
      color: #79c0ff;
      word-break: break-all;
    }
    .subject {
      font-size: 13px;
      color: var(--text-muted);
    }
    .orig {
      font-size: 11px;
      color: #6e7681;
      font-family: monospace;
      margin-top: auto;
      border-top: 1px solid #1a1e27;
      padding-top: 8px;
    }
  </style>
</head>
<body>
  <header>
    <h1>FRAME // Curated 30 Photos Review</h1>
    <p class="lead">All 30 shortlisted frames have been visually inspected and placed in <code>curated_photos_review/</code> with clean, descriptive filenames and authentic, attractive titles.</p>
  </header>
  <div class="grid">
    ${index.map(p => `
      <div class="card">
        <div class="img-wrap">
          <img src="${p.newName}" alt="${p.title}" loading="lazy" />
        </div>
        <div class="info">
          <div class="badge-row">
            <span class="badge">${p.category}</span>
            <span class="num">#${String(p.index).padStart(2, '0')} // ${p.orientation}</span>
          </div>
          <div class="title">${p.title}</div>
          <div class="file">📁 ${p.newName}</div>
          <div class="subject"><strong>Visual Subject:</strong> ${p.subject}</div>
          <div class="orig">Source: ${p.originalFile} (${p.sizeMb} MB)</div>
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(reviewDir, 'review_catalog.html'), html);
console.log('review_catalog.html generated in', reviewDir);

// Also copy to root reviewDir
const rootReviewDir = path.join(__dirname, '../../curated_photos_review');
if (fs.existsSync(rootReviewDir)) {
  fs.writeFileSync(path.join(rootReviewDir, 'review_catalog.html'), html);
}
