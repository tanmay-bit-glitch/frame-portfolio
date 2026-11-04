const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

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

const curated21 = [
  {
    rawCandidates: ['20260406_183233 (1).jpg', '20260406_183233.jpg', '20260406_183233 (2).jpg'],
    newName: '01_mustang_shelby_gt500_cyberpunk.jpg',
    slug: 'shelby-gt500-cyberpunk',
    title: 'Neon Serpent // Shelby GT500',
    category: 'Machines',
    subject: 'Ford Mustang Shelby GT500 with cobra grille badge in purple cyberpunk wrap at car meet',
    alt: 'Ford Mustang Shelby GT500 with cobra emblem in purple cyberpunk geometric livery at car meet',
    featured: true,
    curationWhy: 'Iconic American muscle flagship with striking cyberpunk livery and commanding road presence.'
  },
  {
    rawCandidates: ['20260406_182413.jpg', '20260406_182413 (1).jpg', '20260406_182413 (2).jpg'],
    newName: '02_slammed_tuner_and_cafe_racer.jpg',
    slug: 'slammed-tuner-and-cafe-racer',
    title: 'Street Zillas // Tuner & Cafe Racer',
    category: 'Machines',
    subject: 'Slammed graffiti-wrapped coupe alongside custom cafe racer motorcycle with SEND NOODS plate',
    alt: 'Slammed graffiti-wrapped street coupe alongside custom cafe racer motorcycle with SEND NOODS plate',
    featured: true,
    curationWhy: 'Raw automotive subculture collision of stance tuning and bespoke cafe racer craftsmanship.'
  },
  {
    rawCandidates: ['20260621_100920(0).jpg', '20260621_100920(0) (1).jpg'],
    newName: '03_stunt_rider_rolling_endo.jpg',
    slug: 'stunt-rider-rolling-endo',
    title: 'Defying Gravity // Stoppie in Motion',
    category: 'Machines',
    subject: 'Stunt rider in neon yellow helmet performing a vertical rolling endo balanced on front wheel',
    alt: 'Stunt rider in neon helmet balancing on single front wheel in front of pavilion',
    featured: true,
    curationWhy: 'High-adrenaline athletic action capture of front-wheel stoppie balance.'
  },
  {
    rawCandidates: ['20261014_143051.jpg', '20261014_143051 (1).jpg'],
    newName: '04_aprilia_rs457_superbike.jpg',
    slug: 'aprilia-rs457-superbike',
    title: 'Factory Racing // Aprilia RS 457',
    category: 'Machines',
    subject: 'Aprilia RS 457 supersport motorcycle in matte racing livery with Brembo radial brakes',
    alt: 'Aprilia RS 457 supersport motorcycle in matte racing livery with Brembo radial brakes',
    featured: false,
    curationWhy: 'Crisp aggressive aerodynamics and factory race livery of modern Italian supersport engineering.'
  },
  {
    rawCandidates: ['20261014_123458.jpg', '20261014_123458 (1).jpg'],
    newName: '05_royal_enfield_cruiser_meet.jpg',
    slug: 'royal-enfield-cruiser-meet',
    title: 'The Twin Rumble // Shotgun 650 Meet',
    category: 'Machines',
    subject: 'Royal Enfield 650 custom cruiser alongside green Kawasaki Ninja and riders at bike meet',
    alt: 'Royal Enfield 650 custom cruiser alongside green Kawasaki Ninja at bike gathering',
    featured: false,
    curationWhy: 'Classic roadster character and biker community camaraderie in dappled afternoon light.'
  },
  {
    rawCandidates: ['20260529_231551.jpg', '20260529_231518.jpg'],
    newName: '06_pulsar_ns400z_midnight_beam.jpg',
    slug: 'pulsar-ns400z-midnight-beam',
    title: 'Bajaj Pulsar NS400Z // Midnight Beam',
    category: 'Machines',
    subject: 'Rider on Bajaj Pulsar NS400Z with twin projector LED headlights piercing dark street',
    alt: 'Rider on Bajaj Pulsar NS400Z with twin projector LED headlamps piercing dark street',
    featured: true,
    curationWhy: 'Nocturnal urban mood with twin projector headlights slicing through the Pune shadows.'
  },
  {
    rawCandidates: ['20260510_055252.jpg'],
    newName: '07_south_mumbai_victorian_heritage.jpg',
    slug: 'south-mumbai-victorian-heritage',
    title: 'Colonial Monoliths // Fort Heritage Corridor',
    category: 'Street',
    subject: 'Victorian Gothic heritage facades, Lawrence & Mayo building, and streetlamps in South Mumbai (Monochrome)',
    alt: 'Victorian Gothic heritage facades, Lawrence & Mayo building, South Mumbai in monochrome',
    featured: true,
    curationWhy: 'Timeless high-contrast architectural study of 19th-century colonial stone facades in Fort Mumbai.'
  },
  {
    rawCandidates: ['20260624_175504.jpg'],
    newName: '08_rail_lines_suspension_bridge.jpg',
    slug: 'rail-lines-suspension-bridge',
    title: 'Steel Arteries // Cable-Stayed Horizon',
    category: 'Street',
    subject: 'Railway yard train rakes converging toward massive cable-stayed suspension bridge under cumulus clouds',
    alt: 'Railway yard train rakes converging toward massive cable-stayed suspension bridge under clouds',
    featured: true,
    curationWhy: 'Powerful converging geometric lines of railway tracks anchoring a dramatic cloudscape.'
  },
  {
    rawCandidates: ['20260805_190030 (1).jpg', '20260805_190030.jpg'],
    newName: '09_night_flower_market_glow.jpg',
    slug: 'night-flower-market-glow',
    title: 'Midnight Bloom // The Florist Bazaar',
    category: 'Street',
    subject: 'Vibrant night floral shop with wrapped bouquets of roses, orchids, and sunflowers glowing under overhead bulbs',
    alt: 'Vibrant night flower market with wrapped bouquets of roses and orchids under warm bulbs',
    featured: false,
    curationWhy: 'Luminous burst of saturated floral color and warm hanging incandescent tungsten lighting.'
  },
  {
    rawCandidates: ['20260605_135445.jpg'],
    newName: '10_pune_chowk_summer_transit.jpg',
    slug: 'pune-chowk_summer-transit',
    title: 'Pulse of Pune // Midday Chowk',
    category: 'Street',
    subject: 'Bustling Pune city junction with two-wheelers, auto-rickshaws, saffron flag, and billowing summer clouds',
    alt: 'Bustling Pune intersection with two-wheelers, auto-rickshaws, saffron flag & summer clouds',
    featured: false,
    curationWhy: 'Kinetic snapshot of everyday Maharashtra street mobility beneath deep turquoise skies.'
  },
  {
    rawCandidates: ['20260728_172218.jpg'],
    newName: '11_urban_canyon_monsoon_sky.jpg',
    slug: 'urban-canyon-monsoon-sky',
    title: 'Skyward Breach // Urban Monsoon Sky',
    category: 'Street',
    subject: 'Looking up between city residential blocks toward sweeping monsoon storm cloud formation',
    alt: 'Looking up between apartment buildings toward towering monsoon storm clouds',
    featured: false,
    curationWhy: 'Monumental vertical cloud architecture slicing through residential building skylines.'
  },
  {
    rawCandidates: ['20260324_185407.jpg', '20260324_185407 (1).jpg'],
    newName: '12_ancient_hemadpanthi_temple_steps.jpg',
    slug: 'ancient-hemadpanthi-temple-steps',
    title: 'Echoes in Basalt // Hemadpanthi Sanctum Portal',
    category: 'Heritage',
    subject: 'Hand-carved 12th-century stone temple entrance steps, carved pillars, and sanctum doorway',
    alt: '12th-century Hemadpanthi basalt stone temple entrance steps and carved stone pillars',
    featured: true,
    curationWhy: 'Profound architectural reverence capturing centuries of chisel marks and black basalt masonry.'
  },
  {
    rawCandidates: ['20260324_185514 (1).jpg', '20260324_185514.jpg'],
    newName: '13_stone_temple_shikhara_facade.jpg',
    slug: 'stone-temple-shikhara-facade',
    title: 'Monument of Faith // Medieval Stone Sanctuary',
    category: 'Heritage',
    subject: 'Wide architectural perspective of stone temple tiered carvings and ornate pillars',
    alt: 'Wide architectural perspective of medieval stone temple sanctum and tiered carvings',
    featured: false,
    curationWhy: 'Symmetrical grandeur of medieval stone masonry standing silent against the sky.'
  },
  {
    rawCandidates: ['20260916_201426.jpg'],
    newName: '14_dagdusheth_ganpati_darbar.jpg',
    slug: 'dagdusheth-ganpati-darbar',
    title: 'Golden Darbar // Shreemant Dagdusheth Celebration',
    category: 'Culture',
    subject: 'Magnificent golden Ganeshotsav pandal with Lord Ganesha idol and gathered devotees in prayer',
    alt: 'Golden Ganeshotsav darbar with Lord Ganesha idol and devotees in evening prayer',
    featured: true,
    curationWhy: 'Rich cultural devotion capturing Pune’s most celebrated festival in golden majesty.'
  },
  {
    rawCandidates: ['20260629_125939.jpg'],
    newName: '15_father_daughter_candid_smile.jpg',
    slug: 'father-daughter-candid-smile',
    title: 'Pure Radiance // Father & Daughter',
    category: 'People',
    subject: 'Father carrying his smiling young daughter piggyback against ornate white latticework window',
    alt: 'Father carrying his smiling young daughter piggyback against white carved lattice window',
    featured: true,
    curationWhy: 'Heartwarming genuine human emotion, unstaged intimacy, and infectious laughter.'
  },
  {
    rawCandidates: ['20260214_101223.jpg'],
    newName: '16_elder_in_gandhi_topi_monochrome.jpg',
    slug: 'elder-in-gandhi-topi-monochrome',
    title: 'The Silent Patriarch // Old Pune Ghats',
    category: 'People',
    subject: 'Elderly man in white Gandhi topi seated in thought beside stone temple pillars in monochrome',
    alt: 'Elderly man in white Gandhi topi seated in quiet contemplation beside stone temple pillars in monochrome',
    featured: true,
    curationWhy: 'Deep environmental character portrait with expressive dignity and temple shadows.'
  },
  {
    rawCandidates: ['20260412_214957 (2).jpg', '20260412_214957.jpg'],
    newName: '17_rock_guitarist_stage_spotlight.jpg',
    slug: 'rock-guitarist-stage-spotlight',
    title: 'Riff Under Spotlight // Live Stage Energy',
    category: 'Night',
    subject: 'Rock guitarist performing solo bathed in stark diagonal white stage spotlight beam',
    alt: 'Rock guitarist performing live bathed in sharp diagonal white stage spotlight beam',
    featured: true,
    curationWhy: 'Pure live concert electrical charge with sharp diagonal spotlight cutting the black void.'
  },
  {
    rawCandidates: ['20260927_043405.jpg', '20260927_043405 (1).jpg'],
    newName: '18_stargazer_30s_night_sky.jpg',
    slug: 'stargazer-30s-night-sky',
    title: 'Infinite Canvas // 30-Second Star Trail Gaze',
    category: 'Night',
    subject: 'Illuminated figure looking up at pinpoint stars in pitch black night sky (30s exposure)',
    alt: 'Illuminated figure looking up at pinpoint stars in night sky (30s astrophotography)',
    featured: false,
    curationWhy: 'Authentic 30-second astrophotography long exposure capturing human wonder under the cosmos.'
  },
  {
    rawCandidates: ['20260306_190702.jpg'],
    newName: '19_city_overlook_sunset_silhouette.jpg',
    slug: 'city-overlook-sunset-silhouette',
    title: 'Twilight Horizon // Overlook Above the City',
    category: 'Night',
    subject: 'Silhouette of young woman at dusk overlook above twinkling Pune city lights and amber horizon',
    alt: 'Silhouette of young woman at dusk overlook above twinkling Pune city skyline',
    featured: false,
    curationWhy: 'Evocative twilight gradient transitioning into the nocturnal rhythm of the city.'
  },
  {
    rawCandidates: ['IMG_20260829_165902633.jpg', 'IMG_20260829_165902633 (2).jpg'],
    newName: '20_indian_leopard_through_wire.jpg',
    slug: 'indian-leopard-through-wire',
    title: 'Gaze Through the Mesh // Indian Leopard',
    category: 'Wildlife',
    subject: 'Alert Indian leopard framed through chain-link wire fence against lush green foliage',
    alt: 'Alert Indian leopard framed through chain-link wire fence against lush green foliage',
    featured: true,
    curationWhy: 'Intense predator eye contact framed through geometric wire mesh in lush sanctuary greenery.'
  },
  {
    rawCandidates: ['20260218_180805 (3).jpg', '20260218_180805.jpg'],
    newName: '21_birds_silk_cotton_sunset.jpg',
    slug: 'birds-silk-cotton-sunset',
    title: 'Dusk Duet // Silk-Cotton Crimson Sunset',
    category: 'Wildlife',
    subject: 'Two birds perched side by side on flowering red silk-cotton tree branch against setting red sun',
    alt: 'Two birds perched side by side on flowering red silk-cotton tree branch against setting red sun',
    featured: false,
    curationWhy: 'Poetic natural harmony of paired birds framed against blooming crimson petals and sunset.'
  }
];

