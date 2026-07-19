import random

# ==============================================================================
# PROCEDURAL WORD ARRAYS (MINIMUM 30 ITEMS EACH)
# ==============================================================================

adjetivos_vulgares = [
    "peligrosamente flamboyant",
    "hidratado a base de lagrimitas de practicante",
    "más inútil que cenicero de moto",
    "con aliento a desesperación post-coital",
    "más ordinario que sushi de mortadela",
    "con olor a alfombra húmeda de motel de ruta",
    "más doblado que churro de feria",
    "con la dignidad de un calcetín con papas",
    "más deprimido que ensalada de hospital",
    "con la textura de un flan olvidado en el sol",
    "más feo que pegarle a la abuela en Navidad",
    "con el carisma de un termo de plástico",
    "más perdido que poroto en paila marina",
    "con aliento a cenicero con agua de lluvia",
    "más ordinario que canapé de chicharrones",
    "más inestable que columpio de alambre",
    "con la gracia de un piano cayendo por las escaleras",
    "más seco que lengua de gato en el desierto",
    "con la consistencia de una sopa de sobre fría",
    "más triste que cumpleaños de mimo",
    "con el coeficiente intelectual de una paloma de plaza",
    "más ordinario que tinto en caja con bombilla",
    "con la higiene de un baño de tocata punk",
    "más chanta que horóscopo de revista de peluquería",
    "con la elasticidad de un chicle pegado debajo del banco",
    "más rancio que mantequilla de pensión estudiantil",
    "con el aroma de un abrigo de lana guardado en el sótano desde 1974",
    "más inútil que bocina de avión",
    "con la prestancia de un calcetín blanco con sandalias de cuero",
    "más ordinario que arbolito de pascua de alambre"
]

sustancias_asquerosas = [
    "sudor de cinturón de cuero de un albañil",
    "puré de ansiedad social condensada y RedBull tibio",
    "líquido cefalorraquídeo de un perro triste",
    "queso rallado acumulado entre los dedos del pie",
    "saliva de llama enojada por el calentamiento global",
    "grasa acumulada detrás de la freidora de un carro de completos",
    "agua estancada de un florero abandonado en un cementerio",
    "cerilla de oreja de un pirata de agua dulce",
    "jugo rancio que gotea de la bolsa de basura un domingo por la tarde",
    "sudor de axila de un mimo que sufre de claustrofobia",
    "aceite quemado de una citroneta del año 1971",
    "mucosidad petrificada de un reptil interdimensional",
    "leche cortada sabor chocolate de una mochila abandonada",
    "grasa capilar extraída de un programador COBOL durante un apagón",
    "sarro acumulado de una estatua de bronce de plaza pública",
    "vapor condensado de un sauna de mala muerte en la madrugada",
    "líquido gelatinoso sospechoso que cubre las salchichas baratas",
    "caspa concentrada de un murciélago con dermatitis severa",
    "caldo de sopaipilla que cayó al suelo y volvió a nacer",
    "baba de caracol asmático en periodo de apareamiento",
    "licor de cebolla podrida guardado en una bota de cuero rota",
    "espuma rancia de cerveza artesanal barata hecha en una tina",
    "aceite de fritura reciclado por decimonovena vez",
    "agua de lluvia filtrada a través de un colchón de lana podrido",
    "sebo acumulado en el teclado de una oficina pública de vialidad",
    "extracto concentrado de aliento de ajo de taxista al mediodía",
    "jugo de repollo fermentado en un termo de plástico oxidado",
    "grasa de motor mezclada con caspa de paloma de plaza",
    "líquido amniótico de un alienígena con resaca de pisco barato",
    "sudor condensado de una clase de spinning de señoras a las 7 AM"
]

