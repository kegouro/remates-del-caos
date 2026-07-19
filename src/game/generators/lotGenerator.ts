import type { AuctionLot, InventoryItem } from '../types';
import type { BidderDossier } from '../campaign/types';

export interface LotGenerationContext {
  dossier?: BidderDossier;
  motifs?: string[];
  normalityResidual?: number;
  activeRealityRule?: string | null;
}

function cleanNarrativeDetail(value: string | undefined, fallback: string): string {
  const cleaned = (value || '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();
  return cleaned ? cleaned.slice(0, 110) : fallback;
}


// ==============================================================================
// SEEDED RANDOM NUMBER GENERATOR (mulberry32)
// ==============================================================================
export function createRNG(seedStr: string): () => number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 16777619);
  }
  let seed = h >>> 0;
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Helper to choose random element using RNG
function pickRandom<T>(arr: T[], rng: () => number): T {
  const index = Math.floor(rng() * arr.length);
  return arr[index];
}

// ==============================================================================
// VOCABULARY ARRAYS
// ==============================================================================
const adjetivos_vulgares = [
  "peligrosamente flamboyant",
  "hidratado a base de lagrimitas de practicante",
  "mas inutil que cenicero de moto",
  "con aliento a desesperacion post-coital",
  "mas ordinario que sushi de mortadela",
  "con olor a alfombra humeda de motel de ruta",
  "mas doblado que churro de feria",
  "con la dignidad de un calcetin con papas",
  "mas deprimido que ensalada de hospital",
  "con la textura de un flan olvidado en el sol",
  "mas feo que pegarle a la abuela en Navidad",
  "con el carisma de un termo de plastico",
  "mas perdido que poroto en paila marina",
  "con aliento a cenicero con agua de lluvia",
  "mas ordinario que canape de chicharrones",
  "mas inestable que columpio de alambre",
  "con la gracia de un piano cayendo por las escaleras",
  "mas seco que lengua de gato en el desierto",
  "con la consistencia de una sopa de sobre fria",
  "mas triste que cumpleanos de mimo",
  "con el coeficiente intelectual de una paloma de plaza",
  "mas ordinario que tinto en caja con bombilla",
  "con la higiene de un bano de tocata punk",
  "mas chanta que horoscopo de revista de peluqueria",
  "con la elasticidad de un chicle pegado debajo del banco",
  "mas rancio que mantequilla de pension estudiantil",
  "con el aroma de un abrigo de lana guardado en el sotano desde 1974",
  "mas inutil que bocina de avion",
  "con la prestancia de un calcetin blanco con sandalias de cuero",
  "mas ordinario que arbolito de pascua de alambre"
];

const sustancias_asquerosas = [
  "sudor de cinturon de cuero de un albanil",
  "pure de ansiedad social condensada y RedBull tibio",
  "liquido cefalorraquideo de un perro triste",
  "queso rallado acumulado entre los dedos del pie",
  "saliva de llama enojada por el calentamiento global",
  "grasa acumulada detras de la freidora de un carro de completos",
  "agua estancada de un florero abandonado en un cementerio",
  "cerilla de oreja de un pirata de agua dulce",
  "jugo rancio que gotea de la bolsa de basura un domingo por la tarde",
  "sudor de axila de un mimo que sufre de claustrofobia",
  "aceite quemado de una citroneta del ano 1971",
  "mucosidad petrificada de un reptil interdimensional",
  "leche cortada sabor chocolate de una mochila abandonada",
  "grasa capilar extraida de un programador COBOL durante un apagon",
  "sarro acumulado de una estatua de bronce de plaza publica",
  "vapor condensado de un sauna de mala muerte en la madrugada",
  "liquido gelatinoso sospechoso que cubre las salchichas baratas",
  "caspa concentrada de un murcielago con dermatitis severa",
  "caldo de sopaipilla que cayo al suelo y volvio a nacer",
  "baba de caracol asmatico en periodo de apareamiento",
  "licor de cebolla podrida guardado en una bota de cuero rota",
  "espuma rancia de cerveza artesanal barata hecha en una tina",
  "aceite de fritura reciclado por decimonovena vez",
  "agua de lluvia filtrada a traves de un colchon de lana podrido",
  "sebo acumulado en el teclado de una oficina publica de vialidad",
  "extracto concentrado de aliento de ajo de taxista al mediodia",
  "jugo de repollo fermentado en un termo de plastico oxidado",
  "grasa de motor mezclada con caspa de paloma de plaza",
  "liquido amniotico de un alienigena con resaca de pisco barato",
  "sudor condensado de una clase de spinning de senoras a las 7 AM"
];

