import type { GameState } from '../types';

export interface CampaignEnding {
  id: string;
  title: string;
  description: string;
  score: number;
}

export function getCampaignEnding(state: GameState): CampaignEnding {
  const wonFinalLot = state.pastLots.includes('La Escritura Original de Mortaja, Martillo & Cia') || 
                      state.pastLots.includes('El Martillo Ancestral de Don Belisario') ||
                      state.pastLots.includes('La Corona de Sir Roquefort III') ||
                      state.pastLots.includes('La Salida de Emergencia') ||
                      (state.currentLot === null && state.turnCount >= 15);

  const hasEliteItems = state.inventory.filter(i => i.es_elite).length >= 2;
  const totalItems = state.inventory.length;

  const consciousObjects = state.inventory.filter((item) => item.agency && !['Dormido', 'Inquieto'].includes(item.agency));

  if (state.campaign.delirium.normalityResidual === 0) {
    return {
      id: 'normalidad_liquidada',
      title: '◈ FINAL: LA NORMALIDAD FUE ADJUDICADA ◈',
      description: 'La última norma estable se vende por una vocal usada. El edificio asume personalidad jurídica, los botones obtienen representación sindical y tu expediente queda como única descripción válida de la realidad. Nadie gana, pero todos reciben una factura.',
      score: 777
    };
  }

  if (consciousObjects.some((item) => item.agency === 'Propietario')) {
    const owner = consciousObjects.find((item) => item.agency === 'Propietario');
    return {
      id: 'objeto_propietario',
      title: '◈ FINAL: EL PATRIMONIO ADQUIERE AL POSTOR ◈',
      description: `${owner?.nombre_item || 'Uno de tus objetos'} demuestra que te mantuvo, transportó y administró durante toda la noche. El tribunal le concede tu propiedad. Como accesorio dependiente, conservas derecho a ser desempolvado una vez al mes.`,
      score: 666
    };
  }

  if (state.dossier.preferredInsultIntensity === 'auditoria' && state.campaign.composure <= 12 && state.campaign.storyLog.length >= 12) {
    return {
      id: 'expediente_compra_postor',
      title: '◈ FINAL: EL EXPEDIENTE COMPRA AL POSTOR ◈',
      description: 'Tus contradicciones se presentan como lote, pujan entre sí y forman una persona jurídica más coherente que tú. Mortaja, Martillo & Cía. conserva el expediente. Tú quedas archivado como anexo sin índice.',
      score: 917
    };
  }

  if (state.campaign.suspicion >= 85) {
    return {
      id: 'intervencion_fiscal',
      title: '◈ FINAL: INTERVENCIÓN FISCAL ABSOLUTA ◈',
      description: 'La Fiscal Serafina Timbre clausura las puertas del sótano con sellos oficiales de cera roja. Eres arrestado por evasión de tasas interdimensionales y tu inventario es confiscado para siempre.',
      score: 150
    };
  }

  if (state.budget < 100 && state.debt >= 8000) {
    return {
      id: 'insolvencia_eterna',
      title: '◈ FINAL: INSOLVENCIA ETERNA ◈',
      description: 'Tus acreedores y los secuaces de Don Sanguino te persiguen a través del laberinto del sótano. Tu firma se convierte en propiedad de la sala y tu deuda continuará acumulando intereses más allá de tu vida física.',
      score: 50
    };
  }

  if (state.curse >= 20) {
    return {
      id: 'comprador_comprado',
      title: '◈ FINAL: COMPRADOR COMPRADO ◈',
      description: 'La maldición acumulada de tus objetos distorsiona la realidad. Uno de tus objetos procedimentales compra tus derechos humanos en la última subasta. Ahora eres parte del Patrimonio Inexplicable en la vitrina.',
      score: 300
    };
  }

  if (wonFinalLot) {
    if (state.prestige >= 80) {
      return {
        id: 'nuevo_subastador',
        title: '◈ FINAL: EL NUEVO SUBASTADOR IMPERIAL ◈',
        description: 'Don Belisario Martillazo, exhausto y deprimido, te hace entrega de su martillo original. Te colocas el frac de terciopelo gastado y asumes la dirección de la subasta para el próximo grupo de insolventes.',
        score: 500
      };
    }

    if (state.curse >= 12 && totalItems >= 3) {
      return {
        id: 'rey_sumidero',
        title: '◈ FINAL: REY DEL SUMIDERO ◈',
        description: 'Te alias con Sir Roquefort III. Renuncias al presupuesto humano y eres coronado caballero de las ratas en el sótano inundado. Vives de las tasaciones ajenas y de las sobras de queso rancio.',
        score: 400
      };
    }


    if (hasEliteItems) {
      return {
        id: 'patrimonio_humanidad',
        title: '◈ FINAL: PATRIMONIO DE LA HUMANIDAD ◈',
        description: 'Tu colección de objetos raros y malditos es declarada de interés nacional-cultural por el Notario Sin Rostro. Eres recluido en un museo de antigüedades futuras para cuidar las reliquias eternamente.',
        score: 450
      };
    }

    if (state.campaign.soulSold) {
      return {
        id: 'persona_juridica',
        title: '◈ FINAL: PERSONA JURÍDICA POR ACCIDENTE ◈',
        description: 'Habiendo vendido tu alma a Sir Roquefort, el tribunal paranormal dictamina que dejas de ser una persona natural. Te conviertes en una sociedad anónima de responsabilidad limitada sin rostro.',
        score: 350
      };
    }

    // Default win
    return {
      id: 'adjudicado',
      title: '◈ FINAL: ADJUDICADO Y DUEÑO ◈',
      description: 'Adquieres la escritura del edificio de Mortaja, Martillo & Cía. Eres el nuevo dueño del sótano del teatro incendiado. Don Belisario te saluda con reverencia... justo antes de entregarte los gastos comunes atrasados por $450,000 pesos.',
      score: 600
    };
  }

  if (totalItems === 0 && state.debt === 0) {
    return {
      id: 'salida_emergencia',
      title: '◈ FINAL: SALIDA DE EMERGENCIA ◈',
      description: 'Consigues pasar de todas las ofertas y saldar todas tus cuentas. Abres la puerta oxidada que da al callejón trasero. El sol del amanecer toca tu rostro. Eres libre, pobre, pero completamente solvente.',
      score: 1000
    };
  }

  return {
    id: 'liquidacion_universo',
    title: '◈ FINAL: LIQUIDACIÓN COMPLETA ◈',
    description: 'Todo tu patrimonio inexplicable es subastado de vuelta para saldar cuentas. Te vas con los bolsillos vacíos, pero con un certificado oficial del Notario.',
    score: 200
  };
}
