import type { GameState, InventoryItem } from '../types';
import type { BidderDossier, DeliriumAnomaly, DeliriumState } from './types';

function pick<T>(items: readonly T[], rng: () => number): T {
  return items[Math.floor(rng() * items.length)];
}

function unique(items: string[]): string[] {
  return [...new Set(items.filter(Boolean))];
}

function trimDetail(value: string | undefined, fallback: string): string {
  const clean = (value || '').trim().replace(/[<>]/g, '');
  return clean ? clean.slice(0, 90) : fallback;
}

export function createInitialDelirium(seed: string, dossier: BidderDossier, rng: () => number): DeliriumState {
  const personalMotifs = [
    dossier.embarrassingObjects[0],
    dossier.habits[0],
    dossier.aestheticPreferences[0],
    dossier.suspiciousTimes[0],
    dossier.inventedCrimes[0]
  ].map((v) => trimDetail(v, ''));

  const houseMotifs = [
    'palomas accionistas',
    'formularios color vino',
    'la hora 4:17',
    'objetos incompletos',
    'recibos que respiran',
    'la letra E',
    'sillas con jurisprudencia',
    'lluvia dentro del teatro',
    'una canción que nadie reconoce',
    'herencias de personas vivas'
  ];

  const shuffled = [...houseMotifs].sort(() => rng() - 0.5);
  const motifs = unique([...personalMotifs, ...shuffled.slice(0, 4)]).slice(0, 7);

  const frequencyBudget = {
    escasa: 4,
    medida: 6,
    febril: 8,
    realidad_sin_licencia: 11
  }[dossier.anomalyFrequency];

  return {
    entropy: Math.floor(rng() * 12),
    tension: 0,
    absurdity: Math.max(20, Math.min(100, dossier.absurdityLevel)),
    anomalyBudget: frequencyBudget,
    normalityResidual: 100,
    motifs: motifs.length ? motifs : [`expediente ${seed.slice(0, 4)}`],
    dormantCallbacks: [],
    anomalyHistory: [],
    currentAnomaly: null,
    lastAnomalyTurn: -10,
    activeRealityRule: null,
    microEvent: null,
    blackSwanUsed: false
  };
}

const MICRO_EVENTS = [
  'Una rata cruza el salón cargando una moneda mucho más grande que ella.',
  'El retrato de Casimiro pestañea. Casimiro no tiene párpados registrados.',
  'Un precio cambia por un segundo y vuelve fingiendo inocencia.',
  'Desde otra habitación llega un martillazo que ocurre antes de su eco.',
  'Una silla del público queda vacía. Nadie recuerda que estuviera ocupada.',
  'Una nota al pie acusa al párrafo principal de enriquecimiento ilícito.',
  'La sombra de Don Sanguino firma algo antes de que él levante la pluma.',
  'Una paloma observa la subasta desde una cornisa interior que ayer no existía.',
  'La música ensaya tres notas de una escena que todavía no ha ocurrido.',
  'Sir Roquefort anota la trayectoria del cursor en un libro contable diminuto.'
] as const;

export function generateMicroEvent(state: GameState, rng: () => number): string | null {
  const chance = 0.12 + state.campaign.delirium.absurdity / 500;
  if (rng() > chance) return null;
  const motif = pick(state.campaign.delirium.motifs, rng);
  const base = pick(MICRO_EVENTS, rng);
  if (rng() < 0.35) return `${base} Alguien susurra: “Esto empezó por ${motif}”.`;
  return base;
}

function getPersonalDetail(state: GameState, rng: () => number): string {
  const dossier = state.dossier;
  return pick(
    unique([
      ...dossier.embarrassingObjects,
      ...dossier.habits,
      ...dossier.fictionalWeaknesses,
      ...dossier.recurringWords,
      ...(state.confessions.length ? state.confessions : [])
    ]),
    rng
  ) || 'una promesa que claramente no sobrevivió al fin de semana';
}

