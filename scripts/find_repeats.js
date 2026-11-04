const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = 'curated_photos_review';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg')).sort();

async function checkAll() {
  const thumbs = [];
  for (const f of files) {
    const p = path.join(dir, f);
    const buf = await sharp(p).resize(8, 8, { fit: 'fill' }).greyscale().raw().toBuffer();
    thumbs.push({ name: f, buf, size: fs.statSync(p).size });
  }

  for (let i = 0; i < thumbs.length; i++) {
    for (let j = i + 1; j < thumbs.length; j++) {
      let diff = 0;
      for (let k = 0; k < 64; k++) {
        diff += Math.abs(thumbs[i].buf[k] - thumbs[j].buf[k]);
      }
      if (diff < 50) {
        console.log(`REPEATED / NEAR-DUPLICATE: [${thumbs[i].name}] <===> [${thumbs[j].name}] (diff: ${diff})`);
      }
    }
  }
}
checkAll().then(() => console.log('Finished checking all pairs.'));
