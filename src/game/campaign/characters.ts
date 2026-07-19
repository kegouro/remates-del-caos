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
  const clean = input.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 90) || 'esa declaración vacía';
  
  // Normalización del input para búsqueda de palabras clave
  const normalized = clean
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // Mapa de palabras clave y sus respuestas específicas por personaje
  const keywords: Record<string, string[]> = {
    dinero: ['dinero', 'plata', 'presupuesto', 'pobre', 'riqueza', 'pagar', 'precio', 'comprar', 'pesos', 'oro', 'monedas', 'liquidez'],
    deuda: ['deuda', 'prestamo', 'interes', 'debo', 'sanguino', 'banco', 'credito', 'pagare', 'cobro'],
    secreto: ['secreto', 'mentira', 'ocultar', 'verdad', 'confesar', 'confesion', 'engano'],
    rata: ['rata', 'roquefort', 'queso', 'migas', 'roedor'],
    muerte: ['muerte', 'morir', 'fantasma', 'coiman', 'espectro', 'difunto', 'fallecido', 'tumba'],
    jefe: ['jefe', 'trabajo', 'empleo', 'salario', 'explotar', 'sueldo', 'oficina'],
    tiempo: ['tiempo', 'hora', 'tarde', 'reloj', 'esperar', 'segundos', 'minutos', 'plazo'],
    alma: ['alma', 'espiritu', 'garantia', 'inmaterial']
  };

  // Respuestas temáticas según el personaje y la palabra clave detectada
  const npcReplies: Partial<Record<CharacterId, Record<string, string>>> = {
    subastador: {
      dinero: `Don Belisario Martillazo: “¡Dinero! Esa vulgaridad transitoria que mide el valor de los hombres y el apetito del martillo. Si carece de él, subastaremos su compostura.”`,
      deuda: `Don Belisario Martillazo: “Las deudas en este salón no son números, sino el peso del futuro cayendo sobre sus hombros. Procure que el martillazo no lo encuentre insolvente.”`,
      secreto: `Don Belisario Martillazo: “¿Un secreto? ¡Magnífico! Las mentiras bien ornamentadas cotizan mucho mejor en la subasta que la vulgar y desnuda verdad.”`,
      rata: `Don Belisario Martillazo: “Ah, el pequeño Alphonse. Cree que las migas del sumidero constituyen un imperio. Un roedor astuto, pero desprovisto de toda elegancia dramática.”`,
      muerte: `Don Belisario Martillazo: “La muerte es el subastador supremo. Adjudica al peor postor y nunca concede prórrogas. Mientras tanto, conserve la compostura.”`,
      jefe: `Don Belisario Martillazo: “El empleo es una fianza que uno paga diariamente con su tiempo. No espere simpatía de esta casa por sus desdichas laborales.”`,
      tiempo: `Don Belisario Martillazo: “El tiempo transcurre como una cuenta regresiva: ¡a la una, a las dos, y adjudicado! No lo malgaste en lamentaciones.”`,
      alma: `Don Belisario Martillazo: “¿Su alma? Un lote interesante, pero de tasación compleja. Requiere un marco dorado y un historial libre de embargos anteriores.”`
    },
    fantasma: {
      dinero: `Casimiro Coimán: “El dinero es un trámite que vence mañana. Si necesitas desviar fondos o certificar un pago inexistente, susúrramelo... con un recargo.”`,
      deuda: `Casimiro Coimán: “¿Deudas? Entre nosotros, el libro de actas de Don Sanguino tiene una página muy delgada. Un derrame de tinta oportuno cuesta poco.”`,
      secreto: `Casimiro Coimán: “Los secretos son mi moneda de curso legal. Una mentira oportuna vale más que cualquier certificado de defunción. Cuéntame otra.”`,
      rata: `Casimiro Coimán: “Sir Roquefort cree que controla el Banco de Migas, pero sus contables son espectros que responden a mis sellos. No te fíes de su monóculo.”`,
      muerte: `Casimiro Coimán: “Estar muerto no es tan malo si sabes rellenar los formularios correctos. La burocracia del más allá es eterna, pero negociable.”`,
      jefe: `Casimiro Coimán: “¿Tu jefe? El mío es Belisario, y lleva siglos ensayando discursos solemnes mientras yo me encargo de que los números cuadren.”`,
      tiempo: `Casimiro Coimán: “La hora de salida es un concepto flexible en el subsuelo. Siempre hay tiempo para una firma apócrifa.”`,
      alma: `Casimiro Coimán: “El alma es un activo inmaterial difícil de liquidar. Sanguino te la aceptará, pero yo prefiero algo que quepa en un sobre cerrado.”`
    },
    rata: {
      dinero: `Sir Roquefort III: “El dinero es el único lenguaje racional. Su falta de liquidez demuestra una preocupante obsolescencia biológica. Depréciese en silencio.”`,
      deuda: `Sir Roquefort III: “Las deudas son cadenas lógicas. En el Banco de Migas no prestamos a humanos sentimentales; su tasa de interés es el colapso inminente.”`,
      secreto: `Sir Roquefort III: “Las mentiras humanas son tan predecibles como sus quiebras. Su secreto es un activo de valor cero en cualquier mercado formal.”`,
      rata: `Sir Roquefort III: “¿Roquefort? Sir Roquefort para usted, plebeyo. Y no confunda mi linaje con plagas de alcantarilla; controlo el sumidero completo.”`,
      muerte: `Sir Roquefort III: “La muerte es la amortización total de un recurso gastado. Incluso el fantasma de Coimán paga arriendo por ocupar espacio en mi inventario.”`,
      jefe: `Sir Roquefort III: “El trabajo asalariado es un subsidio para la incompetencia. Si su salario es insuficiente, es porque su valor de mercado es insignificante.”`,
      tiempo: `Sir Roquefort III: “El tiempo no es dinero; el tiempo es el interés compuesto que usted le debe a su propia decadencia. Dése prisa.”`,
      alma: `Sir Roquefort III: “¿Garantía inmaterial? El alma cotiza a la baja. Prefiero activos reales, tangibles e inmunes a sus rezos de fin de semana.”`
    },
    sanguino: {
      dinero: `Don Sanguino: “El dinero va y viene, criatura... Por eso prefiero los contratos permanentes. Una pequeña firma y tu liquidez dejará de ser una preocupación.”`,
      deuda: `Don Sanguino: “No lo llames deuda, hijo; llámalo un futuro asegurado. Te presto hoy lo que perderás mañana, con una modesta comisión inmaterial.”`,
      secreto: `Don Sanguino: “Puedes mentirle a Belisario o a la Fiscal, criatura, pero las mentiras no se descuentan del saldo. Al final, tu firma está en mi libro.”`,
      rata: `Don Sanguino: “Alphonse es un caballero muy digno con su monóculo, sí... pero sus migas de queso también pagan intereses en mi ventanilla.”`,
      muerte: `Don Sanguino: “La muerte no cancela los contratos perpetuos, hijo. Los herederos son una garantía excelente y los espectros siguen firmando con la misma letra.”`,
      jefe: `Don Sanguino: “Un mal jefe es solo un cobrador impaciente. Ven conmigo, mis plazos son eternos y mi trato es mucho más paternal.”`,
      tiempo: `Don Sanguino: “Tómate tu tiempo, criatura. Los segundos acumulados solo significan un futuro más maduro para ser cobrado.”`,
      alma: `Don Sanguino: “La garantía inmaterial es mi favorita. Cabe en una boleta, no paga impuestos de timbre y siempre vuelve a su dueño original... es decir, a mí.”`
    },
    fiscal: {
      dinero: `Fiscal Serafina Timbre: “Toda transacción en efectivo sin timbre oficial es nula. Su flujo de caja está siendo registrado bajo el anexo fiscal.”`,
      deuda: `Fiscal Serafina Timbre: “La deuda acumulada sin amortización comprobada constituye desacato del anexo siete. Presente sus descargos inmediatos.”`,
      secreto: `Fiscal Serafina Timbre: “Ocultar antecedentes en un documento firmado bajo juramento conlleva la incautación del expediente y del declarante.”`,
      rata: `Fiscal Serafina Timbre: “El roedor Alphonse carece de personería jurídica reglamentaria. Sus migas bancarias serán fiscalizadas el próximo lunes.”`,
      muerte: `Fiscal Serafina Timbre: “El cese de funciones vitales no anula la causa fiscal. El expediente de auditoría continuará a través de su sucesión.”`,
      jefe: `Fiscal Serafina Timbre: “Toda relación de dependencia laboral debe ser registrada por triplicado. Las quejas verbales no constituyen prueba formal.”`,
      tiempo: `Fiscal Serafina Timbre: “El plazo reglamentario venció oficialmente. Cualquier alegato o excusa fuera de término queda archivado sin revisión.”`,
      alma: `Fiscal Serafina Timbre: “Las garantías inmateriales carecen de respaldo catastral. El alma no figura como bien embargable en el estatuto principal.”`
    },
    cobradora: {
      dinero: `La Cobradora de las 4:17: “El dinero es solo la medida exacta de su tardanza. Prepare el pago antes de que mis zapatos dejen de sonar.”`,
      deuda: `La Cobradora de las 4:17: “Su saldo insolvente ya figura en la planilla de ejecución diaria. No aceptamos prórrogas firmadas mañana.”`,
      secreto: `La Cobradora de las 4:17: “Toda mentira u ocultación es simplemente un interés que se acumula para la hora del vencimiento final.”`,
      rata: `La Cobradora de las 4:17: “El roedor del Banco de Migas conoce mis plazos. Nadie en el sumidero está exento de la hora de cobro.”`,
      muerte: `La Cobradora de las 4:17: “La muerte es una cita que tengo agendada con usted a las 4:17. No se preocupe, seré sumamente puntual.”`,
      jefe: `La Cobradora de las 4:17: “Su empleador actual no podrá cubrir el saldo adeudado. Las obligaciones del subsuelo son de carácter personalísimo.”`,
      tiempo: `La Cobradora de las 4:17: “El tiempo es el interés moratorio que usted le debe a su propia decadencia. Su plazo expira exactamente ahora.”`,
      alma: `La Cobradora de las 4:17: “Su alma ya fue registrada como garantía de primer grado en la orden del día. Procederemos a su ejecución.”`
    }
  };

  // Buscar palabra clave en el input
  for (const [key, list] of Object.entries(keywords)) {
    if (list.some(keyword => normalized.includes(keyword))) {
      // Intentar obtener respuesta específica para este NPC y palabra clave
      if (npcReplies[id] && npcReplies[id][key]) {
        return npcReplies[id][key];
      }
      // Respuestas de respaldo para otros personajes usando la palabra clave
      if (id === 'viuda') {
        if (key === 'dinero') return `La Viuda del Retail: “¡Dinero! Úsalo para comprar en la gran liquidación de saldos del acto actual antes de que expire.”`;
        if (key === 'deuda') return `La Viuda del Retail: “¿Deudas? Se pagan en doce cuotas fijas con la tarjeta del Salón. La muerte es gratis, el interés no.”`;
      }
      if (id === 'notario') {
        if (key === 'dinero') return `El Notario Sin Rostro: “El pago de bienes debe certificarse en papel sellado. Sin el timbre de fe, sus billetes son celulosa.”`;
        if (key === 'deuda') return `El Notario Sin Rostro: “La deuda consta en copia autorizada y certificada. No intente negar su rúbrica; la tinta no olvida.”`;
      }
      if (id === 'garantia') {
        if (key === 'deuda' || key === 'dinero') return `Padre Garantía: “Toda deuda económica encuentra su salvación mediante una extensión de cobertura. Bendito sea el pago a plazo.”`;
        if (key === 'alma') return `Padre Garantía: “El alma no tiene devolución después de los primeros treinta días corridos. Lea la letra pequeña.”`;
      }
      if (id === 'balance') {
        if (key === 'secreto') return `Madame Balance: “Los secretos desequilibran el balance de vidas anteriores. Confiese todo para cuadrar las columnas.”`;
        if (key === 'tiempo') return `Madame Balance: “El tiempo es una cifra que gira sobre sí misma. Su retraso ya estaba contabilizado en el activo.”`;
      }
    }
  }

  // Fallbacks temáticos altamente personalizados por NPC en lugar de la misma plantilla para todos
  const fallbacks: Record<CharacterId, string[]> = {
    subastador: [
      `Don Belisario Martillazo: “Interesante declaración sobre ‘${clean}’. Pero en este salón, las palabras se pesan en oro y se cortan con martillo.”`,
      `Don Belisario Martillazo examina su postura: “Conque ‘${clean}’... Una confesión pintoresca, aunque carece del dramatismo que exijo de mis deudores.”`,
      `Don Belisario Martillazo: “Archivaré ‘${clean}’ en el anexo de disculpas no homologadas. Prosiga con su puja, el tiempo corre.”`
    ],
    fantasma: [
      `Casimiro Coimán: “¿‘${clean}’? Entre nosotros, he visto expedientes peores archivados en el pozo de cenizas. Todo tiene un precio.”`,
      `Casimiro Coimán susurra: “Anotado. Aunque si quieres borrar el registro de ‘${clean}’, la tarifa estándar son cincuenta pesos. Tú decides.”`,
      `Casimiro Coimán guiña un ojo: “Eso de ‘${clean}’ suena bastante comprometedor. El jefe pagaría bien por saberlo.”`
    ],
    rata: [
      `Sir Roquefort III: “¿‘${clean}’? Un pensamiento de valor marginal, típico de un espécimen con exceso de sentimentalismo y escasez de presupuesto.”`,
      `Sir Roquefort III tasa sus palabras: “Insignificante. Poner en palabras ‘${clean}’ no aumentará su precio de liquidación en el Banco de Migas.”`,
      `Sir Roquefort III: “He oído disculpas de mejor factura de parte de mis contables. Concéntrese en mantener sus números en verde.”`
    ],
    sanguino: [
      `Don Sanguino: “Ay, hijo... Hablar de ‘${clean}’ es un consuelo pasajero. Pero los consuelos no pagan el arriendo de tus mañanas.”`,
      `Don Sanguino sonríe: “Entiendo perfectamente lo de ‘${clean}’. No te preocupes, pondré esa inquietud como garantía en el próximo préstamo.”`,
      `Don Sanguino: “Eso que dices es muy tierno, criatura. Firma aquí y dejemos que el tiempo haga su trabajo.”`
    ],
    fiscal: [
      `Fiscal Serafina Timbre: “Su mención de ‘${clean}’ carece de firmas autorizadas y ha sido archivada provisionalmente en la bandeja de desestimados.”`,
      `Fiscal Serafina Timbre: “Exijo que ‘${clean}’ sea presentado por triplicado ante la inspectora de bienes improbables.”`
    ],
    engrudo: [
      `Maese Engrudo: “Eso de ‘${clean}’ se puede arreglar fácilmente con dos capas de barniz y un poco de cola de carpintero de procedencia dudosa.”`,
      `Maese Engrudo: “He reparado cómodas con grietas más profundas que ‘${clean}’. La restauración comenzará de inmediato.”`
    ],
    balance: [
      `Madame Balance: “Las cifras de ‘${clean}’ no cuadran en la columna del debe. Deberá justificar ese vacío antes del cierre de actas.”`,
      `Madame Balance: “La auditoría de vidas pasadas reveals que ‘${clean}’ es una constante repetida en sus anteriores bancarrotas.”`
    ],
    viuda: [
      `La Viuda del Retail: “Eso de ‘${clean}’ no tiene descuento aplicable. Vuelve cuando encuentres un artículo con etiqueta roja.”`,
      `La Viuda del Retail: “¿‘${clean}’? Prefiero comprar lotes cerrados sin abrir; la sorpresa siempre cotiza más alto.”`
    ],
    notario: [
      `El Notario Sin Rostro: “Se toma razón de ‘${clean}’, procediendo a su incorporación en el protocolo de bienes embargados del folio doce.”`,
      `El Notario Sin Rostro: “La validez de su declaración queda sujeta al pago del impuesto de timbre correspondiente.”`
    ],
    nino: [
      `Niño Índice: “La probabilidad de que ‘${clean}’ afecte el índice de precios del salón es de un tres por ciento. Un margen despreciable.”`,
      `Niño Índice: “Su tendencia respecto a ‘${clean}’ va a la baja. Recomiendo liquidar su inventario antes de la próxima etapa.”`
    ],
    filomena: [
      `Doña Filomena Liquidez: “¡Qué importa ‘${clean}’! Prefiero apostar todo al lote actual y ver si Sir Roquefort se atreve a superar mi oferta.”`,
      `Doña Filomena Liquidez: “¡Jajaja! Eso de ‘${clean}’ suena divertidísimo, pero mi paciencia es corta y mi presupuesto es infinito.”`
    ],
    cardenas: [
      `Contador Cárdenas: “Considerar ‘${clean}’ a estas alturas es caer en la falacia del costo hundido. Ya hemos invertido demasiado en esta pérdida.”`,
      `Contador Cárdenas: “Mis registros indican que ‘${clean}’ aumentará el déficit operativo en un veinte por ciento. Debemos insistir.”`
    ],
    ujier: [
      `El Ujier de Ceniza: “Esa puerta marcada como ‘${clean}’ lleva años clausurada tras el incendio. Le sugiero buscar otra salida.”`,
      `El Ujier de Ceniza: “Los visitantes que hablan de ‘${clean}’ suelen quedarse atrapados en el pasillo de los archivadores mudos.”`
    ],
    infanta: [
      `La Infanta del Recargo: “Añadiremos una pequeña comisión de servicio sobre ‘${clean}’. Es por gastos de representación de mi corona.”`,
      `La Infanta del Recargo: “Qué declaración tan adorable. Conlleva un recargo del quince por ciento por procesamiento burocrático.”`
    ],
    garantia: [
      `Padre Garantía: “Su declaración sobre ‘${clean}’ no cuenta con cobertura contra desgaste ordinario. Deberá encomendarse a la fe del plazo extendido.”`,
      `Padre Garantía: “Bendigo su declaración, aunque las exclusiones de la póliza cubren el noventa por ciento de sus pecados.”`
    ],
    cobradora: [
      `La Cobradora de las 4:17: “Su declaración sobre ‘${clean}’ ha sido registrada. La hora de vencimiento sigue fijada irrevocablemente.”`,
      `La Cobradora de las 4:17: “Eso de ‘${clean}’ no detendrá mis pasos. La planilla de obligaciones debe ser saldada hoy.”`
    ]
  };

  // Obtener array de fallbacks del personaje
  const list = fallbacks[id] || fallbacks.subastador;
  const choice = list[Math.floor(rng() * list.length)];
  return choice;
}