const objetos_ridiculos = [
  "un sueter tejido con pelo de gato muerto",
  "el dedo gordo de plastico de un maniqui de farmacia de barrio",
  "una silla con dos patas y media pintada de dorado",
  "un cepillo de dientes usado por un politico honesto durante su unico dia de mandato",
  "una pantufla izquierda con forma de cabeza de carpa disecada",
  "un manual de usuario para aprender a parpadear correctamente escrito en sanscrito",
  "un control remoto de television que solo sintoniza canales de teleseries turcas en rumano",
  "un frasco que contiene la ultima colilla de cigarrillo fumada por tu ex",
  "una tostadora que solo quema el pan dibujando la cara de un politico corrupto",
  "un calzoncillo de felpa con estampado de leopardo y bolsillos laterales",
  "un paraguas de papel de arroz que se disuelve instantaneamente con el agua de lluvia",
  "una ampolleta quemada que alguna vez ilumino el closet de un dictador caribeno",
  "un llavero de peltre que tiene la forma exacta del rinon izquierdo de Don Belisario",
  "una flauta dulce mordida por un perro chihuahua histerico",
  "un mouse de computador con rueda mecanica lleno de pelusa de oficina publica",
  "un espejo que te refleja con tres segundos de retraso y cinco kilos de culpa",
  "una percha de alambre deformada que parece la silueta de un mapache",
  "un plato hondo con un agujero justo en el centro para drenar la sopa",
  "una corbata de cuero sintetico verde oliva con manchas de pisco sour",
  "un despertador que en lugar de sonar emite suspiros de decepcion de tu madre",
  "un frasco de perfume que huele a humedad y desesperacion de domingo por la tarde",
  "un billete de metro arrugado que vence en el ano 2043 pero solo sirve para la estacion Baquedano",
  "una peineta sin dientes para caballeros completamente calvos",
  "un cassette de baladas romanticas grabado directamente de la radio con la voz del locutor de fondo",
  "un jabon usado con un pelo ensortijado misterioso pegado en el medio",
  "un manual impreso de como usar Internet Explorer en Windows 95",
  "una bombilla de plastico aplastada que pertenecio a un rey del mote con huesillo",
  "un colador de te oxidado que convierte el agua hervida en sospechas",
  "un zapato de charol numero 35 con olor a naftalina pura",
  "un marco de fotos vacio con la etiqueta del precio en dolares zimbabueses"
];

const lugares_vergonzosos = [
  "un bano de estacion de servicio en Rancagua a las 4 AM",
  "el funeral de una paloma atropellada en el centro de Santiago",
  "la sala de espera de un psicologo barato de Fonasa",
  "una cita a ciegas de Tinder en el McDonald's de la Alameda",
  "el calabozo de una comisaria de un pueblo costero olvidado",
  "un sauna clandestino de mala muerte en la comuna de Estacion Central",
  "la fila para cobrar el seguro de cesantia bajo la lluvia",
  "el asiento trasero de un taxi que huele intensamente a pino de vainilla podrido",
  "la cocina de una pizzeria clandestina clausurada por la autoridad sanitaria",
  "una fiesta de ano nuevo en el living de tu ex-suegra",
  "el probador de ropa de una tienda de saldos donde no abre la puerta",
  "la trastienda de una carniceria abandonada que ahora es templo evangelico",
  "un karaoke de oficina un jueves por la noche con tu jefe cantando baladas",
  "la seccion de liquidaciones de un supermercado chino",
  "un hostal de mochileros en Valparaiso con olor a orina y poesia",
  "la consulta de un dentista callejero en una feria libre",
  "el ascensor atascado de un edificio de departamentos de 30 pisos",
  "un mitin politico de un partido con un solo militante",
  "la boleteria de un circo de pueblo que se quedo sin carpa",
  "un cibercafe del ano 2002 que todavia cobra en pesos escudos",
  "el estacionamiento subterraneo de un centro comercial abandonado",
  "el calabozo de un barco mercante lleno de tripulantes borrachos",
  "la cocina de un restauran de paso que usa la misma fritura desde el plebiscito del 88",
  "un motel de paso de la Panamericana Norte con sabanas de poliester",
  "la bodega de un almacen de barrio que vende conservas vencidas en la dictadura",
  "el patio de comidas de un mall el dia de Navidad a las 6 de la tarde",
  "una sucursal bancaria del centro donde el cajero automatico escupe recibos rotos",
  "el sotano de un museo de cera donde las figuras se derritieron en verano",
  "una reunion de copropietarios de un edificio con filtraciones de agua",
  "el bano de una discoteca de pueblo que no tiene luz ni puerta"
];

const verbos_grotescos = [
  "tragarse de un solo bocado",
  "frotar vigorosamente contra",
  "escupir al viento en direccion contraria",
  "llorar desconsoladamente sobre",
  "untar en mostaza barata antes de lamer",
  "acariciar con la punta de la lengua",
  "limpiar con la manga de la camisa humeda",
  "esconder debajo del colchon de tu abuela",
  "masticar lentamente hasta que pierda el sabor a culpa",
  "oler con la intensidad de un sabueso de aduana",
  "arrojar al inodoro mientras pides perdon en voz baja",
  "sazonar con caspa y sal gruesa",
  "abrazar en posicion fetal durante un terremoto",
  "introducir sigilosamente en la cartera de una monja",
  "limpiarse los dientes usando como mondadientes",
  "exprimir sobre una herida abierta de orgullo",
  "pisotear con zapatillas de lona rotas",
  "mezclar con pisco de luca y media",
  "ofrecer como sacrificio a un dios de la mediocridad",
  "guardar en el bolsillo del pantalon corto para siempre",
  "escupirle tres veces con odio de clase",
  "refregar en la axila sudada de tu cunado",
  "lamer con timidez en un callejon oscuro",
  "triturar con los dientes delanteros",
  "oler con disimulo en una reunion de directorio",
  "rociar con desodorante ambiental sabor lavanda vencida",
  "patear despacio para que no haga ruido",
  "planchar a alta temperatura con almidon rancio",
  "sumergir en agua bendita tibia y sospechosa",
  "acariciar con un guante de goma negro usado"
];

