import type { GameState, InventoryItem } from '../types';
import type { StoryBeat } from './types';
import { appendStoryBeat, makeStoryBeat } from './story';

export interface EventOption {
  id: string;
  text: string;
  cost?: number;
}

export interface NarrativeEvent {
  id: string;
  title: string;
  description: string;
  options: EventOption[];
  motifs?: string[];
  minTurn?: number;
}

export const NARRATIVE_EVENTS: NarrativeEvent[] = [
  {
    id: 'inspeccion_fiscal',
    title: '◈ Inspección Sorpresa de la Fiscal Serafina Timbre ◈',
    description: 'La Fiscal Serafina Timbre ingresa haciendo sonar el Sello Número Cero. Exige revisar tus avalúos, tus excusas y cualquier objeto que haya adquirido opiniones.',
    motifs: ['formularios', 'sellos', 'fiscalización'],
    options: [
      { id: 'fiscal_pagar', text: 'Pagar multa inmediata de $1.200 y fingir que esto fue voluntario' },
      { id: 'fiscal_sobornar', text: 'Gastar 3 de Influencia para ofrecer una explicación administrativamente flexible' },
      { id: 'fiscal_negar', text: 'Declarar que los bienes no existen y que ella tampoco debería mirarlos' }
    ]
  },
  {
    id: 'corte_luz',
    title: '◈ Corte de Luz en el Sótano ◈',
    description: 'Una cañería gotea sobre la caja de fusibles. La oscuridad es total, pero algo sigue pujando con una paleta húmeda.',
    motifs: ['oscuridad', 'caja', 'humedad'],
    options: [
      { id: 'luz_comprar', text: 'Comprar la caja sellada que respira en la penumbra por $800' },
      { id: 'luz_esperar', text: 'Encender una vela y permitir que la oscuridad te tase' }
    ]
  },
  {
    id: 'incendio_menor',
    title: '◈ Incendio de Alfombras Conceptuales ◈',
    description: 'Una chispa prende una alfombra cuyo certificado aseguraba ser metafóricamente ignífuga. Maese Engrudo aparece con un extintor que cobra por sílaba.',
    motifs: ['fuego', 'alfombra', 'restauración'],
    options: [
      { id: 'fuego_perder', text: 'Dejar que el fuego elija democráticamente un objeto del inventario' },
      { id: 'fuego_pagar', text: 'Pagar $600 por un extintor de incendios conceptuales' }
    ]
  },
  {
    id: 'coctel_acreedores',
    title: '◈ Cóctel Clandestino de Acreedores ◈',
    description: 'Representantes bancarios y ratas financieras te rodean con canapé de queso rancio. Cada servilleta ya contiene tu firma.',
    motifs: ['deuda', 'queso', 'cóctel'],
    options: [
      { id: 'coctel_negociar', text: 'Consolidar tus errores en una sola deuda elegante' },
      { id: 'coctel_huir', text: 'Huir empujando al Ujier de Ceniza y dejar tu prestigio en el perchero' }
    ]
  },
  {
    id: 'funeral_equivocado',
    title: '◈ El Funeral Equivocado ◈',
    description: 'Traen un ataúd de caoba. Un anciano sale del fondo gritando que está vivo y que la caja pertenece a su contador.',
    motifs: ['ataúd', 'herencia', 'error'],
    options: [
      { id: 'funeral_comprar', text: 'Comprar el ataúd por $1.000 y heredar su ocupación espectral' },
      { id: 'funeral_ignorar', text: 'Ignorar los gritos y evaluar la calidad de las galletas del velorio' }
    ]
  },
  {
    id: 'error_contabilidad',
    title: '◈ Error de Teneduría de Libros ◈',
    description: 'El Notario Sin Rostro cruzó las cuentas por error. Parte de tu deuda figura ahora a nombre de una cascada y nadie quiere corregirlo demasiado rápido.',
    motifs: ['contabilidad', 'error', 'filomena'],
    options: [
      { id: 'error_aceptar', text: 'Endosar $1.000 de deuda a Doña Filomena antes de que aprenda a leer' },
      { id: 'error_auditar', text: 'Exigir auditoría formal y convertirte en la persona más sospechosa de la sala' }
    ]
  },
  {
    id: 'inundacion_ratas',
    title: '◈ Inundación del Sumidero ◈',
    description: 'Agua oscura entra por las rejillas. Un ejército de ratas con estandartes dorados exige tributo por daños a su soberanía hidráulica.',
    motifs: ['ratas', 'agua', 'tributo'],
    options: [
      { id: 'ratas_tributo', text: 'Entregar un objeto como ofrenda diplomática al reino murino' },
      { id: 'ratas_combatir', text: 'Combatirlas con una escoba jurídicamente insuficiente' }
    ]
  },
  {
    id: 'huelga_fantasmas',
    title: '◈ Huelga de Letras Pequeñas ◈',
    description: 'Casimiro organiza una barricada espiritual. Ninguna advertencia contractual acepta trabajar hasta que alguien reconozca sus horas extra.',
    motifs: ['fantasmas', 'huelga', 'letra pequeña'],
    options: [
      { id: 'huelga_soborno', text: 'Entregar $500 al fondo sindical administrado casualmente por Casimiro' },
      { id: 'huelga_ignorar', text: 'Continuar a ciegas y permitir que las cláusulas se organicen solas' }
    ]
  },
  {
    id: 'auditoria_realidad',
    title: '◈ Auditoría de Realidad ◈',
    description: 'Una comisión descubre que tres objetos, dos postores y el miércoles no cuentan con autorización para existir en este inmueble.',
    motifs: ['realidad', 'auditoría', 'miércoles'],
    minTurn: 3,
    options: [
      { id: 'realidad_reclasificar', text: 'Reclasificarte como decoración y ganar 2 de Influencia' },
      { id: 'realidad_defender', text: 'Defender la existencia del inventario sacrificando 12 de Compostura' }
    ]
  },
  {
    id: 'lectura_testamento',
    title: '◈ Lectura de un Testamento Todavía Húmedo ◈',
    description: 'El Notario lee una herencia redactada mañana. Te lega una moneda, una deuda y la obligación de recordar a alguien que nunca existió.',
    motifs: ['testamento', 'mañana', 'herencia'],
    minTurn: 2,
    options: [
      { id: 'testamento_aceptar', text: 'Aceptar la herencia completa y confiar en que la moneda compense los pasivos' },
      { id: 'testamento_renunciar', text: 'Renunciar y quedar como cobarde ante tres generaciones imaginarias' }
    ]
  },
  {
    id: 'banquete_objetos',
    title: '◈ Cena de Objetos con Opinión ◈',
    description: 'Tu inventario exige una mesa propia. El cubierto principal está reservado para el objeto que más se arrepiente de haberte comprado.',
    motifs: ['objetos', 'cena', 'agencia'],
    minTurn: 4,
    options: [
      { id: 'objetos_negociar', text: 'Reconocer derechos laborales y perder 2 de Influencia' },
      { id: 'objetos_imponer', text: 'Recordarles quién pagó y aumentar su deseo de litigio' }
    ]
  },
  {
    id: 'llamada_417',
    title: '◈ Llamada Entrante a las 4:17 ◈',
    description: 'Suena un teléfono que no estaba allí. La voz al otro lado conoce la cifra exacta que todavía no debes.',
    motifs: ['4:17', 'teléfono', 'futuro'],
    minTurn: 5,
    options: [
      { id: 'llamada_contestar', text: 'Contestar y recibir un adelanto de tu deuda futura' },
      { id: 'llamada_cortar', text: 'Cortar la llamada y dejar que el teléfono se ofenda personalmente' }
    ]
  }
];

