import type { GameState } from '../types';
import { CORE_CHARACTERS, isCharacterId } from './characters';

// Helper to choose random item from array
function pickRandom<T>(arr: T[], rng: () => number): T {
  const index = Math.floor(rng() * arr.length);
  return arr[index];
}

// 1. Sanitize text by checking forbidden topics list
export function isTopicForbidden(text: string, forbiddenTopics: string[]): boolean {
  if (!forbiddenTopics) return false;
  return forbiddenTopics.some(topic => text.toLowerCase().includes(topic.toLowerCase()));
}

// Roast template banks per NPC, category, and intensity
const ROASTS_BELISARIO = {
  cortesia: [
    'El postor ofrece una cifra... ciertamente peculiar. Espero que su presupuesto sea más ordenado que sus decisiones.',
    'Una oferta moderada. Llama la atención su timidez en la sala.',
    'Adjudicado provisionalmente, aunque la procedencia de sus fondos sigue bajo un manto de duda respetuosa.'
  ],
  honesta: [
    '¡El postor {alias} ofrece una cantidad asombrosamente imprudente! Ciertamente digno de alguien cuyo desorden principal es {desorden}.',
    'Vaya, ofrece {monto} pesos. Una cifra audaz para alguien cuyo hábito predilecto es {habito}.',
    '¡Adjudicado! Esperemos que este objeto no termine tirado en {desorden} junto a sus otras justificaciones.'
  ],
  demolicion: [
    '¡Contemplen la audacia tributaria de {alias}! Ofrece {monto} pesos con el mismo desparpajo con el que intenta ocultar su vergonzoso {objeto}.',
    '¿{alias}? Ah, sí, el archiduque del desastre doméstico. Pujar por basura parece ser su verdadera profesión declarada de {profesion}.',
    '¿Una puja de {monto}? Espectacular caída libre de dignidad. Sir Roquefort y yo jugamos ajedrez con menos pretensiones que las suyas.'
  ],
  auditoria: [
    '¡ALERTA PATRIMONIAL! El Excel sin fórmulas que {alias} llama vida acaba de registrar otra compra inútil. ¿Planea guardar esto junto a {objeto}?',
    'Señores, {alias} ofrece {monto} pesos con la misma insolvencia con la que mantiene la pestaña de {habito} abierta desde el siglo pasado.',
    'Adjudicado a {alias}. Sus deudas gritan con acento {acento} y su desorden doméstico de {desorden} ya tiene su propio código postal.'
  ]
};

const ROASTS_ROQUEFORT = {
  cortesia: [
    'Su liquidez es baja. La corte murina aconseja prudencia.',
    'Ese objeto sentimental no tiene valor real de tasación. Su oferta es puramente decorativa.',
    'Un activo de bajo rendimiento. Sus decisiones no alteran la corona.'
  ],
  honesta: [
    'Una oferta de {monto} pesos. Muy sentimental. Claramente no tienes la corona de la sensatez.',
    '¿Vienes aquí a comprar esto? Se nota que tu hábito es {habito}. Una rata becaria administraría mejor tu patrimonio.',
    'Tus posesiones en {desorden} ya califican como vertedero clandestino bajo nuestro sumidero.'
  ],
  demolicion: [
    'Incapaz de abandonar una puja, {alias}. Tu debilidad por {objeto} te convertirá en un simple activo devaluado.',
    'Ofreces {monto} por esta basura mientras tu cuenta con Don Sanguino acumula intereses. Qué manera tan vulgar de declararse en quiebra.',
    'Te crees noble por comprar el lote {lote}, pero tu corona es más de cartón que mi bastón de cuchara.'
  ],
  auditoria: [
    'Tu expediente contable es un insulto al Banco de Migas. Vives de la procrastinación en {habito} y pretendes pujar contra la aristocracia.',
    'He tasado tu sombra y carece de valor de mercado. Tu alma es una baratija manchada por tu vergonzoso desorden de {desorden}.',
    '¡Activo devaluado! Tu disculpa tardía por la compra de {lote} vale exactamente cero migas de queso.'
  ]
};

const ROASTS_SANGUINO = {
  cortesia: [
    'Una relación financiera saludable requiere que pagues a tiempo, mi estimado.',
    'Los intereses espectrales no duermen, aunque tú intentes ignorar la noche.',
    'Un abono pequeño es mejor que ninguna disculpa contable.'
  ],
  honesta: [
    'Ofreces {monto} pesos... Qué compra tan impulsiva. ¿Esto también es una "inversión" como la pestaña de {habito}?',
    'Tu deuda moral ya supera a tu deuda bancaria. Hablemos de tu garantía inmaterial, sabandija.',
    '¿A las 4:17 sigues despierto firmando deudas? El reloj de la cobradora no perdona las horas sospechosas.'
  ],
  demolicion: [
    '¿Procrastinando de nuevo en {habito} mientras yo calculo tus recargos del lunes? Qué adorable ingenuidad financiera.',
    'Hipotecar tu vergonzoso {objeto} es una opción viable, aunque su valor real sea un chiste de mal gusto.',
    'Me debes {deuda} pesos. Si tu sombra pudiera firmar pagarés, ya tendríamos tres sucursales nuevas en el sumidero.'
  ],
  auditoria: [
    'Estimado {alias}: tu historial crediticio es una obra de arte del fraude absurdo. Tus deudas gritan con acento {acento} y tu veredicto es la ruina.',
    '¿Pujando {monto} con {deuda} de mora acumulada? Tu shadow-booking es insostenible. Procederemos al embargo de tu nombre o de tu silla de {desorden}.',
    'Tus peores recuerdos ya están en mi archivador espectral. Firma la fianza final o la Cobradora te visitará a las 4:17 con el paraguas mojado.'
  ]
};

