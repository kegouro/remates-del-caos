import type { CampaignData, PrologueChoices, BidderDossier, DossierTrace, AuctionCurrency } from '../campaign/types';

export interface AuctionLot {
  id: string;
  nombre_item: string;
  descripcion: string;
  puja_inicial: number;
  letra_pequena: string;
  es_elite: boolean;
  rareza: string;
  categoria: string;
  precio_compra?: number;
  moneda_compra?: AuctionCurrency;
  procedencia?: string;
  valor_estimado?: number;
  valor_real?: number;
  peso_legal?: number;
  efecto_pasivo?: string;
  comentario_rata?: string;
  estado_emocional?: string;
  degradacion?: number;
  motifs?: string[];
  agency?: 'Dormido' | 'Inquieto' | 'Consciente' | 'Hostil' | 'Sindicalizado' | 'Litigante' | 'Propietario';
  desire?: string;
  callbackText?: string;
  sourceDetail?: string;
  visualVariant?: string;
  petitionAgency?: AuctionLot['agency'];
  petitionText?: string;
}

export interface InventoryItem extends AuctionLot {
  precio_compra: number;
  procedencia: string;
  valor_estimado: number;
  valor_real: number;
  peso_legal: number;
  efecto_pasivo: string;
  comentario_rata: string;
  degradacion: number;
}

export interface Bidder {
  id: string;
  nombre: string;
  presupuesto: number;
  personalidad: string;
  agresividad: number; // 0.0 to 1.0 multiplier
  grudge?: number;
  wins?: number;
  tell?: string;
  obsession?: string;
  shakenUntilTurn?: number;
}

export type GameStatus =
  | 'INTRO'
  | 'DOSSIER_SCREEN'
  | 'PROLOGUE_SCREEN'
  | 'OMEN_SCREEN'
  | 'BARGAIN_SCREEN'
  | 'LOT_REVEAL'
  | 'BIDDING'
  | 'LOT_WON'
  | 'LOT_LOST'
  | 'INTERMISSION'
  | 'TALLER_SCREEN'
  | 'TRIBUNAL_SCREEN'
  | 'TUNELES_SCREEN'
  | 'EVENT_SCREEN'
  | 'NEWSPAPER_SCREEN'
  | 'ANOMALY_SCREEN'
  | 'FINAL_APPRAISAL'
  | 'BANKRUPTCY';

export interface ChatMessage {
  role: 'user' | 'npc';
  text: string;
}

export interface GameState {
  status: GameStatus;
  budget: number;
  debt: number;
  debtTurns: number;
  prestige: number;
  curse: number;
  inventory: InventoryItem[];
  currentLot: AuctionLot | null;
  pastLots: string[];
  turnCount: number;
  activeBid: number;
  highestBidder: string; // "Tú" or bidder.nombre
  biddingActive: boolean;
  rivals: Bidder[];
  bidsLog: string[];
  chatHistory: {
    subastador: ChatMessage[];
    fantasma: ChatMessage[];
    rata: ChatMessage[];
    sanguino: ChatMessage[];
    fiscal: ChatMessage[];
    engrudo: ChatMessage[];
    balance: ChatMessage[];
    viuda: ChatMessage[];
    notario: ChatMessage[];
    nino: ChatMessage[];
    filomena: ChatMessage[];
    cardenas: ChatMessage[];
    ujier: ChatMessage[];
    infanta: ChatMessage[];
    garantia: ChatMessage[];
    cobradora: ChatMessage[];
  };
  confessions: string[];
  seed: string;
  musicOn: boolean;
  voiceOn: boolean;
  volumeMusic: number;
  volumeVoice: number;
  ghostBribed: boolean;
  dialogueBubble: {
    character: string; // 'subastador' | 'fantasma' | etc.
    text: string;
  } | null;
  campaign: CampaignData;
  prologue: PrologueChoices | null;
  dossier: BidderDossier;
  dossierTraces: DossierTrace[];
}
