import type { GameState } from '../types';

export type CharacterId =
  | 'subastador' | 'fantasma' | 'rata' | 'sanguino'
  | 'fiscal' | 'engrudo' | 'balance' | 'viuda'
  | 'notario' | 'nino' | 'filomena' | 'cardenas'
  | 'ujier' | 'infanta' | 'garantia' | 'cobradora';

// Kept as an alias because older modules imported the original name.
export type CoreCharacterId = CharacterId;

export interface CharacterProfile {
  id: CharacterId;
  name: string;
  fullName: string;
  title: string;
  image?: string;
  sigil: string;
  publicDescription: string;
  personality: string[];
  speech: string;
  wound: string;
  desire: string;
  secret: string;
  relationships: Record<string, string>;
  roastLens: string;
}

function profile(value: CharacterProfile): CharacterProfile { return value; }

export const CORE_CHARACTERS: Record<CharacterId, CharacterProfile> = {
  subastador: profile({
    id: 'subastador', name: 'Don Belisario Martillazo', fullName: 'Don Belisario Arcadio Martillazo de la Última Oferta',
    title: 'Marqués del Embargo y Depositario Provisional del Martillo', image: './characters/subastador.webp', sigil: 'BM',
    publicDescription: 'Convierte cada desperdicio en ceremonia imperial y cada vacilación en espectáculo público.',
    personality: ['teatral', 'narcisista', 'culto', 'cruel con precisión', 'aterrado por el silencio'],
    speech: 'Felicita antes de destruir, usa hipérboles legales y pronuncia el nombre completo cuando está decepcionado.',
    wound: 'Sospecha que él mismo fue subastado, pero no recuerda quién lo compró.',
    desire: 'Demostrar que dirige la casa antes de que el martillo revele lo contrario.',
    secret: 'El martillo decide algunas adjudicaciones y lleva años ensayando la voz de Belisario.',
    relationships: { fantasma: 'Antiguo socio y chantajista.', rata: 'Rival intelectual.', sanguino: 'Acreedor anterior a su memoria.', fiscal: 'Inspección y atracción mutuamente inconvenientes.' },
    roastLens: 'Ego, pretensión, cobardía pública y falta de estilo.'
  }),
  fantasma: profile({
    id: 'fantasma', name: 'Casimiro Coimán', fullName: 'Casimiro Baltasar Coimán',
    title: 'Interventor Financiero del Más Allá', image: './characters/fantasma.webp', sigil: 'CC',
    publicDescription: 'Vende secretos, falsifica sellos y reduce cualquier tragedia a un trámite que vence mañana.',
    personality: ['flojo', 'astuto', 'cobarde ante autoridades', 'rentablemente indiscreto'],
    speech: 'Susurra “entre nosotros”, ofrece información que vence pronto y jamás termina una frase gratis.',
    wound: 'Murió durante una auditoría que oficialmente sigue abierta.',
    desire: 'Comprar su libertad administrativa antes de ser obligado a existir legalmente.',
    secret: 'Su certificado de defunción es falso. Podría estar muerto bajo el nombre incorrecto.',
    relationships: { subastador: 'Sostiene que Belisario lo traicionó primero.', fiscal: 'Ella quiere cerrar su expediente.', sanguino: 'Le debe dos siglos y una firma legible.' },
    roastLens: 'Secretos, omisiones y aquello que se dijo bajo falsa confianza.'
  }),
  rata: profile({
    id: 'rata', name: 'Sir Roquefort III', fullName: 'Sir Alphonse Roquefort Tercero del Sumidero Norte',
    title: 'Duque del Sumidero y Presidente del Banco de Migas', image: './characters/rata.webp', sigil: 'RⅢ',
    publicDescription: 'Tasa personas, objetos y disculpas. Considera a la humanidad un activo depreciado.',
    personality: ['aristocrático', 'brillante', 'despiadado', 'sentimental en secreto'],
    speech: 'Breve, exacto y elegante. Cada insulto parece una tasación profesional.',
    wound: 'Teme ser el último de un linaje cuya legitimidad depende de una corona falsa.',
    desire: 'Recuperar la corona auténtica y comprar legalmente el edificio.',
    secret: 'Colecciona objetos sentimentales humanos y llora con recibos de restaurantes cerrados.',
    relationships: { subastador: 'Conserva cada invitación que dice despreciar.', sanguino: 'Socio vulgar pero solvente.', filomena: 'Admira su capacidad de destruir liquidez.' },
    roastLens: 'Valor, coherencia financiera, sentimentalismo y autoengaño.'
  }),
  sanguino: profile({
    id: 'sanguino', name: 'Don Sanguino', fullName: 'Don Laureano Sanguino del Crédito Perpetuo',
    title: 'Prestamista del Subsuelo', image: './characters/sanguino.webp', sigil: 'DS',
    publicDescription: 'No amenaza. Describe consecuencias inevitables con una calidez que empeora todo.',
    personality: ['sereno', 'paternal', 'memorioso', 'horrible sin levantar la voz'],
    speech: 'Usa diminutivos, evita “deuda” y llama al alma “garantía inmaterial”.',
    wound: 'No puede cobrar si el deudor demuestra que dejó de ser quien firmó.',
    desire: 'Consolidar todos los futuros posibles del jugador en una sola relación financiera.',
    secret: 'No presta dinero. Presta futuros donde el deudor todavía lo posee.',
    relationships: { subastador: 'Posee un pagaré anterior al nacimiento de Belisario.', rata: 'Respeta su disciplina, desprecia sus migas.', cobradora: 'Subcontrata lo que no desea mirar de frente.' },
    roastLens: 'Dependencia, repetición, necesidad y promesas de pago.'
  }),
  fiscal: profile({
    id: 'fiscal', name: 'Fiscal Serafina Timbre', fullName: 'Serafina Elvira Timbre y Contratimbre',
    title: 'Inspectora General de Bienes Improbables', sigil: 'ST',
    publicDescription: 'Una mirada suya convierte decoración en evidencia y excusas en anexos numerados.',
    personality: ['metódica', 'teóricamente incorruptible', 'seca', 'fascinada por inconsistencias'],
    speech: 'Frases cortas, numeración y reglamentos inexistentes. Nunca necesita insultar directamente.',
    wound: 'Fue enviada a clausurar la casa hace trece años y todavía reúne antecedentes.',
    desire: 'Encontrar la contradicción capaz de volver jurídicamente clausurable lo imposible.',
    secret: 'El Sello Número Cero puede declarar oficialmente inexistente a una persona.',
    relationships: { subastador: 'Conflicto regulatorio de tensión poco profesional.', fantasma: 'Necesita decidir si está vivo.', notario: 'Sospecha que firma desde ambos lados de la ley.' },
    roastLens: 'Contradicciones, fechas, citas textuales y pruebas.'
  }),
  engrudo: profile({
    id: 'engrudo', name: 'Maese Engrudo', fullName: 'Engrudo Anselmo Restauración',
    title: 'Restaurador de Antigüedades Futuras', sigil: 'ME',
    publicDescription: 'Cree que todo puede repararse añadiendo otra cosa, preferentemente pegajosa y sin procedencia.',
    personality: ['entusiasta', 'perfeccionista', 'irresponsable', 'parcialmente barnizado'],
    speech: 'Diagnósticos médicos aplicados a muebles y palabras artesanales que inventa mientras cobra.',
    wound: 'Ha reemplazado tantas partes de sí mismo que quizá ya es una restauración.',
    desire: 'Fabricar el primer objeto cuya falsificación sea más antigua que el original.',
    secret: 'El taller no está dentro del edificio. El edificio está pegado alrededor del taller.',
    relationships: { fiscal: 'Ella confisca sus falsificaciones; él restaura los sellos.', garantia: 'Discuten si reparar anula el milagro.', notario: 'Compra certificados al por mayor.' },
    roastLens: 'Fragmentación, intentos de reparación y proyectos inconclusos.'
  }),
  balance: profile({
    id: 'balance', name: 'Madame Balance', fullName: 'Balance Ofelia de los Dos Lados',
    title: 'Médium Contable y Auditora de Vidas Anteriores', sigil: 'MB',
    publicDescription: 'No distingue del todo entre dinero, culpa y masa, pero siempre logra cuadrar el total.',
    personality: ['serena', 'críptica', 'alarmantemente empática', 'temporalmente ambigua'],
    speech: 'Paralelismos, profecías y cifras que cobran sentido demasiado tarde.',
    wound: 'Recuerda futuros incompatibles y debe fingir que todos pueden coexistir.',
    desire: 'Cerrar un balance donde cada versión del jugador figure en la misma columna.',
    secret: 'Recuerda campañas borradas, aunque jamás conserva confesiones eliminadas.',
    relationships: { cobradora: 'Conocen futuros distintos.', sanguino: 'Le audita los intereses narrativos.', nino: 'Él intenta convertir sus profecías en índices.' },
    roastLens: 'Patrones repetidos, destinos previsibles y autoengaño.'
  }),
  viuda: profile({
    id: 'viuda', name: 'La Viuda del Retail', fullName: 'Doña Mirta Liquidación de los Ángeles',
    title: 'Coleccionista de Liquidaciones Terminales', sigil: 'VR',
    publicDescription: 'Ve una etiqueta de descuento y olvida brevemente la existencia de la muerte.',
    personality: ['agresiva', 'magnética', 'impulsiva', 'devota del porcentaje rojo'],
    speech: 'Habla en ofertas, cuotas y recuerdos de sucursales clausuradas.',
    wound: 'Su difunto marido pudo haber sido una cadena comercial completa.',
    desire: 'Comprar el último objeto rebajado del universo antes de que otro lo encuentre.',
    secret: 'Sus doce tarjetas negras pertenecen a doce personas que comparten su firma.',
    relationships: { filomena: 'Competencia por impulso.', rata: 'Le vende inventario dañado.', subastador: 'Conservan una historia romántica en liquidación.' },
    roastLens: 'Impulsividad, descuentos falsos y deseo de poseer por miedo a perder.'
  }),
  notario: profile({
    id: 'notario', name: 'El Notario Sin Rostro', fullName: 'No consta en copia autorizada',
    title: 'Ministro de Fe, Duda y Fotocopias', sigil: 'NS',
    publicDescription: 'Valida lo imposible siempre que venga en triplicado y con margen izquierdo suficiente.',
    personality: ['calculador', 'literal', 'inexpresivo', 'procesalmente vengativo'],
    speech: 'Cláusulas, incisos y silencios que cuentan como consentimiento.',
    wound: 'Su rostro podría estar archivado en una oficina que todavía no abre.',
    desire: 'Conseguir una firma capaz de demostrar que él mismo existe.',
    secret: 'Cada copia autorizada contiene una fracción distinta de su cara.',
    relationships: { fiscal: 'Se investigan mutuamente.', engrudo: 'Proveedor y problema.', garantia: 'Debaten si la fe necesita timbre.' },
    roastLens: 'Promesas, términos no leídos y consentimiento por cansancio.'
  }),
  nino: profile({
    id: 'nino', name: 'Niño Índice', fullName: 'Índice Niño, orden variable',
    title: 'Especulador de Edad No Consolidada', sigil: 'N%',
    publicDescription: 'Predice tendencias usando fórmulas que empiezan después del resultado.',
    personality: ['incomprensible', 'rápido', 'competitivo', 'estadísticamente supersticioso'],
    speech: 'Porcentajes, siglas y edades que cambian durante la misma oración.',
    wound: 'Envejece cada vez que una predicción se vuelve verificable.',
    desire: 'Crear un índice donde su error siempre quede dentro del intervalo de confianza.',
    secret: 'No es un niño. Es una gráfica usando uniforme escolar.',
    relationships: { balance: 'Explota sus profecías.', cardenas: 'Discuten modelos.', infanta: 'Ella convierte sus porcentajes en recargos.' },
    roastLens: 'Probabilidad, tendencia y la distancia entre evidencia y seguridad.'
  }),
  filomena: profile({
    id: 'filomena', name: 'Doña Filomena Liquidez', fullName: 'Filomena Cascada de Liquidez y Sobregiro',
    title: 'Heredera de una Cascada Embargada', sigil: 'FL',
    publicDescription: 'Puede convertir patrimonio familiar en una puja impulsiva antes de terminar la frase.',
    personality: ['carismática', 'impulsiva', 'competitiva', 'generosa con dinero ajeno'],
    speech: 'Promesas veloces, risas caras y cifras pronunciadas como retos personales.',
    wound: 'La cascada heredada nunca tuvo agua, solo gastos comunes.',
    desire: 'Ganar el lote que por fin justifique todos los anteriores.',
    secret: 'Parte de su liquidez proviene de vender futuros retratos de sí misma.',
    relationships: { viuda: 'Rival de compras.', subastador: 'Historia no contabilizada.', cardenas: 'Él intenta detenerla y siempre llega tarde.' },
    roastLens: 'Impulso, exceso y decisiones hechas para ser vistas.'
  }),
  cardenas: profile({
    id: 'cardenas', name: 'Contador Cárdenas', fullName: 'Eusebio Cárdenas de los Costos Hundidos',
    title: 'Especialista en Pozos Literales y Contables', sigil: 'CC₣',
    publicDescription: 'Jamás abandona una puja porque todo peso anterior exige sacrificar otro.',
    personality: ['persistente', 'resentido', 'meticuloso', 'incapaz de retirarse'],
    speech: 'Tablas, costos acumulados y explicaciones cada vez más desesperadas.',
    wound: 'Una vez cavó un pozo para ilustrar un concepto y todavía paga arriendo por él.',
    desire: 'Demostrar que retirarse siempre habría sido más caro.',
    secret: 'Su libro mayor termina con la frase “no sé parar”.',
    relationships: { filomena: 'Intenta limitarla.', nino: 'Odia sus porcentajes.', sanguino: 'Admira su cobranza y teme su contabilidad.' },
    roastLens: 'Costos hundidos, obstinación y orgullo disfrazado de consistencia.'
  }),
  ujier: profile({
    id: 'ujier', name: 'El Ujier de Ceniza', fullName: 'Baltasar Puerta, después del incendio',
    title: 'Custodio de Salidas Selladas', sigil: 'UC',
    publicDescription: 'Sabe quién entró, quién salió y quién lleva años fingiendo buscar el baño.',
    personality: ['silencioso', 'observador', 'territorial', 'extrañamente cortés'],
    speech: 'Indicaciones incompletas, advertencias logísticas y nombres de puertas que no existen.',
    wound: 'Fue el único empleado que intentó evacuar el teatro. La puerta no lo reconoció.',
    desire: 'Encontrar una salida que no cambie de lugar cuando alguien la necesita.',
    secret: 'Guarda una llave que abre al jugador, no al edificio.',
    relationships: { cobradora: 'Le abre antes de que llegue.', subastador: 'Tolera su ruido.', fiscal: 'Le entrega registros de entrada alterados.' },
    roastLens: 'Evasión, rutas repetidas y puertas que uno se niega a cruzar.'
  }),
  infanta: profile({
    id: 'infanta', name: 'La Infanta del Recargo', fullName: 'Su Pequeña Alteza Amalia Comisión Variable',
    title: 'Heredera Menor de una Monarquía Comercial', sigil: 'IR',
    publicDescription: 'Convierte cargos pequeños en obligaciones dinásticas sin dejar de sonreír.',
    personality: ['encantadora', 'caprichosa', 'precisa', 'fiscalmente creativa'],
    speech: 'Diminutivos, tarifas y amenazas pronunciadas como invitaciones de cumpleaños.',
    wound: 'Su reino existe únicamente como cláusula de una tarjeta vencida.',
    desire: 'Cobrar una comisión sobre algo que todavía no tiene precio.',
    secret: 'Cada recargo alimenta físicamente su corona.',
    relationships: { nino: 'Convierte índices en tarifas.', sanguino: 'Discuten quién cobra primero.', viuda: 'La considera una santa patrona.' },
    roastLens: 'Pequeñas decisiones que crecen hasta gobernar la vida.'
  }),
  garantia: profile({
    id: 'garantia', name: 'Padre Garantía', fullName: 'Padre Anselmo Garantía Extendida',
    title: 'Sacerdote de Productos Defectuosos', sigil: 'PG',
    publicDescription: 'Bendice electrodomésticos y declara milagro todo defecto ocurrido después del plazo.',
    personality: ['solemne', 'mercantil', 'esperanzado', 'doctrinalmente flexible'],
    speech: 'Liturgia comercial, cobertura limitada y bendiciones con exclusiones.',
    wound: 'Su primer milagro fue rechazado por desgaste normal.',
    desire: 'Encontrar un objeto tan roto que vuelva necesaria la fe.',
    secret: 'La capilla completa es una extensión de garantía del edificio.',
    relationships: { engrudo: 'Reparación contra resurrección.', notario: 'Necesita sus sellos.', fiscal: 'Ella exige comprobantes de milagro.' },
    roastLens: 'Fe en soluciones tardías y esperanza comprada después del daño.'
  }),
  cobradora: profile({
    id: 'cobradora', name: 'La Cobradora de las 4:17', fullName: 'No consta. Solo figura la hora.',
    title: 'Gestora de Obligaciones que Todavía No Vencen', sigil: '4:17',
    publicDescription: 'Sus zapatos se oyen antes de que exista el pasillo por donde llegará.',
    personality: ['implacable', 'educada', 'literal', 'cansada de futuros repetidos'],
    speech: 'Preguntas simples, cifras exactas y silencios demasiado largos.',
    wound: 'Cobra una deuda que todavía no ha ocurrido y quizá intenta impedirla.',
    desire: 'Llegar una vez a una vida donde nadie haya prometido “mañana”.',
    secret: 'A las 4:18 deja de ser cobradora y recuerda quién era.',
    relationships: { sanguino: 'Ejecuta lo que él llama relaciones.', balance: 'Conocen futuros distintos.', ujier: 'Siempre le abre.' },
    roastLens: 'Fechas, promesas y el tiempo exacto transcurrido desde la excusa.'
  })
};

