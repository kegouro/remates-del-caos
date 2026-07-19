import type { GameState } from '../types';

export interface NewspaperEdition {
  headline: string;
  text: string;
  motif: string;
}

function safe(value: string | undefined, fallback: string): string {
  const cleaned = (value || '').replace(/[<>]/g, '').trim();
  return cleaned ? cleaned.slice(0, 80) : fallback;
}

export function generateNewspaperEdition(state: GameState): NewspaperEdition {
  const alias = safe(state.dossier.alias || state.prologue?.alias, state.prologue?.treatment || 'Postor sin representación');
  const motif = safe(state.campaign.delirium.motifs[0], 'formularios húmedos');
  const latest = [...state.campaign.storyLog].reverse().find((beat) => beat.importance >= 3);
  const ownerObject = state.inventory.find((item) => item.agency === 'Propietario');
  const consciousObject = state.inventory.find((item) => ['Consciente', 'Sindicalizado', 'Litigante', 'Propietario'].includes(item.agency || ''));
  const rule = state.campaign.delirium.activeRealityRule;

  if (ownerObject) {
    return {
      headline: `OBJETO ADQUIERE A SU COMPRADOR EN OPERACIÓN SIN PRECEDENTES`,
      text: `${ownerObject.nombre_item} figura ahora como propietario legal de ${alias}. Sir Roquefort calificó la operación como “la primera tasación coherente de la noche”.`,
      motif: ownerObject.motifs?.[0] || motif
    };
  }

  if (state.campaign.delirium.normalityResidual <= 20) {
    return {
      headline: `NORMALIDAD CAE BAJO 20%; PALOMA NIEGA RESPONSABILIDAD`,
      text: `${alias} continúa pujando mientras ${motif} aparece por cuarta vez en documentos que oficialmente no comparten autor. ${latest?.text || 'La casa se abstuvo de explicar por qué el techo solicitó una firma.'}`,
      motif
    };
  }

  if (state.debt >= 6000) {
    return {
      headline: `ACREEDORES CELEBRAN CRECIMIENTO DE ${alias.toUpperCase()}`,
      text: `La deuda consolidada alcanzó $${state.debt.toLocaleString('es-CL')}. Don Sanguino negó estar preocupado y encargó un marco para exhibir el pagaré. ${latest?.title ? `El precedente más reciente, “${latest.title}”, ya fue ofrecido como garantía.` : ''}`,
      motif: 'deuda'
    };
  }

  if (state.campaign.suspicion >= 55) {
    return {
      headline: `FISCAL TIMBRE ABRE EXPEDIENTE CONTRA PERSONA, INVENTARIO Y MIÉRCOLES`,
      text: `${alias} acumula ${state.campaign.suspicion} puntos de sospecha y al menos ${state.inventory.length} objetos con procedencia discutible. La defensa sostiene que el miércoles tampoco presentó identificación.`,
      motif: 'fiscalización'
    };
  }

  if (state.curse >= 12) {
    return {
      headline: `MALDICIÓN PATRIMONIAL SUPERA ÍNDICE DE HUMEDAD DEL SUBSUELO`,
      text: `Vecinos reportan que el inventario de ${alias} pronuncia cláusulas durante la madrugada. ${consciousObject ? `${consciousObject.nombre_item} exigió derecho a réplica y una silla propia.` : `Sir Roquefort recomienda no alimentar a ${motif} después de medianoche.`}`,
      motif: consciousObject?.motifs?.[0] || 'maldición'
    };
  }

  if (state.prestige >= 45) {
    return {
      headline: `POSTOR CONVIERTE MALAS DECISIONES EN PATRIMONIO CULTURAL`,
      text: `${alias} alcanzó ${state.prestige} puntos de Prestigio Fraudulento. Don Belisario felicitó su “capacidad de hacer que una pérdida parezca curaduría”. El público exige saber quién financió ${motif}.`,
      motif: 'prestigio'
    };
  }

  if (rule) {
    return {
      headline: `REGLA LOCAL DEJA DE REGIR; AUTORIDADES CULPAN AL INVENTARIO`,
      text: `La norma ${rule} continúa alterando el remate. ${alias} declaró no haber leído la letra pequeña, afirmación que la letra pequeña celebró como victoria sindical.`,
      motif
    };
  }

  return {
    headline: `EL AVALÚO NACIONAL: ${motif.toUpperCase()} DOMINA LA NOCHE`,
    text: `${alias} sobrevive otro acto en Mortaja, Martillo & Cía. ${latest ? `La portada registra: ${latest.text}` : 'La casa asegura que todo sigue normal, versión que nadie solicitó confirmar.'}`,
    motif
  };
}