const ROASTS_TIMBRE = {
  cortesia: [
    'Consta en acta una inconsistencia menor en su declaración.',
    'El contribuyente presenta documentación incompleta sobre sus activos.',
    'La sospecha fiscal ha subido un escalón reglamentario.'
  ],
  honesta: [
    'El contribuyente declara que {objeto} es un objeto sentimental, pero califica como evasión aduanera.',
    'Su nombre falso de {alias} no coincide con el expediente de su vida anterior. Procederemos a timbrar su culpabilidad.',
    '¿Mora de {deuda} y hábitos declarados de {habito}? Es una contradicción fiscal insalvable.'
  ],
  demolicion: [
    'Su sospecha fiscal del {sospecha}% sugiere que su personalidad completa es una pérdida tributaria activa.',
    'He sellado su solicitud de absolución con el Sello Número Cero. Legalmente, su derecho a pujar por {lote} acaba de dejar de existir.',
    '¿Lavado de herencias con {objeto}? Su justificación en el formulario 11-C es un chiste burocrático.'
  ],
  auditoria: [
    '¡AUDITORÍA SIN ABOGADO! El contribuyente {alias} ha vendido su alma sin timbre fiscal autorizado. Cargos adicionales por contrabando moral.',
    'Sus contradicciones fiscales en {habito} y el desorden moral de {desorden} ya califican como delito patrimonial agravado.',
    'Sello rojo de liquidación forzosa. Su disculpa tardía no tiene valor oficial. Procederemos a embargar su sombra y su vergonzoso {objeto}.'
  ]
};

const ROASTS_CASIMIRO = {
  cortesia: [
    'Tengo un secreto sobre tus ofertas... pero costará un abono respetuoso.',
    'Tus antecedentes no constan en el registro, lo cual es sospechoso.',
    'Entre nosotros, esa oferta es muy baja para impresionar al Notario.'
  ],
  honesta: [
    '¿Vienes a confesar que tu desorden es {desorden}? Ya lo vendí como rumor al Notario Sin Rostro.',
    'Tu disculpa sobre la compra de {lote} me parece una falsificación contable de mala calidad.',
    '¿Mencionaste a {alias} en tu declaración? Ese nombre ya está en tres carpetas de la fiscalía.'
  ],
  demolicion: [
    '¿Querías borrar tu confesión sobre {objeto}? Demasiado tarde, la rata becaria ya la imprimió en papel autocopiante.',
    'Sé que dejas la pestaña de {habito} abierta fingiendo productividad. Puedo falsificar un justificativo médico si me dejas {monto} pesos.',
    'Tu peor recuerdo ya fue subastado en los pasillos por dos monedas de cobre. El comprador se rió bastante de tu desorden de {desorden}.'
  ],
  auditoria: [
    '¡CHANTAL CLANDESTINO! Tengo el acta original de tu delito patrimonial sobre {objeto}. La Fiscal Timbre pagaría una fortuna en influencia por ella.',
    'Tu vida anterior en {profesion} es un fraude total. O me das {monto} o inyecto tu confesión de {habito} en el próximo lote de boss.',
    'Don Belisario cree que es el marqués del embargo, pero yo tengo los pagarés de su propia sombra. ¿Te unes a la conspiración o te timbro en rojo?'
  ]
};

function safePersonalDetail(state: GameState, rng: () => number): string {
  const forbidden = state.dossier.forbiddenTopics.map((topic) => topic.toLowerCase());
  const candidates = [
    ...state.dossier.habits,
    ...state.dossier.embarrassingObjects,
    ...state.dossier.fictionalWeaknesses,
    ...state.dossier.recurringWords,
    ...(state.dossier.fileMetadataList?.map((file) => file.name) || []),
    state.dossier.pastedEvidence || ''
  ].filter((value) => value && !forbidden.some((topic) => value.toLowerCase().includes(topic)));
  return candidates.length ? candidates[Math.floor(rng() * candidates.length)] : 'una decisión sin documentación suficiente';
}