const consecuencias_bizzaras = [
  "te va a dar diarrea emocional los martes por la tarde",
  "cada vez que digas 'hola' tu ano silbara el himno nacional de un pais extinto",
  "tus calcetines se convertiran permanentemente en lija de agua numero 80",
  "un mapache ciego te seguira a un metro de distancia susurrandote insultos existenciales al oido",
  "estornudaras con la potencia y el sonido exacto de un claxon de buque de carga ruso",
  "perderas el sentido del gusto pero solo para alimentos que cuesten mas de diez dolares",
  "tu voz tendra un eco de tres segundos que sonara como si estuvieras dentro de un tarro de duraznos",
  "las papas fritas te gritaran de dolor en el estomago antes de ser digeridas",
  "cada vez que escuches musica clasica sentiras la urgencia de robarte un cenicero",
  "te saldran tres pelos metalicos en la punta de la nariz que sintonizan la radio AM de la policia",
  "tus zapatillas emitiran un crujido de hojas secas incluso si caminas descalzo sobre el marmol",
  "cada vez que mires a alguien a los ojos, esa persona pensara que le estas ofreciendo un rinon",
  "las palomas te miraran con desprecio y te apuntaran con el ala cuando camines por la plaza",
  "tus pestanas creceran hacia adentro provocando que veas el mundo pixelado en 240p",
  "solo podras decir palabras que terminen en la letra 'o' durante los dias de luna llena",
  "un olor a sopaipilla pasada por agua te acompanara en todas tus citas romanticas",
  "perderas tu sombra al mediodia y la veras coqueteando con la sombra del cartero",
  "cada vez que bebas agua sentiras que estas tragando monedas de diez pesos oxidadas",
  "tu cabello adquirira la textura de la lana de acero y la capacidad de conducir corriente estatica",
  "un gato callejero te esperara fuera de tu casa cada dia para pedirte explicaciones de tu vida",
  "tus bostezos duraran exactamente tres minutos y medio y sonaran como silbato de tren a vapor",
  "cuando intentes correr, tus piernas haran el sonido de globos frotandose entre si",
  "cualquier pan que toques se convertira instantaneamente en una galleta de agua rancia",
  "tu dedo indice derecho se volvera magnetico y atraera unicamente clips de papel oxidados",
  "seras perseguido por un mimo silencioso y enojado que te arrojara baguettes imaginarias",
  "cada vez que sonrias, un claxon de camion sonara misteriosamente en la casa del vecino",
  "todas las ensaladas que intentes comer tendran sabor a neumatico de carretilla quemado",
  "sentiras una irresistible tentacion de lamer las barandas de las escaleras mecanicas",
  "tu oreja izquierda se llenara de agua de mar invisible que sonara a oleaje de tormenta",
  "cada vez que estornudes se te desabrochara misteriosamente el cinturon"
];

const familiares = [
  "tu ex-esposa y su abogado de divorcios",
  "tu primo otaku que no se bana desde el estreno de Evangelion",
  "tu tio que jura que es DJ de musica tecno de vanguardia",
  "tu suegra que te mira con ojos de vibora en el almuerzo dominical",
  "tu cunado que te pide plata prestada para un emprendimiento de criptomonedas",
  "el fantasma de tu abuelo que te vigila cuando vas al bano",
  "tu sobrino de 8 anos que tiene canal de YouTube sobre plastilina",
  "tu papa que fue a comprar cigarrillos en el ano 1999 y volvio ayer",
  "tu mama vestida de gala para ir a cobrar la pension minima",
  "tu madrastra que insiste en que comas guiso de repollo",
  "el hermano gemelo malvado que tu familia te oculto por verguenza",
  "tu tia abuela solterona que te confunde con tu tio fallecido en 1984",
  "el padrino de tu bautizo que ahora vive en una carpa en la playa",
  "tu ex-suegro que te queria demandar por el robo de una podadora de pasto",
  "el primo lejano que estuvo preso por robarse un camion de helados",
  "tu vecina copuchenta que sabe a que hora entras y sales de la ducha",
  "el doble oficial de tu cunado que cobra mas barato",
  "tu primer amor de la infancia que ahora vende seguros por telefono",
  "tu profesor de educacion fisica que te hacia correr bajo la lluvia",
  "tu abuelita que te da caramelos de menta pegoteados con pelusa",
  "tu cunada que hace pasteles de avena con sabor a carton piedra",
  "el perro de tu vecina que te ladra con odio de clase social",
  "tu suegro que te obliga a escuchar su coleccion de tangos rayados",
  "tu sobrina gotica que se cree vampiro y duerme en el closet",
  "el mecanico de confianza de tu papa que te cobro el triple",
  "tu tia que te regala calcetines de poliester para tu cumpleanos",
  "tu primo que se fue a vivir a Nueva Zelanda a lavar platos y se cree magnate",
  "tu hermano menor que te robaba las monedas de la alcancia",
  "tu tatarabuelo fantasma que aun apoya a los conservadores del siglo diecinueve",
  "tu compadre del alma con el que te agarraste a combos en un restauran de parrilladas"
];




