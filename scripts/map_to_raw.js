const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function mapToRaw() {
  const rawFiles = fs.readdirSync('raw_photos').filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png'));
  const rawThumbs = [];
  for (const rf of rawFiles) {
    const p = path.join('raw_photos', rf);
    try {
      const buf = await sharp(p).resize(8, 8, { fit: 'fill' }).greyscale().raw().toBuffer();
      rawThumbs.push({ name: rf, buf, size: fs.statSync(p).size });
    } catch (e) {
      // skip unreadable
    }
  }

  const reviewFiles = fs.readdirSync('curated_photos_review').filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg')).sort();

  for (const rf of reviewFiles) {
    const p = path.join('curated_photos_review', rf);
    const buf = await sharp(p).resize(8, 8, { fit: 'fill' }).greyscale().raw().toBuffer();
    const size = fs.statSync(p).size;

    let bestMatch = null;
    let minDiff = 999999;
    for (const raw of rawThumbs) {
      let diff = 0;
      for (let k = 0; k < 64; k++) diff += Math.abs(buf[k] - raw.buf[k]);
      if (diff < minDiff) {
        minDiff = diff;
        bestMatch = raw;
      }
    }
    console.log(`${rf} (${size}) ===> MATCH: [${bestMatch ? bestMatch.name : 'NONE'}] (diff: ${minDiff}, rawSize: ${bestMatch ? bestMatch.size : 0})`);
  }
}
mapToRaw().then(() => console.log('Done mapping!'));

