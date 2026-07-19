# AGENTS.md · Mortaja, Martillo & Cía.

## Product contract

Remates del Caos is a static browser game, not a dashboard and not a server-backed application. The primary experience must work offline after its local assets load and must remain deployable under a GitHub Pages project subpath.

## Canonical identity

- Title: **Remates del Caos**
- Subtitle: **Adjudicado al Peor Postor**
- Auction house: **Mortaja, Martillo & Cía.**
- Visual language: gothic theatrical bureaucracy, old gold, wine red, charcoal, dirty ivory.
- Humor: specific, procedural and character-driven. Generic insults are considered failed content.

## Non-negotiable technical rules

- React + strict TypeScript + Vite.
- No secret keys or generative service credentials in the frontend.
- No remote telemetry or analytics.
- User answers and confessions stay in `sessionStorage` and must be removable.
- Never use `innerHTML`, `dangerouslySetInnerHTML` or `eval` with player content.
- Preserve keyboard navigation and `prefers-reduced-motion` behavior.
- Keep the game engine testable without React.
- Do not commit `node_modules`, Playwright reports, local secrets or absolute machine paths.

## Architecture

- `src/game/campaign`: dossier, lore, endings, bosses, auction formats and delirium director.
- `src/game/generators`: deterministic local procedural content.
- `src/game/state`: serializable reducer state.
- `src/components`: presentation and interaction only.
- `legacy/streamlit`: preserved original prototype.

## Validation

```bash
npm ci
npm run check
npm run test:e2e
```

GitHub Pages CI installs Chromium and runs the browser smoke test before deployment.

## Narrative rules

- Surprise requires contrast. Avoid uninterrupted randomness.
- Major anomalies must leave a consequence, story beat, motif or rule mutation.
- Reuse player-provided material only when voluntarily entered.
- Do not expose personal text in screenshots, exports, URLs or logs.
- Every major character needs a desire, wound, secret, speech pattern and distinct roast lens.
