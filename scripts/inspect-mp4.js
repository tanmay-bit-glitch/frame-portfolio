const fs = require('fs');
const path = require('path');

function parseMp4(filePath) {
  const fd = fs.openSync(filePath, 'r');
  const stat = fs.fstatSync(fd);
  const buf = Buffer.alloc(Math.min(stat.size, 1024 * 1024)); // read first 1MB
  fs.readSync(fd, buf, 0, buf.length, 0);
  fs.closeSync(fd);

  let offset = 0;
  let durationSec = null;
  let width = null;
  let height = null;

  while (offset + 8 <= buf.length) {
    const size = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    if (size === 0) break;

    if (type === 'moov') {
      let subOffset = offset + 8;
      const moovEnd = offset + size;
      while (subOffset + 8 <= moovEnd && subOffset < buf.length) {
        const subSize = buf.readUInt32BE(subOffset);
        const subType = buf.toString('ascii', subOffset + 4, subOffset + 8);
        if (subSize === 0) break;

        if (subType === 'mvhd') {
          const version = buf.readUInt8(subOffset + 8);
          let timescale, duration;
          if (version === 1) {
            timescale = buf.readUInt32BE(subOffset + 8 + 16);
            duration = Number(buf.readBigUInt64BE(subOffset + 8 + 20));
          } else {
            timescale = buf.readUInt32BE(subOffset + 8 + 8);
            duration = buf.readUInt32BE(subOffset + 8 + 12);
          }
          durationSec = timescale ? +(duration / timescale).toFixed(2) : null;
        }

        if (subType === 'trak') {
          // Look for tkhd inside trak
          let trakSub = subOffset + 8;
          const trakEnd = subOffset + subSize;
          while (trakSub + 8 <= trakEnd && trakSub < buf.length) {
            const tkSize = buf.readUInt32BE(trakSub);
            const tkType = buf.toString('ascii', trakSub + 4, trakSub + 8);
            if (tkSize === 0) break;
            if (tkType === 'tkhd') {
              const version = buf.readUInt8(trakSub + 8);
              const wOffset = version === 1 ? trakSub + 8 + 32 + 48 : trakSub + 8 + 20 + 48;
              if (wOffset + 8 <= buf.length) {
                const w = buf.readUInt32BE(wOffset) / 65536;
                const h = buf.readUInt32BE(wOffset + 4) / 65536;
                if (w > 0 && h > 0 && (!width || w > width)) {
                  width = Math.round(w);
                  height = Math.round(h);
                }
              }
            }
            trakSub += tkSize;
          }
        }
        subOffset += subSize;
      }
      break;
    }
    offset += size;
  }

  return { sizeBytes: stat.size, sizeMB: +(stat.size / (1024 * 1024)).toFixed(1), durationSec, width, height };
}

const res = parseMp4(path.join(__dirname, '..', 'raw_photos', 'Sequence 04_2.mp4'));
console.log('Parsed MP4 info:', res);

