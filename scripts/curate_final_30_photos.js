const fs = require('fs');
const path = require('path');

// 1. Definition of the 30 Curated Frames
const final30Definitions = [
  // MACHINES (01 - 06)
  {
    num: 1,
    id: 'photo-01',
    slug: 'shelby-gt500-neon-serpent',
    title: 'Neon Serpent // Shelby GT500',
    category: 'Machines',
    orig_src: 'rejects/curation_batch2/01_mustang_shelby_gt500_cyberpunk.jpg',
    new_filename: '01_mustang_shelby_gt500_cyberpunk.jpg',
    alt: 'Custom Shelby GT500 with iridescent cyberpunk wrap parked at car meet',
    featured: true,
    exif: {
      make: 'samsung',
      model: 'Galaxy S23',
      lens: 'Samsung Galaxy S23 Rear Telephoto Camera',
      focalLength: '7.0mm',
      focalLength35mm: '69mm',
      aperture: 'f/2.4',
      shutterSpeed: '1/300s',
      iso: 25,
      dateTaken: '2026-04-06'
    }
  },
  {
    num: 2,
    id: 'photo-02',
    slug: 'street-zillas-tuner-cafe-racer',
    title: 'Street Zillas // Tuner & Cafe Racer',
    category: 'Machines',
    orig_src: 'rejects/curation_batch2/02_slammed_tuner_and_cafe_racer.jpg',
    new_filename: '02_slammed_tuner_and_cafe_racer.jpg',
    alt: 'Custom widebody street tuner parked alongside a cafe racer motorcycle',
    featured: false,
    exif: {
      make: 'samsung',
      model: 'Galaxy S23',
      lens: 'Samsung Galaxy S23 Rear Wide Camera',
      focalLength: '5.4mm',
      focalLength35mm: '23mm',
      aperture: 'f/1.8',
      shutterSpeed: '1/350s',
      iso: 25,
      dateTaken: '2026-04-06'
    }
  },
  {
    num: 3,
    id: 'photo-03',
    slug: 'defying-gravity-stoppie-in-motion',
    title: 'Defying Gravity // Stoppie in Motion',
    category: 'Machines',
    orig_src: 'rejects/curation_batch2/03_stunt_rider_rolling_endo.jpg',
    new_filename: '03_stunt_rider_rolling_endo.jpg',
    alt: 'Stunt motorcycle rider performing a rolling stoppie balanced on front wheel',
    featured: true,
    exif: {
      make: 'samsung',
      model: 'Galaxy S23',
      lens: 'Samsung Galaxy S23 Rear Wide Camera',
      focalLength: '5.4mm',
      focalLength35mm: '23mm',
      aperture: 'f/1.8',
      shutterSpeed: '1/2100s',
      iso: 25,
      dateTaken: '2026-06-21'
    }
  },
  {
    num: 4,
    id: 'photo-04',
    slug: 'factory-racing-aprilia-rs457',
    title: 'Factory Racing // Aprilia RS 457',
    category: 'Machines',
    orig_src: 'rejects/curation_batch2/04_aprilia_rs457_superbike.jpg',
    new_filename: '04_aprilia_rs457_superbike.jpg',
    alt: 'Aprilia RS 457 superbike front fairing and winglet details in racing livery',
    featured: false,
    exif: {
      make: 'samsung',
      model: 'Galaxy S23',
      lens: 'Samsung Galaxy S23 Rear Telephoto Camera',
      focalLength: '7.0mm',
      focalLength35mm: '69mm',
      aperture: 'f/2.4',
      shutterSpeed: '1/640s',
      iso: 25,
      dateTaken: '2026-10-14'
    }
  },
  {
    num: 5,
    id: 'photo-05',
    slug: 'royal-enfield-shotgun-650-twin-detail',
    title: 'Shotgun 650 // Twin Detail',
    category: 'Machines',
    orig_src: 'raw_photos/20261014_124956 (2).jpg',
    new_filename: '05_royal_enfield_shotgun_650_twin.jpg',
    alt: 'Royal Enfield Shotgun 650 custom side cover badge, exposed spring suspension and solo saddle',
    featured: true,
    exif: {
      make: 'samsung',
      model: 'Galaxy S23',
      lens: 'Samsung Galaxy S23 Rear Telephoto Camera',
      focalLength: '7.0mm',
      focalLength35mm: '69mm',
      aperture: 'f/2.4',
      shutterSpeed: '1/150s',
      iso: 25,
      dateTaken: '2026-10-14'
    }
  },
  {
    num: 6,
    id: 'photo-06',
    slug: 'pulsar-ns400z-midnight-beam',
    title: 'Bajaj Pulsar NS400Z // Midnight Beam',
    category: 'Machines',
    orig_src: 'rejects/curation_batch2/06_pulsar_ns400z_midnight_beam.jpg',
    new_filename: '06_pulsar_ns400z_midnight_beam.jpg',
    alt: 'Bajaj Pulsar NS400Z motorcycle rider in full helmet illuminated by headlamp',
    featured: false,
    exif: {
      make: 'samsung',
      model: 'Galaxy S23',
      lens: 'Samsung Galaxy S23 Rear Wide Camera',
      focalLength: '5.4mm',
      focalLength35mm: '23mm',
      aperture: 'f/1.8',
      shutterSpeed: '1/120s',
      iso: 80,
      dateTaken: '2026-05-29'
    }
  },

  // STREET (07 - 11)
  {
    num: 7,
    id: 'photo-07',
    slug: 'colonial-monoliths-fort-corridor',
    title: 'Colonial Monoliths // Fort Heritage Corridor',
    category: 'Street',
    orig_src: 'rejects/curation_batch2/07_south_mumbai_victorian_heritage.jpg',
    new_filename: '07_south_mumbai_victorian_heritage.jpg',
    alt: 'Monochrome architectural street photography of colonial Victorian heritage facades in South Mumbai',
    featured: false,
    exif: {
      make: 'samsung',
      model: 'Galaxy S23',
      lens: 'Samsung Galaxy S23 Rear Wide Camera',
      focalLength: '5.4mm',
      focalLength35mm: '23mm',
      aperture: 'f/1.8',
      shutterSpeed: '1/500s',
      iso: 25,
      dateTaken: '2026-06-24'
    }
  },
  {
    num: 8,
    id: 'photo-08',
    slug: 'steel-arteries-cable-stayed-horizon',
    title: 'Steel Arteries // Cable-Stayed Horizon',
    category: 'Street',
    orig_src: 'rejects/curation_batch2/08_rail_lines_suspension_bridge.jpg',
    new_filename: '08_rail_lines_suspension_bridge.jpg',
    alt: 'Train railyards converging toward cable-stayed suspension bridge towers beneath blue skies and clouds',
    featured: false,
    exif: {
      make: 'samsung',
      model: 'Galaxy S23',
      lens: 'Samsung Galaxy S23 Rear Wide Camera',
      focalLength: '5.4mm',
      focalLength35mm: '23mm',
      aperture: 'f/1.8',
      shutterSpeed: '1/750s',
      iso: 25,
      dateTaken: '2026-06-24'
    }
  },
  {
    num: 9,
    id: 'photo-09',
    slug: 'midnight-bloom-florist-bazaar',
    title: 'Midnight Bloom // The Florist Bazaar',
    category: 'Street',
    orig_src: 'rejects/curation_batch2/09_night_flower_market_glow.jpg',
    new_filename: '09_night_flower_market_glow.jpg',
    alt: 'Vibrant evening flower market bouquets lit beneath warm suspended bulbs in Old Pune',
    featured: false,
    exif: {
      make: 'samsung',
      model: 'Galaxy S23',
      lens: 'Samsung Galaxy S23 Rear Wide Camera',
      focalLength: '5.4mm',
      focalLength35mm: '23mm',
      aperture: 'f/1.8',
      shutterSpeed: '1/60s',
      iso: 160,
      dateTaken: '2026-08-05'
    }
  },
  {
    num: 10,
    id: 'photo-10',
    slug: 'pulse-of-pune-midday-chowk',
    title: 'Pulse of Pune // Midday Chowk',
    category: 'Street',
    orig_src: 'rejects/curation_batch2/10_pune_chowk_summer_transit.jpg',
    new_filename: '10_pune_chowk_summer_transit.jpg',
    alt: 'Bustling Pune city street intersection transit under harsh summer sun',
    featured: false,
    exif: {
      make: 'samsung',
      model: 'Galaxy S23',
      lens: 'Samsung Galaxy S23 Rear Wide Camera',
      focalLength: '5.4mm',
      focalLength35mm: '23mm',
      aperture: 'f/1.8',
      shutterSpeed: '1/2000s',
      iso: 25,
      dateTaken: '2026-05-15'
    }
  },
  {
    num: 11,
    id: 'photo-11',
    slug: 'skyward-breach-urban-monsoon-sky',
    title: 'Skyward Breach // Urban Monsoon Sky',
    category: 'Street',
    orig_src: 'rejects/curation_batch2/11_urban_canyon_monsoon_sky.jpg',
    new_filename: '11_urban_canyon_monsoon_sky.jpg',
    alt: 'Looking directly up between buildings into deep monsoon rainclouds',
    featured: false,
    exif: {
      make: 'samsung',
      model: 'Galaxy S23',
      lens: 'Samsung Galaxy S23 Rear Wide Camera',
      focalLength: '5.4mm',
      focalLength35mm: '23mm',
      aperture: 'f/1.8',
      shutterSpeed: '1/1500s',
      iso: 25,
      dateTaken: '2026-06-05'
    }
  },

  // HERITAGE & CULTURE (12 - 14)
  {
    num: 12,
    id: 'photo-12',
    slug: 'echoes-in-basalt-hemadpanthi-portal',
    title: 'Echoes in Basalt // Hemadpanthi Sanctum Portal',
    category: 'Heritage',
    orig_src: 'rejects/curation_batch2/12_ancient_hemadpanthi_temple_steps.jpg',
    new_filename: '12_ancient_hemadpanthi_temple_steps.jpg',
    alt: 'Ancient Hemadpanthi stone masonry temple steps and entrance portal',
    featured: false,
    exif: {
      make: 'samsung',
      model: 'Galaxy S23',
      lens: 'Samsung Galaxy S23 Rear Wide Camera',
      focalLength: '5.4mm',
      focalLength35mm: '23mm',
      aperture: 'f/1.8',
      shutterSpeed: '1/320s',
      iso: 25,
      dateTaken: '2026-07-17'
    }
  },
  {
    num: 13,
    id: 'photo-13',
    slug: 'monument-of-faith-stone-sanctuary',
    title: 'Monument of Faith // Medieval Stone Sanctuary',
    category: 'Heritage',
    orig_src: 'rejects/curation_batch2/13_stone_temple_shikhara_facade.jpg',
    new_filename: '13_stone_temple_shikhara_facade.jpg',
    alt: 'Carved basalt temple spire towering against dramatic Maharashtra sky',
    featured: false,
    exif: {
      make: 'samsung',
      model: 'Galaxy S23',
      lens: 'Samsung Galaxy S23 Rear Telephoto Camera',
      focalLength: '7.0mm',
      focalLength35mm: '69mm',
      aperture: 'f/2.4',
      shutterSpeed: '1/500s',
      iso: 25,
      dateTaken: '2026-07-17'
    }
  },
  {
    num: 14,
    id: 'photo-14',
    slug: 'golden-darbar-dagdusheth-ganpati',
    title: 'Golden Darbar // Shreemant Dagdusheth Celebration',
    category: 'Culture',
    orig_src: 'rejects/curation_batch2/14_dagdusheth_ganpati_darbar.jpg',
    new_filename: '14_dagdusheth_ganpati_darbar.jpg',
    alt: 'Ornate gold and floral darbar backdrop of Shreemant Dagdusheth Halwai Ganpati in Pune',
    featured: true,
    exif: {
      make: 'samsung',
      model: 'Galaxy S23',
      lens: 'Samsung Galaxy S23 Rear Wide Camera',
      focalLength: '5.4mm',
      focalLength35mm: '23mm',
      aperture: 'f/1.8',
      shutterSpeed: '1/120s',
      iso: 100,
      dateTaken: '2026-09-15'
    }
  },

  // PEOPLE (15 - 18)
  {
    num: 15,
    id: 'photo-15',
    slug: 'pure-radiance-father-and-daughter',
    title: 'Pure Radiance // Father & Daughter',
    category: 'People',
    orig_src: 'rejects/curation_batch2/15_father_daughter_candid_smile.jpg',
    new_filename: '15_father_daughter_candid_smile.jpg',
    alt: 'Candid warm portrait of a smiling father holding his daughter outdoors',
    featured: false,
    exif: {
      make: 'samsung',
      model: 'Galaxy S23',
      lens: 'Samsung Galaxy S23 Rear Wide Camera',
      focalLength: '5.4mm',
      focalLength35mm: '23mm',
      aperture: 'f/1.8',
      shutterSpeed: '1/400s',
      iso: 25,
      dateTaken: '2026-06-29'
    }
  },
  {
    num: 16,
    id: 'photo-16',
    slug: 'silent-patriarch-old-pune-ghats',
    title: 'The Silent Patriarch // Old Pune Ghats',
    category: 'People',
    orig_src: 'rejects/curation_batch2/16_elder_in_gandhi_topi_monochrome.jpg',
    new_filename: '16_elder_in_gandhi_topi_monochrome.jpg',
    alt: 'Respectful portrait of an elderly gentleman in traditional white Gandhi topi',
    featured: false,
    exif: {
      make: 'samsung',
      model: 'Galaxy S23',
      lens: 'Samsung Galaxy S23 Rear Wide Camera',
      focalLength: '5.4mm',
      focalLength35mm: '23mm',
      aperture: 'f/1.8',
      shutterSpeed: '1/350s',
      iso: 25,
      dateTaken: '2026-06-29'
    }
  },
  {
    num: 17,
    id: 'photo-17',
    slug: 'golden-gaze-solar-iris',
    title: 'Golden Gaze // Solar Flare in Iris',
    category: 'People',
    orig_src: 'raw_photos/20260530_175613.jpg',
    new_filename: '17_golden_gaze_eyes_macro.jpg',
    alt: 'Intimate close-up macro portrait of golden late-afternoon sunlight reflecting in deep hazel eyes',
    featured: true,
    exif: {
      make: 'samsung',
      model: 'Galaxy S23',
      lens: 'Samsung Galaxy S23 Rear Telephoto Camera',
      focalLength: '7.0mm',
      focalLength35mm: '69mm',
      aperture: 'f/2.4',
      shutterSpeed: '1/180s',
      iso: 25,
      dateTaken: '2026-05-30'
    }
  },
  {
    num: 18,
    id: 'photo-18',
    slug: 'stage-presence-auditorium-spotlight',
    title: 'Stage Presence // Campus Auditorium Spotlight',
    category: 'People',
    orig_src: 'rejects/curation_batch2/48_auditorium_spotlight_beam.jpg',
    new_filename: '18_auditorium_spotlight_beam.jpg',
    alt: 'Student attendee in lecture auditorium with back graphic Some days you just have to create your own sunshine',
    featured: false,
    exif: {
      make: 'samsung',
      model: 'Galaxy S23',
      lens: 'Samsung Galaxy S23 Rear Wide Camera',
      focalLength: '5.4mm',
      focalLength35mm: '23mm',
      aperture: 'f/1.8',
      shutterSpeed: '1/100s',
      iso: 125,
      dateTaken: '2026-04-18'
    }
  },

  // NIGHT & ASTROPHOTOGRAPHY (19 - 21)
  {
    num: 19,
    id: 'photo-19',
    slug: 'riff-under-spotlight-live-stage',
    title: 'Riff Under Spotlight // Live Stage Energy',
    category: 'Night',
    orig_src: 'rejects/curation_batch2/17_rock_guitarist_stage_spotlight.jpg',
    new_filename: '19_rock_guitarist_stage_spotlight.jpg',
    alt: 'Lead electric guitarist captured mid-solo beneath saturated blue concert spotlights',
    featured: false,
    exif: {
      make: 'samsung',
      model: 'Galaxy S23',
      lens: 'Samsung Galaxy S23 Rear Telephoto Camera',
      focalLength: '7.0mm',
      focalLength35mm: '69mm',
      aperture: 'f/2.4',
      shutterSpeed: '1/50s',
      iso: 400,
      dateTaken: '2026-04-12'
    }
  },
  {
    num: 20,
    id: 'photo-20',
    slug: 'stargazer-pointing-to-cosmos',
    title: 'Stargazer // Pointing to the Cosmos',
    category: 'Night',
    orig_src: 'raw_photos/20260927_043405(1) (1).jpg',
    new_filename: '20_stargazer_pointing_cosmos.jpg',
    alt: 'Figure standing against pitch black night sky pointing right arm upward toward brilliant constellations',
    featured: true,
    exif: {
      make: 'samsung',
      model: 'Galaxy S23',
      lens: 'Samsung Galaxy S23 Rear Wide Camera',
      focalLength: '5.4mm',
      focalLength35mm: '23mm',
      aperture: 'f/1.8',
      shutterSpeed: '30.00s',
      iso: 200,
      dateTaken: '2026-09-27'
    }
  },
  {
    num: 21,
    id: 'photo-21',
    slug: 'twilight-horizon-overlook-silhouette',
    title: 'Twilight Horizon // Overlook Above the City',
    category: 'Night',
    orig_src: 'rejects/curation_batch2/19_city_overlook_sunset_silhouette.jpg',
    new_filename: '21_city_overlook_sunset_silhouette.jpg',
    alt: 'Sunset panorama looking down from hill vantage point as city streetlights begin to glow',
    featured: false,
    exif: {
      make: 'samsung',
      model: 'Galaxy S23',
      lens: 'Samsung Galaxy S23 Rear Wide Camera',
      focalLength: '5.4mm',
      focalLength35mm: '23mm',
      aperture: 'f/1.8',
      shutterSpeed: '1/25s',
      iso: 640,
      dateTaken: '2026-06-29'
    }
  },

  // MACHINES & HIGHWAYS (22 - 25)
  {
    num: 22,
    id: 'photo-22',
    slug: 'audi-sport-rally-spec',
    title: 'Audi Sport No. 9 // Rally Spec',
    category: 'Machines',
    orig_src: 'rejects/curation_batch2/22_audi_sport_rally_spec.jpg',
    new_filename: '22_audi_sport_rally_spec.jpg',
    alt: 'Audi Sport race car with track aero and rally livery at evening paddock gathering',
    featured: false,
    exif: {
      make: 'samsung',
      model: 'Galaxy S23',
      lens: 'Samsung Galaxy S23 Rear Wide Camera',
      focalLength: '5.4mm',
      focalLength35mm: '23mm',
      aperture: 'f/1.8',
      shutterSpeed: '1/200s',
      iso: 32,
      dateTaken: '2026-04-06'
    }
  },
  {
    num: 23,
    id: 'photo-23',
    slug: 'lone-rider-midnight-horizon',
    title: 'Lone Rider // Midnight Horizon',
    category: 'Machines',
    orig_src: 'rejects/curation_batch2/37_lone_rider_highway_silhouette.jpg',
    new_filename: '23_lone_rider_highway_silhouette.jpg',
    alt: 'Motorcycle rider in full gear captured at speed through urban neon night light trails',
    featured: true,
    exif: {
      make: 'samsung',
      model: 'Galaxy S23',
      lens: 'Samsung Galaxy S23 Rear Wide Camera',
      focalLength: '5.4mm',
      focalLength35mm: '23mm',
      aperture: 'f/1.8',
      shutterSpeed: '1/15s',
      iso: 500,
      dateTaken: '2026-04-18'
    }
  },
  {
    num: 24,
    id: 'photo-24',
    slug: 'superbike-cockpit-clipons',
    title: 'Command Center // Superbike Cockpit',
    category: 'Machines',
    orig_src: 'rejects/curation_batch2/57_superbike_cockpit_clipons.jpg',
    new_filename: '24_superbike_cockpit_clipons.jpg',
    alt: 'High performance motorcycle cockpit with Tibetan prayer flags draped across handlebars and instrument cluster',
    featured: false,
    exif: {
      make: 'samsung',
      model: 'Galaxy S23',
      lens: 'Samsung Galaxy S23 Rear Telephoto Camera',
      focalLength: '7.0mm',
      focalLength35mm: '69mm',
      aperture: 'f/2.4',
      shutterSpeed: '1/600s',
      iso: 25,
      dateTaken: '2026-10-14'
    }
  },
  {
    num: 25,
    id: 'photo-25',
    slug: 'overpass-solitude-midnight-cables',
    title: 'Overpass Solitude // Midnight Cable Span',
    category: 'Street',
    orig_src: 'rejects/curation_batch2/39_midnight_flyover_cables.jpg',
    new_filename: '25_midnight_flyover_cables.jpg',
    alt: 'Atmospheric night highway overpass with overhead suspension cables silhouetted in deep indigo shadows',
    featured: false,
    exif: {
      make: 'samsung',
      model: 'Galaxy S23',
      lens: 'Samsung Galaxy S23 Rear Wide Camera',
      focalLength: '5.4mm',
      focalLength35mm: '23mm',
      aperture: 'f/1.8',
      shutterSpeed: '1/30s',
      iso: 400,
      dateTaken: '2026-06-24'
    }
  },

  // STREET & CAMPUS (26 - 27)
  {
    num: 26,
    id: 'photo-26',
    slug: 'morning-awakening-old-pune-alley',
    title: 'Morning Awakening // Old Pune Alleyway',
    category: 'Street',
    orig_src: 'rejects/curation_batch2/35_morning_bazaar_old_pune.jpg',
    new_filename: '26_morning_bazaar_old_pune.jpg',
    alt: 'Quiet morning lane in historic Pune bazaar with pastel facades and morning sunlight',
    featured: false,
    exif: {
      make: 'samsung',
      model: 'Galaxy S23',
      lens: 'Samsung Galaxy S23 Rear Wide Camera',
      focalLength: '5.4mm',
      focalLength35mm: '23mm',
      aperture: 'f/1.8',
      shutterSpeed: '1/250s',
      iso: 32,
      dateTaken: '2026-06-29'
    }
  },
  {
    num: 27,
    id: 'photo-27',
    slug: 'sunlit-sanctuary-golden-classroom',
    title: 'Sunlit Sanctuary // Golden Hour Classroom',
    category: 'Details',
    orig_src: 'raw_photos/IMG-20260312-WA0035 (1).jpg',
    new_filename: '27_classroom_golden_sunlight.jpg',
    alt: 'Warm golden late-afternoon sunlight streaming through window grilles across empty college classroom wooden benches',
    featured: true,
    exif: {
      make: 'samsung',
      model: 'Galaxy S23',
      lens: 'Samsung Galaxy S23 Rear Wide Camera',
      focalLength: '5.4mm',
      focalLength35mm: '23mm',
      aperture: 'f/1.8',
      shutterSpeed: '1/200s',
      iso: 40,
      dateTaken: '2026-03-12'
    }
  },

  // WILDLIFE (28 - 30)
  {
    num: 28,
    id: 'photo-28',
    slug: 'street-sentinel-sunlit-cat',
    title: 'Street Sentinel // Sunlit Alley Cat',
    category: 'Wildlife',
    orig_src: 'raw_photos/20260717_125925 (1).jpg',
    new_filename: '28_sunlit_street_cat_portrait.jpg',
    alt: 'White and ginger cat with notched ear gazing upward against weathered concrete wall in golden afternoon light',
    featured: true,
    exif: {
      make: 'samsung',
      model: 'Galaxy S23',
      lens: 'Samsung Galaxy S23 Rear Telephoto Camera',
      focalLength: '7.0mm',
      focalLength35mm: '69mm',
      aperture: 'f/2.4',
      shutterSpeed: '1/800s',
      iso: 25,
      dateTaken: '2026-07-17'
    }
  },
  {
    num: 29,
    id: 'photo-29',
    slug: 'gaze-through-the-mesh-leopard',
    title: 'Gaze Through the Mesh // Indian Leopard',
    category: 'Wildlife',
    orig_src: 'rejects/curation_batch2/20_indian_leopard_through_wire.jpg',
    new_filename: '29_indian_leopard_through_wire.jpg',
    alt: 'Indian leopard looking forward intently through rescue sanctuary protective wire mesh',
    featured: false,
    exif: {
      make: 'samsung',
      model: 'Galaxy S23',
      lens: 'Samsung Galaxy S23 Rear Telephoto Camera',
      focalLength: '7.0mm',
      focalLength35mm: '69mm',
      aperture: 'f/2.4',
      shutterSpeed: '1/45s',
      iso: 320,
      dateTaken: '2026-03-06'
    }
  },
  {
    num: 30,
    id: 'photo-30',
    slug: 'dusk-duet-crimson-sunset',
    title: 'Dusk Duet // Silk-Cotton Crimson Sunset',
    category: 'Wildlife',
    orig_src: 'rejects/curation_batch2/21_birds_silk_cotton_sunset.jpg',
    new_filename: '30_birds_silk_cotton_sunset.jpg',
    alt: 'Pair of wild birds perched on bare branches of red silk-cotton tree silhouetted against glowing orange sunset',
    featured: false,
    exif: {
      make: 'samsung',
      model: 'Galaxy S23',
      lens: 'Samsung Galaxy S23 Rear Telephoto Camera',
      focalLength: '7.0mm',
      focalLength35mm: '69mm',
      aperture: 'f/2.4',
      shutterSpeed: '1/400s',
      iso: 25,
      dateTaken: '2026-03-26'
    }
  }
];

module.exports = { final30Definitions };
