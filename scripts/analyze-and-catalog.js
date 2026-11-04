const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

function parseExif(buf) {
  if (!buf || buf.length < 14) return null;
  let offset = 0;
  if (buf.slice(0, 4).toString('ascii') === 'Exif') {
    offset = 6;
  }
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
        if (type === 2) { // ASCII
          const strOffset = num > 4 ? readU32(valOffset) : valOffset;
          if (strOffset < buf.length - offset) {
            val = buf.toString('ascii', offset + strOffset, Math.min(buf.length, offset + strOffset + num)).replace(/\0+$/, '').trim();
          }
        } else if (type === 3) { // SHORT
          val = readU16(valOffset);
        } else if (type === 4) { // LONG
          val = readU32(valOffset);
        } else if (type === 5) { // RATIONAL
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
  if (tags[0x8825]) readIFD(tags[0x8825]);
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

// Compute 8x8 difference hash (dHash) for fast visual similarity
async function computeDHash(image) {
  const { data } = await image
    .clone()
    .greyscale()
    .resize(9, 8, { fit: 'fill' })
    .raw()
    .toBuffer({ resolveWithObject: true });
  
  let hash = '';
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const left = data[row * 9 + col];
      const right = data[row * 9 + col + 1];
      hash += left > right ? '1' : '0';
    }
  }
  return hash;
}

// Compute Laplacian sharpness variance
async function computeSharpness(image) {
  const laplacian = {
    width: 3,
    height: 3,
    kernel: [0, 1, 0, 1, -4, 1, 0, 1, 0]
  };
  const { data } = await image
    .clone()
    .resize(600, null, { withoutEnlargement: true })
    .greyscale()
    .convolve(laplacian)
    .raw()
    .toBuffer({ resolveWithObject: true });
  
  let sum = 0;
  for (let i = 0; i < data.length; i++) sum += data[i];
  const mean = sum / data.length;
  let variance = 0;
  for (let i = 0; i < data.length; i++) {
    const diff = data[i] - mean;
    variance += diff * diff;
  }
  return Math.round(variance / data.length);
}

