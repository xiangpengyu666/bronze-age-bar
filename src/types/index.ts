export type VesselCategory = 'storage' | 'warming' | 'drinking';

export type OccasionId = 'state_dinner' | 'governor_summit' | 'backyard_bbq';

export type OutcomeTier = 'perfect' | 'minor_breach' | 'total_disgrace';

export interface Vessel {
  id: string;
  name_chinese: string;
  name_pinyin: string;
  name_english: string;
  category: VesselCategory;
  capacity_ml: number | null;
  us_equivalent: string | null;
  valid_occasions: OccasionId[];
  short_description: string;
  historical_fact: string;
  slip_description: string;
  wine_meter_fill: number | null;
  model_asset: string;
  available?: boolean;
}

export interface Occasion {
  id: OccasionId;
  name_english: string;
  flavor: string;
  hidden_rank: string;
  us_equivalent: string;
  correct_drinking: string;
}

export interface StoryEntry {
  id: string;
  occasion: OccasionId;
  outcome_tier: OutcomeTier;
  bei_triggered: boolean;
  text: string;
}

export type GamePhase =
  | 'start'
  | 'occasion'
  | 'storage'
  | 'warming'
  | 'drinking'
  | 'cinematic'
  | 'result';

export interface Selections {
  storage: string | null;
  warming: string | null;
  drinking: string | null;
}