objetos_ridiculos = [
    "un suéter tejido con pelo de gato muerto",
    "el dedo gordo de plástico de un maniquí de farmacia de barrio",
    "una silla con dos patas y media pintada de dorado",
    "un cepillo de dientes usado por un político honesto durante su único día de mandato",
    "una pantufla izquierda con forma de cabeza de carpa disecada",
    "un manual de usuario para aprender a parpadear correctamente escrito en sánscrito",
    "un control remoto de televisión que solo sintoniza canales de teleseries turcas en rumano",
    "un frasco que contiene la última colilla de cigarrillo fumada por tu ex",
    "una tostadora que solo quema el pan dibujando la cara de un político corrupto",
    "un calzoncillo de felpa con estampado de leopardo y bolsillos laterales",
    "un paraguas de papel de arroz que se disuelve instantáneamente con el agua de lluvia",
    "una ampolleta quemada que alguna vez iluminó el closet de un dictador caribeño",
    "un llavero de peltre que tiene la forma exacta del riñón izquierdo del subastador",
    "una flauta dulce mordida por un perro chihuahua histérico",
    "un mouse de computador con rueda mecánica lleno de pelusa de oficina pública",
    "un espejo que te refleja con tres segundos de retraso y cinco kilos de culpa",
    "una percha de alambre deformada que parece la silueta de un mapache",
    "un plato hondo con un agujero justo en el centro para drenar la sopa",
    "una corbata de cuero sintético verde oliva con manchas de pisco sour",
    "un despertador que en lugar de sonar emite suspiros de decepción de tu madre",
    "un frasco de perfume que huele a humedad y desesperación de domingo por la tarde",
    "un billete de metro arrugado que vence en el año 2043 pero solo sirve para la estación Baquedano",
    "una peineta sin dientes para caballeros completamente calvos",
    "un cassette de baladas románticas grabado directamente de la radio con la voz del locutor de fondo",
    "un jabón usado con un pelo ensortijado misterioso pegado en el medio",
    "un manual impreso de cómo usar Internet Explorer en Windows 95",
    "una bombilla de plástico aplastada que perteneció a un rey del mote con huesillo",
    "un colador de té oxidado que convierte el agua hervida en sospechas",
    "un zapato de charol número 35 con olor a naftalina pura",
    "un marco de fotos vacío con la etiqueta del precio en dólares zimbabuenses"
]

lugares_vergonzosos = [
    "un baño de estación de servicio en Rancagua a las 4 AM",
    "el funeral de una paloma atropellada en el centro de Santiago",
    "la sala de espera de un psicólogo barato de Fonasa",
    "una cita a ciegas de Tinder en el McDonald's de la Alameda",
    "el calabozo de una comisaría de un pueblo costero olvidado",
    "un sauna clandestino de mala muerte en la comuna de Estación Central",
    "la fila para cobrar el seguro de cesantía bajo la lluvia",
    "el asiento trasero de un taxi que huele intensamente a pino de vainilla podrido",
    "la cocina de una pizzería clandestina clausurada por la autoridad sanitaria",
    "una fiesta de año nuevo en el living de tu ex-suegra",
    "el probador de ropa de una tienda de saldos donde no abre la puerta",
    "la trastienda de una carnicería abandonada que ahora es templo evangélico",
    "un karaoke de oficina un jueves por la noche con tu jefe cantando baladas",
    "la sección de liquidaciones de un supermercado chino",
    "un hostal de mochileros en Valparaíso con olor a orina y poesía",
    "la consulta de un dentista callejero en una feria libre",
    "el ascensor atascado de un edificio de departamentos de 30 pisos",
    "un mitin político de un partido con un solo militante",
    "la boletería de un circo de pueblo que se quedó sin carpa",
    "un cibercafé del año 2002 que todavía cobra en pesos escudos",
    "el estacionamiento subterráneo de un centro comercial abandonado",
    "el calabozo de un barco mercante lleno de tripulantes borrachos",
    "la cocina de un restorán de paso que usa la misma fritura desde el plebiscito del 88",
    "un motel de paso de la Panamericana Norte con sábanas de poliéster",
    "la bodega de un almacén de barrio que vende conservas vencidas en la dictadura",
    "el patio de comidas de un mall el día de Navidad a las 6 de la tarde",
    "una sucursal bancaria del centro donde el cajero automático escupe recibos rotos",
    "el sótano de un museo de cera donde las figuras se derritieron en verano",
    "una reunión de copropietarios de un edificio con filtraciones de agua",
    "el baño de una discoteca de pueblo que no tiene luz ni puerta"
]

