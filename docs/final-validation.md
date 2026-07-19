# Validación final

Fecha: 2026-07-19

## Entorno

- Node.js: `v22.16.0`
- npm: `10.9.2`
- Vite: `8.1.5`
- Vitest: `3.2.7`
- TypeScript estricto

## Instalación limpia

```bash
npm ci
```

Resultado:

- 198 paquetes instalados.
- 0 vulnerabilidades reportadas por npm.

## Verificación principal

```bash
npm run check
```

Incluye:

1. `npm run typecheck`
2. `npm run lint`
3. `npm run test`
4. `npm run build`

Resultado: **PASS**.

## Pruebas unitarias

- Archivos: 8
- Pruebas: 47
- Resultado: 47 aprobadas

Cobertura conductual incluida:

- RNG reproducible;
- generación y diversidad de lotes;
- 500 lotes simulados sin markup ejecutable;
- pujas y decisiones de rivales;
- préstamos, deuda y bancarrota;
- formatos de subasta no monetarios;
- campaña testamentaria;
- expediente procedural;
- sanitización de confesiones;
- director de anomalías;
- resolución sin softlock;
- dieciséis personajes y relaciones;
- eventos deterministas;
- memoria institucional;
- periódicos reactivos;
- logros derivados y persistentes;
- presagios contractuales;
- rencor y conmoción de rivales;
- maniobras clandestinas;
- contratos con la casa y rechazo sin softlock;
- flujo correcto de periódico a evento;
- modo interminable y exportación segura;
- Remate del Día reproducible;
- peticiones de objetos con agencia;
- rituales secretos y catálogo ceremonial;
- simulaciones aceleradas de campañas breves, completas e infinitas.

## Build

```text
dist/index.html                   1.11 kB
dist/assets/index-D0b36THL.css   41.80 kB
dist/assets/index-7Mm2sbhn.js   440.81 kB
```

- JavaScript gzip: 142.89 kB
- CSS gzip: 9.55 kB
- Carpeta `dist/` completa: aproximadamente 706 kB
- Retratos web: aproximadamente 233 kB en total

Los cuatro retratos principales fueron convertidos desde JPEG de 1024 px a WebP optimizado. El peso conjunto bajó desde aproximadamente 2,8 MB.

## Prueba de GitHub Pages en subdirectorio

El contenido de `dist/` se sirvió localmente bajo:

```text
/remates-del-caos/
```

Se comprobaron mediante HTTP:

- documento HTML;
- bundle JavaScript;
- CSS;
- retrato principal.

Resultado: **PASS**. No hubo rutas 404 en los recursos comprobados.

## Playwright

La suite E2E existe, contiene 18 recorridos enumerables en Chromium, Firefox y Chrome móvil, y el workflow de GitHub instala Chromium antes de ejecutarla.

En este sandbox se intentó ejecutar Chromium del sistema contra `http://127.0.0.1:5173`. El navegador devolvió:

```text
net::ERR_BLOCKED_BY_ADMINISTRATOR
```

`curl` sí accedió al mismo servidor, por lo que la limitación corresponde a la política del navegador del entorno y no a Vite. En consecuencia:

- E2E dentro de este sandbox: **NO VERIFICADO**.
- E2E configurado para GitHub Actions: **SÍ**.
- No se afirma que Playwright haya pasado localmente.

## Seguridad y privacidad

Se buscaron explícitamente:

```text
AIza
GEMINI
API_KEY
/Users/
/home/
dangerouslySetInnerHTML
innerHTML
eval(
```

No se encontraron claves ni rutas privadas en la aplicación moderna. Las coincidencias en `AGENTS.md` y este documento son prohibiciones y términos de auditoría, no uso ejecutable.

La versión web:

- no posee backend;
- no contiene telemetría;
- no envía confesiones;
- procesa metadatos e imágenes voluntarias localmente;
- guarda la partida y el expediente en `sessionStorage`;
- guarda únicamente preferencias y logros derivados en `localStorage`.

## Limitaciones verificadas

- Las capturas existentes corresponden a una fase anterior del diseño y no muestran todos los sistemas nuevos.
- Doce personajes secundarios usan retratos tipográficos y marcos CSS, no ilustraciones propias.
- La auditoría automatizada de accesibilidad con axe-core todavía no está integrada.
- El despliegue público requiere crear o conectar el repositorio de GitHub y activar Pages con GitHub Actions.
