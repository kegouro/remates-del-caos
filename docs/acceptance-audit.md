# Auditoría de aceptación

Estado real de la expansión **Remate Febril / Oráculo Estocástico**.

| Requisito | Estado | Evidencia | Trabajo restante |
|---|---|---|---|
| Aplicación web sin Python en producción | PASS | React, TypeScript y Vite generan `dist/`. | Ninguno para la versión web. |
| Legado Streamlit preservado | PASS | `legacy/streamlit/`. | Ninguno. |
| GitHub Pages | PARTIAL | Workflow oficial en `.github/workflows/deploy-pages.yml`; build estático verificado. | Activar Pages y comprobar la URL pública desde GitHub. |
| Funcionamiento en subdirectorio | PASS | `base: './'`; prueba estática bajo `/remates-del-caos/`. | Repetir verificación en el hosting público. |
| Máquina de estados | PASS | Reducer central en `src/game/state/store.ts`. | Seguir dividiendo el reducer si crece. |
| Campaña por actos | PASS | Modos breve, completo e infinito; actos, jefes, periódicos y finales. | Más escenas visuales para actos avanzados. |
| Presagios y contratos de la casa | PASS | Profecías deterministas, pulso institucional y contratos con consecuencias en el reducer. | Añadir arte dedicado para la casa consciente. |
| Remate del Día | PASS | Semilla UTC, seis modificadores y acta compartible sin backend. | Añadir ranking opcional solo si existe una arquitectura de privacidad separada. |
| Peticiones de objetos | PASS | La agencia desbloquea peticiones con efectos, precedentes y prevención de cobro repetido por etapa. | Añadir escenas judiciales específicas para demandas de objetos. |
| Exportación de periódicos | PASS | Portada PNG y texto copiable construidos desde la edición publicada. | Añadir plantillas visuales alternativas. |
| Interrogatorio procedural | PASS | `DossierOnboarding`, banco de preguntas y selección por semilla. | Expandir preguntas y traducción inglesa. |
| Hostilidad configurable | PASS | Cuatro intensidades, confirmación adulta, temas prohibidos y modo incógnito. | Mayor variedad lingüística regional. |
| Evidencia voluntaria local | PASS | Metadatos de archivos, texto pegado y paleta de imagen procesados en navegador. | Añadir panel más detallado de procedencia por dato. |
| Privacidad | PASS | Sin backend ni telemetría; datos sensibles en sesión; borrado disponible. | Auditoría externa antes de publicación masiva. |
| Director de delirio | PASS | Presupuesto de anomalía, normalidad residual, motivos, microeventos y callbacks. | Más colisiones sistémicas y rituales secretos. |
| Subastas especiales | PASS | Ciega, compostura, prestigio y testamentaria. | Subasta inversa y formatos simultáneos. |
| Objetos con agencia | PASS | Evolución hasta `Propietario`, deseos y consecuencias narrativas. | Diálogos propios de objetos y litigios completos. |
| Personajes con lore | PASS | 16 perfiles con deseo, herida, secreto, voz y relaciones. | Retratos ilustrados para los 12 personajes secundarios. |
| Eventos narrativos | PASS | 12 eventos deterministas con consecuencias y registro. | Más cadenas de eventos de varios actos. |
| Periódico procedural | PASS | Titulares basados en deuda, sospecha, objetos, motivos y precedentes. | Exportación visual como PNG. |
| Memoria de campaña | PASS | Libro de Actas, precedentes y finales reactivos. | Metaprogresión completa entre campañas. |
| Generación reproducible | PASS | RNG por semilla y pruebas deterministas. | Versionar formalmente el esquema de semillas. |
| Audio local | PASS | Web Audio y Speech Synthesis. | Mezcla adaptativa más profunda y pruebas manuales entre navegadores. |
| Responsive | PARTIAL | CSS móvil y capturas existentes. | Verificación manual final en dispositivos físicos. |
| Accesibilidad | PARTIAL | Focus, controles nativos, movimiento reducido y alternativas de audio. | Integrar axe-core y completar auditoría de teclado. |
| Pruebas unitarias | PASS | 47 pruebas, simulación de 500 lotes y 31 campañas aceleradas completas o infinitas. | Añadir fuzzing de saves históricos. |
| E2E | PARTIAL | Suite Playwright y CI configurados. | El sandbox actual bloqueó Chromium en localhost; ejecutar en CI/GitHub. |
| Assets optimizados | PASS | Retratos WebP reducidos de ~2,8 MB a ~233 KB. | Crear fondos y retratos secundarios coherentes. |
| README y documentación | PASS | README, auditoría, validación y visión técnica. | Añadir URL pública y capturas nuevas tras despliegue. |
| Seguridad de entradas | PASS | Sanitización y pruebas contra markup ejecutable. | Fuzzing adicional de entradas. |
