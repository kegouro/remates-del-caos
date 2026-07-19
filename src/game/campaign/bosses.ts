import type { GameState, Bidder } from '../types';

export interface BossProfile extends Bidder {
  isBoss: boolean;
  bossType: 'viuda' | 'notario' | 'cobradora' | 'martillo' | 'publico';
  introLine: string;
  defeatLine: string;
  winLine: string;
}

export const BOSSES: BossProfile[] = [
  {
    id: 'boss_viuda',
    nombre: 'La Viuda del Retail',
    presupuesto: 18000,
    personalidad: 'Avariciosa y obsesiva. Duplica apuestas agresivamente.',
    agresividad: 0.85,
    isBoss: true,
    bossType: 'viuda',
    introLine: '¡Esas alfombras quemadas combinan perfecto con mis doce tarjetas de credito negras!',
    defeatLine: '¡Imposible! Mi cupo financiero estaba aprobado por el directorio...',
    winLine: 'Adjudicado. Otro trofeo para mis bodegas sin fecha de inauguracion.'
  },
  {
    id: 'boss_notario',
    nombre: 'El Notario Sin Rostro',
    presupuesto: 16000,
    personalidad: 'Burocratico, frio y letal. Altera clausulas en vivo.',
    agresividad: 0.6,
    isBoss: true,
    bossType: 'notario',
    introLine: 'Presente su declaracion jurada de solvencia antes de abrir la boca.',
    defeatLine: 'Apelare esta decision ante la Corte Suprema del Subsuelo.',
    winLine: 'Firma estampada. Este lote ahora forma parte de mi archivo nacional.'
  },
  {
    id: 'boss_cobradora',
    nombre: 'La Cobradora de las 4:17',
    presupuesto: 22000,
    personalidad: 'Una sombra implacable que te persigue fuera del tiempo.',
    agresividad: 0.9,
    isBoss: true,
    bossType: 'cobradora',
    introLine: 'Tus deudas de la infancia han vencido. Vengo a cobrar el saldo.',
    defeatLine: 'No importa. Volveras a despertar a las 4:17 y la cuenta seguira activa.',
    winLine: 'Tu tiempo se ha agotado. Deja de fingir que tienes el control.'
  },
  {
    id: 'boss_martillo',
    nombre: 'El Martillo de Don Belisario',
    presupuesto: 25000,
    personalidad: 'El martillo de madera original ha cobrado vida propia.',
    agresividad: 0.75,
    isBoss: true,
    bossType: 'martillo',
    introLine: '◈ ¡CRAC! Yo decido quien paga y quien se rompe el lomo ◈',
    defeatLine: '◈ ¡CLAC! El mango se astilla... por ahora ◈',
    winLine: '◈ ¡PUM! Vendido al precio de tu dignidad ◈'
  },
  {
    id: 'boss_publico',
    nombre: 'El Publico Susurrante',
    presupuesto: 35000,
    personalidad: 'Una masa amorfa de ojos goticos y sombras en los balcones.',
    agresividad: 0.95,
    isBoss: true,
    bossType: 'publico',
    introLine: 'Susurramos tus confesiones... todo esta en los contratos.',
    defeatLine: 'Las sombras se disipan con la luz del amanecer...',
    winLine: 'Te has unido a nuestra coleccion permanente de deudores.'
  }
];

export function getBossProfile(bossType: 'viuda' | 'notario' | 'cobradora' | 'martillo' | 'publico'): BossProfile {
  const found = BOSSES.find(b => b.bossType === bossType);
  if (!found) {
    throw new Error(`Boss profile ${bossType} not found`);
  }
  return found;
}

export function applyBossActiveMechanic(state: GameState, currentRivalBid: number): { nextBid: number; bidsLogText: string; stateMutation?: Partial<GameState> } {
  if (!state.campaign.activeBossId) {
    return { nextBid: currentRivalBid, bidsLogText: '' };
  }

  const boss = BOSSES.find(b => b.id === state.campaign.activeBossId);
  if (!boss) return { nextBid: currentRivalBid, bidsLogText: '' };

  let nextBid = currentRivalBid;
  let bidsLogText = '';
  const mutation: Partial<GameState> = {};

  if (boss.bossType === 'viuda') {
    // She bids 25% more than the active bid instead of the increment
    nextBid = Math.floor(state.activeBid * 1.25);
    bidsLogText = `${boss.nombre} duplica agresivamente la puja a $${nextBid} con su tarjeta de crédito.`;
  } else if (boss.bossType === 'notario') {
    // Altera la letra pequeña y aumenta la sospecha fiscal del jugador
    nextBid = currentRivalBid;
    bidsLogText = `${boss.nombre} puja $${nextBid} y estampa un timbre de sospecha sobre tus papeles.`;
    mutation.campaign = {
      ...state.campaign,
      suspicion: Math.min(100, state.campaign.suspicion + 5)
    };
  } else if (boss.bossType === 'cobradora') {
    // Puja y baja la compostura del jugador
    nextBid = currentRivalBid;
    bidsLogText = `${boss.nombre} puja $${nextBid} murmurando tus deudas pasadas. Pierdes compostura.`;
    mutation.campaign = {
      ...state.campaign,
      composure: Math.max(0, state.campaign.composure - 6)
    };
  } else if (boss.bossType === 'martillo') {
    // Automatically bids higher
    nextBid = currentRivalBid + 300;
    bidsLogText = `El Martillo Viviente golpea la mesa e incrementa la puja a $${nextBid}.`;
  } else if (boss.bossType === 'publico') {
    // Bids standard, but drains composure and raises suspicion
    nextBid = currentRivalBid;
    bidsLogText = `El Público Susurrante puja $${nextBid}. Los susurros llenan la sala.`;
    mutation.campaign = {
      ...state.campaign,
      composure: Math.max(0, state.campaign.composure - 4),
      suspicion: Math.min(100, state.campaign.suspicion + 4)
    };
  }

  return { nextBid, bidsLogText, stateMutation: mutation };
}