export function selectNarrativeEvent(state: GameState, rng: () => number): NarrativeEvent {
  const eligible = NARRATIVE_EVENTS.filter((event) => (event.minTurn || 0) <= state.turnCount);
  const motifs = new Set(state.campaign.delirium.motifs.map((motif) => motif.toLowerCase()));
  const weighted = eligible.flatMap((event) => {
    const motifHit = (event.motifs || []).some((motif) => motifs.has(motif.toLowerCase()));
    const copies = motifHit ? 3 : 1;
    return Array.from({ length: copies }, () => event);
  });
  return weighted[Math.floor(rng() * weighted.length)] || NARRATIVE_EVENTS[0];
}

function deterministicItemId(state: GameState, suffix: string): string {
  const source = `${state.seed}:${state.turnCount}:${suffix}`;
  let hash = 0;
  for (let index = 0; index < source.length; index += 1) hash = ((hash << 5) - hash + source.charCodeAt(index)) | 0;
  return `event_${suffix}_${Math.abs(hash).toString(36)}`;
}

function eventItem(state: GameState, item: Omit<InventoryItem, 'id'>, suffix: string): InventoryItem {
  return { ...item, id: deterministicItemId(state, suffix) };
}

function chooseInventoryIndex(state: GameState, salt: string): number {
  if (!state.inventory.length) return -1;
  const source = `${state.seed}:${state.turnCount}:${salt}`;
  let hash = 0;
  for (let index = 0; index < source.length; index += 1) hash = ((hash << 5) - hash + source.charCodeAt(index)) | 0;
  return Math.abs(hash) % state.inventory.length;
}