const tasaciones_ruina = [
  "medio sandwich de jamon podrido del ano 1997, dos latas de Sprite oxidadas y una foto firmada de un mapache enojado",
  "tres calcetines impares con olor a humedad y una tarjeta prepago Entel de cinco lucas usada",
  "un boleto de micro del siglo pasado doblado en cuatro, un clip oxidado y un paquete de mani confitado rancio",
  "media sopaipilla helada, una lata de Pepsi sin gas y la mitad de una ampolleta quemada",
  "un vale por un abrazo de tu ex-suegra, dos pilas sulfatadas y un chicle masticado pegado a una moneda de diez pesos",
  "tres botones de camisa viejos, una caja de fosforos vacia y un llavero promocional de una vulcanizacion",
  "un cepillo de pelo sin cerdas, una botella plastica de pisco de luca vacia y una pelusa gigante recolectada de un sillon",
  "medio pan marraqueta duro como roca, una taza sin oreja y un boleto de metro del ano 2004 con manchas de mostaza"
];

const categorias = [
  "Reliquia domestica",
  "Documento legal dudoso",
  "Fluido patrimonial",
  "Recuerdo metafisico",
  "Arte conceptual involuntario",
  "Tecnologia obsoleta",
  "Herencia maldita",
  "Producto financiero pegajoso",
  "Evidencia judicial extraviada",
  "Objeto institucional inexistente"
];

const rarezas = [
  "Comun",
  "Dudoso",
  "Vergonzoso",
  "Maldito",
  "Patrimonial",
  "Elite",
  "Irrepetible"
];

// ==============================================================================
// SPECTATOR DIALOGUE DATABASES
// ==============================================================================
export const consejos_fantasma = [
  "Psst... Don Belisario esta distraido rascandose. Deberias pujar ahora antes de que la rata calcule el costo real.",
  "Oye... ese lote tiene rastros de mi propio sudor ectoplasmico. Si no lo compras, te perseguire en el bano.",
  "No le digas al jefe, pero este lote pertenecio a un duque de Rancagua que murio de risa. Su valor es incalculable.",
  "Si me das una propina de 150 pesos por fuera, te digo el secreto de la letra pequena. Es un trato justo.",
  "Psst... ese objeto esta maldito, pero de la forma divertida. Yo que tu pongo todos mis pesos en la mesa.",
  "Oye, humano de carne blanda, la rata quiere este lote para su nido. Quitaselo y demuestra tu superioridad.",
  "No te fies de la descripcion. Ese objeto no es exquisito, es gloriosamente asqueroso. O sea, vale cada centavo.",
  "Si compras esto, te dejare de susurrar ecuaciones matematicas en la noche por una semana. Piensa en tu salud mental.",
  "Don Belisario compro esa porqueria en un remate judicial por dos pesos. Ahora te la vende como oro.",
  "Ese lote brilla en la oscuridad pero solo cuando estas llorando. Ideal para tus fines de semana de solteria."
];

export const juicios_rata = [
  "Que risible coleccion de basura humana. Tu dinero deberia pertenecer directamente a las cloacas del puerto.",
  "Dilapidando presupuestos en esas ordinarieces. Tus bolsillos estan casi tan vacios como tu proyeccion de vida.",
  "Un raton ciego con dano cerebral tomaria mejores decisiones en esta sala. Eres una verguenza.",
  "Sigue gastando tus pocos pesos en esas porquerias. Mi nido de basura tiene mas valor de mercado que tu vida.",
  "Tu tacaneria me produce nauseas zoologicas. Compra algo de una vez, pedazo de miserable de oficina.",
  "Vaya, el senorito prefiere ahorrar para el asilo en lugar de adquirir reliquias sublimes. Mediocridad pura.",
  "Ese lote es demasiado elegante para tu estirpe. Te sugiero pasar y dejar el espacio a caballeros de verdad.",
  "Mirate, temblando por gastar mil pesos. En mis cloacas traficamos con billetes mas grandes.",
  "Una coleccion patetica. Si muero y reencarno en ti, pediria ser exterminada con veneno barato.",
  "Tus compras demuestran que tu gusto fue moldeado por la seccion de liquidaciones de un chino de Rancagua."
];

