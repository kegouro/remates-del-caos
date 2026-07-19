export type CampaignMode = 'breve' | 'completa' | 'infinita';

export type CampaignAct = 'PROLOGUE' | 'ACT_I' | 'ACT_II' | 'ACT_III' | 'ACT_IV' | 'ACT_V' | 'ENDING';

export interface DebtSplits {
  bancaria: number;
  espectral: number;
  moral: number;
  sanguino: number;
  unremembered: number;
}

export interface PlayerRelationships {
  [npcId: string]: {
    trust: number;
    fear: number;
    debt: number;
    suspicion: number;
  };
}

export type ConsentScope =
  | 'alias'
  | 'weaknesses'
  | 'objects'
  | 'habits'
  | 'crimes'
  | 'aesthetic'
  | 'files'
  | 'clipboard'
  | 'screenshot'
  | 'environment';

export type RoastIntensity = 'cortesia' | 'honesta' | 'demolicion' | 'auditoria';
export type AnomalyFrequency = 'escasa' | 'medida' | 'febril' | 'realidad_sin_licencia';
export type ProfanityLevel = 'ninguna' | 'moderada' | 'fuerte' | 'terminal_buses';

export type AuctionFormatId = 'normal' | 'ciega' | 'compostura' | 'prestigio' | 'testamentaria';
export type AuctionCurrency = 'liquidez' | 'compostura' | 'prestigio';

export type OmenId =
  | 'third_refusal'
  | 'debt_mirror'
  | 'awakened_witness'
  | 'missing_coin'
  | 'normality_funeral'
  | 'fraudulent_crown'
  | 'confession_returns'
  | 'collector_consumed';

export interface Omen {
  id: OmenId;
  title: string;
  prophecy: string;
  condition: string;
  rewardLabel: string;
  motif: string;
}



export type DailyModifierId =
  | 'hungry_house'
  | 'fiscal_opening'
  | 'soul_market'
  | 'future_installment'
  | 'hostile_gallery'
  | 'inheritance_error';

export interface DailyChallenge {
  id: DailyModifierId;
  seed: string;
  date: string;
  label: string;
  description: string;
  rule: string;
}

export type HouseBargainId =
  | 'feed_object'
  | 'applause_loan'
  | 'sell_composure'
  | 'lease_name'
  | 'fiscal_ratification'
  | 'future_installment';

export interface HouseBargain {
  id: HouseBargainId;
  title: string;
  description: string;
  costLabel: string;
  rewardLabel: string;
  warning: string;
  motif: string;
  available: boolean;
}

export interface AuctionFormat {
  id: AuctionFormatId;
  name: string;
  description: string;
  currency: AuctionCurrency;
  hidesLot: boolean;
  debtOnWin: number;
  curseOnWin: number;
}

export interface StoryBeat {
  id: string;
  turn: number;
  kind: 'lote' | 'deuda' | 'relacion' | 'anomalia' | 'objeto' | 'confesion' | 'juicio' | 'casa';
  title: string;
  text: string;
  motif?: string;
  importance: 1 | 2 | 3 | 4 | 5;
}

export interface BidderDossier {
  alias: string;
  ceremonialTitle: string;
  declaredOccupation?: string;
  aestheticPreferences: string[];
  recurringWords: string[];
  habits: string[];
  fictionalWeaknesses: string[];
  embarrassingObjects: string[];
  suspiciousTimes: string[];
  emotionalCurrencies: string[];
  inventedCrimes: string[];
  preferredInsultIntensity: RoastIntensity;
  forbiddenTopics: string[];
  consentScopes: ConsentScope[];
  questionCount: number;
  anomalyFrequency: AnomalyFrequency;
  absurdityLevel: number;
  profanityLevel: ProfanityLevel;
  publicHumiliation: boolean;
  longCallbacks: boolean;
  fileMetadataList?: { name: string; size: number; type: string; lastModified: number }[];
  pastedEvidence?: string;
  screenshotPalette?: string[];
  screenshotBrightness?: 'claro' | 'oscuro';
  wallpaperMetadata?: { colors: string[]; description?: string };
}

export interface DossierTrace {
  field: keyof BidderDossier;
  source: string;
  uses: string[];
  lastUsedTimestamp?: string;
}

export interface DeliriumChoice {
  id: string;
  label: string;
  hint: string;
}

export interface DeliriumAnomaly {
  id: string;
  title: string;
  description: string;
  character: string;
  severity: 1 | 2 | 3 | 4 | 5;
  motif: string;
  choices: DeliriumChoice[];
  epilogue?: string;
}

export interface DeliriumState {
  entropy: number;
  tension: number;
  absurdity: number;
  anomalyBudget: number;
  normalityResidual: number;
  motifs: string[];
  dormantCallbacks: string[];
  anomalyHistory: string[];
  currentAnomaly: DeliriumAnomaly | null;
  lastAnomalyTurn: number;
  activeRealityRule: string | null;
  microEvent: string | null;
  blackSwanUsed: boolean;
}

export interface CampaignData {
  mode: CampaignMode;
  act: CampaignAct;
  debtSplits: DebtSplits;
  composure: number;
  influence: number;
  soulFragments: number;
  suspicion: number;
  relationships: PlayerRelationships;
  factionsReputation: { [factionId: string]: number };
  activeMissions: string[];
  completedMissions: string[];
  discoveredRituals: string[];
  daysChallenge: boolean;
  dailyChallenge: DailyChallenge | null;
  currentArea: 'salon' | 'taller' | 'tribunal' | 'tuneles' | 'archivo' | 'capilla';
  inspectedItemId: string | null;
  activeBossId: string | null;
  newspaperHeadline: string | null;
  newspaperText: string | null;
  newspaperStage: 'act' | 'event' | null;
  lastNewspaperTurn: number;
  soulSold: boolean;
  patienceBelisario: number;
  precedentsCount: number;
  delirium: DeliriumState;
  auctionFormat: AuctionFormat;
  storyLog: StoryBeat[];
  consecutivePasses: number;
  lostByOneCount: number;
  houseDisposition: number;
  houseHunger: number;
  audienceMood: number;
  omenChoices: Omen[];
  chosenOmen: Omen | null;
  omenCompleted: boolean;
  omenMessage: string | null;
  lotIntelRevealed: boolean;
  auctionTricksUsed: string[];
  pendingBargains: HouseBargain[];
  lastBargainTurn: number;
}


export interface PrologueChoices {
  alias: string;
  treatment: string;
  reason: string;
  initialDebt: number;
  personalItemName: string;
  confession: string;
  seed: string;
}