function makeAnomaly(state: GameState, rng: () => number): DeliriumAnomaly {
  const motif = pick(state.campaign.delirium.motifs, rng);
  const personal = trimDetail(getPersonalDetail(state, rng), 'una carpeta llamada final');
  const available: DeliriumAnomaly[] = [
    {
      id: 'pigeon_shareholder',
      title: 'LA PALOMA SOLICITA MAYORÍA ACCIONARIA',
      description: `La paloma que llevaba rondas observando el salón aterriza sobre el martillo con una escritura. Afirma haber adquirido el 31% de Mortaja, Martillo & Cía. usando como garantía “${personal}”.`,
      character: 'rata',
      severity: 3,
      motif: 'palomas accionistas',
      choices: [
        { id: 'feed', label: 'Pagar $300 en alpiste fiduciario', hint: 'Ganas prestigio murino, pierdes liquidez humana.' },
        { id: 'contest', label: 'Impugnar la calidad jurídica del ave', hint: 'Aumenta la sospecha fiscal. Las palomas tienen abogados.' }
      ]
    },
    {
      id: 'buttons_union',
      title: 'LOS BOTONES DECLARAN HUELGA',
      description: `Los controles de la subasta exigen pausas reglamentarias, mejores etiquetas y el derecho a negarse cuando intentes convertir “${personal}” en una inversión.`,
      character: 'subastador',
      severity: 2,
      motif: 'sindicato de botones',
      choices: [
        { id: 'sign', label: 'Firmar el convenio colectivo', hint: 'Cuesta $200, pero recuperas influencia.' },
        { id: 'break', label: 'Romper la huelga a martillazos', hint: 'Pierdes compostura y los botones recordarán tu nombre.' }
      ]
    },
    {
      id: 'object_awakes',
      title: 'UN OBJETO PRESENTA PERSONALIDAD JURÍDICA',
      description: state.inventory.length
        ? `${state.inventory[state.inventory.length - 1].nombre_item} solicita salario, un nombre menos humillante y protección frente a tus decisiones de compra.`
        : `Una silla vacía solicita personalidad jurídica y te nombra como accesorio dependiente. El expediente cita “${personal}” como precedente.`,
      character: 'fiscal',
      severity: 3,
      motif,
      choices: [
        { id: 'negotiate', label: 'Reconocer sus derechos laborales', hint: 'El objeto despierta, pero puede ayudarte más adelante.' },
        { id: 'lock', label: 'Guardarlo dentro de un contrato', hint: 'Aumenta la maldición. El contrato aprende a golpear.' }
      ]
    },
    {
      id: 'past_self',
      title: 'ENTRA EL POSTOR QUE SÍ TERMINÓ',
      description: `Una versión de ${state.dossier.alias || 'ti'} entra con mejor postura, una carpeta cerrada y evidencia de haber terminado “${personal}”. Pide competir por tus próximos lotes.`,
      character: 'subastador',
      severity: 4,
      motif: 'versiones alternativas',
      choices: [
        { id: 'hire', label: 'Contratarlo como asesor', hint: 'Se incorpora como rival y vigila tus pujas.' },
        { id: 'challenge', label: 'Desafiarlo públicamente', hint: 'Ganas prestigio, pierdes compostura.' }
      ]
    },
    {
      id: 'letter_embargo',
      title: 'LA LETRA E HA SIDO EMBARGADA',
      description: `La Fiscal Timbre informa que la vocal más endeudada del castellano queda fuera de circulación. Casimiro intenta venderte tres “e” usadas dentro de un sobre marcado ${motif}.`,
      character: 'fiscal',
      severity: 2,
      motif: 'la letra E',
      choices: [
        { id: 'buy', label: 'Comprar vocales de contrabando por $417', hint: 'La escritura continúa, pero la fiscal toma nota.' },
        { id: 'refuse', label: 'Hablar con documentación defectuosa', hint: 'Activa una regla de realidad temporal.' }
      ]
    },
    {
      id: 'house_hungry',
      title: 'EL EDIFICIO TIENE HAMBRE',
      description: `Las paredes pronuncian tu tratamiento ceremonial y exigen alimento. Aparentemente el teatro se nutre de objetos, deuda moral y frases que empiezan con “mañana”.`,
      character: 'fantasma',
      severity: 4,
      motif: 'el edificio despierto',
      choices: [
        { id: 'feed_item', label: 'Entregar el último objeto adquirido', hint: 'La casa queda satisfecha. Tu inventario no.' },
        { id: 'feed_debt', label: 'Firmar una deuda moral de $1.200', hint: 'Conservas el objeto y alimentas algo peor.' }
      ]
    },
    {
      id: 'pause_menu_auction',
      title: 'EL MENÚ DE PAUSA SALE A REMATE',
      description: `El botón de pausa presenta títulos de dominio y solicita postores. Afirma que lleva años sosteniendo tus retiradas estratégicas, incluyendo “${personal}”.`,
      character: 'subastador', severity: 3, motif: 'componentes sindicalizados',
      choices: [
        { id: 'buy', label: 'Comprar el derecho a detenerte por $400', hint: 'Recuperas influencia. La casa cobra por respirar.' },
        { id: 'cede', label: 'Ceder el menú a la Viuda del Retail', hint: 'La pausa conservará controles técnicos, pero te juzgará.' }
      ]
    },
    {
      id: 'debt_liquid',
      title: 'LA DEUDA SE VUELVE LÍQUIDA',
      description: `Una sustancia color vino comienza a gotear desde tus cifras. Don Sanguino confirma que es deuda de cosecha tardía con notas de ${motif}.`,
      character: 'sanguino', severity: 3, motif: 'deuda líquida',
      choices: [
        { id: 'bottle', label: 'Embotellarla como activo artesanal', hint: 'Obtienes un objeto consciente y reduces una parte de la deuda.' },
        { id: 'drink', label: 'Beber para internalizar la obligación', hint: 'Reduce más deuda, aumenta maldición y arruina la compostura.' }
      ]
    },
    {
      id: 'portrait_escape',
      title: 'UN RETRATO ABANDONA SU MARCO',
      description: `La silueta de ${pick(['Casimiro', 'Sir Roquefort', 'Don Belisario', 'la Fiscal Timbre'], rng)} baja del retrato. El marco vacío asegura que siempre fue él quien hacía el trabajo.`,
      character: 'ujier', severity: 2, motif: 'marcos vacíos',
      choices: [
        { id: 'chase', label: 'Seguir las huellas de tinta', hint: 'Pierdes compostura y encuentras un rumor valioso.' },
        { id: 'rent', label: 'Arrendar el marco por $250', hint: 'El marco se convierte en espacio adicional de prestigio.' }
      ]
    },
    {
      id: 'vowel_market',
      title: 'SE ABRE EL MERCADO NEGRO DE VOCALES',
      description: `La Infanta del Recargo ofrece comprar una vocal de tu alias. Casimiro ya vendió dos de “${personal}” y afirma que no eran tuyas.`,
      character: 'infanta', severity: 3, motif: 'vocales embargadas',
      choices: [
        { id: 'sell', label: 'Vender una vocal y conservar el recibo', hint: 'Ganas influencia. Los textos futuros cobran recargo lingüístico.' },
        { id: 'buyback', label: 'Recomprar el alfabeto por $500', hint: 'La normalidad conserva ortografía provisional.' }
      ]
    },
    {
      id: 'object_cult',
      title: 'SE FUNDA UN CULTO EN TU INVENTARIO',
      description: `${state.inventory[0]?.nombre_item || 'Una silla sin propietario'} ha sido declarado objeto sagrado por la Iglesia del Recibo Inmaculado. El primer mandamiento prohíbe explicar “${personal}”.`,
      character: 'garantia', severity: 4, motif: 'religiones de inventario',
      choices: [
        { id: 'join', label: 'Aceptar el cargo de profeta insolvente', hint: 'Ganas prestigio, maldición y una obligación litúrgica.' },
        { id: 'denounce', label: 'Denunciar el culto ante la Fiscal', hint: 'Sube la sospecha. El culto obtiene publicidad gratuita.' }
      ]
    },
    {
      id: 'future_lawsuit',
      title: 'TU FUTURO TE DEMANDA',
      description: `Una versión futura de ${state.dossier.alias} presenta una demanda por haber convertido “${personal}” en precedente. Solicita indemnización por expectativas mal administradas.`,
      character: 'fiscal', severity: 4, motif: 'futuros litigantes',
      choices: [
        { id: 'settle', label: 'Pactar por $800 de deuda futura', hint: 'El juicio termina; el futuro conserva derecho a decepcionarse.' },
        { id: 'counterclaim', label: 'Demandar al futuro por llegar tarde', hint: 'Ganas prestigio y sospecha fiscal.' }
      ]
    },
    {
      id: 'perfectly_normal',
      title: 'DURANTE UN MINUTO TODO PARECE NORMAL',
      description: 'Los precios son razonables. Nadie te insulta. El edificio deja de respirar. Esta ausencia de hostilidad es estadísticamente insoportable.',
      character: 'balance', severity: 3, motif: 'normalidad sospechosa',
      choices: [
        { id: 'trust', label: 'Aceptar la normalidad sin investigar', hint: 'Recuperas compostura. Algo toma nota.' },
        { id: 'inspect', label: 'Buscar la costura detrás de la escena', hint: 'Pierdes normalidad, encuentras un fragmento de alma.' }
      ]
    },
    {
      id: 'receipt_marriage',
      title: 'UN RECIBO AFIRMA ESTAR CASADO CONTIGO',
      description: `El recibo muestra tu alias, la hora ${state.dossier.suspiciousTimes[0] || '4:17'} y una lista de bienes comunes que incluye ${motif}. El Notario declara consumado el vínculo.`,
      character: 'notario', severity: 3, motif: 'matrimonio documental',
      choices: [
        { id: 'annul', label: 'Pagar $350 por nulidad inmediata', hint: 'El documento queda resentido, pero soltero.' },
        { id: 'accept', label: 'Aceptar el matrimonio patrimonial', hint: 'Ganas prestigio y deuda moral compartida.' }
      ]
    }
  ];

  const canUseObject = state.inventory.length > 0;
  const filtered = available.filter((event) => event.id !== 'object_awakes' || canUseObject || state.turnCount > 3);

  if (!state.campaign.delirium.blackSwanUsed && state.turnCount >= 8 && rng() < 0.035) {
    return {
      id: 'black_swan_game_bankruptcy',
      title: 'EL JUEGO DECLARA BANCARROTA',
      description: 'La propia interfaz presenta una solicitud de insolvencia. Los marcos ornamentales comienzan a venderse entre sí y el tutorial exige indemnización por abandono.',
      character: 'subastador',
      severity: 5,
      motif: 'la realidad como lote',
      choices: [
        { id: 'bailout', label: 'Rescatar el juego con un fragmento de alma', hint: 'Consume un fragmento o aumenta tu deuda espectral.' },
        { id: 'let_sell', label: 'Permitir que venda una parte de sí mismo', hint: 'La normalidad será liquidada.' }
      ]
    };
  }

  return pick(filtered, rng);
}