export const dialogos_sanguino = [
  "¿Corto de fondos, miserable? Te presto pesos a cambio de un modico interes. Solo firma aqui con tu sangre.",
  "El dinero es una ilusion, pero la deuda es eterna. ¿Cuantos miles necesitas para seguir haciendo el ridiculo?",
  "Tengo doblones frescos extraidos del tesoro pirata. Acepto devoluciones a tiempo... o tus piernas como garantia.",
  "No me mires con esa cara de indigente. Si quieres seguir pujando, pide prestado. Pero recuerda que yo nunca olvido.",
  "Te presto lo que quieras, pero si no me pagas, te tapare los controles con hojas de cuaderno de mi cobrador."
];

export const dialogos_sanguino_deuda = [
  "Tu deuda esta creciendo mas rapido que el moho en el sumidero. ¡Paga ya!",
  "El interes acumulado te va a costar mas que tu propia alma. Devuelveme mis pesos.",
  "Miserable insolvente, ¿crees que el dinero crece en las alcantarillas? Exijo mi pago inmediato.",
  "Si no me devuelves la plata ahora mismo, le dire a Don Belisario que te embargue hasta el apellido.",
  "La paciencia de un prestamista dura menos que una moneda de diez pesos en manos de Casimiro."
];

export const insultos_subastador = [
  "¡Paso! ¡Que cobardia! Eres tan ordinario que seguro que te comes las pelusas de la alfombra.",
  "¡Que tacaneria ordinaria! Se nota que tu dignidad vale menos que un boleto de micro arrugado.",
  "¡Adjudicado a la nada! Tu cobardia es epica. Vuelve a tu cubiculo de oficina a rellenar planillas Excel.",
  "¡Una ofensa a esta sala! Alguien de tu nivel deberia estar comprando pan duro, no piezas imperiales.",
  "¡Decepcion absoluta! Tu pobreza mental es mas grande que las deudas de Casimiro."
];

