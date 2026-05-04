import type { Vessel } from '@/types';

// Note: Gu (觚) and Jiao (角) GLB models are not yet available.
// They are flagged with available:false and use a placeholder model path.

export const vessels: Vessel[] = [
  // ── Storage Vessels ─────────────────────────────────────────
  {
    id: 'zun',
    name_chinese: '尊',
    name_pinyin: 'Zūn',
    name_english: 'Zun',
    category: 'storage',
    capacity_ml: null,
    us_equivalent: 'Ceremonial Decanter',
    valid_occasions: ['state_dinner', 'governor_summit', 'backyard_bbq'],
    short_description:
      'A tall, broad-shouldered ritual wine container, often shaped like an animal.',
    historical_fact:
      'The Si Yang Fang Zun (四羊方尊) of the Shang dynasty features four rams emerging from its corners — a masterwork of bronze casting.',
    slip_description:
      'Imposing storage vessel suitable for any rank of host.',
    wine_meter_fill: null,
    model_asset: '/models/zun.glb',
    available: true,
  },
  {
    id: 'yi',
    name_chinese: '彝',
    name_pinyin: 'Yí',
    name_english: 'Yi',
    category: 'storage',
    capacity_ml: null,
    us_equivalent: 'Sacred Reserve Jar',
    valid_occasions: ['state_dinner', 'governor_summit', 'backyard_bbq'],
    short_description:
      'A general term for ritual bronze containers used for sacrificial wine.',
    historical_fact:
      'The character 彝 came to mean "ritual" itself — these vessels embodied proper conduct.',
    slip_description:
      'A solemn storage vessel reserved for ancestral rites.',
    wine_meter_fill: null,
    model_asset: '/models/yi.glb',
    available: true,
  },
  {
    id: 'lei',
    name_chinese: '罍',
    name_pinyin: 'Léi',
    name_english: 'Lei',
    category: 'storage',
    capacity_ml: null,
    us_equivalent: 'Large Wine Cask',
    valid_occasions: ['state_dinner', 'governor_summit', 'backyard_bbq'],
    short_description:
      'A large-bellied storage vessel with a small mouth, often with handles.',
    historical_fact:
      'Lei often featured taotie (饕餮) masks — mythical beasts believed to ward off evil spirits.',
    slip_description: 'Heavy bronze cask for storing fermented millet wine.',
    wine_meter_fill: null,
    model_asset: '/models/lei.glb',
    available: true,
  },
  {
    id: 'you',
    name_chinese: '卣',
    name_pinyin: 'Yǒu',
    name_english: 'You',
    category: 'storage',
    capacity_ml: null,
    us_equivalent: 'Lidded Wine Pot',
    valid_occasions: ['state_dinner', 'governor_summit', 'backyard_bbq'],
    short_description:
      'A lidded wine vessel with a swinging handle, often used to carry sacrificial wine.',
    historical_fact:
      'You vessels were sometimes shaped like a tiger embracing a man — one of the most enigmatic motifs in early Chinese art.',
    slip_description: 'Portable lidded vessel for transporting ritual wine.',
    wine_meter_fill: null,
    model_asset: '/models/you.glb',
    available: true,
  },
  {
    id: 'hu',
    name_chinese: '壶',
    name_pinyin: 'Hú',
    name_english: 'Hu',
    category: 'storage',
    capacity_ml: null,
    us_equivalent: 'Tall Wine Flask',
    valid_occasions: ['state_dinner', 'governor_summit', 'backyard_bbq'],
    short_description:
      'A tall pear-shaped vessel for storing wine or other liquids.',
    historical_fact:
      'Hu remained in use for over a thousand years, evolving from Shang ritual to Han household use.',
    slip_description: 'Elegant flask popular in the Eastern Zhou period.',
    wine_meter_fill: null,
    model_asset: '/models/hu.glb',
    available: true,
  },
  {
    id: 'gong',
    name_chinese: '觥',
    name_pinyin: 'Gōng',
    name_english: 'Gong',
    category: 'storage',
    capacity_ml: null,
    us_equivalent: 'Sculpted Wine Boat',
    valid_occasions: ['state_dinner', 'governor_summit', 'backyard_bbq'],
    short_description:
      'A boat-shaped vessel with a lid, often zoomorphic in form.',
    historical_fact:
      'Gong vessels frequently combined animals — half ox, half bird — symbolic of cosmic balance.',
    slip_description:
      'Decorative pouring vessel, prized for its sculptural form.',
    wine_meter_fill: null,
    model_asset: '/models/gong.glb',
    available: true,
  },
  {
    id: 'bu',
    name_chinese: '瓿',
    name_pinyin: 'Bù',
    name_english: 'Bu',
    category: 'storage',
    capacity_ml: null,
    us_equivalent: 'Squat Storage Jar',
    valid_occasions: ['state_dinner', 'governor_summit', 'backyard_bbq'],
    short_description:
      'A small, round-bellied storage vessel with a wide mouth.',
    historical_fact:
      'Bu were often used to store not only wine, but also salt and condiments in noble households.',
    slip_description: 'Squat utility vessel of moderate ritual importance.',
    wine_meter_fill: null,
    model_asset: '/models/bu.glb',
    available: true,
  },

  // ── Warming Vessels ─────────────────────────────────────────
  {
    id: 'jia',
    name_chinese: '斝',
    name_pinyin: 'Jiǎ',
    name_english: 'Jia',
    category: 'warming',
    capacity_ml: null,
    us_equivalent: 'Tripod Warmer',
    valid_occasions: ['state_dinner', 'governor_summit', 'backyard_bbq'],
    short_description:
      'A round vessel on three legs with two posts on the rim, used to warm wine over fire.',
    historical_fact:
      'Jia were placed directly over coals; the two posts let attendants lift the vessel without burning their hands.',
    slip_description:
      'Three-legged warming vessel — heat the wine before serving.',
    wine_meter_fill: null,
    model_asset: '/models/jia.glb',
    available: true,
  },
  {
    id: 'jue_warm',
    name_chinese: '爵',
    name_pinyin: 'Jué',
    name_english: 'Jue (Warming)',
    category: 'warming',
    capacity_ml: null,
    us_equivalent: 'Spouted Warmer',
    valid_occasions: ['state_dinner', 'governor_summit', 'backyard_bbq'],
    short_description:
      'A three-legged spouted vessel that doubled as both warmer and ceremonial cup.',
    historical_fact:
      'Jue is one of the earliest bronze vessels — the spout (流) and tail (尾) gave it perfect ritual symmetry.',
    slip_description:
      'Tripod spouted vessel — warms and pours in one elegant gesture.',
    wine_meter_fill: null,
    model_asset: '/models/jue.glb',
    available: true,
  },

  // ── Drinking Vessels ────────────────────────────────────────
  {
    id: 'jue',
    name_chinese: '爵',
    name_pinyin: 'Jué',
    name_english: 'Jue',
    category: 'drinking',
    capacity_ml: 200,
    us_equivalent: 'Small Sake Cup (Tall)',
    valid_occasions: [],
    short_description:
      'A small three-legged spouted cup used for libations and ceremonial sips.',
    historical_fact:
      'Jue capacity (≈200ml) was the unit of one "sip" in royal ritual.',
    slip_description:
      'Holds only ~200ml — too modest for a proper drinking ceremony.',
    wine_meter_fill: 20,
    model_asset: '/models/jue.glb',
    available: true,
  },
  {
    id: 'gu',
    name_chinese: '觚',
    name_pinyin: 'Gū',
    name_english: 'Gu',
    category: 'drinking',
    capacity_ml: 400,
    us_equivalent: 'Grande (Starbucks)',
    valid_occasions: ['governor_summit'],
    short_description:
      'A tall, slender, trumpet-mouthed drinking vessel — the elegant choice for nobles.',
    historical_fact:
      'Confucius lamented "a Gu that is no longer a Gu" — meaning ritual was being corrupted.',
    slip_description:
      'Elegant tall cup, ~400ml — proper for a feudal lord.',
    wine_meter_fill: 40,
    model_asset: '/models/gu.glb',
    available: false,
  },
  {
    id: 'zhi',
    name_chinese: '觯',
    name_pinyin: 'Zhì',
    name_english: 'Zhi',
    category: 'drinking',
    capacity_ml: 600,
    us_equivalent: 'Venti (Starbucks)',
    valid_occasions: ['state_dinner'],
    short_description:
      'A medium-sized drinking vessel with a lid, used at the highest ranks of ritual.',
    historical_fact:
      'Zhi was the cup of the Son of Heaven — its 600ml capacity reflects imperial dignity.',
    slip_description:
      'Lidded drinking vessel, ~600ml — fit for the Emperor himself.',
    wine_meter_fill: 60,
    model_asset: '/models/zhi.glb',
    available: true,
  },
  {
    id: 'jiao',
    name_chinese: '角',
    name_pinyin: 'Jiǎo',
    name_english: 'Jiao',
    category: 'drinking',
    capacity_ml: 800,
    us_equivalent: 'A Full Pint',
    valid_occasions: ['backyard_bbq'],
    short_description:
      'A large, horn-like drinking vessel without a spout — pure capacity.',
    historical_fact:
      'Jiao means "horn" — the form echoes the drinking horns of an even older era.',
    slip_description:
      'Largest of the drinking vessels, ~800ml — perfect for friends.',
    wine_meter_fill: 80,
    model_asset: '/models/jiao.glb',
    available: false,
  },
  {
    id: 'bei',
    name_chinese: '杯',
    name_pinyin: 'Bēi',
    name_english: 'Bei',
    category: 'drinking',
    capacity_ml: 100,
    us_equivalent: 'Espresso Shot',
    valid_occasions: [],
    short_description:
      'A small cup — but in the Bronze Age, bei did not yet mean what you think.',
    historical_fact:
      'The bei (杯) as a generic drinking cup belongs to the Han dynasty and later — it is anachronistic in a Bronze Age ritual.',
    slip_description:
      'WRONG ERA — this is a later Han-style cup, not a Bronze Age vessel.',
    wine_meter_fill: 10,
    model_asset: '/models/bei.glb',
    available: true,
  },
];

export const vesselById = (id: string) => vessels.find((v) => v.id === id);

export const vesselsByCategory = (cat: 'storage' | 'warming' | 'drinking') =>
  vessels.filter((v) => v.category === cat);
