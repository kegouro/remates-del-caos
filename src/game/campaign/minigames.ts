import type { GameState } from '../types';

export interface MinigameState {
  type: 'firma' | 'timbre' | 'tasacion';
  prompt: string;
  answer: string;
  options?: string[];
  timeLeft: number;
}

export function startMinigame(type: 'firma' | 'timbre' | 'tasacion', seed: string): MinigameState {
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  if (type === 'firma') {
    const codes = ['Aprobado66B', 'EmbargoMoral10', 'DeudaLiquida4', 'ExorcismoFiel7', 'JurisprudenciaX'];
    const chosen = codes[hash % codes.length];
    return {
      type: 'firma',
      prompt: `Copia la firma exactamente antes de que venza el contrato: "${chosen}"`,
      answer: chosen,
      timeLeft: 6
    };
  } else if (type === 'timbre') {
    const docs = [
      { name: 'Formulario de Liquidación de Bienes', stamp: 'EMBARGADO' },
      { name: 'Solicitud de Préstamo de Órganos', stamp: 'DENEGADO' },
      { name: 'Contrato de Arriendo de Letras Pequeñas', stamp: 'ACEPTADO' }
    ];
    const chosen = docs[hash % docs.length];
    return {
      type: 'timbre',
      prompt: `Estampa el sello correcto para: "${chosen.name}"`,
      answer: chosen.stamp,
      options: ['ACEPTADO', 'DENEGADO', 'EMBARGADO'],
      timeLeft: 8
    };
  } else {
    // tasacion
    const items = [
      { name: 'Un sillón de dentista del siglo pasado', value: 800 },
      { name: 'La dentadura postiza de plata oxidada', value: 300 },
      { name: 'Un contrato firmado con sangre de paloma', value: 1200 }
    ];
    const chosen = items[hash % items.length];
    return {
      type: 'tasacion',
      prompt: `Estima el precio justo de salida para: "${chosen.name}" (Acierta dentro del rango)`,
      answer: String(chosen.value),
      timeLeft: 10
    };
  }
}

export function resolveMinigameResult(state: GameState, success: boolean, type: 'firma' | 'timbre' | 'tasacion'): GameState {
  const newState = { ...state };
  newState.campaign = { ...state.campaign };

  if (success) {
    if (type === 'firma') {
      newState.prestige += 15;
      newState.bidsLog.push('Firma estampada con éxito. Ganaste +15 Prestigio.');
    } else if (type === 'timbre') {
      newState.campaign.influence += 4;
      newState.bidsLog.push('Documento despachado. Ganaste +4 de Influencia.');
    } else {
      newState.budget += 600;
      newState.bidsLog.push('Tasación acertada. Ganaste $600 pesos de honorarios.');
    }
  } else {
    newState.campaign.composure = Math.max(0, newState.campaign.composure - 12);
    if (type === 'firma') {
      newState.debt += 400;
      newState.campaign.debtSplits.bancaria += 400;
      newState.bidsLog.push('Fallo de firma. Penalización de $400 en deuda bancaria, -12 Compostura.');
    } else if (type === 'timbre') {
      newState.campaign.suspicion += 15;
      newState.bidsLog.push('Sello erróneo. Ganaste +15 de Sospecha Fiscal, -12 Compostura.');
    } else {
      newState.bidsLog.push('Tasación fallida. Perdiste -12 Compostura.');
    }
  }

  // Cap stats
  newState.campaign.composure = Math.min(100, Math.max(0, newState.campaign.composure));
  newState.campaign.suspicion = Math.min(100, Math.max(0, newState.campaign.suspicion));

  return newState;
}