function findSource(candidates) {
  const searchDirs = [
    rawDir,
    path.join(rootDir, 'rejects/duplicates'),
    path.join(rootDir, 'rejects/quality'),
    path.join(rootDir, 'assets/drive_photos')
  ];
  for (const c of candidates) {
    for (const d of searchDirs) {
      const p = path.join(d, c);
      if (fs.existsSync(p)) return p;
    }
  }
  return null;
}

async function rebuild() {
  console.log(`Rebuilding curated set with ${curated21.length} verified photos...`);

  // 1. Clean reviewDir
  if (fs.existsSync(reviewDir)) {
    fs.readdirSync(reviewDir).forEach(f => {
      try { fs.unlinkSync(path.join(reviewDir, f)); } catch(e){}
    });
  } else {
    fs.mkdirSync(reviewDir, { recursive: true });
  }

  if (fs.existsSync(rootReviewDir)) {
    fs.readdirSync(rootReviewDir).forEach(f => {
      try { fs.unlinkSync(path.join(rootReviewDir, f)); } catch(e){}
    });
  } else {
    fs.mkdirSync(rootReviewDir, { recursive: true });
  }

  const reviewReport = [];
  const photosJson = [];

  for (let i = 0; i < curated21.length; i++) {
    const item = curated21[i];
    const src = findSource(item.rawCandidates);
    if (!src) {
      throw new Error(`Could not find source for ${item.newName}`);
    }

    // Copy to reviewDir
    const dest = path.join(reviewDir, item.newName);
    fs.copyFileSync(src, dest);
    // Mirror to rootReviewDir
    fs.copyFileSync(src, path.join(rootReviewDir, item.newName));

    const stat = fs.statSync(dest);
    const sizeMb = (stat.size / 1024 / 1024).toFixed(2);
    const origName = path.basename(src);

    const image = sharp(src);
    const meta = await image.metadata();
    const origWidth = meta.width;
    const origHeight = meta.height;
    const isPortrait = origHeight >= origWidth;
    const orientation = isPortrait ? 'portrait' : 'landscape';

    const tags = meta.exif ? parseExif(meta.exif) : {};
    const make = tags && tags[0x010F] ? tags[0x010F] : 'Samsung';
    const model = tags && tags[0x0110] ? tags[0x0110] : 'Galaxy S23';
    const lens = tags && tags[0xA434] ? tags[0xA434] : 'Samsung Galaxy S23 Camera';
    const rawDate = tags && (tags[0x9003] || tags[0x0132]) ? (tags[0x9003] || tags[0x0132]) : null;
    const dateTaken = formatIsoDate(rawDate);
    const exposureTime = tags && tags[0x829A] ? formatExposureTime(tags[0x829A]) : null;
    const aperture = tags && tags[0x829D] ? `f/${tags[0x829D].value.toFixed(1)}` : null;
    const iso = tags && tags[0x8827] ? tags[0x8827] : null;
    const focalLength = tags && tags[0x920A] ? `${tags[0x920A].value.toFixed(1)}mm` : null;
    const focalLength35mm = tags && tags[0xA405] ? `${tags[0xA405]}mm` : null;

    // Generate 20px blurred WebP placeholder as base64 data URI
    const placeholderBuf = await sharp(src)
      .resize(20, 20, { fit: 'inside' })
      .webp({ quality: 35 })
      .toBuffer();
    const placeholderUri = `data:image/webp;base64,${placeholderBuf.toString('base64')}`;

    // Export 3 sizes: 640, 1280, 1920 (longer edge)
    const sizes = [640, 1280, 1920];
    const srcset = {};

    for (const size of sizes) {
      let targetW, targetH;
      if (isPortrait) {
        targetH = Math.min(size, origHeight);
        targetW = Math.round(targetH * (origWidth / origHeight));
      } else {
        targetW = Math.min(size, origWidth);
        targetH = Math.round(targetW * (origHeight / origWidth));
      }

      const outFilename = `${item.slug}-${size}.webp`;
      const outFilePath = path.join(photosOutDir, outFilename);

      await sharp(src)
        .resize(targetW, targetH, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 84, effort: 4 })
        .toFile(outFilePath);

      srcset[size.toString()] = `assets/photos/${outFilename}`;
    }

    const id = `photo-${String(i + 1).padStart(2, '0')}`;
    const photoObj = {
      id,
      slug: item.slug,
      title: item.title,
      category: item.category,
      orientation,
      width: origWidth,
      height: origHeight,
      aspectRatio: +(origWidth / origHeight).toFixed(3),
      dateTaken,
      exif: {
        camera: `${make} ${model}`.trim(),
        make,
        model,
        lens,
        aperture,
        shutter: exposureTime,
        iso,
        focalLength,
        focalLength35mmEquiv: focalLength35mm
      },
      placeholder: placeholderUri,
      src: srcset['1280'],
      srcset: `${srcset['640']} 640w, ${srcset['1280']} 1280w, ${srcset['1920']} 1920w`,
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
      alt: item.alt,
      featured: item.featured,
      curationWhy: item.curationWhy
    };

    photosJson.push(photoObj);

    reviewReport.push({
      index: i + 1,
      newName: item.newName,
      originalFile: origName,
      category: item.category,
      title: item.title,
      subject: item.subject,
      orientation,
      sizeMb
    });

    console.log(`[${i + 1}/${curated21.length}] Processed ${item.newName} (${sizeMb} MB) -> ${item.slug}`);
  }

  // Write /data/photos.json
  const photosJsonPath = path.join(rootDir, 'data', 'photos.json');
  fs.writeFileSync(photosJsonPath, JSON.stringify(photosJson, null, 2));
  console.log(`Wrote ${photosJson.length} entries to ${photosJsonPath}`);

  // Write REVIEW_INDEX.json
  const reviewIndexPath = path.join(reviewDir, 'REVIEW_INDEX.json');
  fs.writeFileSync(reviewIndexPath, JSON.stringify(reviewReport, null, 2));
  fs.writeFileSync(path.join(rootReviewDir, 'REVIEW_INDEX.json'), JSON.stringify(reviewReport, null, 2));

  // Generate review_catalog.html
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FRAME // Approved Curated Photos Review (21 Frames)</title>
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
    <h1>FRAME // Confirmed Curated 21 Frames</h1>
    <p class="lead">All 21 approved frames with corrected titles (including Bajaj Pulsar NS400Z). In <code>curated_photos_review/</code>.</p>
  </header>
  <div class="grid">
    ${reviewReport.map(p => `
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
  fs.writeFileSync(path.join(rootReviewDir, 'review_catalog.html'), html);
  console.log('review_catalog.html updated.');
}

rebuild().catch(err => {
  console.error(err);
  process.exit(1);
});
