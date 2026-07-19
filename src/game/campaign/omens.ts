import type { GameState } from '../types';
import type { Omen, OmenId } from './types';
import { appendStoryBeat, makeStoryBeat } from './story';

function clean(value: string | undefined, fallback: string): string {
  const normalized = (value || '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();
  return (normalized || fallback).slice(0, 78);
}

function pick<T>(values: readonly T[], rng: () => number): T {
  return values[Math.floor(rng() * values.length)];
}

export function generateOmenChoices(state: GameState, rng: () => number): Omen[] {
  const personal = clean(
    state.dossier.embarrassingObjects[0] || state.dossier.habits[0] || state.prologue?.personalItemName,
    'una promesa con manchas de café'
  );
  const motif = clean(pick(state.campaign.delirium.motifs, rng), 'la hora 4:17');

  const catalogue: Omen[] = [
    {
      id: 'third_refusal',
      title: 'LA TERCERA NEGATIVA ABRIRÁ UNA PUERTA',
      prophecy: `Tres veces deberás rechazar aquello que la casa jure indispensable. A la tercera, una salida fingirá haber estado allí desde siempre.`,
      condition: 'Deja pasar tres lotes consecutivos.',
      rewardLabel: '+3 Influencia, +1 Fragmento de Alma',
      motif: 'puertas que cobran entrada'
    },
    {
      id: 'debt_mirror',
      title: 'LA DEUDA APRENDERÁ TU NOMBRE',
      prophecy: `Cuando tus obligaciones superen seis mil, el espejo contable devolverá una cifra que no pediste y una versión de ti que sí firmó.`,
      condition: 'Alcanza $6.000 de deuda.',
      rewardLabel: '+$2.000, +1 Fragmento, +2 Maldición',
      motif: 'deuda con caligrafía propia'
    },
    {
      id: 'awakened_witness',
      title: 'LO QUE COMPRES DECLARARÁ CONTRA TI',
      prophecy: `Conserva un objeto hasta que despierte. Cuando exija derechos, escúchalo antes de que contrate al Notario.`,
      condition: 'Consigue un objeto Consciente o superior.',
      rewardLabel: '+20 Prestigio, +2 Influencia',
      motif: 'objetos con personalidad jurídica'
    },
    {
      id: 'missing_coin',
      title: 'EL PESO FALTANTE REGRESARÁ CON TESTIGOS',
      prophecy: `Perderás por una diferencia obscena. Si ocurre dos veces, la casa reconocerá que el peso era una entidad y no una cantidad.`,
      condition: 'Pierde dos lotes después de haber pujado.',
      rewardLabel: '+$1.000, +15 Prestigio',
      motif: 'el peso faltante'
    },
    {
      id: 'normality_funeral',
      title: 'LA NORMALIDAD SERÁ VELADA SIN CUERPO',
      prophecy: `Cuando el salón conserve menos de dos tercios de realidad, ${motif} oficiará el funeral y tú figurarás como familiar directo.`,
      condition: 'Reduce la Normalidad Residual a 65% o menos.',
      rewardLabel: '+2 Fragmentos, +2 Influencia, +1 Maldición',
      motif
    },
    {
      id: 'fraudulent_crown',
      title: 'LA CORONA ELEGIRÁ LA CABEZA EQUIVOCADA',
      prophecy: `Reúne cincuenta puntos de prestigio fraudulento. La corona te reconocerá por el brillo y luego revisará la documentación.`,
      condition: 'Alcanza 50 de Prestigio Fraudulento.',
      rewardLabel: '+$1.500, +10 Sospecha Fiscal',
      motif: 'coronas con due diligence'
    },
    {
      id: 'confession_returns',
      title: 'LO CONFESADO VOLVERÁ CON PRECIO DE RESERVA',
      prophecy: `Entrega tres declaraciones. Una de ellas regresará convertida en lote, y “${personal}” será citada como procedencia legítima.`,
      condition: 'Entrega tres confesiones durante la campaña.',
      rewardLabel: '+12 Prestigio, +3 Influencia',
      motif: personal
    },
    {
      id: 'collector_consumed',
      title: 'EL QUINTO OBJETO TE AÑADIRÁ A SU INVENTARIO',
      prophecy: `Acumula cinco bienes. El quinto presentará una lista donde tú aparecerás debajo de “accesorios incluidos”.`,
      condition: 'Conserva cinco objetos simultáneamente.',
      rewardLabel: '+1 Fragmento, +18 Prestigio',
      motif: 'inventarios recíprocos'
    }
  ];

  const ranked = catalogue
    .map((omen) => ({ omen, key: rng() }))
    .sort((a, b) => a.key - b.key)
    .map(({ omen }) => omen);

  return ranked.slice(0, 3);
}

export function getOmenProgress(state: GameState, omen: Omen): { current: number; target: number; label: string } {
  switch (omen.id) {
    case 'third_refusal':
      return { current: Math.min(3, state.campaign.consecutivePasses), target: 3, label: 'rechazos consecutivos' };
    case 'debt_mirror':
      return { current: Math.min(6000, state.debt), target: 6000, label: 'deuda reconocida' };
    case 'awakened_witness': {
      const ranks = ['Dormido', 'Inquieto', 'Consciente', 'Hostil', 'Sindicalizado', 'Litigante', 'Propietario'];
      const awake = state.inventory.some((item) => ranks.indexOf(item.agency || 'Dormido') >= 2);
      return { current: awake ? 1 : 0, target: 1, label: 'testigo despierto' };
    }
    case 'missing_coin':
      return { current: Math.min(2, state.campaign.lostByOneCount), target: 2, label: 'derrotas archivadas' };
    case 'normality_funeral':
      return { current: Math.max(0, 100 - state.campaign.delirium.normalityResidual), target: 35, label: 'normalidad liquidada' };
    case 'fraudulent_crown':
      return { current: Math.min(50, state.prestige), target: 50, label: 'prestigio fraudulento' };
    case 'confession_returns':
      return { current: Math.min(3, state.confessions.length), target: 3, label: 'declaraciones entregadas' };
    case 'collector_consumed':
      return { current: Math.min(5, state.inventory.length), target: 5, label: 'bienes acumulados' };
  }
}

function isComplete(state: GameState, id: OmenId): boolean {
  const omen = state.campaign.chosenOmen;
  if (!omen || omen.id !== id) return false;
  const progress = getOmenProgress(state, omen);
  return progress.current >= progress.target;
}

export function resolveChosenOmen(state: GameState): GameState {
  const omen = state.campaign.chosenOmen;
  if (!omen || state.campaign.omenCompleted || !isComplete(state, omen.id)) return state;

  let next: GameState = {
    ...state,
    campaign: {
      ...state.campaign,
      omenCompleted: true,
      omenMessage: `PRESAGIO CUMPLIDO: ${omen.title}. ${omen.rewardLabel}.`,
      storyLog: appendStoryBeat(state.campaign.storyLog, makeStoryBeat(
        state.turnCount,
        'casa',
        `Presagio cumplido: ${omen.title}`,
        `${omen.prophecy} La casa pagó la recompensa y negó cualquier participación causal.`,
        5,
        omen.motif
      ))
    }
  };

  switch (omen.id) {
    case 'third_refusal':
      next = { ...next, campaign: { ...next.campaign, influence: next.campaign.influence + 3, soulFragments: next.campaign.soulFragments + 1, houseDisposition: next.campaign.houseDisposition + 3 } };
      break;
    case 'debt_mirror':
      next = { ...next, budget: next.budget + 2000, curse: next.curse + 2, campaign: { ...next.campaign, soulFragments: next.campaign.soulFragments + 1, houseHunger: Math.min(100, next.campaign.houseHunger + 12) } };
      break;
    case 'awakened_witness':
      next = { ...next, prestige: next.prestige + 20, campaign: { ...next.campaign, influence: next.campaign.influence + 2, audienceMood: Math.min(100, next.campaign.audienceMood + 15) } };
      break;
    case 'missing_coin':
      next = { ...next, budget: next.budget + 1000, prestige: next.prestige + 15 };
      break;
    case 'normality_funeral':
      next = { ...next, curse: next.curse + 1, campaign: { ...next.campaign, influence: next.campaign.influence + 2, soulFragments: next.campaign.soulFragments + 2 } };
      break;
    case 'fraudulent_crown':
      next = { ...next, budget: next.budget + 1500, campaign: { ...next.campaign, suspicion: Math.min(100, next.campaign.suspicion + 10) } };
      break;
    case 'confession_returns':
      next = { ...next, prestige: next.prestige + 12, campaign: { ...next.campaign, influence: next.campaign.influence + 3 } };
      break;
    case 'collector_consumed':
      next = { ...next, prestige: next.prestige + 18, campaign: { ...next.campaign, soulFragments: next.campaign.soulFragments + 1 } };
      break;
  }

  return {
    ...next,
    dialogueBubble: {
      character: 'balance',
      text: `${omen.title}. ${omen.prophecy} La profecía se ha cumplido y ahora pretende cobrar derechos de autor.`
    }
  };
}