verbos_grotescos = [
    "tragarse de un solo bocado",
    "frotar vigorosamente contra",
    "escupir al viento en dirección contraria",
    "llorar desconsoladamente sobre",
    "untar en mostaza barata antes de lamer",
    "acariciar con la punta de la lengua",
    "limpiar con la manga de la camisa húmeda",
    "esconder debajo del colchón de tu abuela",
    "masticar lentamente hasta que pierda el sabor a culpa",
    "oler con la intensidad de un sabueso de aduana",
    "arrojar al inodoro mientras pides perdón en voz baja",
    "sazonar con caspa y sal gruesa",
    "abrazar en posición fetal durante un terremoto",
    "introducir sigilosamente en la cartera de una monja",
    "limpiarse los dientes usando como mondadientes",
    "exprimir sobre una herida abierta de orgullo",
    "pisotear con zapatillas de lona rotas",
    "mezclar con pisco de luca y media",
    "ofrecer como sacrificio a un dios de la mediocridad",
    "guardar en el bolsillo del pantalón corto para siempre",
    "escupirle tres veces con odio de clase",
    "refregar en la axila sudada de tu cuñado",
    "lamer con timidez en un callejón oscuro",
    "triturar con los dientes delanteros",
    "oler con disimulo en una reunión de directorio",
    "rociar con desodorante ambiental sabor lavanda vencida",
    "patear despacio para que no haga ruido",
    "planchar a alta temperatura con almidón rancio",
    "sumergir en agua bendita tibia y sospechosa",
    "acariciar con un guante de goma negro usado"
]

consecuencias_bizzaras = [
    "te va a dar diarrea emocional los martes por la tarde",
    "cada vez que digas 'hola' tu ano silbará el himno nacional de un país extinto",
    "tus calcetines se convertirán permanentemente en lija de agua número 80",
    "un mapache ciego te seguirá a un metro de distancia susurrándote insultos existenciales al oído",
    "estornudarás con la potencia y el sonido exacto de un claxon de buque de carga ruso",
    "perderás el sentido del gusto pero solo para alimentos que cuesten más de diez dólares",
    "tu voz tendrá un eco de tres segundos que sonará como si estuvieras dentro de un tarro de duraznos",
    "las papas fritas te gritarán de dolor en el estómago antes de ser digeridas",
    "cada vez que escuches música clásica sentirás la urgencia de robarte un cenicero",
    "te saldrán tres pelos metálicos en la punta de la nariz que sintonizan la radio AM de la policía",
    "tus zapatillas emitirán un crujido de hojas secas incluso si caminas descalzo sobre el mármol",
    "cada vez que mires a alguien a los ojos, esa persona pensará que le estás ofreciendo un riñón",
    "las palomas te mirarán con desprecio y te apuntarán con el ala cuando camines por la plaza",
    "tus pestañas crecerán hacia adentro provocando que veas el mundo pixelado en 240p",
    "solo podrás decir palabras que terminen en la letra 'o' durante los días de luna llena",
    "un olor a sopaipilla pasada por agua te acompañará en todas tus citas románticas",
    "perderás tu sombra al mediodía y la verás coqueteando con la sombra del cartero",
    "cada vez que bebas agua sentirás que estás tragando monedas de diez pesos oxidadas",
    "tu cabello adquirirá la textura de la lana de acero y la capacidad de conducir corriente estática",
    "un gato callejero te esperará fuera de tu casa cada día para pedirte explicaciones de tu vida",
    "tus bostezos durarán exactamente tres minutos y medio y sonarán como silbato de tren a vapor",
    "cuando intentes correr, tus piernas harán el sonido de globos frotándose entre sí",
    "cualquier pan que toques se convertirá instantáneamente en una galleta de agua rancia",
    "tu dedo índice derecho se volverá magnético y atraerá únicamente clips de papel oxidados",
    "serás perseguido por un mimo silencioso y enojado que te arrojará baguettes imaginarias",
    "cada vez que sonrías, un claxon de camión sonará misteriosamente en la casa del vecino",
    "todas las ensaladas que intentes comer tendrán sabor a neumático de carretilla quemado",
    "sentirás una irresistible tentación de lamer las barandas de las escaleras mecánicas",
    "tu oreja izquierda se llenará de agua de mar invisible que sonará a oleaje de tormenta",
    "cada vez que estornudes se te desabrochará misteriosamente el cinturón"
]

