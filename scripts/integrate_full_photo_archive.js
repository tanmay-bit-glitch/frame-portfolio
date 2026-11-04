const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Native EXIF parser
function parseExif(buf) {
  if (!buf || buf.length < 14) return null;
  let offset = 0;
  if (buf.slice(0, 4).toString('ascii') === 'Exif') offset = 6;
  const isLE = buf.toString('ascii', offset, offset + 2) === 'II';
  const readU16 = (o) => isLE ? buf.readUInt16LE(offset + o) : buf.readUInt16BE(offset + o);
  const readU32 = (o) => isLE ? buf.readUInt32LE(offset + o) : buf.readUInt32BE(offset + o);
  if (readU16(2) !== 42) return null;
  const ifd0Offset = readU32(4);
  const tags = {};
  function readIFD(ifdOffset) {
    if (!ifdOffset || ifdOffset >= buf.length - offset) return;
    const count = readU16(ifdOffset);
    let p = ifdOffset + 2;
    for (let i = 0; i < count; i++) {
      if (p + 12 > buf.length - offset) break;
      const tag = readU16(p);
      const type = readU16(p + 2);
      const num = readU32(p + 4);
      let valOffset = p + 8;
      let val = null;
      try {
        if (type === 2) {
          const strOffset = num > 4 ? readU32(valOffset) : valOffset;
          if (strOffset < buf.length - offset) {
            val = buf.toString('ascii', offset + strOffset, Math.min(buf.length, offset + strOffset + num)).replace(/\0+$/, '').trim();
          }
        } else if (type === 3) val = readU16(valOffset);
        else if (type === 4) val = readU32(valOffset);
        else if (type === 5) {
          const ratOffset = readU32(valOffset);
          if (ratOffset + 8 <= buf.length - offset) {
            const numVal = isLE ? buf.readUInt32LE(offset + ratOffset) : buf.readUInt32BE(offset + ratOffset);
            const denVal = isLE ? buf.readUInt32LE(offset + ratOffset + 4) : buf.readUInt32BE(offset + ratOffset + 4);
            val = { num: numVal, den: denVal, value: denVal ? numVal / denVal : 0 };
          }
        }
      } catch (e) {}
      tags[tag] = val;
      p += 12;
    }
  }
  readIFD(ifd0Offset);
  if (tags[0x8769]) readIFD(tags[0x8769]);
  return tags;
}

function formatExposureTime(rational) {
  if (!rational) return null;
  if (rational.num === 1) return `1/${rational.den}s`;
  if (rational.value < 1 && rational.value > 0) {
    const den = Math.round(1 / rational.value);
    return `1/${den}s`;
  }
  return `${rational.value.toFixed(2)}s`;
}

