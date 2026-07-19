# REMATES DEL CAOS

## Adjudicado al Peor Postor

> Tienes diez mil pesos, ningún criterio y una silla reservada en el subsuelo de **Mortaja, Martillo & Cía.**

![Entrada a Mortaja, Martillo & Cía.](docs/screenshots/desktop-main.png)

**Remates del Caos** es un roguelite narrativo de subastas, deudas, objetos malditos y burocracia espectral. Nació como un prototipo en Streamlit y ahora funciona como un juego web estático en React, TypeScript y Vite.

No pretende resolver un problema real. Pretende averiguar cuánto pagarías por una tetera que recuerda discusiones y qué diría una rata aristócrata al respecto.

## Qué ocurre dentro

- **Interrogatorio procedural:** la Declaración Jurada de Dudosa Relevancia construye un expediente local a partir de preguntas extrañas, hábitos, objetos vergonzosos y contradicciones.
- **Hostilidad configurable:** desde cortesía diplomática hasta Auditoría Sin Abogado. Los personajes reutilizan información autorizada para elaborar roasts contextuales, no insultos genéricos.
- **Director de delirio:** administra motivos recurrentes, microeventos, anomalías, pausas y mutaciones de reglas. La rareza tiene ritmo y memoria.
- **Subastas con monedas incorrectas:** algunos lotes se pagan con liquidez, compostura, prestigio o deuda heredada.
- **Presagios contractuales:** cada campaña comienza eligiendo una profecía jugable. Cumplirla produce recompensas, callbacks y una humillación jurídicamente premeditada.
- **Salón con pulso:** el público, los rivales y el propio edificio reaccionan por separado. Los rivales acumulan rencor, revelan tics y cambian su tolerancia a la puja.
- **Maniobras clandestinas:** influencia y fragmentos de alma permiten filtrar tasaciones, sembrar escándalos y reescribir precios de apertura.
- **Contratos con la casa:** cuando el edificio tiene hambre puede pedir objetos, compostura, nombre o aplausos futuros a cambio de recursos. Rechazarlo también deja consecuencias.
- **Remate del Día:** la fecha UTC genera una semilla y un modificador común, completamente offline, para comparar la misma desgracia con otras personas.
- **Peticiones del patrimonio:** los objetos conscientes pueden exigir salario, sindicalizarse, iniciar una demanda o registrarte como parte de su inventario.
- **Rituales secretos:** combinaciones improbables de objetos, rechazos, deudas y evidencia despiertan ceremonias únicas. El catálogo muestra pistas veladas y registra únicamente lo descubierto.
- **Prensa exportable:** *El Avalúo Nacional* produce portadas reactivas que pueden guardarse como PNG o copiarse sin extraer confesiones crudas.
- **Patrimonio con agencia:** los objetos pueden despertar, sindicalizarse, litigar y terminar figurando como propietarios del jugador.
- **Dieciséis personajes:** cada uno posee voz, deseo, herida, secreto, relaciones y una forma propia de destruir tu autoestima administrativa.
- **Campaña por actos:** eventos, jefes, minijuegos, taller, tribunal, noticias procedurales, finales y un Libro de Actas de accidentes legalmente ocurridos. Incluye Remate Breve, Noche Completa y Remate Interminable.
- **Evidencia voluntaria local:** el jugador puede entregar nombres y metadatos de archivos, texto pegado o una imagen para extraer una paleta. Nada se lee sin selección explícita y el contenido no se envía a servidores.
- **Audio local:** música sintetizada, martillazos, ambientes y voces mediante APIs del navegador.
- **Semillas reproducibles:** la estructura procedural puede repetirse sin depender de IA ni backend.

## Habitantes del subsuelo

**Don Belisario Martillazo** convierte cada pérdida en ceremonia. Sospecha que él también fue subastado.

**Casimiro Coimán** vende información confidencial y quizá posee un certificado de defunción falso.

**Sir Roquefort III** dirige el Banco de Migas y considera a la humanidad un activo depreciado.

**Don Sanguino** presta futuros donde todavía tenías dinero y llama al alma “garantía inmaterial”.

La Fiscal Serafina Timbre, Maese Engrudo, Madame Balance, la Cobradora de las 4:17 y otras criaturas completan un consejo de dieciséis enemigos potenciales.

## Modos de expediente

- **Incógnito Patrimonial:** inventa todos los datos.
- **Visita Diplomática:** personalización y roasts suaves.
- **Contabilidad Nocturna:** experiencia equilibrada.
- **Fiebre Patrimonial:** más anomalías y callbacks.
- **Auditoría Sin Abogado:** modo adulto, hostil y deliberadamente personal. Requiere confirmación explícita y permite borrar la munición durante la partida.

## Privacidad

La aplicación no contiene telemetría, analítica ni backend.

- La partida activa, confesiones, conversaciones y expediente viven en `sessionStorage`.
- Preferencias y logros derivados viven en `localStorage`.
- Los archivos solo se procesan después de que el usuario los selecciona. Se usan nombres, tipos, tamaños y fechas, no su contenido.
- Las imágenes voluntarias se reducen localmente a datos de paleta. La imagen original no se guarda en el estado.
- Todo puede borrarse desde la interfaz.
- El modo incógnito ofrece la experiencia completa sin entregar información personal.

La casa puede fingir omnisciencia como personaje. El software no espía.

## Desarrollo

```bash
npm ci
npm run dev
```

Validación principal:

```bash
npm run check
```

Comandos individuales:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run test:e2e
```

La salida estática se genera en `dist/`.

## GitHub Pages

El repositorio incluye `.github/workflows/deploy-pages.yml`. El workflow instala dependencias con `npm ci`, ejecuta las verificaciones, construye `dist/` y publica mediante las acciones oficiales de GitHub Pages.

La configuración de Vite usa rutas relativas, por lo que la aplicación puede alojarse como Project Page dentro de una subcarpeta.

## Arquitectura

```text
src/
├── app/                    interfaz y escenas
├── audio/                  síntesis, voces y efectos
├── components/             salón, expediente, anomalías e inventario
└── game/
    ├── campaign/           delirio, presagios, contratos, personajes, formatos, eventos y finales
    ├── engine/             decisiones de rivales
    ├── generators/         lotes, roasts y texto procedural
    ├── persistence/        sesión, preferencias y logros
    ├── state/              máquina de estados y reducer
    └── tests/              pruebas unitarias y simulaciones
```

El motor procedural puede ejecutarse sin React, lo que permite probar campañas, lotes, presagios, contratos, rivales y anomalías de forma determinista. La versión 1.1.0 incluye 47 pruebas unitarias y simulaciones de campañas completas, campañas infinitas y rituales secretos.

## Legado

La versión original de Python y Streamlit permanece en `legacy/streamlit/`. No se necesita para jugar la versión web.

## Estado de validación

La validación reproducible y sus limitaciones están documentadas en:

- [`docs/final-validation.md`](docs/final-validation.md)
- [`docs/acceptance-audit.md`](docs/acceptance-audit.md)
- [`docs/obra-febril.md`](docs/obra-febril.md)

## Licencia

MIT. Los retratos incluidos forman parte del proyecto y fueron optimizados para distribución web.

---

### English

A browser-only procedural auction roguelite about cursed property, predatory debt, hostile bureaucracy and objects that may eventually acquire their buyer. It runs locally with React and TypeScript, requires no generative-AI service, and includes a configurable narrative dossier that can remain entirely fictional.