acciones_ridiculas = [
    "se come las pelusas de la alfombra de un motel",
    "discute de política internacional con un microondas desenchufado",
    "intenta lamerse el codo izquierdo para impresionar a su ex-suegra",
    "le pide perdón de rodillas a una planta de plástico",
    "escribe poemas de amor dedicados al recolector de basura",
    "intenta pagar la cuenta del restorán con tarjetas de prepago vencidas",
    "baila reggaetón evangélico en la fila del banco",
    "le habla en inglés británico a las palomas de la plaza de armas",
    "le toma la temperatura al agua de los fideos con el codo",
    "intenta peinar su calvicie con un cepillo de alambre para asados",
    "compra calcetines usados en la feria y los usa como guantes",
    "le canta canciones de cuna a un pedazo de queso rancio",
    "le pone apodos cariñosos a las arañas de rincón de su pieza",
    "intenta convencer al cartero de que la tierra es plana y tiene forma de empanada",
    "se saca las costras de las rodillas y las colecciona en una cajita de fósforos",
    "le saca fotos al plato de comida de su perro para subirlas a Instagram",
    "intenta afeitarse las axilas con un cuchillo untador de mantequilla",
    "le reza a San Expedito para que le devuelvan su cassette de Axe Bahía",
    "se limpia la nariz con los boletos del autobús que encuentra en el suelo",
    "le explica a un caracol de jardín el funcionamiento de la bolsa de comercio",
    "intenta hacer fuego frotando dos vienesas crudas",
    "esconde las cucharas de la casa porque cree que el gobierno lo espía",
    "le pone calcetines a las patas de la mesa para que no tengan frío",
    "se pasa el cepillo de ropa por la cara antes de salir a la calle",
    "colecciona tapas de botellas de cerveza creyendo que son monedas del futuro",
    "intenta sintonizar la radio del auto con los dientes",
    "le teje un abrigo de lana a una piedra que encontró en el río",
    "se echa colonia de bebé en los ojos para ver el mundo con más ternura",
    "le pide autógrafos al guardia del supermercado mayorista",
    "se mide la circunferencia de la cabeza con papel higiénico usado"
]

familiares = [
    "tu ex-esposa y su abogado de divorcios",
    "tu primo otaku que no se baña desde el estreno de Evangelion",
    "tu tío que jura que es DJ de música tecno de vanguardia",
    "tu suegra que te mira con ojos de víbora en el almuerzo dominical",
    "tu cuñado que te pide plata prestada para un emprendimiento de criptomonedas",
    "el fantasma de tu abuelo que te vigila cuando vas al baño",
    "tu sobrino de 8 años que tiene canal de YouTube sobre plastilina",
    "tu papá que fue a comprar cigarrillos en el año 1999 y volvió ayer",
    "tu mamá vestida de gala para ir a cobrar la pensión mínima",
    "tu madrastra que insiste en que comas guiso de repollo",
    "el hermano gemelo malvado que tu familia te ocultó por vergüenza",
    "tu tía abuela solterona que te confunde con tu tío fallecido en 1984",
    "el padrino de tu bautizo que ahora vive en una carpa en la playa",
    "tu ex-suegro que te quería demandar por el robo de una podadora de pasto",
    "el primo lejano que estuvo preso por robarse un camión de helados",
    "tu vecina copuchenta que sabe a qué hora entras y sales de la ducha",
    "el doble oficial de tu cuñado que cobra más barato",
    "tu primer amor de la infancia que ahora vende seguros por teléfono",
    "tu profesor de educación física que te hacía correr bajo la lluvia",
    "tu abuelita que te da caramelos de menta pegoteados con pelusa",
    "tu cuñada que hace pasteles de avena con sabor a cartón piedra",
    "el perro de tu vecina que te ladra con odio de clase social",
    "tu suegro que te obliga a escuchar su colección de tangos rayados",
    "tu sobrina gótica que se cree vampiro y duerme en el clóset",
    "el mecánico de confianza de tu papá que te cobró el triple",
    "tu tía que te regala calcetines de poliéster para tu cumpleaños",
    "tu primo que se fue a vivir a Nueva Zelanda a lavar platos y se cree magnate",
    "tu hermano menor que te robaba las monedas de la alcancía",
    "tu tatarabuelo fantasma que aún apoya a los conservadores del siglo diecinueve",
    "tu compadre del alma con el que te agarraste a combos en un restorán de parrilladas"
]

tasaciones_ruina = [
    "medio sándwich de jamón podrido del año 1997, dos latas de Sprite oxidadas y una foto firmada de un mapache enojado",
    "tres calcetines impares con olor a humedad y una tarjeta prepago Entel de cinco lucas usada",
    "un boleto de micro del siglo pasado doblado en cuatro, un clip oxidado y un paquete de maní confitado rancio",
    "media sopaipilla helada, una lata de Pepsi sin gas y la mitad de una ampolleta quemada",
    "un vale por un abrazo de tu ex-suegra, dos pilas sulfatadas y un chicle masticado pegado a una moneda de diez pesos",
    "tres botones de camisa viejos, una caja de fósforos vacía y un llavero promocional de una vulcanización",
    "un cepillo de pelo sin cerdas, una botella plástica de pisco de luca vacía y una pelusa gigante recolectada de un sillón",
    "medio pan marraqueta duro como roca, una taza sin oreja y un boleto de metro del año 2004 con manchas de mostaza"
]