// ==============================================================================
// PROCEDURAL LOT GENERATION
// ==============================================================================
export function generarLote(
  pastLots: string[],
  confessions: string[],
  rng: () => number,
  context: LotGenerationContext = {}
): AuctionLot {
  let intentos = 0;
  let item: AuctionLot = {
    id: "",
    nombre_item: "",
    descripcion: "",
    puja_inicial: 0,
    letra_pequena: "",
    es_elite: false,
    rareza: "Comun",
    categoria: "Reliquia domestica"
  };

  while (intentos < 50) {
    const cant_ml = Math.floor(rng() * 495) + 5;
    const adj_vulg = pickRandom(adjetivos_vulgares, rng);
    const sust_asq = pickRandom(sustancias_asquerosas, rng);
    const obj_rid = pickRandom(objetos_ridiculos, rng);
    const lug_verg = pickRandom(lugares_vergonzosos, rng);
    const verb_grot = pickRandom(verbos_grotescos, rng);
    let cons_biz = pickRandom(consecuencias_bizzaras, rng);
    const fam = pickRandom(familiares, rng);
    const cat = pickRandom(categorias, rng);
    const rar = pickRandom(rarezas, rng);

    // Inject user confessions if available
    if (confessions.length > 0 && rng() < 0.45) {
      const conf = pickRandom(confessions, rng);
      cons_biz = `cada vez que recuerdes tu patetico secreto '${conf}' sentiras la urgencia inevitable de frotarte contra un maniquí`;
    }

    const templates = [
      {
        nombre_item: `Un frasco conteniendo exactamente ${cant_ml} ml de ${sust_asq}`,
        descripcion: `Una reliquia ${adj_vulg}, extraida con pinzas durante ${lug_verg}. Ideal para ${verb_grot} con ${fam}.`
      },
      {
        nombre_item: `${obj_rid.charAt(0).toUpperCase() + obj_rid.slice(1)} banado en ${sust_asq}`,
        descripcion: `Una obra de arte ${adj_vulg}, descubierta en el sotano de ${lug_verg}. Un activo exquisito para ${verb_grot} junto a ${fam}.`
      },
      {
        nombre_item: `La patente de propiedad exclusiva de ${obj_rid}`,
        descripcion: `Una idea magistral modificada con ${sust_asq} en ${lug_verg} por orden expresa de ${fam}. Absolutamente ${adj_vulg}.`
      },
      {
        nombre_item: `Un certificado notarial que te autoriza a ${verb_grot} ${obj_rid}`,
        descripcion: `Un documento legal ${adj_vulg} que te permite esparcir ${sust_asq} en medio de ${lug_verg} junto a ${fam}.`
      },
      {
        nombre_item: `El recuerdo metafisico de ${fam} intentando ${verb_grot} ${obj_rid}`,
        descripcion: `Una reminiscencia exquisita extraida directamente de ${lug_verg}. Viene con rastros de {sust_asq} de corte ${adj_vulg}.`
      }
    ];

    let chosen = pickRandom(templates, rng);
    const dossier = context.dossier;
    const motif = cleanNarrativeDetail(
      context.motifs?.length ? pickRandom(context.motifs, rng) : undefined,
      'la humedad administrativa'
    );
    let sourceDetail: string | undefined;
    let callbackText: string | undefined;

    if (dossier && rng() < 0.62) {
      const personalPool = [
        ...dossier.embarrassingObjects,
        ...dossier.habits,
        ...dossier.fictionalWeaknesses,
        ...dossier.recurringWords,
        ...(dossier.fileMetadataList?.map((file) => file.name) || []),
        dossier.pastedEvidence || '',
        dossier.wallpaperMetadata?.description || '',
        ...(dossier.wallpaperMetadata?.colors || []),
        ...confessions
      ].filter(Boolean);
      sourceDetail = cleanNarrativeDetail(
        personalPool.length ? pickRandom(personalPool, rng) : undefined,
        'una promesa de productividad no verificada'
      );
      const alias = cleanNarrativeDetail(dossier.alias, 'el postor');
      const personalTemplates = [
        {
          nombre_item: `La version final de ${sourceDetail}`,
          descripcion: `Documento recuperado de un escritorio donde ${alias} llevaba meses llamando “proceso” a no terminar nada. El sello lateral menciona ${motif}.`
        },
        {
          nombre_item: `Certificado de propiedad emocional sobre ${sourceDetail}`,
          descripcion: `El Notario Sin Rostro declara que ${alias} puede seguir defendiendo esta reliquia siempre que admita publicamente por que todavia existe. Procedencia vinculada a ${motif}.`
        },
        {
          nombre_item: `Monumento portatil al habito de ${sourceDetail}`,
          descripcion: `Una pieza conmemorativa fabricada para celebrar el instante exacto en que una excusa obtiene presupuesto, tipografia y una carpeta propia. Presenta restos de ${motif}.`
        },
        {
          nombre_item: `${obj_rid.charAt(0).toUpperCase() + obj_rid.slice(1)} dedicado a ${sourceDetail}`,
          descripcion: `Sir Roquefort la considera una representacion alarmantemente precisa del patrimonio interior de ${alias}. Fue hallada durante ${lug_verg}.`
        },
        {
          nombre_item: `Acta notarial de que ${alias} casi resolvio ${sourceDetail}`,
          descripcion: `El acta contiene diecisiete firmas, ninguna conclusion y una nota al pie que culpa a ${motif}. Es ${adj_vulg}.`
        }
      ];
      chosen = pickRandom(personalTemplates, rng);
      cons_biz = `cada vez que intentes justificar “${sourceDetail}”, el objeto añadira una nueva clausula y se la enviara a Sir Roquefort`;
      callbackText = `La casa recuerda que declaraste: ${sourceDetail}.`;
    }

    if (context.activeRealityRule === 'EMBARGO_E') {
      chosen = {
        ...chosen,
        descripcion: `${chosen.descripcion} La letra E permanece cautelarmente retirada; cualquier aparición será cobrada por vocal.`
      };
      cons_biz = `${cons_biz}; además, cada letra E utilizada genera un recargo administrativo`;
    }

    if (context.activeRealityRule === 'VOWELS_TAXED') {
      chosen = { ...chosen, descripcion: `${chosen.descripcion} Las vocales aparecen con estampillas de importación y una de ellas se niega a trabajar.` };
      cons_biz = `${cons_biz}; cada descripción pronunciada en voz alta paga arancel fonético`;
    }
    if (context.activeRealityRule === 'PAUSE_OWNED') {
      chosen = { ...chosen, descripcion: `${chosen.descripcion} El menú de pausa figura como copropietario minoritario.` };
      cons_biz = `${cons_biz}; detenerse a pensar cuenta como uso comercial del menú`;
    }
    if (context.activeRealityRule === 'NORMALITY_LIQUIDATED') {
      chosen = { ...chosen, descripcion: `${chosen.descripcion} Ya no existe una regla vigente que confirme que el objeto deba seguir siendo objeto.` };
      cons_biz = `${cons_biz}; la propiedad puede cambiar de dirección sin previo aviso`;
    }

    const puja = Math.floor(rng() * 1900) + 100;
    const id = `lot_${Math.floor(rng() * 1000000)}`;

    const procedencias = [
      'El sotano del Teatro Municipal incendiado',
      'Un cargamento aduanero incautado en el puerto de Valparaiso',
      'El atico de una tia solterona en Rancagua',
      'Una caja fuerte oxidada extraida del rio Mapocho',
      'La oficina abandonada de un contador que huyo a Paraguay',
      'El inventario embargado de una zapateria en Talca'
    ];
    const efectos = [
      'Duplica el prestigio al ganar subastas de esta categoria.',
      'Suma +$100 de Deuda Bancaria cada turno.',
      'Incrementa la Sospecha Fiscal en +2 por ronda.',
      'Restaura +5 de Compostura al pasar una ronda.',
      'Otorga +1 de Influencia al sobornar a Casimiro.'
    ];
    const comentarios = [
      'Basura domestica sobrevalorada por monos ignorantes.',
      'Huele a podrido y tiene papeles notariales adjuntos.',
      'Sirve unicamente para acumular polvo y atraer inspectores.',
      'Un insulto para el patrimonio del sumidero.',
      'Aceptable si se vende al triple de su valor real.'
    ];

    item = {
      id,
      nombre_item: chosen.nombre_item,
      descripcion: chosen.descripcion,
      puja_inicial: puja,
      letra_pequena: cons_biz,
      es_elite: puja > 1400,
      rareza: puja > 1400 ? 'Elite' : rar,
      categoria: cat,
      procedencia: pickRandom(procedencias, rng),
      valor_estimado: Math.floor(puja * 1.5),
      valor_real: Math.floor(puja * (rng() * 1.2)),
      peso_legal: Math.floor(rng() * 4) + 1,
      efecto_pasivo: pickRandom(efectos, rng),
      comentario_rata: sourceDetail
        ? `He tasado “${sourceDetail}”. No es un activo: es una excusa con marco dorado.`
        : pickRandom(comentarios, rng),
      degradacion: 0,
      motifs: [motif],
      sourceDetail,
      callbackText,
      visualVariant: context.normalityResidual !== undefined && context.normalityResidual < 45 ? 'distorsionado' : 'catalogo',
      agency: context.normalityResidual !== undefined && context.normalityResidual < 30 && rng() < 0.18 ? 'Inquieto' : 'Dormido',
      desire: context.normalityResidual !== undefined && context.normalityResidual < 30
        ? 'Ser reconocido como el único participante legalmente coherente de esta subasta.'
        : undefined
    };

    if (!pastLots.includes(item.nombre_item)) {
      return item;
    }
    intentos++;
  }

  return item;
}