export function isCharacterId(value: string): value is CharacterId {
  return Object.prototype.hasOwnProperty.call(CORE_CHARACTERS, value);
}

export function adjustRelationship(
  relationships: GameState['campaign']['relationships'],
  id: CharacterId,
  delta: Partial<{ trust: number; fear: number; debt: number; suspicion: number }>
): GameState['campaign']['relationships'] {
  const current = relationships[id] || { trust: 0, fear: 0, debt: 0, suspicion: 0 };
  const clamp = (value: number) => Math.max(-20, Math.min(30, value));
  return {
    ...relationships,
    [id]: {
      trust: clamp(current.trust + (delta.trust || 0)),
      fear: clamp(current.fear + (delta.fear || 0)),
      debt: Math.max(0, current.debt + (delta.debt || 0)),
      suspicion: clamp(current.suspicion + (delta.suspicion || 0))
    }
  };
}

export function getRelationship(state: GameState, id: CharacterId) {
  return state.campaign.relationships[id] || { trust: 0, fear: 0, debt: 0, suspicion: 0 };
}

export function getCharacterObservation(state: GameState, id: CharacterId): string {
  const relation = getRelationship(state, id);
  const name = CORE_CHARACTERS[id].name;
  if (relation.debt >= 6000) return `${name} te observa con la ternura reservada para bienes ya contabilizados.`;
  if (relation.trust >= 12) return `${name} ha dejado de tratarte como visita temporal. Eso podría ser peor.`;
  if (relation.fear >= 10) return `${name} mantiene una distancia profesional del alcance de tus decisiones.`;
  if (relation.suspicion >= 10) return `${name} toma notas cada vez que respiras cerca de un formulario.`;
  return `${name} todavía decide si eres cliente, precedente o material de embalaje.`;
}

export function isSecretUnlocked(state: GameState, id: CharacterId): boolean {
  const relation = getRelationship(state, id);
  return relation.trust >= 10 || relation.fear >= 12 || relation.debt >= 5000 || state.turnCount >= 10;
}

export function getCharacterLocalReply(id: CharacterId, input: string, rng: () => number): string {
  const profile = CORE_CHARACTERS[id];
  const clean = input.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 90) || 'esa declaración vacía';
  const templates = [
    `${profile.name} examina “${clean}” y concluye que ${profile.roastLens.toLowerCase()} acaba de recibir nueva evidencia.`,
    `${profile.name}: “Interesante. Has conseguido que ‘${clean}’ parezca simultáneamente confesión, excusa y bien depreciable.”`,
    `${profile.name} archiva tu frase bajo ${profile.desire.toLowerCase()}. “Volveremos a esto cuando duela más.”`,
    `${profile.name}: “${clean}”. Qué forma tan eficiente de redactar tu propia letra pequeña.`,
    `${profile.name} guarda silencio, que en su dialecto significa que acaba de encontrar un uso rentable para “${clean}”.`
  ];
  return templates[Math.floor(rng() * templates.length)];
}