# ==============================================================================
# NPC PROCEDURAL TEXTS (ADVICE AND JUDGMENTS)
# ==============================================================================

consejos_fantasma = [
    "Psst... el jefe está distraído rascándose la espalda con el martillo. Deberías pujar ahora antes de que la rata calcule el costo real.",
    "Oye... ese lote tiene rastros de mi propio sudor ectoplásmico. Te aseguro que si no lo compras, te perseguiré en las duchas.",
    "No le cuentes al viejo decrepito, pero este lote perteneció a un duque de Rancagua que murió de risa. Su valor es incalculable.",
    "Si me das una propina de 150 pesos por fuera, te digo el secreto. Aunque si no lo haces, igual te digo que esto es pura delicia.",
    "Psst... ese objeto está maldito, pero de la forma divertida. Yo que tú pongo todos mis pesos sobre la mesa.",
    "Oye, humano de carne blanda, la rata quiere este lote para su nido. Quítaselo de las manos y demuestra tu superioridad.",
    "No te fíes de la descripción del viejo. Ese objeto no es exquisito, es gloriosamente asqueroso. O sea, vale cada centavo.",
    "Si compras esto, te dejaré de susurrar ecuaciones matemáticas en la noche por al menos una semana. Piensa en tu salud mental.",
    "El subastador compró esa porquería en un remate judicial por dos pesos. Ahora te la vende como oro. Pujar es tu única salida poética.",
    "Ese lote brilla en la oscuridad pero solo cuando estás llorando. Ideal para tus fines de semana de soltería.",
    "Psst... el monóculo de la rata está empañado. Si pujas el mínimo, capaz que el viejo no se dé cuenta de tu pobreza.",
    "He visto fantasmas de la alta sociedad flotar leguas enteras solo para oler esa sustancia. Pon tu dinero ahí.",
    "Oye, si compras eso, te daré el pase vip para las alcantarillas de Valparaíso. Un lujo que pocos mortales disfrutan.",
    "Ese objeto perteneció a un pirata cojo que solo robaba pantuflas izquierdas. Historia pura, weón.",
    "El jefe está borracho de pisco rancio. Si pujas ahora, ganarás el lote y tal vez un pedazo de su dignidad."
]

juicios_rata = [
    "Qué risible colección de basura humana. Tu dinero debería pertenecer directamente a las cloacas del puerto.",
    "Dilapidando presupuestos en esas ordinarieces. Tus bolsillos están casi tan vacíos como tu proyección de vida.",
    "Un ratón ciego con daño cerebral tomaría mejores decisiones en esta sala. Eres una vergüenza para los mamíferos.",
    "Sigue gastando tus pocos pesos en esas porquerías. Mi nido de basura tiene más valor de mercado que toda tu existencia.",
    "Tu tacañería me produce náuseas zoológicas. Compra algo de una vez, pedazo de miserable de oficina.",
    "Vaya, el señorito prefiere ahorrar para el asilo en lugar de adquirir reliquias sublimes. Qué mediocridad intelectual.",
    "Ese lote es demasiado elegante para tu estirpe de clase media. Te sugiero pasar y dejar el espacio a caballeros de verdad.",
    "Mírate, temblando por gastar mil pesos. En mis cloacas traficamos con billetes más grandes para limpiar el alcantarillado.",
    "Una colección patética. Si muero y reencarno en ti, pediría ser exterminada con veneno barato de supermercado.",
    "Tus compras demuestran que tu gusto estético fue moldeado por la sección de ofertas de una tienda de saldos de Rancagua.",
    "Qué ordinariez de cartera. Si no vas a pujar en serio, vuelve a tu cubículo de oficina a llenar planillas Excel.",
    "Tanta pretensión y terminas comprando sudor condensado. Eres el rey de la decadencia involuntaria.",
    "Hasta mis pulgas tienen una noción más clara de la inversión financiera. Has tirado el dinero como un principiante.",
    "Tu presencia en esta subasta de lujo es un insulto al buen gusto. Vete a comprar pan duro y quédate en silencio.",
    "Felicidades por adquirir estiércol embotellado. Realmente encaja con la energía de tu perfil de Tinder."
]