function record(log: StoryBeat[], state: GameState, title: string, text: string, motif?: string, importance: StoryBeat['importance'] = 3): StoryBeat[] {
  return appendStoryBeat(log, makeStoryBeat(state.turnCount, 'casa', title, text, importance, motif));
}

export function resolveEventOption(state: GameState, eventId: string, optionId: string): GameState {
  const newState: GameState = {
    ...state,
    bidsLog: [...state.bidsLog],
    inventory: state.inventory.map((item) => ({ ...item })),
    campaign: {
      ...state.campaign,
      debtSplits: { ...state.campaign.debtSplits },
      relationships: { ...state.campaign.relationships },
      factionsReputation: { ...state.campaign.factionsReputation },
      storyLog: [...state.campaign.storyLog],
      delirium: { ...state.campaign.delirium }
    }
  };

  let summary = 'La casa archivó una decisión sin explicar por qué era necesaria.';
  const motif = NARRATIVE_EVENTS.find((event) => event.id === eventId)?.motifs?.[0];

  switch (optionId) {
    case 'fiscal_pagar':
      if (newState.budget >= 1200) {
        newState.budget -= 1200;
        summary = 'Pagaste una multa fiscal de $1.200 y recibiste un comprobante culpable.';
      } else {
        newState.campaign.suspicion += 20;
        summary = 'No pudiste pagar la multa. La Fiscal abrió dos anexos nuevos.';
      }
      break;
    case 'fiscal_sobornar':
      if (newState.campaign.influence >= 3) {
        newState.campaign.influence -= 3;
        newState.campaign.relationships.fiscal = { trust: -2, fear: 0, debt: 0, suspicion: 7 };
        summary = 'La explicación administrativamente flexible fue aceptada como evidencia futura.';
      } else {
        newState.campaign.suspicion += 30;
        summary = 'Intentaste sobornar sin influencia. La torpeza quedó numerada.';
      }
      break;
    case 'fiscal_negar':
      newState.campaign.suspicion += 30;
      newState.campaign.composure -= 10;
      summary = 'Negaste la existencia de los bienes mientras uno de ellos solicitaba abogado.';
      break;
    case 'luz_comprar':
      if (newState.budget >= 800) {
        newState.budget -= 800;
        newState.inventory.push(eventItem(state, {
          nombre_item: 'Caja Sellada en la Penumbra', descripcion: 'Un cubo cubierto de brea que emite vibraciones bajas cuando alguien dice “garantía”.',
          puja_inicial: 800, letra_pequena: 'La oscuridad interior figura como arrendataria.', es_elite: false, rareza: 'Raro', categoria: 'Misterio',
          precio_compra: 800, procedencia: 'El rincón más oscuro del sótano', valor_estimado: 1200, valor_real: 200, peso_legal: 2,
          efecto_pasivo: 'Aumenta la maldición cuando es inspeccionada.', comentario_rata: 'Huele a azufre, humedad y optimismo crediticio.', degradacion: 0,
          agency: 'Inquieto', desire: 'Ser abierta por alguien con menos futuro.'
        }, 'caja_penumbra'));
        newState.curse += 2;
        summary = 'Compraste una caja que ya estaba respirando antes de pertenecer a alguien.';
      } else {
        newState.campaign.composure -= 10;
        summary = 'La caja pujó por ti. No alcanzó el presupuesto.';
      }
      break;
    case 'luz_esperar':
      newState.campaign.composure -= 5;
      summary = 'Esperaste en la oscuridad hasta escuchar tu propia paleta ofrecer una cifra.';
      break;
    case 'fuego_perder': {
      const index = chooseInventoryIndex(newState, 'fuego');
      if (index >= 0) {
        const [removed] = newState.inventory.splice(index, 1);
        summary = `${removed.nombre_item} fue declarado pérdida histórica antes de terminar de arder.`;
      } else {
        newState.campaign.composure -= 15;
        summary = 'No había inventario que quemar. El fuego consumió una parte de tu compostura.';
      }
      break;
    }
    case 'fuego_pagar':
      if (newState.budget >= 600) {
        newState.budget -= 600;
        summary = 'Maese Engrudo apagó el incendio y certificó que ahora es antiguo.';
      } else {
        const index = chooseInventoryIndex(newState, 'engrudado');
        if (index >= 0) newState.inventory.splice(index, 1);
        newState.campaign.debtSplits.sanguino += 600;
        newState.debt += 600;
        summary = 'Engrudo apagó el incendio a crédito y Sanguino compró el humo.';
      }
      break;
    case 'coctel_negociar':
      newState.prestige += 15;
      newState.campaign.debtSplits.bancaria += 2000;
      newState.debt += 2000;
      newState.campaign.composure -= 15;
      summary = 'Consolidaste tus errores en una deuda con mejor tipografía.';
      break;
    case 'coctel_huir':
      newState.prestige -= 5;
      summary = 'Escapaste del cóctel. El Ujier conservó tu abrigo y una versión peor de tu nombre.';
      break;
    case 'funeral_comprar':
      if (newState.budget >= 1000) {
        newState.budget -= 1000;
        newState.campaign.debtSplits.espectral += 1500;
        newState.debt += 1500;
        newState.curse += 5;
        newState.inventory.push(eventItem(state, {
          nombre_item: 'Ataúd del Resucitado Protestante', descripcion: 'Un cajón fúnebre vacío con rasguños interiores y una reseña negativa.',
          puja_inicial: 1000, letra_pequena: 'El ocupante conserva derecho preferente a regresar.', es_elite: false, rareza: 'Élite', categoria: 'Muebles',
          precio_compra: 1000, procedencia: 'Funeral equivocado del subsuelo', valor_estimado: 2500, valor_real: 0, peso_legal: 5,
          efecto_pasivo: 'Reduce compostura durante noticias funerarias.', comentario_rata: 'Una caja para gente que necesita paredes incluso muerta.', degradacion: 0,
          agency: 'Dormido', desire: 'Encontrar un ocupante que no presente recursos.'
        }, 'ataud_resucitado'));
        summary = 'Compraste el ataúd. El anciano exigió comisión por haberlo usado como demostración.';
      } else {
        newState.campaign.composure -= 10;
        summary = 'No alcanzó el dinero y el supuesto muerto te llamó insolvente.';
      }
      break;
    case 'funeral_ignorar':
      summary = 'Ignoraste el funeral. Las galletas fueron declaradas único patrimonio líquido.';
      break;
    case 'error_aceptar':
      newState.campaign.debtSplits.bancaria = Math.max(0, newState.campaign.debtSplits.bancaria - 1000);
      newState.debt = Math.max(0, newState.debt - 1000);
      summary = 'Endosaste $1.000 de deuda a Filomena. Ella brindó antes de preguntar por qué.';
      break;
    case 'error_auditar':
      newState.budget = Math.max(0, newState.budget - 100);
      newState.campaign.suspicion += 5;
      summary = 'Exigiste auditoría. La auditoría exigió otra auditoría de tu exigencia.';
      break;
    case 'ratas_tributo': {
      const index = chooseInventoryIndex(newState, 'ratas');
      if (index >= 0) {
        const [removed] = newState.inventory.splice(index, 1);
        newState.campaign.relationships.rata = { trust: 5, fear: 0, debt: 0, suspicion: 0 };
        summary = `${removed.nombre_item} fue nacionalizado por la Corte del Sumidero.`;
      } else {
        newState.curse += 3;
        summary = 'Sin tributo disponible, las ratas cobraron en tobillos metafóricos.';
      }
      break;
    }
    case 'ratas_combatir':
      newState.curse += 5;
      newState.campaign.relationships.rata = { trust: -5, fear: 2, debt: 0, suspicion: 6 };
      summary = 'Combatir al reino murino con una escoba produjo cinco nuevas relaciones diplomáticas hostiles.';
      break;
    case 'huelga_soborno':
      if (newState.budget >= 500) {
        newState.budget -= 500;
        newState.ghostBribed = true;
        summary = 'Casimiro suspendió la huelga y facturó la traición como mediación.';
      } else {
        newState.campaign.composure -= 10;
        summary = 'La huelga continuó. Las letras pequeñas corearon tu saldo disponible.';
      }
      break;
    case 'huelga_ignorar':
      newState.campaign.composure -= 10;
      newState.campaign.delirium.activeRealityRule = 'SMALL_PRINT_STRIKE';
      summary = 'Continuaste a ciegas. La letra pequeña dejó de considerarte lector autorizado.';
      break;
    case 'realidad_reclasificar':
      newState.campaign.influence += 2;
      newState.campaign.delirium.normalityResidual -= 7;
      summary = 'Fuiste reclasificado como decoración funcional. Por primera vez una institución te asignó propósito.';
      break;
    case 'realidad_defender':
      newState.campaign.composure -= 12;
      newState.campaign.houseDisposition -= 2;
      summary = 'Defendiste la existencia de cada objeto. Dos se abstuvieron de testificar a tu favor.';
      break;
    case 'testamento_aceptar':
      newState.budget += 1;
      newState.debt += 1700;
      newState.campaign.debtSplits.unremembered += 1700;
      newState.inventory.push(eventItem(state, {
        nombre_item: 'Moneda Heredada Mañana', descripcion: 'Una moneda acuñada con la fecha del próximo arrepentimiento.', puja_inicial: 1,
        letra_pequena: 'Su valor nominal no compensa la genealogía.', es_elite: false, rareza: 'Patrimonial', categoria: 'Herencia', precio_compra: 1,
        procedencia: 'Testamento de una persona todavía viva', valor_estimado: 1, valor_real: -1700, peso_legal: 4,
        efecto_pasivo: 'Permite demostrar que una deuda puede llegar antes que su causa.', comentario_rata: 'Una excelente moneda, salvo por todo lo que representa.', degradacion: 0,
        agency: 'Consciente', desire: 'Ser gastada antes de ser heredada.'
      }, 'moneda_manana'));
      summary = 'Aceptaste una moneda y $1.700 de deuda que nadie recuerda haber generado.';
      break;
    case 'testamento_renunciar':
      newState.prestige = Math.max(0, newState.prestige - 4);
      newState.campaign.composure += 4;
      summary = 'Renunciaste a la herencia. Tres generaciones imaginarias te llamaron cobarde con excelente dicción.';
      break;
    case 'objetos_negociar':
      newState.campaign.influence = Math.max(0, newState.campaign.influence - 2);
      newState.inventory = newState.inventory.map((item, index) => index === chooseInventoryIndex(newState, 'cena')
        ? { ...item, agency: item.agency === 'Dormido' ? 'Inquieto' : item.agency, desire: 'Obtener silla, nombre y representación en el consejo.' }
        : item);
      summary = 'Reconociste derechos laborales. El inventario exigió un convenio escrito sobre tu espalda.';
      break;
    case 'objetos_imponer':
      newState.campaign.composure -= 8;
      newState.inventory = newState.inventory.map((item) => ({ ...item, agency: item.agency === 'Consciente' ? 'Litigante' : item.agency }));
      summary = 'Recordaste a los objetos quién pagó. Ellos recordaron quién podría ser demandado.';
      break;
    case 'llamada_contestar':
      newState.budget += 1400;
      newState.debt += 2600;
      newState.campaign.debtSplits.unremembered += 2600;
      newState.campaign.delirium.dormantCallbacks = [...newState.campaign.delirium.dormantCallbacks, 'La llamada de las 4:17 todavía no ha ocurrido.'];
      summary = 'Aceptaste $1.400 provenientes de una deuda futura por $2.600. El teléfono agradeció tu puntualidad retroactiva.';
      break;
    case 'llamada_cortar':
      newState.campaign.composure += 3;
      newState.campaign.delirium.motifs = Array.from(new Set([...newState.campaign.delirium.motifs, 'teléfono ofendido']));
      summary = 'Cortaste la llamada. El teléfono comenzó a aparecer en fotografías donde no estaba.';
      break;
    default:
      break;
  }

  newState.budget = Math.max(0, Math.round(newState.budget));
  newState.prestige = Math.max(0, Math.round(newState.prestige));
  newState.campaign.composure = Math.min(100, Math.max(0, Math.round(newState.campaign.composure)));
  newState.campaign.influence = Math.max(0, Math.round(newState.campaign.influence));
  newState.campaign.suspicion = Math.min(100, Math.max(0, Math.round(newState.campaign.suspicion)));
  newState.campaign.delirium.normalityResidual = Math.min(100, Math.max(0, Math.round(newState.campaign.delirium.normalityResidual)));
  newState.bidsLog.push(summary);
  newState.campaign.storyLog = record(newState.campaign.storyLog, state, NARRATIVE_EVENTS.find((event) => event.id === eventId)?.title || 'Evento sin clasificación', summary, motif, 3);
  return newState;
}
