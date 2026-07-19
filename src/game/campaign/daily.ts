import type { DailyChallenge, DailyModifierId } from './types';

const MODIFIERS: Record<DailyModifierId, Omit<DailyChallenge, 'seed' | 'date'>> = {
  hungry_house: {
    id: 'hungry_house',
    label: 'LA CASA DESAYUNÓ PATRIMONIO',
    description: 'El edificio comienza con hambre crítica, pero deja influencia extra sobre la mesa.',
    rule: 'Hambre inicial 78 · +2 influencia'
  },
  fiscal_opening: {
    id: 'fiscal_opening',
    label: 'SERAFINA LLEGÓ ANTES QUE TÚ',
    description: 'La inspección ya está abierta. Obtienes prestigio por notoriedad y sospecha por respirar cerca del expediente.',
    rule: '+8 prestigio · 28 sospecha fiscal'
  },
  soul_market: {
    id: 'soul_market',
    label: 'MERCADO DE ALMAS A LA BAJA',
    description: 'Dos fragmentos de alma aparecen en tu bolsillo. Nadie quiere explicar de quién eran.',
    rule: '+2 fragmentos · +3 maldición · −$1.000'
  },
  future_installment: {
    id: 'future_installment',
    label: 'TU YO FUTURO YA PIDIÓ EL PRÉSTAMO',
    description: 'Recibes liquidez hoy y una deuda procedente de una campaña que todavía no has jugado.',
    rule: '+$1.800 · +$1.800 deuda no recordada'
  },
  hostile_gallery: {
    id: 'hostile_gallery',
    label: 'EL PÚBLICO VINO A VERTE FALLAR',
    description: 'La galería comienza hostil, pero la tensión social vuelve más valiosa cualquier maniobra.',
    rule: 'Público −45 · +3 influencia · +6 prestigio'
  },
  inheritance_error: {
    id: 'inheritance_error',
    label: 'HERENCIA DESTINADA A OTRA PERSONA',
    description: 'El sistema te acredita patrimonio, deuda y estatus de un difunto administrativamente parecido.',
    rule: '+$1.200 · +$1.600 deuda · +10 prestigio'
  }
};

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

export function getUtcDateKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function getDailyChallenge(date = new Date()): DailyChallenge {
  const dateKey = getUtcDateKey(date);
  const ids = Object.keys(MODIFIERS) as DailyModifierId[];
  const id = ids[hash(`mortaja:${dateKey}`) % ids.length];
  return {
    ...MODIFIERS[id],
    seed: `remate-diario-${dateKey}`,
    date: dateKey
  };
}
