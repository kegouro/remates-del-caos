import type { BidderDossier, DossierTrace } from './types';

export type QuestionCategory =
  | 'vergüenza'
  | 'economía'
  | 'relaciones'
  | 'identidad'
  | 'superstición'
  | 'hábitos'
  | 'estética'
  | 'imposibles';

export interface QuestionnaireQuestion {
  id: string;
  category: QuestionCategory;
  prompt: string;
  placeholder?: string;
  target: keyof Pick<
    BidderDossier,
    | 'aestheticPreferences'
    | 'recurringWords'
    | 'habits'
    | 'fictionalWeaknesses'
    | 'embarrassingObjects'
    | 'suspiciousTimes'
    | 'emotionalCurrencies'
    | 'inventedCrimes'
  >;
  reactivePrompt?: (answer: string) => string | null;
}

function sanitizeAnswer(value: string): string {
  return value.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 180);
}

export function createDefaultDossier(): BidderDossier {
  return {
    alias: 'Postor Incógnito',
    ceremonialTitle: 'Persona Natural Sospechosa',
    declaredOccupation: 'Insolvente Genérico',
    aestheticPreferences: ['Oscuridad absoluta', 'Terciopelo gastado'],
    recurringWords: ['deuda', 'tiempo'],
    habits: ['Fingir que lee contratos', 'Abrir carpetas vacías'],
    fictionalWeaknesses: ['Atracción por sillas inútiles'],
    embarrassingObjects: ['Un recibo de luz vencido'],
    suspiciousTimes: ['04:17'],
    emotionalCurrencies: ['Culpa', 'Dignidad'],
    inventedCrimes: ['Contrabando de metáforas'],
    preferredInsultIntensity: 'honesta',
    forbiddenTopics: [],
    consentScopes: ['alias', 'environment'],
    questionCount: 8,
    anomalyFrequency: 'medida',
    absurdityLevel: 62,
    profanityLevel: 'moderada',
    publicHumiliation: true,
    longCallbacks: true
  };
}

export const DOSSIER_PRESETS: Record<string, { label: string; description: string; dossier: BidderDossier }> = {
  incognito: {
    label: 'Expediente Apócrifo',
    description: 'No usa información real. La casa inventa antecedentes administrativos completamente falsos.',
    dossier: createDefaultDossier()
  },
  visita: {
    label: 'Visita Diplomática',
    description: 'Pocas preguntas, rareza moderada y hostilidad elegante.',
    dossier: {
      ...createDefaultDossier(),
      preferredInsultIntensity: 'cortesia',
      questionCount: 5,
      anomalyFrequency: 'escasa',
      absurdityLevel: 35,
      profanityLevel: 'ninguna',
      publicHumiliation: false,
      consentScopes: ['alias']
    }
  },
  contabilidad: {
    label: 'Contabilidad Nocturna',
    description: 'El equilibrio canónico: preguntas raras, callbacks y humillación razonablemente injusta.',
    dossier: {
      ...createDefaultDossier(),
      preferredInsultIntensity: 'honesta',
      questionCount: 8,
      anomalyFrequency: 'medida',
      absurdityLevel: 62,
      consentScopes: ['alias', 'habits', 'objects', 'environment']
    }
  },
  fiebre: {
    label: 'Fiebre Patrimonial',
    description: 'Más preguntas, más colisiones y objetos construidos a partir de tus propias declaraciones.',
    dossier: {
      ...createDefaultDossier(),
      preferredInsultIntensity: 'demolicion',
      questionCount: 11,
      anomalyFrequency: 'febril',
      absurdityLevel: 84,
      profanityLevel: 'fuerte',
      consentScopes: ['alias', 'habits', 'objects', 'weaknesses', 'crimes', 'aesthetic', 'environment']
    }
  },
  auditoria: {
    label: 'Auditoría Sin Abogado',
    description: 'La casa recuerda, combina, demora y presenta tus contradicciones con anexos.',
    dossier: {
      ...createDefaultDossier(),
      preferredInsultIntensity: 'auditoria',
      questionCount: 14,
      anomalyFrequency: 'realidad_sin_licencia',
      absurdityLevel: 100,
      profanityLevel: 'terminal_buses',
      publicHumiliation: true,
      longCallbacks: true,
      consentScopes: ['alias', 'habits', 'objects', 'weaknesses', 'crimes', 'aesthetic', 'environment']
    }
  }
};

