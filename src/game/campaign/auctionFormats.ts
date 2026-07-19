import type { GameState } from '../types';
import type { AuctionCurrency, AuctionFormat } from './types';

export const NORMAL_AUCTION_FORMAT: AuctionFormat = {
  id: 'normal',
  name: 'Subasta Ordinariamente Ilegal',
  description: 'El dinero conserva su función tradicional: abandonar tu cuenta para convertirse en problema.',
  currency: 'liquidez',
  hidesLot: false,
  debtOnWin: 0,
  curseOnWin: 0
};

const SPECIAL_FORMATS: AuctionFormat[] = [
  {
    id: 'ciega',
    name: 'Subasta Ciega de Contenido No Verificado',
    description: 'El lote permanece lacrado hasta el martillazo. Solo se revelan su rareza y su dudosa categoría.',
    currency: 'liquidez',
    hidesLot: true,
    debtOnWin: 0,
    curseOnWin: 1
  },
  {
    id: 'compostura',
    name: 'Subasta por Compostura',
    description: 'Aquí no se paga con dinero. Cada puja entrega públicamente una porción de tu capacidad de fingir normalidad.',
    currency: 'compostura',
    hidesLot: false,
    debtOnWin: 0,
    curseOnWin: 1
  },
  {
    id: 'prestigio',
    name: 'Subasta de Reputación Inflada',
    description: 'Las ofertas se expresan en prestigio. Ganar prueba que estabas dispuesto a perderlo por algo peor.',
    currency: 'prestigio',
    hidesLot: false,
    debtOnWin: 0,
    curseOnWin: 0
  },
  {
    id: 'testamentaria',
    name: 'Subasta Testamentaria con Pasivos',
    description: 'El ganador hereda el objeto, sus obligaciones y una deuda que el fallecido tuvo la delicadeza de no explicar.',
    currency: 'liquidez',
    hidesLot: false,
    debtOnWin: 0.5,
    curseOnWin: 2
  }
];

export function chooseAuctionFormat(state: GameState, rng: () => number): AuctionFormat {
  const delirium = state.campaign.delirium;
  const chance = Math.min(0.52, 0.06 + delirium.absurdity / 350 + (100 - delirium.normalityResidual) / 420);
  if (state.turnCount <= 1 || state.campaign.activeBossId || rng() > chance) return NORMAL_AUCTION_FORMAT;

  const eligible = SPECIAL_FORMATS.filter((format) => {
    if (format.currency === 'compostura') return state.campaign.composure >= 18;
    if (format.currency === 'prestigio') return state.prestige >= 12;
    return true;
  });
  return eligible[Math.floor(rng() * eligible.length)] || NORMAL_AUCTION_FORMAT;
}

export function getAuctionCapacity(state: GameState): number {
  const currency: AuctionCurrency = state.campaign.auctionFormat.currency;
  if (currency === 'compostura') return state.campaign.composure;
  if (currency === 'prestigio') return state.prestige;
  return state.budget;
}

export function getAuctionCurrencyLabel(format: AuctionFormat): string {
  if (format.currency === 'compostura') return 'puntos de compostura';
  if (format.currency === 'prestigio') return 'puntos de prestigio';
  return 'pesos';
}

export function formatAuctionAmount(format: AuctionFormat, amount: number): string {
  if (format.currency === 'liquidez') return `$${amount.toLocaleString()}`;
  return `${amount} ${format.currency === 'compostura' ? 'COM' : 'PRE'}`;
}