export function maybeScheduleAnomaly(state: GameState, rng: () => number): DeliriumAnomaly | null {
  const director = state.campaign.delirium;
  if (director.currentAnomaly || state.turnCount <= 1) return null;

  const frequency = state.dossier.anomalyFrequency;
  const minGap = { escasa: 5, medida: 4, febril: 2, realidad_sin_licencia: 1 }[frequency];
  const baseChance = { escasa: 0.12, medida: 0.24, febril: 0.42, realidad_sin_licencia: 0.62 }[frequency];
  const gap = state.turnCount - director.lastAnomalyTurn;
  if (gap < minGap || director.anomalyBudget < 2) return null;

  const pressure = Math.min(0.30, state.curse * 0.008 + state.debt / 80000 + director.tension / 500 + state.campaign.houseHunger / 900);
  if (rng() > baseChance + pressure) return null;
  return makeAnomaly(state, rng);
}

function awakenItem(item: InventoryItem, hostile: boolean): InventoryItem {
  return {
    ...item,
    agency: hostile ? 'Hostil' : 'Consciente',
    desire: hostile
      ? 'Ser vendido a alguien con menos entusiasmo y más almacenamiento ventilado.'
      : 'Recibir salario, un nombre respetable y derecho a declarar en tu contra.',
    callbackText: hostile
      ? 'El objeto golpea suavemente desde dentro de su contrato.'
      : 'El objeto observa cada puja como quien prepara una demanda.'
  };
}

