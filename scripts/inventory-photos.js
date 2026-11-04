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
      } catch (e) {
        // ignore tag parse error
      }
      tags[tag] = val;
      p += 12;
    }
  }
  
  readIFD(ifd0Offset);
  if (tags[0x8769]) {
    readIFD(tags[0x8769]);
  }
  if (tags[0x8825]) { // GPS IFD
    readIFD(tags[0x8825]);
  }
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

async function inventory() {
  const rawDir = path.join(__dirname, '..', 'raw_photos');
  const files = fs.readdirSync(rawDir);
  console.log(`Found ${files.length} items in raw_photos`);
  
  const results = [];
  
  for (const filename of files) {
    const fullPath = path.join(rawDir, filename);
    const stat = fs.statSync(fullPath);
    
    if (stat.size === 0) {
      results.push({
        filename,
        size: 0,
        valid: false,
        rejectReason: '0-byte file'
      });
      continue;
    }
    
    try {
      const image = sharp(fullPath);
      const meta = await image.metadata();
      const tags = meta.exif ? parseExif(meta.exif) : {};
      
      const width = meta.width;
      const height = meta.height;
      const isPortrait = height >= width;
      
      const make = tags && tags[0x010F] ? tags[0x010F] : null;
      const model = tags && tags[0x0110] ? tags[0x0110] : null;
      const dateOriginal = tags && tags[0x9003] ? tags[0x9003] : (tags && tags[0x0132] ? tags[0x0132] : null);
      const exposureTime = tags && tags[0x829A] ? formatExposureTime(tags[0x829A]) : null;
      const aperture = tags && tags[0x829D] ? `f/${tags[0x829D].value.toFixed(1)}` : null;
      const iso = tags && tags[0x8827] ? tags[0x8827] : null;
      const focalLength = tags && tags[0x920A] ? `${tags[0x920A].value.toFixed(1)}mm` : null;
      const focalLength35mm = tags && tags[0xA405] ? `${tags[0xA405]}mm` : null;
      const lensModel = tags && tags[0xA434] ? tags[0xA434] : null;
      const hasGps = tags && (tags[1] !== undefined || tags[2] !== undefined);
      
      results.push({
        filename,
        size: stat.size,
        format: meta.format,
        width,
        height,
        orientation: isPortrait ? 'portrait' : 'landscape',
        aspectRatio: +(width / height).toFixed(3),
        dateOriginal,
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
        hasGps,
        valid: true
      });
    } catch (err) {
      results.push({
        filename,
        size: stat.size,
        valid: false,
        error: err.message,
        rejectReason: 'corrupt or unreadable image'
      });
    }
  }
  
  const outPath = path.join(__dirname, '..', 'curation', 'inventory.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`Saved inventory of ${results.length} files to ${outPath}`);
}

inventory().catch(console.error);