# ==============================================================================
# PROCEDURAL GENERATORS
# ==============================================================================

def generar_lote(past_items=[], confessions=[]):
    intentos = 0
    while intentos < 20:
        cant_ml = random.randint(5, 500)
        adj_vulg = random.choice(adjetivos_vulgares)
        sust_asq = random.choice(sustancias_asquerosas)
        obj_rid = random.choice(objetos_ridiculos)
        lug_verg = random.choice(lugares_vergonzosos)
        verb_grot = random.choice(verbos_grotescos)
        cons_biz = random.choice(consecuencias_bizzaras)
        fam = random.choice(familiares)
        
        # Inject confessions dynamically into consequence templates if available!
        if confessions and random.random() < 0.4:
            conf = random.choice(confessions)
            cons_biz = f"cada vez que recuerdes tu patético secreto '{conf}' te dará un tic anal y querrás frotarte contra un maniquí"
            
        templates = [
            {
                "nombre_item": f"Un frasco de vidrio conteniendo exactamente {cant_ml} ml de {sust_asq}",
                "descripcion": f"Una reliquia {adj_vulg}, extraída con pinzas quirúrgicas durante {lug_verg}. ¡Totalmente ideal para {verb_grot} con {fam}!"
            },
            {
                "nombre_item": f"{obj_rid.capitalize()} bañado en {sust_asq}",
                "descripcion": f"Una obra de arte {adj_vulg}, descubierta en el sótano de {lug_verg}. Un activo exquisito para {verb_grot} a espaldas de {fam}."
            },
            {
                "nombre_item": f"La patente de propiedad exclusiva de {obj_rid}",
                "descripcion": f"Una idea magistral modificada con {sust_asq} en {lug_verg} por orden expresa de {fam}. Absolutamente {adj_vulg}."
            },
            {
                "nombre_item": f"Un certificado notarial que te autoriza a {verb_grot} {obj_rid}",
                "descripcion": f"Un documento legal {adj_vulg} que te permite esparcir {sust_asq} en medio de {lug_verg} junto a {fam}."
            },
            {
                "nombre_item": f"El recuerdo metafísico de {fam} intentando {verb_grot} {obj_rid}",
                "descripcion": f"Una reminiscencia exquisita extraída directamente de {lug_verg}. Viene con rastros frescos de {sust_asq} de corte {adj_vulg}."
            }
        ]
        
        item = random.choice(templates)
        item["puja_inicial"] = random.randint(100, 2000)
        item["letra_pequena"] = cons_biz
        
        if item["nombre_item"] not in past_items:
            return item
        intentos += 1
        
    return item

def generar_insulto():
    adj_vulg = random.choice(adjetivos_vulgares)
    acc_rid = random.choice(acciones_ridiculas)
    lug_verg = random.choice(lugares_vergonzosos)
    
    insultos = [
        f"¡Paso! ¡Qué cobardía! Eres tan {adj_vulg} que de seguro {acc_rid} en {lug_verg}.",
        f"¡Qué tacañería ordinaria! Se nota que eres {adj_vulg} y que {acc_rid} cuando vas a {lug_verg}.",
        f"¡Adjudicado a la nada! Tu cobardía es {adj_vulg}. Probablemente {acc_rid} en {lug_verg} para pasar el tiempo.",
        f"¡Una ofensa a esta sala! Alguien tan {adj_vulg} seguro que {acc_rid} en {lug_verg} los fines de semana.",
        f"¡Qué decepción absoluta! Tu tacañería es {adj_vulg}. Se rumorea en el mercado negro que {acc_rid} en {lug_verg}."
    ]
    return random.choice(insultos)

def generar_consejo_fantasma():
    return random.choice(consejos_fantasma)

def generar_juicio_rata():
    return random.choice(juicios_rata)

def generar_tasacion_local(inventory):
    total_spent = sum(item.get('precio_compra', 0) for item in inventory)
    tasacion = random.choice(tasaciones_ruina)
    return (
        f"¡Espectacular bancarrota, espécimen de tacañería superlativa! Has dilapidado un total de ${total_spent} "
        f"en reliquias de una inutilidad incuestionable. Nuestros corredores del inframundo estiman que tu "
        f"magnífico inventario completo tiene un valor neto actual de mercado negro de: "
        f"**{tasacion}**. "
        f"¡Una jugada financiera verdaderamente maestra! Por favor, retírate de la sala de subastas antes de que libere a los sabuesos invisibles."
    )
