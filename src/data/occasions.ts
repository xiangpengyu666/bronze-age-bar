import type { Occasion } from '@/types';

export const occasions: Occasion[] = [
  {
    id: 'state_dinner',
    name_english: 'State Dinner',
    flavor:
      'The Emperor himself has invited you. Every gesture is being watched.',
    hidden_rank: 'Son of Heaven (天子)',
    us_equivalent: 'White House State Dinner',
    correct_drinking: 'zhi',
  },
  {
    id: 'governor_summit',
    name_english: "Governor's Summit",
    flavor:
      'Regional lords gather. Impressions matter, but there is room to breathe.',
    hidden_rank: 'Feudal Lord (诸侯)',
    us_equivalent: 'Multi-State Political Summit',
    correct_drinking: 'gu',
  },
  {
    id: 'backyard_bbq',
    name_english: 'Backyard BBQ',
    flavor:
      'A relaxed gathering among friends. Just don’t embarrass yourself.',
    hidden_rank: 'Scholar-Official (士大夫)',
    us_equivalent: 'American Backyard BBQ',
    correct_drinking: 'jiao',
  },
];

export const occasionById = (id: string) =>
  occasions.find((o) => o.id === id);