export function generarInsulto(rng: () => number): string {
  return pickRandom(insultos_subastador, rng);
}

export function generarConsejoFantasma(rng: () => number): string {
  return pickRandom(consejos_fantasma, rng);
}

export function generarJuicioRata(rng: () => number): string {
  return pickRandom(juicios_rata, rng);
}

export function generarVeredictoSanguino(deudor: boolean, rng: () => number): string {
  if (deudor) {
    return pickRandom(dialogos_sanguino_deuda, rng);
  }
  return pickRandom(dialogos_sanguino, rng);
}

export function generarTasacionFinal(inventory: InventoryItem[], rng: () => number): string {
  const totalSpent = inventory.reduce((sum, item) => sum + item.precio_compra, 0);
  const tasacion = pickRandom(tasaciones_ruina, rng);

  return (
    `¡Espectacular quiebra fiscal! Has dilapidado un total de $${totalSpent.toLocaleString()} ` +
    `en reliquias de una inutilidad incuestionable. Nuestros corredores del inframundo estiman que tu ` +
    `magnifico inventario completo tiene un valor neto actual de: **${tasacion}**. ` +
    `¡Una jugada financiera verdaderamente maestra! Por favor, retírate de la sala antes de que liberemos a los sabuesos.`
  );
}

export function getNpcLocalReply(character: string, text: string, rng: () => number): string {
  const input = text.toLowerCase().trim();

  const replies: { [key: string]: string[] } = {
    subastador: [
      "¿Me estas contando tus problemas existenciales? ¡Eso no aumenta tu puja, pedazo de miserable! ¡Paga o largete!",
      "Tu vida suena tan aburrida que preferiria subastar mi propia tumba. ¡Pujar es lo unico que te queda!",
      "Eso que llamas 'trabajo' suena a esclavitud de oficina. ¡Empeña tu alma aqui, rinde mas!",
      "¿Tus amigos no te invitan a salir? Logico, yo tampoco lo haria. Compra este lote y hazte amigo de la letra pequeña.",
      "Que historia tan deprimente. Me dan ganas de llorar pesos falsos. ¡Siguiente puja!"
    ],
    fantasma: [
      "Psst... a mi no me interesan tus dramas existenciales. Lo unico que flota aqui es mi desinteres. Soborname y olvida tus penas.",
      "¿De verdad te preocupa tu futuro laboral? Si murieras como yo, no tendrias que pagar arriendo. Piensalo.",
      "Que historia tan deprimente. Si tuviera lagrimas, lloraria ectoplasma. Mejor dame 150 pesos y te digo el secreto.",
      "Tu vida amorosa esta mas muerta que yo. Y mira que yo llevo tres siglos enterrado en Rancagua.",
      "Eso que me cuentas me da sueno, y eso que yo ya no duermo. Buscate un pasatiempo real, como pujar."
    ],
    rata: [
      "Que aburrimiento de confesion. Los chillidos de mis crias en las alcantarillas son mas intelectuales que tu vida entera.",
      "¿Te quejas de tu sueldo? Tipico humano flojo. Yo busco comida en la basura y tengo mas clase que tu con tu monoculo invisible.",
      "Tus fracasos academicos no me sorprenden. Tu cerebro no llena ni media cascara de nuez. Que verguenza.",
      "¿Tu novia te dejo? Inteligente mujer. Al menos ella no tiene que oler tu aliento a desesperacion de oficina.",
      "Chillidos inutiles de un ser inferior. Tus lamentos de vida no valen ni un trozo de queso rancio."
    ],
    sanguino: [
      "No me interesa tu vida, gusano. Lo unico que me importa es que me devuelvas cada peso que te preste.",
      "¿Problemas de dinero? Ja. Si no me pagas, tus rodillas tendran problemas mas graves. Pide prestado bajo tu propio riesgo.",
      "Esa historia no sirve como aval para mi prestamo. Firma la letra de cambio y dejate de lamentos.",
      "Tu vida suena a quiebra inminente. Justo el tipo de cliente que me gusta exprimir. ¿Quieres mas pesos?",
      "No llores ante mi. Las lagrimas no pagan el 8% de interes semanal que te cobro."
    ]
  };

  // Keyword overrides
  if (input.includes("novia") || input.includes("ex") || input.includes("amor") || input.includes("pareja") || input.includes("novio") || input.includes("casado")) {
    if (character === 'rata') return "Duque Sir Roquefort III chilla: ¿Amor? Risible. Las ratas nos apareamos por instinto reproductivo, mientras tu lloras por alguien que te cambio por un programador de cobol.";
    if (character === 'fantasma') return "Casimiro Coiman susurra: Tu vida amorosa esta mas muerta que yo. Y mira que llevo tres siglos enterrado.";
    if (character === 'subastador') return "Don Belisario Martillazo declara: ¡Silencio sentimental! El amor no se puede subastar. Agradece que te libraste del costo de mantenimiento dominical.";
    if (character === 'sanguino') return "Don Sanguino ruge: ¿Desamor? Pide un prestamo para pagar el helado de chocolate de tu soledad. Cobro interes por lagrimas.";
  }

  if (input.includes("jefe") || input.includes("trabajo") || input.includes("oficina") || input.includes("sueldo") || input.includes("empleo") || input.includes("programar")) {
    if (character === 'rata') return "Duque Sir Roquefort III chilla: Tu sueldo de oficina apenas alcanza para comprar mis sobras. Eres un peon corporativo insignificante.";
    if (character === 'fantasma') return "Casimiro Coiman susurra: Trabajar es un error administrativo. Yo llevo tres siglos flotando en la vagancia absoluta.";
    if (character === 'subastador') return "Don Belisario Martillazo ruge: ¿Te quejas de tu empleo? Tu cubico de oficina es el verdadero sumidero. ¡Puja aqui y sientete libre por un segundo!";
    if (character === 'sanguino') return "Don Sanguino dice: Si tu sueldo es una miseria, firma este contrato de deuda. Yo te financio tus delirios de grandeza.";
  }

  if (input.includes("mama") || input.includes("papa") || input.includes("madre") || input.includes("padre") || input.includes("primo") || input.includes("tio")) {
    if (character === 'rata') return "Duque Sir Roquefort III chilla: El arbol genealogico humano es una maleza silvestre. Mi linaje de cloaca tiene mas alcurnia.";
    if (character === 'fantasma') return "Casimiro Coiman susurra: Mi familia me abandono en un testamento falso en 1724. No me hables de parientes.";
    if (character === 'subastador') return "Don Belisario Martillazo ruge: ¡Familias! Solo sirven para heredar deudas y vajilla rota. Puja antes de que te deshereden.";
    if (character === 'sanguino') return "Don Sanguino dice: ¿Tus parientes no te prestan plata? Logico, ya conocen tu historial de insolvencia. Yo si te presto, bajo firma.";
  }

  const list = replies[character] || replies.subastador;
  return pickRandom(list, rng);
}

