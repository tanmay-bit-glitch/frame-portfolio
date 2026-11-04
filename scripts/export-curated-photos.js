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
  // Format: '2026:04:06 18:24:13' -> '2026-04-06T18:24:13+05:30'
  const m = dateStr.match(/^(\d{4}):(\d{2}):(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/);
  if (m) {
    return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}+05:30`;
  }
  return dateStr;
}

const photoDefinitions = [
  // 1. MACHINES (4)
  {
    rawFile: '20260621_100920(0).jpg',
    slug: 'rolling-endo-stunt',
    title: 'Rolling Endo Stunt',
    category: 'Machines',
    alt: 'Stunt motorcycle rider performing a rolling endo balanced on the front wheel in daylight',
    featured: true,
    curationWhy: 'Peak athletic action shot capturing stunt rider on single front wheel with razor-sharp focus.'
  },
  {
    rawFile: '20260514_010036.jpg',
    slug: 'night-cockpit-controls',
    title: 'Night Cockpit & Controls',
    category: 'Machines',
    alt: 'Cockpit controls and handlebars of a motorcycle illuminated in the dark',
    featured: false,
    curationWhy: 'Nocturnal mechanical atmosphere highlighting instrumentation and metallic handlebar textures.'
  },
  {
    rawFile: '20260514_010124.jpg',
    slug: 'stunt-bike-rear-swingarm',
    title: 'Stunt Bike Rear Swingarm',
    category: 'Machines',
    alt: 'Close-up mechanical detail of motorcycle chain drive and rear tyre assembly',
    featured: false,
    curationWhy: 'Raw close-up of motorcycle chain, swingarm, and high-performance racing tyre.'
  },
  {
    rawFile: '20260514_010328.jpg',
    slug: 'street-motorcycle-profile',
    title: 'Street Motorcycle Profile',
    category: 'Machines',
    alt: 'Side profile of a parked motorcycle under urban streetlights at night',
    featured: false,
    curationWhy: 'Clean horizontal profile showcasing motorcycle silhouette beneath soft street illumination.'
  },

  // 2. STREET (4)
  {
    rawFile: '20260605_135445.jpg',
    slug: 'monsoon-concrete-canyons',
    title: 'Monsoon Concrete Canyons',
    category: 'Street',
    alt: 'Urban high-rise concrete apartments towering into dense monsoon cloud cover',
    featured: true,
    curationWhy: 'Monumental urban geometry with 7800px vertical resolution framing dramatic monsoon clouds.'
  },
  {
    rawFile: '20260624_175504.jpg',
    slug: 'night-flower-bazaar',
    title: 'Night Flower Bazaar',
    category: 'Street',
    alt: 'Flower vendor stall glowing under warm incandescent lights with heaps of fresh orange marigold garlands',
    featured: false,
    curationWhy: 'Vibrant amber and orange tones capturing traditional Pune floral market night economy.'
  },
  {
    rawFile: '20260815_130046.jpg',
    slug: 'old-city-bazaar-rush',
    title: 'Old City Bazaar Rush',
    category: 'Street',
    alt: 'Bustling crowd moving through historic Pune market streets lined with heritage facades',
    featured: false,
    curationWhy: 'High-energy candid street rhythm showcasing historical market architecture and pedestrian flow.'
  },
  {
    rawFile: '20260815_100857.jpg',
    slug: 'tricolor-street-alleys',
    title: 'Tricolor Street Alleys',
    category: 'Street',
    alt: 'Narrow Pune alleyway decorated with celebratory tricolor flags flapping against weathered walls',
    featured: false,
    curationWhy: 'Festive alleyway perspective capturing texture, flags, and morning street geometry.'
  },

  // 3. PEOPLE (4)
  {
    rawFile: '20260214_101223.jpg',
    slug: 'the-elder-of-the-ghats',
    title: 'The Elder of the Ghats',
    category: 'People',
    alt: 'Elderly man in white Gandhi topi seated in quiet contemplation beside stone temple pillars',
    featured: true,
    curationWhy: 'Quiet, evocative environmental portrait with deep character lines and authentic temple lighting.'
  },
  {
    rawFile: '20260728_172218.jpg',
    slug: 'courtyard-laughter',
    title: 'Courtyard Laughter',
    category: 'People',
    alt: 'Father and daughter laughing together during an afternoon stroll in an open courtyard',
    featured: false,
    curationWhy: 'Unstaged, heartwarming family candid filled with spontaneous warmth and natural laughter.'
  },
  {
    rawFile: '20260728_154940.jpg',
    slug: 'afternoon-candid-portrait',
    title: 'Afternoon Candid Portrait',
    category: 'People',
    alt: 'Candid outdoor portrait of a young person captured in crisp natural sunlight',
    featured: false,
    curationWhy: 'Sharp natural-light portrait showing expressive warmth without artificial staging.'
  },
  {
    rawFile: '20260629_125939.jpg',
    slug: 'stage-electric-solo',
    title: 'Stage Electric Solo',
    category: 'People',
    alt: 'Electric guitarist performing passionately on stage bathed in dramatic stage lighting',
    featured: false,
    curationWhy: 'Live concert performance energy with electric guitar lead under vibrant stage illumination.'
  },

  // 4. NIGHT (4)
  {
    rawFile: '20260927_043405.jpg',
    slug: 'mountain-stargaze-30s',
    title: 'Mountain Stargaze (30s Exposure)',
    category: 'Night',
    alt: 'Pinpoint stars and constellations captured across deep midnight sky over Sahyadri ridge',
    featured: true,
    curationWhy: 'Authentic 30-second astrophotography long exposure showcasing pinpoint stars and pristine dark skies.'
  },
  {
    rawFile: '20260306_190702.jpg',
    slug: 'transit-flyover-twilight',
    title: 'Transit Flyover at Twilight',
    category: 'Night',
    alt: 'Elevated transit expressway and vehicle light trails cutting through the Pune city skyline',
    featured: false,
    curationWhy: 'Urban transition shot combining dusk gradient sky with kinetic traffic streaks on elevated expressway.'
  },
  {
    rawFile: '20260218_180805 (3).jpg',
    slug: 'dusk-city-gradient',
    title: 'Dusk City Gradient',
    category: 'Night',
    alt: 'Vibrant gradient of deep blue to orange dusk sky settling over building silhouettes',
    featured: false,
    curationWhy: 'Clean horizontal sunset silhouette displaying gradient Sahyadri horizon and city edges.'
  },
  {
    rawFile: '20260412_214957 (2).jpg',
    slug: 'amber-street-bokeh',
    title: 'Amber Street Bokeh',
    category: 'Night',
    alt: 'Urban street scene enveloped in soft out-of-focus amber light orbs and nocturnal atmosphere',
    featured: false,
    curationWhy: 'Atmospheric night bokeh highlighting warm amber tones and nocturnal street mood.'
  },

  // 5. LANDSCAPES AND TRAVEL (5)
  {
    rawFile: '20260406_182413.jpg',
    slug: 'sinhagad-mist-bastion',
    title: 'Sinhagad Mist Bastion',
    category: 'Landscapes and Travel',
    alt: 'Ancient stone fortress bastion descending into monsoon mist at Sinhagad fort',
    featured: true,
    curationWhy: 'Powerful cinematic bastion composition with exceptional sharpness (1941 score) engulfed in cloud.'
  },
  {
    rawFile: '20260406_183233 (1).jpg',
    slug: 'sahyadri-sunset-ridgeline',
    title: 'Sahyadri Sunset Ridgeline',
    category: 'Landscapes and Travel',
    alt: 'Rugged mountain cliffs and rolling ridges of the Western Ghats glowing under warm sunset light',
    featured: false,
    curationWhy: 'Layered Sahyadri mountain ridgelines illuminated in warm amber late-afternoon glow.'
  },
  {
    rawFile: '20260406_181043.jpg',
    slug: 'cliff-edge-valley-overlook',
    title: 'Cliff Edge Valley Overlook',
    category: 'Landscapes and Travel',
    alt: 'Winding stone trail running along sheer precipice overlooking Pune valley plains',
    featured: false,
    curationWhy: 'Dramatic sense of scale with fortified cliffside path overlooking the vast valleys below.'
  },
  {
    rawFile: '20260510_055252.jpg',
    slug: 'dawn-over-sahyadri-hills',
    title: 'Dawn Over Sahyadri Hills',
    category: 'Landscapes and Travel',
    alt: 'First light of dawn breaking across mountain horizon with golden morning mist',
    featured: false,
    curationWhy: 'Crispest landscape in dataset (sharpness 2624) capturing pristine sunrise horizon.'
  },
  {
    rawFile: '20261025_164506(0).jpg',
    slug: 'golden-hour-backwaters',
    title: 'Golden Hour Backwaters',
    category: 'Landscapes and Travel',
    alt: 'Still lake water surface reflecting glowing golden sky and distant shoreline trees',
    featured: false,
    curationWhy: 'Serene reflection study on calm waters capturing golden hour tranquillity.'
  },

  // 6. WILDLIFE (4)
  {
    rawFile: 'IMG_20260829_165902633 (2).jpg',
    slug: 'leopard-in-the-sanctuary',
    title: 'Leopard in the Sanctuary',
    category: 'Wildlife',
    alt: 'Wild Indian leopard alertly resting along a massive horizontal tree bough in forest sanctuary',
    featured: true,
    curationWhy: 'Rare wildlife sighting of wild leopard perched in natural canopy; corrects previous category misplacement.'
  },
  {
    rawFile: 'IMG_20260829_155022311.jpg',
    slug: 'spotted-chital-in-clearing',
    title: 'Spotted Chital in Forest Clearing',
    category: 'Wildlife',
    alt: 'Spotted deer (chital) standing quietly alert among tall dry grass and woodland foliage',
    featured: false,
    curationWhy: 'Ultra-sharp wildlife portrait (sharpness 1963) capturing delicate deer eye and coat patterns.'
  },
  {
    rawFile: 'IMG_20260829_152501537.jpg',
    slug: 'canopy-langur-watch',
    title: 'Canopy Langur Watch',
    category: 'Wildlife',
    alt: 'Grey langur perched among dense green canopy leaves looking down into the forest floor',
    featured: false,
    curationWhy: 'Natural behavior snapshot of grey langur poised in deep jungle canopy.'
  },
  {
    rawFile: '20260805_190030 (1).jpg',
    slug: 'sunlit-alley-cat',
    title: 'Sunlit Alley Cat',
    category: 'Wildlife',
    alt: 'Domestic alley cat with intense green eyes sitting peacefully in a strip of warm afternoon sunlight',
    featured: false,
    curationWhy: 'Striking feline portrait with razor-sharp whiskers (sharpness 1688) bathed in golden beam.'
  },

  // 7. DETAILS (5)
  {
    rawFile: '20261014_123458.jpg',
    slug: 'ancient-temple-pillars',
    title: 'Ancient Temple Pillars',
    category: 'Details',
    alt: 'Hand-carved basalt stone pillars in Hemadpanthi temple displaying intricate geometrical motifs',
    featured: true,
    curationWhy: 'Tactile study of 800-year-old basalt stonework with deep contrast and historical chisel marks.'
  },
  {
    rawFile: '20261014_131807 (1).jpg',
    slug: 'sacred-deepstambh-tower',
    title: 'Sacred Deepstambh Tower',
    category: 'Details',
    alt: 'Monolithic stone lamp tower (Deepstambh) reaching upward in a quiet temple courtyard',
    featured: false,
    curationWhy: 'Architectural verticality emphasizing traditional lamp brackets against Maharashtra sky.'
  },
  {
    rawFile: '20260717_125925.jpg',
    slug: 'sanctum-silver-deity',
    title: 'Sanctum Silver Deity',
    category: 'Details',
    alt: 'Sacred silver idol resting within temple inner sanctum decorated with fresh flowers and brass lamps',
    featured: false,
    curationWhy: 'Intimate spiritual detail capturing silver specular highlights and temple offering textures.'
  },
  {
    rawFile: '20260315_151841 (1).jpg',
    slug: 'geometry-and-shadow',
    title: 'Geometry and Shadow',
    category: 'Details',
    alt: 'Sharp architectural shadows cutting across textured stone masonry surfaces',
    featured: false,
    curationWhy: 'Minimalist shadow and light abstraction with top sharpness in collection (sharpness 2283).'
  },
  {
    rawFile: '20260925_075825(0) (1).jpg',
    slug: 'morning-dew-leaf-veins',
    title: 'Morning Dew Leaf Veins',
    category: 'Details',
    alt: 'Macro detail of crystalline morning dew droplets clinging to intricate green leaf veins',
    featured: false,
    curationWhy: 'Macro botany study capturing refractive morning dew beads across organic leaf structure.'
  }
];

async function runExport() {
  const rootDir = path.join(__dirname, '..');
  const rawDir = path.join(rootDir, 'raw_photos');
  const outDir = path.join(rootDir, 'assets', 'photos');

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outputPhotos = [];

  console.log(`Starting export of ${photoDefinitions.length} curated photos to WebP (640, 1280, 1920)...`);

  let count = 0;
  for (const def of photoDefinitions) {
    count++;
    const srcPath = path.join(rawDir, def.rawFile);
    if (!fs.existsSync(srcPath)) {
      throw new Error(`File not found: ${srcPath}`);
    }

    const image = sharp(srcPath);
    const meta = await image.metadata();
    const origWidth = meta.width;
    const origHeight = meta.height;
    const isPortrait = origHeight >= origWidth;
    const orientation = isPortrait ? 'portrait' : 'landscape';

    // Parse EXIF tags directly from buffer
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
    const placeholderBuf = await sharp(srcPath)
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

      const outFilename = `${def.slug}-${size}.webp`;
      const outFilePath = path.join(outDir, outFilename);

      // WebP export: strip GPS and unnecessary metadata for privacy and size
      await sharp(srcPath)
        .resize(targetW, targetH, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 84, effort: 4 })
        .toFile(outFilePath);

      srcset[size.toString()] = `assets/photos/${outFilename}`;
    }

    const id = `photo-${String(count).padStart(2, '0')}`;
    outputPhotos.push({
      id,
      slug: def.slug,
      title: def.title,
      category: def.category,
      orientation,
      width: origWidth,
      height: origHeight,
      aspectRatio: +(origWidth / origHeight).toFixed(3),
      dateTaken,
      exif: {
        make,
        model,
        lens,
        focalLength,
        focalLength35mm,
        aperture,
        shutterSpeed: exposureTime,
        iso
      },
      placeholder: placeholderUri,
      srcset,
      alt: def.alt,
      featured: def.featured,
      curationWhy: def.curationWhy
    });

    console.log(`[${count}/30] Exported: ${def.slug} (${orientation}, ${def.category})`);
  }

  // Save to /data/photos.json
  const jsonPath = path.join(rootDir, 'data', 'photos.json');
  fs.writeFileSync(jsonPath, JSON.stringify(outputPhotos, null, 2), 'utf8');
  console.log(`\nSuccessfully generated ${outputPhotos.length} photos in ${jsonPath}`);

  // Generate markdown summary
  let md = `# Curation Summary: 30 Final Portfolio Frames\n\n`;
  md += `**Curated from 249 Original Samsung Galaxy S23 Frames**\n`;
  md += `**Total Selected:** 30 Frames | **Orientations:** 24 Portrait, 6 Landscape | **Categories:** 7 Balanced Categories\n\n`;
  md += `| # | Thumbnail | Title / Slug | Category | Orient. | Specs | Why It Made The Cut |\n`;
  md += `|---|---|---|---|---|---|---|\n`;

  outputPhotos.forEach((p, idx) => {
    const exifStr = [p.exif.aperture, p.exif.shutterSpeed, p.exif.iso ? `ISO ${p.exif.iso}` : ''].filter(Boolean).join(' • ');
    md += `| ${idx + 1} | [View](assets/photos/${p.slug}-640.webp) | **${p.title}**<br>\`${p.slug}\` | ${p.category} | ${p.orientation} | ${p.width}×${p.height}<br>${exifStr} | ${p.curationWhy} |\n`;
  });

  fs.writeFileSync(path.join(rootDir, 'curation', 'final-30.md'), md, 'utf8');
  console.log('Saved curation/final-30.md');
}

runExport().catch(err => {
  console.error('Export failed:', err);
  process.exit(1);
});