export function resolveAnomalyChoice(state: GameState, choiceId: string): GameState {
  const anomaly = state.campaign.delirium.currentAnomaly;
  if (!anomaly) return state;

  const next: GameState = {
    ...state,
    inventory: [...state.inventory],
    rivals: [...state.rivals],
    bidsLog: [...state.bidsLog],
    campaign: {
      ...state.campaign,
      debtSplits: { ...state.campaign.debtSplits },
      delirium: {
        ...state.campaign.delirium,
        currentAnomaly: null,
        lastAnomalyTurn: state.turnCount,
        anomalyBudget: Math.max(0, state.campaign.delirium.anomalyBudget - anomaly.severity),
        normalityResidual: Math.max(0, state.campaign.delirium.normalityResidual - anomaly.severity * 5),
        anomalyHistory: [...state.campaign.delirium.anomalyHistory, anomaly.id],
        motifs: unique([...state.campaign.delirium.motifs, anomaly.motif]),
        blackSwanUsed: state.campaign.delirium.blackSwanUsed || anomaly.id.startsWith('black_swan')
      }
    },
    status: 'INTERMISSION',
    dialogueBubble: {
      character: anomaly.character,
      text: anomaly.epilogue || 'El salón registra la decisión y finge que aquello era perfectamente normal.'
    }
  };

  switch (`${anomaly.id}:${choiceId}`) {
    case 'pigeon_shareholder:feed':
      next.budget = Math.max(0, next.budget - 300);
      next.prestige += 6;
      next.dialogueBubble = { character: 'rata', text: 'La paloma acepta el alpiste y te concede una acción sin derecho a voto.' };
      break;
    case 'pigeon_shareholder:contest':
      next.campaign.suspicion = Math.min(100, next.campaign.suspicion + 9);
      next.campaign.composure = Math.max(0, next.campaign.composure - 5);
      next.dialogueBubble = { character: 'fiscal', text: 'La impugnación queda archivada bajo “humanos que subestimaron aves con notario”.' };
      break;
    case 'buttons_union:sign':
      next.budget = Math.max(0, next.budget - 200);
      next.campaign.influence += 2;
      next.dialogueBubble = { character: 'subastador', text: 'Los botones vuelven al trabajo, ahora con descanso para colación y derecho a juzgarte.' };
      break;
    case 'buttons_union:break':
      next.campaign.composure = Math.max(0, next.campaign.composure - 9);
      next.campaign.delirium.activeRealityRule = 'BUTTONS_REMEMBER';
      next.dialogueBubble = { character: 'subastador', text: 'La huelga termina. Los controles obedecen, pero guardan actas.' };
      break;
    case 'object_awakes:negotiate':
      if (next.inventory.length) next.inventory[next.inventory.length - 1] = awakenItem(next.inventory[next.inventory.length - 1], false);
      next.campaign.influence = Math.max(0, next.campaign.influence - 1);
      next.prestige += 4;
      break;
    case 'object_awakes:lock':
      if (next.inventory.length) next.inventory[next.inventory.length - 1] = awakenItem(next.inventory[next.inventory.length - 1], true);
      next.curse += 3;
      break;
    case 'past_self:hire':
      if (!next.rivals.some((r) => r.id === 'rival_past_self')) {
        next.rivals.push({
          id: 'rival_past_self',
          nombre: 'El Postor que Sí Terminó',
          presupuesto: 18000,
          personalidad: 'Conoce tus excusas y puja exactamente antes de que decidas actuar.',
          agresividad: 0.72
        });
      }
      next.prestige = Math.max(0, next.prestige - 3);
      break;
    case 'past_self:challenge':
      next.prestige += 12;
      next.campaign.composure = Math.max(0, next.campaign.composure - 12);
      break;
    case 'letter_embargo:buy':
      next.budget = Math.max(0, next.budget - 417);
      next.campaign.suspicion = Math.min(100, next.campaign.suspicion + 3);
      break;
    case 'letter_embargo:refuse':
      next.campaign.delirium.activeRealityRule = 'EMBARGO_E';
      next.campaign.composure = Math.max(0, next.campaign.composure - 4);
      break;
    case 'house_hungry:feed_item': {
      const eaten = next.inventory.pop();
      next.dialogueBubble = {
        character: 'fantasma',
        text: eaten ? `Las paredes mastican ${eaten.nombre_item}. Casimiro emite un recibo húmedo.` : 'La casa no encuentra objetos y muerde una esquina del presupuesto.'
      };
      if (!eaten) next.budget = Math.max(0, next.budget - 300);
      break;
    }
    case 'house_hungry:feed_debt':
      next.debt += 1200;
      next.campaign.debtSplits.moral += 1200;
      break;
    case 'pause_menu_auction:buy':
      next.budget = Math.max(0, next.budget - 400);
      next.campaign.influence += 3;
      next.dialogueBubble = { character: 'subastador', text: 'Has comprado el derecho a detenerte. Naturalmente, continuar sigue siendo gratis y por eso te resulta sospechoso.' };
      break;
    case 'pause_menu_auction:cede':
      next.campaign.delirium.activeRealityRule = 'PAUSE_OWNED';
      next.prestige += 4;
      break;
    case 'debt_liquid:bottle': {
      const reduction = Math.min(600, next.debt);
      next.debt -= reduction;
      next.campaign.debtSplits.sanguino = Math.max(0, next.campaign.debtSplits.sanguino - reduction);
      next.inventory.push({
        id: `debt_bottle_${state.turnCount}`, nombre_item: 'Botella de Deuda Líquida de Cosecha Tardía',
        descripcion: 'Fluido color vino que murmura cuotas cuando se agita.', puja_inicial: 600, letra_pequena: 'Devenga sed en vez de intereses.',
        es_elite: false, rareza: 'Maldito', categoria: 'Fluido patrimonial', precio_compra: 0, moneda_compra: 'liquidez',
        procedencia: 'El costado húmedo de tu balance', valor_estimado: 900, valor_real: 12, peso_legal: 4,
        efecto_pasivo: 'Incrementa la Sospecha Fiscal en +2 por ronda.', comentario_rata: 'Finalmente una deuda con cuerpo y mejor postura.',
        degradacion: 0, agency: 'Consciente', desire: 'Ser descorchada durante una renegociación hostil.', motifs: ['deuda líquida']
      });
      break;
    }
    case 'debt_liquid:drink': {
      const reduction = Math.min(1200, next.debt);
      next.debt -= reduction;
      next.campaign.debtSplits.sanguino = Math.max(0, next.campaign.debtSplits.sanguino - reduction);
      next.curse += 4;
      next.campaign.composure = Math.max(0, next.campaign.composure - 10);
      break;
    }
    case 'portrait_escape:chase':
      next.campaign.composure = Math.max(0, next.campaign.composure - 7);
      next.campaign.influence += 3;
      next.dialogueBubble = { character: 'ujier', text: 'Las huellas terminan dentro de otro retrato. El rumor obtenido afirma que la casa colecciona marcos, no personas.' };
      break;
    case 'portrait_escape:rent':
      next.budget = Math.max(0, next.budget - 250);
      next.prestige += 7;
      break;
    case 'vowel_market:sell':
      next.campaign.influence += 4;
      next.campaign.composure = Math.max(0, next.campaign.composure - 3);
      next.campaign.delirium.activeRealityRule = 'VOWELS_TAXED';
      break;
    case 'vowel_market:buyback':
      next.budget = Math.max(0, next.budget - 500);
      next.campaign.delirium.normalityResidual = Math.min(100, next.campaign.delirium.normalityResidual + 3);
      break;
    case 'object_cult:join':
      next.prestige += 10;
      next.curse += 4;
      next.campaign.factionsReputation = { ...next.campaign.factionsReputation, receipt_church: 12 };
      break;
    case 'object_cult:denounce':
      next.campaign.suspicion = Math.min(100, next.campaign.suspicion + 12);
      next.prestige += 3;
      break;
    case 'future_lawsuit:settle':
      next.debt += 800;
      next.campaign.debtSplits.unremembered += 800;
      break;
    case 'future_lawsuit:counterclaim':
      next.prestige += 11;
      next.campaign.suspicion = Math.min(100, next.campaign.suspicion + 9);
      break;
    case 'perfectly_normal:trust':
      next.campaign.composure = Math.min(100, next.campaign.composure + 14);
      next.campaign.delirium.normalityResidual = Math.min(100, next.campaign.delirium.normalityResidual + 8);
      next.dialogueBubble = { character: 'balance', text: 'La normalidad acepta tu confianza. Eso no prueba que fuera normal.' };
      break;
    case 'perfectly_normal:inspect':
      next.campaign.soulFragments += 1;
      next.campaign.delirium.normalityResidual = Math.max(0, next.campaign.delirium.normalityResidual - 10);
      next.dialogueBubble = { character: 'balance', text: 'Detrás del decorado encuentras un fragmento de alma y una nota: “no debiste revisar”.' };
      break;
    case 'receipt_marriage:annul':
      next.budget = Math.max(0, next.budget - 350);
      next.dialogueBubble = { character: 'notario', text: 'Nulidad concedida. El recibo conservará fines de semana alternos con tus futuras compras.' };
      break;
    case 'receipt_marriage:accept':
      next.prestige += 7;
      next.debt += 300;
      next.campaign.debtSplits.moral += 300;
      break;
    case 'black_swan_game_bankruptcy:bailout':
      if (next.campaign.soulFragments > 0) next.campaign.soulFragments -= 1;
      else {
        next.debt += 2000;
        next.campaign.debtSplits.espectral += 2000;
      }
      next.dialogueBubble = { character: 'sanguino', text: 'He refinanciado el software. Ahora cada botón tiene beneficiario final.' };
      break;
    case 'black_swan_game_bankruptcy:let_sell':
      next.campaign.delirium.normalityResidual = 0;
      next.campaign.delirium.activeRealityRule = 'NORMALITY_LIQUIDATED';
      next.prestige += 20;
      next.curse += 8;
      break;
    default:
      break;
  }

  next.bidsLog.push(`Anomalía registrada: ${anomaly.title}.`);
  return next;
}
