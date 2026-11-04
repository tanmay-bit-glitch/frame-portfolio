const fs = require('fs');
const path = require('path');

const rawDir = path.join(__dirname, '../raw_photos');
const reviewDir = path.join(__dirname, '../curated_photos_review');

if (!fs.existsSync(reviewDir)) {
  fs.mkdirSync(reviewDir, { recursive: true });
}

// 30 meticulously curated and visually verified photos
const curatedSelection = [
  // --- 1. MACHINES: AUTOMOTIVE & MOTORCYCLE CULTURE (12) ---
  {
    rawCandidates: ['20260406_183233 (1).jpg', '20260406_183233.jpg', '20260406_183233 (2).jpg'],
    newName: '01_mustang_shelby_gt500_cyberpunk.jpg',
    title: 'Neon Serpent // Shelby GT500',
    category: 'Machines',
    subject: 'Ford Mustang Shelby GT500 with cobra grille badge in purple cyberpunk wrap at car meet',
    orientation: 'portrait'
  },
  {
    rawCandidates: ['20260406_181043.jpg', '20260406_181043 (1).jpg'],
    newName: '02_audi_sport_rally_spec.jpg',
    title: 'Audi Sport No. 9 // Rally Spec',
    category: 'Machines',
    subject: 'Audi Sport #9 race car with rally livery and illuminated amber LED bumper light bars',
    orientation: 'portrait'
  },
  {
    rawCandidates: ['20260406_182413.jpg', '20260406_182413 (1).jpg', '20260406_182413 (2).jpg'],
    newName: '03_slammed_tuner_and_cafe_racer.jpg',
    title: 'Street Zillas // Tuner & Cafe Racer',
    category: 'Machines',
    subject: 'Slammed graffiti-wrapped coupe alongside custom cafe racer motorcycle with SEND NOODS plate',
    orientation: 'portrait'
  },
  {
    rawCandidates: ['20260406_175521.jpg', '20260406_175521 (1).jpg', '20260406_175521 (2).jpg'],
    newName: '04_polo_gt_tiffany_blue.jpg',
    title: 'Tiffany Stance // Polo GT Carbon',
    category: 'Machines',
    subject: 'Custom slammed Tiffany Blue Volkswagen Polo GT with carbon hood and demon-eye headlamps',
    orientation: 'portrait'
  },
  {
    rawCandidates: ['20260406_180550.jpg', '20260406_180550 (1).jpg', '20260406_180550_1.jpg'],
    newName: '05_stealth_altroz_custom.jpg',
    title: 'Dark Knight // Stealth Hatch',
    category: 'Machines',
    subject: 'Matte black custom Tata Altroz with red aero splitter accent and custom vented hood',
    orientation: 'portrait'
  },
  {
    rawCandidates: ['20260621_100920(0).jpg', '20260621_100920(0) (1).jpg'],
    newName: '06_stunt_rider_rolling_endo.jpg',
    title: 'Defying Gravity // Stoppie in Motion',
    category: 'Machines',
    subject: 'Stunt rider in neon yellow helmet performing a vertical rolling endo balanced on front wheel',
    orientation: 'portrait'
  },
  {
    rawCandidates: ['20261014_143051.jpg', '20261014_143051 (1).jpg'],
    newName: '07_aprilia_rs457_superbike.jpg',
    title: 'Factory Racing // Aprilia RS 457',
    category: 'Machines',
    subject: 'Aprilia RS 457 supersport motorcycle in matte racing livery with Brembo radial brakes',
    orientation: 'portrait'
  },
  {
    rawCandidates: ['20261014_123458.jpg', '20261014_123458 (1).jpg'],
    newName: '08_royal_enfield_cruiser_meet.jpg',
    title: 'The Twin Rumble // Shotgun 650 Meet',
    category: 'Machines',
    subject: 'Royal Enfield 650 custom cruiser alongside green Kawasaki Ninja and riders at bike meet',
    orientation: 'portrait'
  },
  {
    rawCandidates: ['20261014_131807 (1).jpg', '20261014_131807.jpg'],
    newName: '09_thruxton_cb350_lineup.jpg',
    title: 'Classic Iron // Thruxton & CB350 Lineup',
    category: 'Machines',
    subject: 'Lineup of Triumph Thruxton 400 and red Honda CB350RS under event canopies',
    orientation: 'portrait'
  },
  {
    rawCandidates: ['20260315_151841.jpg', '20260315_151841 (1).jpg'],
    newName: '10_defender_urban_silhouette.jpg',
    title: 'Obsidian Presence // Defender 110',
    category: 'Machines',
    subject: 'All-black Land Rover Defender with illuminated square LED taillights on avenue',
    orientation: 'portrait'
  },
  {
    rawCandidates: ['20260529_231551.jpg', '20260529_231518.jpg'],
    newName: '11_yamaha_mt15_night_glow.jpg',
    title: 'Midnight Stalker // MT-15 Beam',
    category: 'Machines',
    subject: 'Rider on Yamaha MT-15 with twin projector LED headlights piercing dark street',
    orientation: 'portrait'
  },
  {
    rawCandidates: ['20260530_002201.jpg'],
    newName: '12_ktm_duke_midnight_post.jpg',
    title: 'Midnight Vigil // Duke Under the Lamppost',
    category: 'Machines',
    subject: 'Helmeted rider seated on KTM Duke motorcycle under lamppost electrical box at midnight',
    orientation: 'portrait'
  },

  // --- 2. STREET & ARCHITECTURE (5) ---
  {
    rawCandidates: ['20260510_055252.jpg'],
    newName: '13_south_mumbai_victorian_heritage.jpg',
    title: 'Colonial Monoliths // Fort Heritage Corridor',
    category: 'Street',
    subject: 'Victorian Gothic heritage facades, Lawrence & Mayo building, and streetlamps in South Mumbai (Monochrome)',
    orientation: 'landscape'
  },
  {
    rawCandidates: ['20260624_175504.jpg'],
    newName: '14_rail_lines_suspension_bridge.jpg',
    title: 'Steel Arteries // Cable-Stayed Horizon',
    category: 'Street',
    subject: 'Railway yard train rakes converging toward massive cable-stayed suspension bridge under cumulus clouds',
    orientation: 'portrait'
  },
  {
    rawCandidates: ['20260805_190030 (1).jpg', '20260805_190030.jpg'],
    newName: '15_night_flower_market_glow.jpg',
    title: 'Midnight Bloom // The Florist Bazaar',
    category: 'Street',
    subject: 'Vibrant night floral shop with wrapped bouquets of roses, orchids, and sunflowers glowing under overhead bulbs',
    orientation: 'portrait'
  },
  {
    rawCandidates: ['20260605_135445.jpg'],
    newName: '16_pune_chowk_summer_transit.jpg',
    title: 'Pulse of Pune // Midday Chowk',
    category: 'Street',
    subject: 'Bustling Pune city junction with two-wheelers, auto-rickshaws, saffron flag, and billowing summer clouds',
    orientation: 'portrait'
  },
  {
    rawCandidates: ['20260728_172218.jpg'],
    newName: '17_urban_canyon_monsoon_sky.jpg',
    title: 'Skyward Breach // Urban Monsoon Sky',
    category: 'Street',
    subject: 'Looking up between city residential blocks toward sweeping monsoon storm cloud formation',
    orientation: 'portrait'
  },

  // --- 3. HERITAGE & SACRED CULTURE (3) ---
  {
    rawCandidates: ['20260324_185407.jpg', '20260324_185407 (1).jpg'],
    newName: '18_ancient_hemadpanthi_temple_steps.jpg',
    title: 'Echoes in Basalt // Hemadpanthi Sanctum Portal',
    category: 'Heritage',
    subject: 'Hand-carved 12th-century stone temple entrance steps, carved pillars, and sanctum doorway',
    orientation: 'portrait'
  },
  {
    rawCandidates: ['20260324_185514 (1).jpg', '20260324_185514.jpg'],
    newName: '19_stone_temple_shikhara_facade.jpg',
    title: 'Monument of Faith // Medieval Stone Sanctuary',
    category: 'Heritage',
    subject: 'Wide architectural perspective of stone temple tiered carvings and ornate pillars',
    orientation: 'landscape'
  },
  {
    rawCandidates: ['20260916_201426.jpg'],
    newName: '20_dagdusheth_ganpati_darbar.jpg',
    title: 'Golden Darbar // Shreemant Dagdusheth Celebration',
    category: 'Culture',
    subject: 'Magnificent golden Ganeshotsav pandal with Lord Ganesha idol and gathered devotees in prayer',
    orientation: 'portrait'
  },

  // --- 4. PEOPLE & CANDID PORTRAITS (5) ---
  {
    rawCandidates: ['20260629_125939.jpg'],
    newName: '21_father_daughter_candid_smile.jpg',
    title: 'Pure Radiance // Father & Daughter',
    category: 'People',
    subject: 'Father carrying his smiling young daughter piggyback against ornate white latticework window',
    orientation: 'portrait'
  },
  {
    rawCandidates: ['20260214_101223.jpg'],
    newName: '22_elder_in_gandhi_topi_monochrome.jpg',
    title: 'The Silent Patriarch // Old Pune Ghats',
    category: 'People',
    subject: 'Elderly man in white Gandhi topi seated in thought beside stone temple pillars in monochrome',
    orientation: 'landscape'
  },
  {
    rawCandidates: ['20260406_175844.jpg'],
    newName: '23_car_meet_street_culture.jpg',
    title: 'Car Meet Chronicles // Subculture Dialogue',
    category: 'People',
    subject: 'Candid conversation at car meet: guy in Bonkers graphic tee and girl with VR46 cap & tattoo sleeve',
    orientation: 'portrait'
  },
  {
    rawCandidates: ['20260925_075825(0).jpg', '20260925_075825(0) (1).jpg'],
    newName: '24_girl_gazing_sky_on_scooter.jpg',
    title: 'Daydreaming at Dawn // Field Solitude',
    category: 'People',
    subject: 'Young woman reclining back on orange TVS Jupiter scooter looking up at the sky in open field',
    orientation: 'portrait'
  },
  {
    rawCandidates: ['20261025_164506(0) (1).jpg', '20261025_164506(0).jpg', '20261025_165233.jpg'],
    newName: '25_kart_track_portrait.jpg',
    title: 'Paddock Cool // Go-Kart Circuit Stance',
    category: 'People',
    subject: 'Young man in sunglasses and F1 graphic tee standing by yellow tire barriers of go-kart track',
    orientation: 'portrait'
  },

  // --- 5. NIGHT & LIVE ATMOSPHERE (3) ---
  {
    rawCandidates: ['20260412_214957 (2).jpg', '20260412_214957.jpg'],
    newName: '26_rock_guitarist_stage_spotlight.jpg',
    title: 'Riff Under Spotlight // Live Stage Energy',
    category: 'Night',
    subject: 'Rock guitarist performing solo bathed in stark diagonal white stage spotlight beam',
    orientation: 'portrait'
  },
  {
    rawCandidates: ['20260927_043405.jpg', '20260927_043405 (1).jpg'],
    newName: '27_stargazer_30s_night_sky.jpg',
    title: 'Infinite Canvas // 30-Second Star Trail Gaze',
    category: 'Night',
    subject: 'Illuminated figure looking up at pinpoint stars in pitch black night sky (30s exposure)',
    orientation: 'portrait'
  },
  {
    rawCandidates: ['20260306_190702.jpg'],
    newName: '28_city_overlook_sunset_silhouette.jpg',
    title: 'Twilight Horizon // Overlook Above the City',
    category: 'Night',
    subject: 'Silhouette of young woman at dusk overlook above twinkling Pune city lights and amber horizon',
    orientation: 'landscape'
  },

  // --- 6. WILDLIFE & NATURE (2) ---
  {
    rawCandidates: ['IMG_20260829_165902633.jpg', 'IMG_20260829_165902633 (2).jpg'],
    newName: '29_indian_leopard_through_wire.jpg',
    title: 'Gaze Through the Mesh // Indian Leopard',
    category: 'Wildlife',
    subject: 'Alert Indian leopard framed through chain-link wire fence against lush green foliage',
    orientation: 'portrait'
  },
  {
    rawCandidates: ['20260218_180805 (3).jpg', '20260218_180805.jpg'],
    newName: '30_birds_silk_cotton_sunset.jpg',
    title: 'Dusk Duet // Silk-Cotton Crimson Sunset',
    category: 'Wildlife',
    subject: 'Two birds perched side by side on flowering red silk-cotton tree branch against setting red sun',
    orientation: 'landscape'
  }
];