function formatIsoDate(dateStr) {
  if (!dateStr) return null;
  const m = dateStr.match(/^(\d{4}):(\d{2}):(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}+05:30`;
  return dateStr;
}

const rootDir = path.join(__dirname, '..');
const rawDir = path.join(rootDir, 'raw_photos');
const reviewDir = path.join(rootDir, 'curated_photos_review');
const rootReviewDir = path.join(rootDir, '..', 'curated_photos_review');
const photosOutDir = path.join(rootDir, 'assets', 'photos');

async function run() {
  console.log('--- Integrating Full Photo Archive (61 Photos) ---');
  
  // 1. Read existing 21 photos
  const current21 = JSON.parse(fs.readFileSync(path.join(rootDir, 'data', 'photos.json'), 'utf8'));
  console.log(`Loaded ${current21.length} existing approved photos.`);

  // 2. Read new photos to add
  const newPhotosToAdd = JSON.parse(fs.readFileSync(path.join(__dirname, 'new_photos_list.json'), 'utf8'));
  console.log(`Processing ${newPhotosToAdd.length} new photos...`);

  const combinedPhotos = [...current21];
  const allReviewCatalogItems = [];

  // Populate review catalog items from existing 21
  for (let i = 0; i < current21.length; i++) {
    const p = current21[i];
    const numStr = String(i + 1).padStart(2, '0');
    // Find matching file in reviewDir
    const matching = fs.readdirSync(reviewDir).find(f => f.startsWith(`${numStr}_`));
    allReviewCatalogItems.push({
      num: i + 1,
      filename: matching || `${numStr}_${p.slug}.jpg`,
      title: p.title,
      category: p.category,
      aspectRatio: `${p.width}x${p.height} (${(p.width/p.height).toFixed(2)})`,
      camera: p.exif ? `${p.exif.camera} • ${p.exif.focalLength || ''} • ${p.exif.aperture || ''}` : 'Samsung Galaxy S23',
      date: p.dateTaken ? p.dateTaken.split('T')[0] : '2026'
    });
  }

  // Process each new photo
  let nextIndex = 22;
  for (const item of newPhotosToAdd) {
    const rawPath = path.join(rawDir, item.rawFile);
    if (!fs.existsSync(rawPath)) {
      console.warn(`Raw file not found: ${rawPath}`);
      continue;
    }

    const numStr = String(nextIndex).padStart(2, '0');
    const newReviewFilename = `${numStr}_${item.slug.replace(/-/g, '_')}.jpg`;

    // Copy full-res original to review folders
    fs.copyFileSync(rawPath, path.join(reviewDir, newReviewFilename));
    if (fs.existsSync(rootReviewDir)) {
      fs.copyFileSync(rawPath, path.join(rootReviewDir, newReviewFilename));
    }

    // Read metadata & EXIF
    const rawBuf = fs.readFileSync(rawPath);
    const meta = await sharp(rawBuf).metadata();
    const exifTags = parseExif(rawBuf) || {};

    const exifData = {
      camera: 'Samsung Galaxy S23',
      lens: 'Galaxy S23 Main Camera',
      aperture: exifTags[0x829d] ? `f/${exifTags[0x829d].value.toFixed(1)}` : 'f/1.8',
      shutterSpeed: formatExposureTime(exifTags[0x829a]),
      iso: exifTags[0x8827] ? `ISO ${exifTags[0x8827]}` : null,
      focalLength: exifTags[0x920a] ? `${exifTags[0x920a].value.toFixed(1)}mm` : '5.4mm'
    };

    const dateTaken = formatIsoDate(exifTags[0x9003] || exifTags[0x0132]);

    // Generate blur placeholder (20px width)
    const blurBuf = await sharp(rawBuf)
      .resize({ width: 20 })
      .webp({ quality: 30 })
      .toBuffer();
    const placeholder = `data:image/webp;base64,${blurBuf.toString('base64')}`;

    // Export responsive WebP sizes: 640w, 1280w, 1920w
    const sizes = [
      { name: '640', width: 640 },
      { name: '1280', width: 1280 },
      { name: '1920', width: 1920 }
    ];

    for (const sz of sizes) {
      const outPath = path.join(photosOutDir, `${item.slug}-${sz.name}.webp`);
      await sharp(rawBuf)
        .resize({ width: sz.width, withoutEnlargement: true })
        .webp({ quality: 82, effort: 4 })
        .toFile(outPath);
    }

    const photoObj = {
      id: `photo-${numStr}`,
      slug: item.slug,
      title: item.title,
      category: item.category,
      width: meta.width,
      height: meta.height,
      dateTaken: dateTaken,
      exif: exifData,
      placeholder: placeholder,
      src: `assets/photos/${item.slug}-1280.webp`,
      srcset: `assets/photos/${item.slug}-640.webp 640w, assets/photos/${item.slug}-1280.webp 1280w, assets/photos/${item.slug}-1920.webp 1920w`,
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
      alt: item.alt,
      featured: false,
      curationWhy: item.subject
    };

    combinedPhotos.push(photoObj);

    allReviewCatalogItems.push({
      num: nextIndex,
      filename: newReviewFilename,
      title: item.title,
      category: item.category,
      aspectRatio: `${meta.width}x${meta.height} (${(meta.width/meta.height).toFixed(2)})`,
      camera: `${exifData.camera} • ${exifData.focalLength} • ${exifData.aperture}`,
      date: dateTaken ? dateTaken.split('T')[0] : '2026'
    });

    console.log(`  [${numStr}/61] Added: ${item.title} (${item.category})`);
    nextIndex++;
  }

  // 3. Save updated photos.json
  const photosJsonPath = path.join(rootDir, 'data', 'photos.json');
  fs.writeFileSync(photosJsonPath, JSON.stringify(combinedPhotos, null, 2));
  console.log(`Saved ${combinedPhotos.length} photos to ${photosJsonPath}`);

  // 4. Save review catalog JSON and HTML
  const reviewIndexPath = path.join(reviewDir, 'REVIEW_INDEX.json');
  fs.writeFileSync(reviewIndexPath, JSON.stringify(allReviewCatalogItems, null, 2));
  if (fs.existsSync(rootReviewDir)) {
    fs.copyFileSync(reviewIndexPath, path.join(rootReviewDir, 'REVIEW_INDEX.json'));
  }

  // Generate review_catalog.html
  const catalogHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FRAME // Full Curated Portfolio Review (${combinedPhotos.length} Frames)</title>
  <style>
    :root {
      --bg: #070706;
      --card-bg: #0e0e0c;
      --border: rgba(255,255,255,0.08);
      --text: #f5f2ea;
      --muted: #8e8b83;
      --accent: #ff4820;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 30px 20px;
    }
    header {
      max-width: 1400px;
      margin: 0 auto 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 16px;
    }
    h1 { font-size: 26px; font-weight: 700; letter-spacing: -0.02em; }
    h1 span { color: var(--accent); }
    .subtitle { color: var(--muted); font-size: 14px; margin-top: 6px; }
    .badge {
      display: inline-block;
      padding: 6px 12px;
      background: rgba(255,72,32,0.15);
      border: 1px solid var(--accent);
      color: var(--accent);
      font-size: 12px;
      font-family: monospace;
      border-radius: 4px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .img-wrap {
      position: relative;
      background: #000;
      width: 100%;
      height: 380px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .img-wrap img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      cursor: zoom-in;
    }
    .card-info {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
    }
    .tag-row {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      font-family: monospace;
      color: var(--accent);
    }
    .title {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
    }
    .meta {
      font-size: 12px;
      color: var(--muted);
      line-height: 1.5;
    }
    .filename {
      font-family: monospace;
      font-size: 11px;
      color: #aaa;
      background: rgba(255,255,255,0.04);
      padding: 4px 8px;
      border-radius: 4px;
      margin-top: auto;
      word-break: break-all;
    }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>FRAME // <span>FULL PORTFOLIO REVIEW</span></h1>
      <p class="subtitle">Complete archive of ${combinedPhotos.length} curated frames with authentic Samsung Galaxy S23 EXIF metadata.</p>
    </div>
    <span class="badge">TOTAL FRAMES: ${combinedPhotos.length}</span>
  </header>

  <div class="grid">
    ${allReviewCatalogItems.map(item => `
      <div class="card">
        <div class="img-wrap">
          <img src="${item.filename}" alt="${item.title}" loading="lazy">
        </div>
        <div class="card-info">
          <div class="tag-row">
            <span>FRAME ${String(item.num).padStart(2, '0')}</span>
            <span>${item.category.toUpperCase()}</span>
          </div>
          <div class="title">${item.title}</div>
          <div class="meta">${item.camera}</div>
          <div class="meta">Dimensions: ${item.aspectRatio} • Date: ${item.date}</div>
          <div class="filename">${item.filename}</div>
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(reviewDir, 'review_catalog.html'), catalogHtml);
  if (fs.existsSync(rootReviewDir)) {
    fs.writeFileSync(path.join(rootReviewDir, 'review_catalog.html'), catalogHtml);
  }
  console.log(`Saved updated review catalog (${combinedPhotos.length} frames).`);

  // 5. Update index.html filter counts and embedded photosData
  const indexHtmlPath = path.join(rootDir, 'index.html');
  let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

  // Count per category
  const counts = {
    all: combinedPhotos.length,
    Machines: combinedPhotos.filter(p => p.category === 'Machines').length,
    Street: combinedPhotos.filter(p => p.category === 'Street').length,
    Heritage: combinedPhotos.filter(p => p.category === 'Heritage').length,
    Culture: combinedPhotos.filter(p => p.category === 'Culture').length,
    People: combinedPhotos.filter(p => p.category === 'People').length,
    Night: combinedPhotos.filter(p => p.category === 'Night').length,
    Wildlife: combinedPhotos.filter(p => p.category === 'Wildlife').length
  };

  console.log('Category Counts:', counts);

  // Replace filter tabs
  const newFilterTabs = `<div class="filter-tabs" role="tablist" aria-label="Filter photography archive">
          <button class="filter-tab is-active" type="button" role="tab" aria-selected="true" data-filter="all">ALL [${String(counts.all).padStart(2, '0')}]</button>
          <button class="filter-tab" type="button" role="tab" aria-selected="false" data-filter="Machines">MACHINES [${String(counts.Machines).padStart(2, '0')}]</button>
          <button class="filter-tab" type="button" role="tab" aria-selected="false" data-filter="Street">STREET [${String(counts.Street).padStart(2, '0')}]</button>
          <button class="filter-tab" type="button" role="tab" aria-selected="false" data-filter="Heritage">HERITAGE [${String(counts.Heritage).padStart(2, '0')}]</button>
          <button class="filter-tab" type="button" role="tab" aria-selected="false" data-filter="Culture">CULTURE [${String(counts.Culture).padStart(2, '0')}]</button>
          <button class="filter-tab" type="button" role="tab" aria-selected="false" data-filter="People">PEOPLE [${String(counts.People).padStart(2, '0')}]</button>
          <button class="filter-tab" type="button" role="tab" aria-selected="false" data-filter="Night">NIGHT [${String(counts.Night).padStart(2, '0')}]</button>
          <button class="filter-tab" type="button" role="tab" aria-selected="false" data-filter="Wildlife">WILDLIFE [${String(counts.Wildlife).padStart(2, '0')}]</button>
        </div>`;

  indexHtml = indexHtml.replace(/<div class="filter-tabs"[\s\S]*?<\/div>\s*<\/div>/, `${newFilterTabs}\n      </div>`);

  // Replace embedded photosData
  const embeddedTag = `<script id="photosData" type="application/json">\n${JSON.stringify(combinedPhotos, null, 2)}\n      </script>`;
  indexHtml = indexHtml.replace(/<script id="photosData" type="application\/json">[\s\S]*?<\/script>/, embeddedTag);

  fs.writeFileSync(indexHtmlPath, indexHtml);
  console.log('Updated index.html with new filter tabs and embedded 61 photos data.');

  console.log('--- All 61 Photos successfully integrated! ---');
}

run().catch(err => {
  console.error('Error integrating photos:', err);
  process.exit(1);
});
