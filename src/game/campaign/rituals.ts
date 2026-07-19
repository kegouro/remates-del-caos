import type { GameState } from '../types';

export type SecretRitualId =
  | 'chair_trinity'
  | 'seventh_refusal'
  | 'final_reincidence'
  | 'rat_coronation'
  | 'palindromic_debt';

export interface SecretRitual {
  id: SecretRitualId;
  title: string;
  description: string;
  reward: string;
  speaker: string;
  motif: string;
}

export const SECRET_RITUALS: Record<SecretRitualId, SecretRitual> = {
  chair_trinity: {
    id: 'chair_trinity',
    title: 'LA SANTÍSIMA TRINIDAD DEL ASIENTO',
    description: 'Tres sillas reconocen simultáneamente que ninguna ha sido utilizada para sentarse. El salón las declara consejo directivo.',
    reward: '+3 influencia · +5 prestigio · normalidad −7',
    speaker: 'garantia',
    motif: 'sillas jerárquicas'
  },
  seventh_refusal: {
    id: 'seventh_refusal',
    title: 'LA HUELGA DEL POSTOR INMÓVIL',
    description: 'Tras siete negativas, la casa descubre que no puede alimentarse de una decisión que nunca ocurrió. Las paredes presentan disculpas sin firma.',
    reward: '+7 influencia · +10 prestigio · hambre 0',
    speaker: 'subastador',
    motif: 'silencio adjudicado'
  },
  final_reincidence: {
    id: 'final_reincidence',
    title: 'EL TERCER ARCHIVO DEFINITIVO',
    description: 'Tres documentos distintos juran ser la versión final. La contradicción genera espontáneamente un fragmento de alma editorial.',
    reward: '+1 fragmento · +8 prestigio · normalidad −5',
    speaker: 'fiscal',
    motif: 'finales reincidentes'
  },
  rat_coronation: {
    id: 'rat_coronation',
    title: 'CORONACIÓN DEL ACTIVO DESALMADO',
    description: 'Una corona dentro del inventario reconoce la venta del alma y nombra al postor noble murino de responsabilidad ilimitada.',
    reward: '+2 fragmentos · +15 prestigio · +3 maldición',
    speaker: 'rata',
    motif: 'corona verdadera'
  },
  palindromic_debt: {
    id: 'palindromic_debt',
    title: 'LA DEUDA SE LEE IGUAL EN AMBAS DIRECCIONES',
    description: 'El monto adeudado forma un palíndromo. Don Sanguino lo interpreta como firma bilateral del universo.',
    reward: '+2 influencia · +1 fragmento · +6 sospecha',
    speaker: 'sanguino',
    motif: 'números reversibles'
  }
};

function containsChair(value: string): boolean {
  return /silla|sillón|asiento|banqueta|taburete/i.test(value);
}

function isPalindromeDebt(debt: number): boolean {
  if (debt < 101) return false;
  const value = Math.floor(debt).toString();
  return value === [...value].reverse().join('');
}

export function detectSecretRitual(state: GameState): SecretRitual | null {
  const discovered = new Set(state.campaign.discoveredRituals);
  const available = (id: SecretRitualId) => !discovered.has(id);

  if (
    available('rat_coronation') &&
    state.campaign.soulSold &&
    state.inventory.some((item) => /corona|diadema|tiara/i.test(item.nombre_item))
  ) return SECRET_RITUALS.rat_coronation;

  if (
    available('chair_trinity') &&
    state.inventory.filter((item) => containsChair(`${item.nombre_item} ${item.descripcion}`)).length >= 3
  ) return SECRET_RITUALS.chair_trinity;

  if (available('seventh_refusal') && state.campaign.consecutivePasses >= 7) {
    return SECRET_RITUALS.seventh_refusal;
  }

  const finalFiles = (state.dossier.fileMetadataList || []).filter((file) => /final|definitiv|v\d+/i.test(file.name));
  if (available('final_reincidence') && finalFiles.length >= 3) {
    return SECRET_RITUALS.final_reincidence;
  }

  if (available('palindromic_debt') && isPalindromeDebt(state.debt)) {
    return SECRET_RITUALS.palindromic_debt;
  }

  return null;
}