function findSource(candidates) {
  const searchDirs = [
    rawDir,
    path.join(__dirname, '../rejects/duplicates'),
    path.join(__dirname, '../rejects/quality'),
    path.join(__dirname, '../assets/drive_photos')
  ];

  for (const c of candidates) {
    for (const d of searchDirs) {
      const p = path.join(d, c);
      if (fs.existsSync(p)) return p;
    }
  }
  return null;
}

console.log(`Copying all ${curatedSelection.length} curated photos into curated_photos_review/ ...`);

const report = [];

curatedSelection.forEach((item, idx) => {
  const src = findSource(item.rawCandidates);
  if (!src) {
    console.error(`ERROR: Could not find any source for ${item.newName}! Candidates:`, item.rawCandidates);
    process.exit(1);
  }
  const dest = path.join(reviewDir, item.newName);
  fs.copyFileSync(src, dest);
  const sizeMb = (fs.statSync(dest).size / 1024 / 1024).toFixed(2);
  const foundFile = path.basename(src);
  console.log(`[${idx + 1}/30] Copied ${item.newName} (${sizeMb} MB) from ${foundFile}`);
  report.push({
    index: idx + 1,
    newName: item.newName,
    originalFile: foundFile,
    category: item.category,
    title: item.title,
    subject: item.subject,
    orientation: item.orientation,
    sizeMb
  });
});

fs.writeFileSync(path.join(reviewDir, 'REVIEW_INDEX.json'), JSON.stringify(report, null, 2));

console.log('\nSUCCESS! All 30 photos have been successfully copied into curated_photos_review/.');
