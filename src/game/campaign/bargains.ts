import type { GameState } from '../types';
import type { HouseBargain, HouseBargainId } from './types';

const BARGAINS: Record<HouseBargainId, Omit<HouseBargain, 'available'>> = {
  feed_object: {
    id: 'feed_object',
    title: 'Entregar un objeto a las paredes',
    description: 'La casa exige la pieza menos defendible de tu patrimonio. Promete masticarla lejos del público.',
    costLabel: 'Pierdes un objeto',
    rewardLabel: '+2 fragmentos de alma · Hambre −28',
    warning: 'El objeto será retirado del inventario y recordado como víctima arquitectónica.',
    motif: 'paredes con apetito'
  },
  applause_loan: {
    id: 'applause_loan',
    title: 'Adelanto garantizado con aplausos futuros',
    description: 'El público financia tu próxima mala decisión a cambio de una ovación todavía no ocurrida.',
    costLabel: '+$2.200 de deuda moral',
    rewardLabel: '+$1.500 · +8 prestigio',
    warning: 'Los aplausos pasarán a ser propiedad de la casa hasta nuevo aviso.',
    motif: 'aplausos hipotecados'
  },
  sell_composure: {
    id: 'sell_composure',
    title: 'Liquidar dieciocho puntos de compostura',
    description: 'Mortaja, Martillo & Cía. compra tu capacidad de fingir que todo está bajo control.',
    costLabel: '−18 compostura',
    rewardLabel: '+4 influencia · Hambre −14',
    warning: 'Las paredes conservarán el derecho a citar tu expresión facial.',
    motif: 'compostura en liquidación'
  },
  lease_name: {
    id: 'lease_name',
    title: 'Arrendar temporalmente tu nombre',
    description: 'Durante el resto del acto, tu nombre será un activo de la casa y podrá figurar en formularios ajenos.',
    costLabel: '−12 prestigio',
    rewardLabel: '+$900 · +1 fragmento de alma',
    warning: 'No incluye derecho preferente a recuperarlo con la misma ortografía.',
    motif: 'nombres arrendados'
  },
  fiscal_ratification: {
    id: 'fiscal_ratification',
    title: 'Ratificar una procedencia que jamás existió',
    description: 'La Fiscal Timbre ofrece convertir una mentira pequeña en una verdad administrativamente resistente.',
    costLabel: '+16 sospecha · +2 maldición',
    rewardLabel: '+12 prestigio · +2 influencia',
    warning: 'Una verdad timbrada sigue siendo una mentira, pero posee mejores abogados.',
    motif: 'verdades timbradas'
  },
  future_installment: {
    id: 'future_installment',
    title: 'Cobrar hoy una cuota de tu próxima campaña',
    description: 'Don Sanguino adelanta dinero perteneciente a una versión futura de ti que todavía no puede objetar.',
    costLabel: '+$1.800 deuda no recordada',
    rewardLabel: '+$1.800 · Hambre −8',
    warning: 'La próxima versión del postor puede presentarse como acreedora.',
    motif: 'futuros empeñados'
  }
};

function bargainAvailable(id: HouseBargainId, state: GameState): boolean {
  if (id === 'feed_object') return state.inventory.length > 0;
  if (id === 'sell_composure') return state.campaign.composure >= 18;
  if (id === 'lease_name') return state.prestige >= 12;
  return true;
}

export function shouldOfferHouseBargain(state: GameState): boolean {
  if (state.turnCount < 2 || state.campaign.lastBargainTurn === state.turnCount) return false;
  if (state.campaign.pendingBargains.length > 0) return false;
  return state.campaign.houseHunger >= 70 || (state.turnCount % 4 === 0 && state.campaign.houseHunger >= 38);
}

export function generateHouseBargains(state: GameState, rng: () => number): HouseBargain[] {
  const pool = (Object.keys(BARGAINS) as HouseBargainId[])
    .filter((id) => bargainAvailable(id, state))
    .map((id) => ({ ...BARGAINS[id], available: true }));

  const shuffled = [...pool];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled.slice(0, Math.min(3, shuffled.length));
}