export const QUESTION_BANK: QuestionnaireQuestion[] = [
  {
    id: 'verg_1', category: 'vergüenza', target: 'embarrassingObjects',
    prompt: '¿Qué objeto inútil de tu habitación defenderías en un juicio de quiebra?',
    placeholder: 'Una taza trizada que ya tiene derechos adquiridos...',
    reactivePrompt: (answer) => /taza|vaso|copa/i.test(answer)
      ? '¿Cuántos inviernos lleva ese recipiente conteniendo sospechas en lugar de líquido?'
      : null
  },
  {
    id: 'verg_2', category: 'vergüenza', target: 'habits',
    prompt: '¿Qué desorden doméstico llevas meses llamando “sistema”?',
    placeholder: 'La silla con ropa, archivo horizontal de vestuario...'
  },
  {
    id: 'verg_3', category: 'vergüenza', target: 'embarrassingObjects',
    prompt: '¿Qué electrodoméstico te juzga cuando entras a la cocina?',
    placeholder: 'El tostador que conoce la verdad...'
  },
  {
    id: 'verg_4', category: 'vergüenza', target: 'fictionalWeaknesses',
    prompt: '¿Qué compra absurda sigues defendiendo porque admitir el error sería más caro?',
    placeholder: 'Un teclado mecánico para escribir tres correos...'
  },
  {
    id: 'verg_5', category: 'vergüenza', target: 'habits',
    prompt: '¿Qué tarea realizas con una ceremonia desproporcionada para evitar otra de diez minutos?',
    placeholder: 'Ordenar iconos antes de comenzar a trabajar...'
  },
  {
    id: 'econ_1', category: 'economía', target: 'emotionalCurrencies',
    prompt: '¿Cuánto pagarías para que nadie leyera tus borradores antiguos?',
    placeholder: 'Dos mil pesos y una tarde de 2019...'
  },
  {
    id: 'econ_2', category: 'economía', target: 'fictionalWeaknesses',
    prompt: '¿Qué gasto llamas inversión para no admitir que fue puro capricho?',
    placeholder: 'Herramientas para un proyecto que todavía no existe...'
  },
  {
    id: 'econ_3', category: 'economía', target: 'recurringWords',
    prompt: '¿Cuál es la frase exacta que pronuncias antes de comprar algo que no necesitas?',
    placeholder: 'Pero si lo voy a usar caleta...'
  },
  {
    id: 'econ_4', category: 'economía', target: 'emotionalCurrencies',
    prompt: '¿Qué emoción aceptarías como moneda si el Banco Central perdiera el pudor?',
    placeholder: 'Validación externa fraccionada...'
  },
  {
    id: 'econ_5', category: 'economía', target: 'suspiciousTimes',
    prompt: '¿A qué hora empiezan tus decisiones financieramente indefendibles?',
    placeholder: '02:43, después del tercer café...'
  },
  {
    id: 'rel_1', category: 'relaciones', target: 'fictionalWeaknesses',
    prompt: '¿Quién ganaría una subasta por tus peores recuerdos y por qué ofrecería tan poco?',
    placeholder: 'Una ex, porque ya posee las copias certificadas...'
  },
  {
    id: 'rel_2', category: 'relaciones', target: 'habits',
    prompt: '¿Qué mensaje sabes que no deberías volver a enviar, pero conservas como borrador diplomático?',
    placeholder: '“Hola, soñé contigo” a las 3:12...'
  },
  {
    id: 'rel_3', category: 'relaciones', target: 'inventedCrimes',
    prompt: '¿Qué delito administrativo cometería tu ex versión sentimental?',
    placeholder: 'Reingreso no autorizado a conversaciones cerradas...'
  },
  {
    id: 'rel_4', category: 'relaciones', target: 'fictionalWeaknesses',
    prompt: '¿Qué tipo de persona reconoces como mala idea únicamente después de cocinarle?',
    placeholder: 'Alguien que dice “veamos qué fluye” y trae una mochila...'
  },
  {
    id: 'ident_1', category: 'identidad', target: 'inventedCrimes',
    prompt: '¿Qué cargo ridículamente pomposo imprimirías para volver legal tu desorden?',
    placeholder: 'Archiduque de la Procrastinación Aplicada...'
  },
  {
    id: 'ident_2', category: 'identidad', target: 'fictionalWeaknesses',
    prompt: '¿Qué edad emocional tienes cuando llama un número desconocido?',
    placeholder: 'Siete años con una carpeta tributaria...'
  },
  {
    id: 'ident_3', category: 'identidad', target: 'recurringWords',
    prompt: '¿Qué palabra utilizas para hacer que una obsesión parezca proyecto?',
    placeholder: 'Validación, investigación, prototipo...'
  },
  {
    id: 'ident_4', category: 'identidad', target: 'fictionalWeaknesses',
    prompt: '¿Qué parte de tu personalidad declararías como pérdida tributaria?',
    placeholder: 'La necesidad de convertir todo en una misión épica...'
  },
  {
    id: 'super_1', category: 'superstición', target: 'suspiciousTimes',
    prompt: '¿Qué número te parece culpable sin evidencia matemática?',
    placeholder: '47...'
  },
  {
    id: 'super_2', category: 'superstición', target: 'recurringWords',
    prompt: '¿Qué animal administraría peor tu patrimonio?',
    placeholder: 'Una paloma de plaza con acceso al crédito...'
  },
  {
    id: 'super_3', category: 'superstición', target: 'embarrassingObjects',
    prompt: '¿Qué objeto de tu casa está embrujado, aunque su único poder sea incomodarte?',
    placeholder: 'Una lámpara que parpadea cuando miento...'
  },
  {
    id: 'super_4', category: 'superstición', target: 'inventedCrimes',
    prompt: '¿Qué delito cometería tu sombra al independizarse?',
    placeholder: 'Contrabando de clips y suplantación de postura...'
  },
  {
    id: 'hab_1', category: 'hábitos', target: 'habits',
    prompt: '¿Qué pestaña mantienes abierta fingiendo que volverás a ella?',
    placeholder: 'Un curso de ocho horas detenido en 13:42...'
  },
  {
    id: 'hab_2', category: 'hábitos', target: 'habits',
    prompt: '¿Qué haces cuando deberías estar trabajando?',
    placeholder: 'Diseñar otro sistema para organizar el trabajo...'
  },
  {
    id: 'hab_3', category: 'hábitos', target: 'recurringWords',
    prompt: '¿Qué frase anuncia que estás a punto de perder dos horas?',
    placeholder: 'Voy a revisar una cosita rápida...'
  },
  {
    id: 'hab_4', category: 'hábitos', target: 'fictionalWeaknesses',
    prompt: '¿Qué hábito presentarían como evidencia en un juicio por sabotaje contra ti mismo?',
    placeholder: 'Empezar a ordenar cuando aparece una fecha límite...'
  },
  {
    id: 'hab_5', category: 'hábitos', target: 'habits',
    prompt: '¿Qué cosa haces repetidamente pese a conocer exactamente el desenlace?',
    placeholder: 'Abrir el refrigerador sin que haya aparecido comida nueva...'
  },
  {
    id: 'est_1', category: 'estética', target: 'aestheticPreferences',
    prompt: '¿Qué color tendría tu bancarrota?',
    placeholder: 'Naranjo institucional sobre negro funerario...'
  },
  {
    id: 'est_2', category: 'estética', target: 'aestheticPreferences',
    prompt: '¿Tu vida parece un PDF corrupto, un Excel sin fórmulas o una presentación rota?',
    placeholder: 'Una presentación con 87 diapositivas y ninguna conclusión...'
  },
  {
    id: 'est_3', category: 'estética', target: 'embarrassingObjects',
    prompt: '¿Qué decoración bastaría para condenarte ante un jurado de diseñadores?',
    placeholder: 'Una frase motivacional en cursiva sobre madera falsa...'
  },
  {
    id: 'est_4', category: 'estética', target: 'aestheticPreferences',
    prompt: '¿Qué tipografía usaría tu peor enemigo para redactar tu biografía?',
    placeholder: 'Comic Sans condensada y en mayúsculas...'
  },
  {
    id: 'imp_1', category: 'imposibles', target: 'suspiciousTimes',
    prompt: 'Si tu deuda pudiera hablar, ¿qué voz tendría?',
    placeholder: 'La voz amable de alguien que ya tiene tus datos...'
  },
  {
    id: 'imp_2', category: 'imposibles', target: 'emotionalCurrencies',
    prompt: '¿Cuál es el valor de mercado de una disculpa tardía?',
    placeholder: 'Tres pesos y una silla incómoda...'
  },
  {
    id: 'imp_3', category: 'imposibles', target: 'inventedCrimes',
    prompt: '¿Qué delito cometió tu reflejo mientras mirabas hacia otro lado?',
    placeholder: 'Uso malicioso de una expresión segura...'
  },
  {
    id: 'imp_4', category: 'imposibles', target: 'fictionalWeaknesses',
    prompt: '¿Qué parte de tu nombre podría ser embargada sin que lo notes?',
    placeholder: 'La segunda vocal, casi no la uso...'
  },
  {
    id: 'imp_5', category: 'imposibles', target: 'embarrassingObjects',
    prompt: '¿Qué objeto compraría tu fantasma para seguir molestándote después de muerto?',
    placeholder: 'Un cargador que solo funciona en cierto ángulo...'
  },
  {
    id: 'imp_6', category: 'imposibles', target: 'recurringWords',
    prompt: '¿Qué palabra jamás debería aparecer en una escritura pública?',
    placeholder: 'Probablemente...'
  },
  {
    id: 'imp_7', category: 'imposibles', target: 'emotionalCurrencies',
    prompt: '¿Cuántos años de tu vida vale una silla realmente perfecta?',
    placeholder: 'Dos, pero solo si reclina...'
  },
  {
    id: 'imp_8', category: 'imposibles', target: 'aestheticPreferences',
    prompt: '¿Qué forma geométrica tiene tu culpa?',
    placeholder: 'Un hexágono ligeramente chueco...'
  }
];

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed: string): () => number {
  let value = hashSeed(seed) || 1;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function selectQuestionnaireSubset(seed: string, count: number): QuestionnaireQuestion[] {
  const rng = seededRandom(seed || 'mortaja');
  const groups = new Map<QuestionCategory, QuestionnaireQuestion[]>();
  for (const question of QUESTION_BANK) {
    groups.set(question.category, [...(groups.get(question.category) || []), question]);
  }

  const selected: QuestionnaireQuestion[] = [];
  const categories = [...groups.keys()].sort(() => rng() - 0.5);
  for (const category of categories) {
    const group = groups.get(category) || [];
    if (group.length) selected.push(group[Math.floor(rng() * group.length)]);
    if (selected.length >= count) return selected;
  }

  const remaining = QUESTION_BANK.filter((question) => !selected.some((item) => item.id === question.id));
  while (selected.length < Math.min(count, QUESTION_BANK.length) && remaining.length) {
    const index = Math.floor(rng() * remaining.length);
    selected.push(remaining.splice(index, 1)[0]);
  }
  return selected;
}

export function buildDossierFromAnswers(
  base: BidderDossier,
  answers: Record<string, string>,
  questions: QuestionnaireQuestion[]
): BidderDossier {
  const dossier: BidderDossier = {
    ...base,
    aestheticPreferences: [...base.aestheticPreferences],
    recurringWords: [...base.recurringWords],
    habits: [...base.habits],
    fictionalWeaknesses: [...base.fictionalWeaknesses],
    embarrassingObjects: [...base.embarrassingObjects],
    suspiciousTimes: [...base.suspiciousTimes],
    emotionalCurrencies: [...base.emotionalCurrencies],
    inventedCrimes: [...base.inventedCrimes]
  };

  for (const question of questions) {
    const value = sanitizeAnswer(answers[question.id] || '');
    if (!value) continue;
    const current = dossier[question.target] as string[];
    dossier[question.target] = [value, ...current.filter((item) => item !== value)].slice(0, 8) as never;

    const words = value
      .toLowerCase()
      .replace(/[^a-záéíóúñü0-9\s]/gi, '')
      .split(/\s+/)
      .filter((word) => word.length >= 5)
      .slice(0, 2);
    dossier.recurringWords = [...new Set([...words, ...dossier.recurringWords])].slice(0, 8);
  }

  return dossier;
}

export function buildDossierTraces(
  answers: Record<string, string>,
  questions: QuestionnaireQuestion[]
): DossierTrace[] {
  return questions
    .filter((question) => sanitizeAnswer(answers[question.id] || ''))
    .map((question) => ({
      field: question.target,
      source: `Declaración Jurada: ${question.prompt}`,
      uses: ['Generación de lotes', 'Roasts contextuales', 'Motivos de campaña']
    }));
}

export function addDossierTrace(
  traces: DossierTrace[],
  field: keyof BidderDossier,
  source: string,
  useDescription: string
): DossierTrace[] {
  const existing = traces.find((trace) => trace.field === field);
  const now = new Date().toLocaleTimeString();
  if (!existing) {
    return [...traces, { field, source, uses: [useDescription], lastUsedTimestamp: now }];
  }
  return traces.map((trace) => trace.field === field
    ? { ...trace, uses: [...new Set([...trace.uses, useDescription])], lastUsedTimestamp: now }
    : trace);
}