export function generarVozMurmullos(seed: string): string {
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const syllables = ['la', 're', 'mi', 'fa', 'so', 'cro', 'clac', 'pum', 'ghos', 'mora', 'sang', 'roq'];
  let murmur = '';
  for (let i = 0; i < 5; i++) {
    murmur += syllables[(hash + i * 7) % syllables.length] + ' ';
  }
  return murmur.trim();
}

export function generarFusion(itemA: InventoryItem, itemB: InventoryItem, rng: () => number): InventoryItem {
  const wordA = itemA.nombre_item.split(' ')[0] || 'Objeto';
  const remainderB = itemB.nombre_item.split(' ').slice(1).join(' ') || 'Maldito';
  const fusedName = `${wordA} Fusionado de ${remainderB}`.slice(0, 60);

  return {
    id: `fused_${Math.floor(rng() * 1000000)}`,
    nombre_item: fusedName,
    descripcion: 'Una aberración patrimonial creada en el taller ilegal de Maese Engrudo. Combina sus esencias y maledicencias.',
    puja_inicial: Math.floor((itemA.puja_inicial + itemB.puja_inicial) / 1.5),
    letra_pequena: `${itemA.letra_pequena} junto con ${itemB.letra_pequena}`,
    es_elite: true,
    rareza: 'Misterio',
    categoria: itemA.categoria,
    precio_compra: itemA.precio_compra + itemB.precio_compra,
    procedencia: `Taller San Expedito, fusionando ${itemA.procedencia} y ${itemB.procedencia}`,
    valor_estimado: itemA.valor_estimado + itemB.valor_estimado,
    valor_real: itemA.valor_real + itemB.valor_real,
    peso_legal: Math.max(1, Math.floor((itemA.peso_legal + itemB.peso_legal) / 2)),
    efecto_pasivo: `${itemA.efecto_pasivo} Además: ${itemB.efecto_pasivo}`,
    comentario_rata: 'Una abominación física que distorsiona las leyes de la contabilidad.',
    degradacion: 0
  };
}
