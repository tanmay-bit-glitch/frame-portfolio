const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { final30Definitions } = require('./curate_final_30_photos.js');

async function testAll() {
  console.log('Total items in final30Definitions:', final30Definitions.length);
  
  const thumbs = [];
  for (const item of final30Definitions) {
    const p = path.resolve(item.orig_src);
    if (!fs.existsSync(p)) {
      console.log('MISSING:', item.orig_src, 'at', p);
      continue;
    }
    const buf = await sharp(p).resize(16, 16, { fit: 'fill' }).greyscale().raw().toBuffer();
    thumbs.push({ num: item.num, title: item.title, orig: item.orig_src, buf });
  }

  for (let i = 0; i < thumbs.length; i++) {
    for (let j = i + 1; j < thumbs.length; j++) {
      let diff = 0;
      for (let k = 0; k < 256; k++) {
        diff += Math.abs(thumbs[i].buf[k] - thumbs[j].buf[k]);
      }
      const avgDiff = diff / 256;
      if (avgDiff < 30) {
        console.log(`POTENTIAL DUPLICATE: Frame ${thumbs[i].num} (${thumbs[i].orig}) vs Frame ${thumbs[j].num} (${thumbs[j].orig}) - avgDiff: ${avgDiff.toFixed(2)}`);
      }
    }
  }
  console.log('Check completed.');
}
testAll().catch(console.error);