// Main roast compiler and generator
export function generateContextualRoast(state: GameState, character: string, rng: () => number): string {
  const intensity = state.dossier.preferredInsultIntensity || 'honesta';
  const forbidden = state.dossier.forbiddenTopics || [];

  let bank = ROASTS_BELISARIO[intensity];
  if (character === 'rata') bank = ROASTS_ROQUEFORT[intensity];
  else if (character === 'sanguino') bank = ROASTS_SANGUINO[intensity];
  else if (character === 'fiscal') bank = ROASTS_TIMBRE[intensity];
  else if (character === 'fantasma') bank = ROASTS_CASIMIRO[intensity];
  else if (isCharacterId(character)) {
    const profile = CORE_CHARACTERS[character];
    const detail = safePersonalDetail(state, rng);
    const prefixes = {
      cortesia: 'Observación provisional',
      honesta: 'Tasación contextual',
      demolicion: 'Demolición documentada',
      auditoria: 'AUDITORÍA SIN ABOGADO'
    };
    const lines = [
      `${profile.name}: “${detail}”. ${profile.roastLens} El expediente agradece que hayas redactado la evidencia tú mismo.`,
      `${profile.name} aplica su método de ${profile.speech.toLowerCase()} a “${detail}” y obtiene un valor de liquidación ofensivamente preciso.`,
      `${prefixes[intensity]} de ${profile.name}: has conseguido que “${detail}” parezca una decisión, una excusa y una deuda al mismo tiempo.`,
      `${profile.name}: “No me preocupa que hayas dicho ${detail}. Me preocupa la cantidad de infraestructura que construiste para seguir diciéndolo.”`
    ];
    const selected = lines[Math.floor(rng() * lines.length)];
    return state.dossier.forbiddenTopics.some((topic) => selected.toLowerCase().includes(topic.toLowerCase()))
      ? `${profile.name} cierra el expediente sin comentarios utilizables.`
      : selected;
  }

  // Try to find a template that doesn't trigger forbidden topics
  let attempts = 0;
  let template = pickRandom(bank, rng);
  while (attempts < 15) {
    let hasForbidden = false;
    for (const topic of forbidden) {
      if (template.toLowerCase().includes(topic.toLowerCase())) {
        hasForbidden = true;
        break;
      }
    }
    if (!hasForbidden) break;
    template = pickRandom(bank, rng);
    attempts++;
  }

  // Fallback if all templates contain forbidden topics
  if (attempts >= 15) {
    return 'El subastador golpea el martillo en silencio.';
  }

  // Replace tokens safely using dossier or fallback data
  const d = state.dossier;
  const alias = d.alias || 'Postor';
  const desorden = d.habits && d.habits[0] ? d.habits[0] : 'la pila de papeles del escritorio';
  const habito = d.habits && d.habits[1] ? d.habits[1] : 'procrastinar frente a la pantalla';
  const profesion = d.declaredOccupation || 'insolvente profesional';
  const objeto = d.embarrassingObjects && d.embarrassingObjects[0] ? d.embarrassingObjects[0] : 'un calcetín con papas';
  const acento = d.suspiciousTimes && d.suspiciousTimes[0] ? d.suspiciousTimes[0] : 'sospechoso';
  const monto = state.activeBid.toLocaleString();
  const deuda = state.debt.toLocaleString();
  const sospecha = state.campaign.suspicion.toString();
  const lote = state.currentLot ? state.currentLot.nombre_item : 'este misterioso lote';

  const result = template
    .replace(/{alias}/g, alias)
    .replace(/{desorden}/g, desorden)
    .replace(/{habito}/g, habito)
    .replace(/{profesion}/g, profesion)
    .replace(/{objeto}/g, objeto)
    .replace(/{acento}/g, acento)
    .replace(/{monto}/g, monto)
    .replace(/{deuda}/g, deuda)
    .replace(/{sospecha}/g, sospecha)
    .replace(/{lote}/g, lote);

  const callbacks = state.campaign.delirium?.dormantCallbacks || [];
  const callback = callbacks.length ? callbacks[Math.floor(rng() * callbacks.length)] : null;
  const contradiction = state.debt > 4000 && state.activeBid > 1200
    ? ` Tienes $${state.debt.toLocaleString()} de deuda y sigues pujando como si la aritmética fuera una opinión.`
    : state.inventory.length >= 4 && state.budget < 2000
      ? ' Has convertido el acaparamiento en una forma extremadamente cara de no tomar decisiones.'
      : '';

  const profanity = (() => {
    if (state.dossier.profanityLevel === 'ninguna' || intensity === 'cortesia') return '';
    if (state.dossier.profanityLevel === 'moderada') return rng() < 0.25 ? ' Qué manera tan penca de administrar una identidad.' : '';
    if (state.dossier.profanityLevel === 'fuerte') return rng() < 0.38 ? ' Una jugada culia de una elegancia fiscalmente indefendible.' : '';
    return rng() < 0.5 ? ' Francamente, es una estrategia de saco de hueas con papelería premium.' : '';
  })();

  const delayedCallback = state.dossier.longCallbacks && callback && rng() < 0.42
    ? ` Y consta en acta: ${callback}. La casa no olvidó esa hueá; solo estaba esperando una sala con mejor acústica.`
    : '';

  const finalRoast = `${result}${contradiction}${profanity}${delayedCallback}`;
  return isTopicForbidden(finalRoast, forbidden)
    ? 'El personaje observa el expediente, encuentra una restricción expresa y decide atacarte por tu estrategia de puja en cambio.'
    : finalRoast;
}
