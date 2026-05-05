import type { Vessel } from '@/types';

export const vessels: Vessel[] = [
  // ── Storage Vessels (盛酒器) ────────────────────────────────
  {
    id: 'zun',
    name_chinese: '尊',
    name_pinyin: 'Zūn',
    name_english: 'Ritual Wine Vessel',
    category: 'storage',
    capacity_ml: null,
    us_equivalent: null,
    valid_occasions: ['state_dinner', 'governor_summit', 'backyard_bbq'],
    short_description:
      'The most prestigious storage vessel in Zhou dynasty ceremonies. Tall, wide-mouthed, and often shaped like an animal — elephant, rhinoceros, owl, or tiger.',
    historical_fact:
      'The character 尊 (zūn) is the root of the modern Chinese word for "respect" (尊重, zūnzhòng). Owning a fine zūn signaled both wealth and ritual authority.',
    slip_description:
      'You chose the most important vessel in the room just to store the wine. No one said anything. They didn\'t have to.',
    wine_meter_fill: null,
    model_asset: '/models/zun.glb',
    available: true,
  },
  {
    id: 'yi',
    name_chinese: '彝',
    name_pinyin: 'Yí',
    name_english: 'Square Ritual Vessel',
    category: 'storage',
    capacity_ml: null,
    us_equivalent: null,
    valid_occasions: ['state_dinner', 'governor_summit', 'backyard_bbq'],
    short_description:
      'A rectangular or square bronze container used to store ritual wine. Often covered with dense taotie (monster mask) patterns and used exclusively in formal ancestral ceremonies.',
    historical_fact:
      'The 彝 was considered one of the six major ritual bronze categories in the Zhou dynasty. Its square shape symbolized the earth in ancient Chinese cosmology.',
    slip_description:
      'You grabbed the sacred ancestral vessel like it was a cooler at a tailgate. Your ancestors are filing a formal complaint.',
    wine_meter_fill: null,
    model_asset: '/models/yi.glb',
    available: true,
  },
  {
    id: 'lei',
    name_chinese: '罍',
    name_pinyin: 'Léi',
    name_english: 'Large Storage Jar',
    category: 'storage',
    capacity_ml: null,
    us_equivalent: 'A full keg',
    valid_occasions: ['state_dinner', 'governor_summit', 'backyard_bbq'],
    short_description:
      'One of the largest bronze storage vessels, used to hold wine before a ceremony. Typically round or square with a lid, featuring bold decorative bands and animal-shaped handles.',
    historical_fact:
      'The 罍 appears in the Book of Songs (《诗经》): "We have a guest; let the 罍 be brought out." It was a vessel of hospitality and abundance.',
    slip_description:
      'You hauled in a vessel the size of a keg to a formal imperial banquet. Logistically impressive. Socially catastrophic.',
    wine_meter_fill: null,
    model_asset: '/models/lei.glb',
    available: true,
  },
  {
    id: 'you',
    name_chinese: '卣',
    name_pinyin: 'Yǒu',
    name_english: 'Oval Spirit Container',
    category: 'storage',
    capacity_ml: null,
    us_equivalent: null,
    valid_occasions: ['state_dinner', 'governor_summit', 'backyard_bbq'],
    short_description:
      'An oval vessel with a swing handle and lid, used to store a special fragrant wine called 秬鬯 (jù chàng) used in ritual libations. One of the most distinctive shapes in Bronze Age China.',
    historical_fact:
      'The 卣 was specifically associated with storing 秬鬯, a black millet wine infused with fragrant herbs and used in shamanistic rituals to summon ancestral spirits.',
    slip_description:
      'This vessel was meant for summoning ancestors, not for serving guests. There\'s an awkward spiritual energy at the table now.',
    wine_meter_fill: null,
    model_asset: '/models/you.glb',
    available: true,
  },
  {
    id: 'hu',
    name_chinese: '壶',
    name_pinyin: 'Hú',
    name_english: 'Everyday Wine Flask',
    category: 'storage',
    capacity_ml: null,
    us_equivalent: 'A water pitcher',
    valid_occasions: ['backyard_bbq', 'governor_summit'],
    short_description:
      'A general-purpose long-necked vessel used to store and sometimes pour wine. Far more common and less prestigious than the 尊 or 彝 — it was the everyday flask of the Bronze Age.',
    historical_fact:
      'By the Warring States period, the 壶 had become so common that it appeared in everyday household use, not just ceremonial contexts — the ancient equivalent of bringing your own bottle.',
    slip_description:
      'You brought a pitcher. To a State Dinner. At the White House. With the Emperor watching.',
    wine_meter_fill: null,
    model_asset: '/models/hu.glb',
    available: true,
  },
  {
    id: 'gong',
    name_chinese: '觥',
    name_pinyin: 'Gōng',
    name_english: 'Penalty Cup Vessel',
    category: 'storage',
    capacity_ml: null,
    us_equivalent: 'The vessel equivalent of a red card',
    valid_occasions: ['state_dinner', 'governor_summit', 'backyard_bbq'],
    short_description:
      'A large, often animal-shaped vessel (typically a horned beast) used as a penalty cup at banquets. When someone broke the rules of ceremony, they were made to drink from the 觥.',
    historical_fact:
      'The phrase 觥筹交错 (gōng chóu jiāo cuò), still used in modern Chinese, describes a lively banquet scene where penalty cups and tally sticks are flying. The 觥 was the ancient equivalent of a drinking game punishment.',
    slip_description:
      'You served wine in the punishment cup. Everyone immediately assumed someone was in trouble. They looked at you. They were right.',
    wine_meter_fill: null,
    model_asset: '/models/gong.glb',
    available: true,
  },
  {
    id: 'bu',
    name_chinese: '瓿',
    name_pinyin: 'Bù',
    name_english: 'Small Storage Jar',
    category: 'storage',
    capacity_ml: null,
    us_equivalent: 'A mason jar',
    valid_occasions: ['backyard_bbq'],
    short_description:
      'A small, round, wide-mouthed jar used to store wine or sauces. Squat and practical, the 瓿 was more utilitarian than ceremonial — think of it as the ancient mason jar.',
    historical_fact:
      'The 瓿 was frequently used to store not just wine but also fermented sauces and food, making it one of the most versatile vessels of the Shang and Zhou periods.',
    slip_description:
      'You showed up to the Governor\'s Summit with what is essentially a mason jar. Points for authenticity. Zero points for everything else.',
    wine_meter_fill: null,
    model_asset: '/models/bu.glb',
    available: true,
  },

  // ── Warming Vessels (温酒器) ────────────────────────────────
  {
    id: 'jia',
    name_chinese: '斝',
    name_pinyin: 'Jiǎ',
    name_english: 'Ritual Wine Warmer',
    category: 'warming',
    capacity_ml: null,
    us_equivalent: 'An ancient version of a milk frother — but for wine',
    valid_occasions: ['state_dinner', 'governor_summit', 'backyard_bbq'],
    short_description:
      'A three-legged vessel with two posts on the rim, used to warm wine over a fire before serving. The legs were designed to sit directly over heat sources, making it the original portable wine warmer.',
    historical_fact:
      'The 斝 is one of the oldest bronze vessel forms, appearing as early as the Erlitou culture (c. 1900–1500 BCE). It may have evolved from ceramic predecessors used in Neolithic ritual brewing.',
    slip_description:
      'At least you got the warming right. One out of three isn\'t bad. Actually, yes it is.',
    wine_meter_fill: null,
    model_asset: '/models/jia.glb',
    available: true,
  },
  {
    id: 'jue_warm',
    name_chinese: '爵',
    name_pinyin: 'Jué',
    name_english: 'Pouring and Warming Cup',
    category: 'warming',
    capacity_ml: 200,
    us_equivalent: 'Starbucks Tall (12oz)',
    valid_occasions: ['state_dinner', 'governor_summit', 'backyard_bbq'],
    short_description:
      'The most iconic bronze vessel of ancient China — a three-legged cup with a pouring spout and a tail, used for both warming wine over a flame and drinking. The 爵 could serve double duty at a ceremony.',
    historical_fact:
      'The 爵 is so central to Chinese bronze culture that the word itself became the root of the nobility ranking system (爵位, juéwèi) — the five ranks of Zhou aristocracy. Your rank literally named after this cup.',
    slip_description:
      'You tried to warm the wine in a drinking cup. The wine is now lukewarm, the cup is scorched, and your host is reconsidering the invitation.',
    wine_meter_fill: null,
    model_asset: '/models/jue.glb',
    available: true,
  },

  // ── Drinking Vessels (饮酒器) ───────────────────────────────
  {
    id: 'jue',
    name_chinese: '爵',
    name_pinyin: 'Jué',
    name_english: 'Ritual Drinking Cup',
    category: 'drinking',
    capacity_ml: 200,
    us_equivalent: 'Starbucks Tall (12oz) — the smallest order',
    valid_occasions: ['state_dinner', 'governor_summit', 'backyard_bbq'],
    short_description:
      'The most recognizable bronze vessel in Chinese history. Three-legged, with a long pouring spout, a pointed tail, and two mushroom-shaped posts on the rim. Holds about 200ml — a modest, controlled pour.',
    historical_fact:
      'According to 《周礼·考工记》, the 爵 holds exactly one 升 (shēng), approximately 200ml by modern estimation. It is the baseline unit of the Zhou drinking hierarchy — every other vessel is measured relative to the 爵.',
    slip_description:
      'You ordered the Tall at a State Dinner. The Emperor has had more wine spilled at this table than you just poured. Embarrassing.',
    wine_meter_fill: 20,
    model_asset: '/models/jue.glb',
    available: true,
  },
  {
    id: 'gu',
    name_chinese: '觚',
    name_pinyin: 'Gū',
    name_english: 'Slender Ceremonial Goblet',
    category: 'drinking',
    capacity_ml: 400,
    us_equivalent: 'Starbucks Grande (16oz) — the safe middle choice',
    valid_occasions: ['governor_summit'],
    short_description:
      'A tall, slender, elegantly flared goblet used by nobility at formal banquets. Its elongated form made it visually impressive — the ancient equivalent of drinking from a champagne flute at a state reception.',
    historical_fact:
      'The 觚 holds two 升, or approximately 400ml. Its tall narrow form required a steady hand — spilling from a 觚 at a formal banquet was considered a serious breach of etiquette.',
    slip_description:
      'A fine choice — for a Governor\'s Summit. You\'re at a Backyard BBQ. Your champagne-flute energy is making everyone uncomfortable.',
    wine_meter_fill: 40,
    model_asset: '/models/gu.glb',
    available: true,
  },
  {
    id: 'zhi',
    name_chinese: '觯',
    name_pinyin: 'Zhì',
    name_english: 'Noble\'s Drinking Vessel',
    category: 'drinking',
    capacity_ml: 600,
    us_equivalent: 'Starbucks Venti (20oz) — the power move',
    valid_occasions: ['state_dinner'],
    short_description:
      'A rounded, slightly oval drinking vessel reserved for the highest-ranking guests at a ceremony. Dignified in proportion, significant in volume — the 觯 signals status without ostentation.',
    historical_fact:
      '《礼记·礼器》 states directly: "尊者举觯，卑者举角" — "The noble raises the Zhì; the humble raises the Jiǎo." The 觯 is the vessel of rank by ancient law.',
    slip_description:
      'You grabbed the Emperor\'s cup at a Backyard BBQ. It\'s not wrong exactly — it\'s just a lot. Your host noticed. Everyone noticed.',
    wine_meter_fill: 60,
    model_asset: '/models/zhi.glb',
    available: true,
  },
  {
    id: 'jiao',
    name_chinese: '角',
    name_pinyin: 'Jiǎo',
    name_english: 'Commoner\'s Horn Cup',
    category: 'drinking',
    capacity_ml: 800,
    us_equivalent: 'A full Pint — the classic BBQ order',
    valid_occasions: ['backyard_bbq'],
    short_description:
      'The largest standard drinking vessel, shaped like an animal horn, used by lower-ranking guests at ceremonies. Holds nearly a full pint — generous, unpretentious, and built for drinking rather than display.',
    historical_fact:
      '《礼记·礼器》 pairs the 角 directly with the 觯 as opposites in the drinking hierarchy: noble uses 觯, humble uses 角. Unlike the 觯, the 角 has no posts on the rim, making it slightly less formal in appearance.',
    slip_description:
      'You showed up to the White House State Dinner with the ancient equivalent of a pint glass. The Secret Service has questions.',
    wine_meter_fill: 80,
    model_asset: '/models/jiao.glb',
    available: true,
  },
  {
    id: 'bei',
    name_chinese: '杯',
    name_pinyin: 'Bēi',
    name_english: 'Han Dynasty Drinking Cup',
    category: 'drinking',
    capacity_ml: 100,
    us_equivalent: 'An espresso shot — tiny and historically misplaced',
    valid_occasions: [],
    short_description:
      'A small, simple drinking cup that became popular during the Han dynasty — roughly 500 years after the Zhou ritual bronze age. Selecting this vessel means you\'ve arrived at the wrong century entirely.',
    historical_fact:
      'The lacquerware 杯 replaced bronze drinking vessels during the Han dynasty as lacquer production became cheaper and more widespread. Finding one at a Zhou dynasty banquet would be like bringing a smartphone to a medieval feast.',
    slip_description:
      'A cup? That won\'t exist for another 500 years. Somehow you\'ve managed to time-travel to the Han Dynasty mid-ceremony. The Emperor is confused. The historians are furious.',
    wine_meter_fill: 10,
    model_asset: '/models/bei.glb',
    available: true,
  },
];

export const vesselById = (id: string) => vessels.find((v) => v.id === id);

export const vesselsByCategory = (cat: 'storage' | 'warming' | 'drinking') =>
  vessels.filter((v) => v.category === cat);