async function main() {
  const rawDir = path.join(__dirname, '..', 'raw_photos');
  const thumbDir = path.join(__dirname, '..', 'curation', 'thumbnails');
  const files = fs.readdirSync(rawDir);
  console.log(`Starting analysis of ${files.length} images...`);

  const list = [];
  let processed = 0;

  for (const filename of files) {
    const fullPath = path.join(rawDir, filename);
    const stat = fs.statSync(fullPath);

    if (stat.size === 0) {
      list.push({
        filename,
        size: 0,
        valid: false,
        rejectReason: '0-byte file'
      });
      continue;
    }

    try {
      const img = sharp(fullPath);
      const meta = await img.metadata();
      const tags = meta.exif ? parseExif(meta.exif) : {};

      const width = meta.width;
      const height = meta.height;
      const orientation = height >= width ? 'portrait' : 'landscape';

      // Thumbnail
      const thumbName = `${filename.replace(/[^a-zA-Z0-9_-]/g, '_')}.webp`;
      const thumbPath = path.join(thumbDir, thumbName);
      await img
        .clone()
        .resize(360, 360, { fit: 'inside' })
        .webp({ quality: 75 })
        .toFile(thumbPath);

      // Visual hash and sharpness
      const dhash = await computeDHash(img);
      const sharpness = await computeSharpness(img);

      // Grayscale stats
      const stats = await img.clone().stats();
      const meanLum = stats.channels ? Math.round(stats.channels.reduce((acc, c) => acc + c.mean, 0) / stats.channels.length) : null;

      const dateOriginal = tags && (tags[0x9003] || tags[0x0132]) ? (tags[0x9003] || tags[0x0132]) : null;
      const make = tags && tags[0x010F] ? tags[0x010F] : null;
      const model = tags && tags[0x0110] ? tags[0x0110] : null;
      const lensModel = tags && tags[0xA434] ? tags[0xA434] : null;
      const exposureTime = tags && tags[0x829A] ? formatExposureTime(tags[0x829A]) : null;
      const aperture = tags && tags[0x829D] ? `f/${tags[0x829D].value.toFixed(1)}` : null;
      const iso = tags && tags[0x8827] ? tags[0x8827] : null;
      const focalLength = tags && tags[0x920A] ? `${tags[0x920A].value.toFixed(1)}mm` : null;
      const focalLength35mm = tags && tags[0xA405] ? `${tags[0xA405]}mm` : null;

      list.push({
        filename,
        size: stat.size,
        format: meta.format,
        width,
        height,
        orientation,
        aspectRatio: +(width / height).toFixed(3),
        dateOriginal,
        dhash,
        sharpness,
        meanLum,
        thumbRel: `thumbnails/${thumbName}`,
        exif: {
          make,
          model,
          lensModel,
          exposureTime,
          aperture,
          iso,
          focalLength,
          focalLength35mm
        },
        valid: true
      });
    } catch (err) {
      list.push({
        filename,
        size: stat.size,
        valid: false,
        error: err.message,
        rejectReason: 'corrupt or unreadable image'
      });
    }

    processed++;
    if (processed % 25 === 0 || processed === files.length) {
      console.log(`Processed ${processed}/${files.length} images...`);
    }
  }

  const outAnalysis = path.join(__dirname, '..', 'curation', 'analysis.json');
  fs.writeFileSync(outAnalysis, JSON.stringify(list, null, 2), 'utf8');
  console.log(`Saved analysis to ${outAnalysis}`);

  // Generate HTML Catalog
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>FRAME Photo Curation Catalog (249 Images)</title>
<style>
body { background: #0a0a0c; color: #e2e2e8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; }
h1 { font-size: 24px; margin-bottom: 8px; }
p.sub { color: #8e8e9c; margin-bottom: 24px; font-size: 14px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.card { background: #141418; border: 1px solid #22222a; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column; }
.card img { width: 100%; height: 220px; object-fit: contain; background: #050507; }
.info { padding: 12px; font-size: 12px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.fname { font-weight: 600; font-size: 13px; color: #fff; word-break: break-all; margin-bottom: 6px; }
.meta-row { color: #9c9ca8; margin-bottom: 4px; }
.badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 11px; margin-top: 6px; }
.badge-valid { background: #133423; color: #4ade80; }
.badge-invalid { background: #3c1616; color: #f87171; }
.scores { margin-top: 6px; font-family: monospace; font-size: 11px; color: #60a5fa; }
</style>
</head>
<body>
<h1>FRAME Photo Curation Visual Catalog</h1>
<p class="sub">Total files: ${files.length} | Generated: ${new Date().toISOString()}</p>
<div class="grid">
`;

  for (const item of list) {
    if (!item.valid) {
      html += `
  <div class="card">
    <div style="height:220px;display:flex;align-items:center;justify-content:center;background:#2a1010;color:#f87171;">INVALID / CORRUPT</div>
    <div class="info">
      <div class="fname">${item.filename}</div>
      <div class="meta-row">Size: ${item.size} bytes</div>
      <span class="badge badge-invalid">${item.rejectReason}</span>
    </div>
  </div>`;
      continue;
    }

    const exifStr = item.exif ? [
      item.exif.model,
      item.exif.focalLength,
      item.exif.aperture,
      item.exif.exposureTime,
      item.exif.iso ? `ISO ${item.exif.iso}` : ''
    ].filter(Boolean).join(' • ') : 'No EXIF';

    html += `
  <div class="card" id="card-${item.filename.replace(/[^a-zA-Z0-9_-]/g, '_')}">
    <img src="${item.thumbRel}" alt="${item.filename}" loading="lazy">
    <div class="info">
      <div class="fname">${item.filename}</div>
      <div class="meta-row">${item.width}×${item.height} (${item.orientation}) • ${(item.size/1024).toFixed(0)} KB</div>
      <div class="meta-row">${item.dateOriginal || 'No date'}</div>
      <div class="meta-row">${exifStr}</div>
      <div class="scores">Sharpness: ${item.sharpness} | Lum: ${item.meanLum}</div>
      <span class="badge badge-valid">VALID</span>
    </div>
  </div>`;
  }

  html += `
</div>
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, '..', 'curation', 'catalog.html'), html, 'utf8');
  console.log('Saved catalog.html');
}

main().catch(console.error);
