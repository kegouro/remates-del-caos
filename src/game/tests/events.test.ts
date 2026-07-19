import { describe, expect, it } from 'vitest';
import { resolveEventOption, selectNarrativeEvent } from '../campaign/events';
import { generateNewspaperEdition } from '../campaign/newspaper';
import { createRNG, generarLote } from '../generators/lotGenerator';
import { createInitialState } from '../state/store';


describe('Eventos institucionales', () => {
  it('selects the same event for the same seeded state', () => {
    const state = createInitialState('evento-determinista');
    state.turnCount = 5;
    const first = selectNarrativeEvent(state, createRNG('selector'));
    const second = selectNarrativeEvent(state, createRNG('selector'));
    expect(first.id).toBe(second.id);
  });

  it('resolves event objects deterministically without mutating the source state', () => {
    const state = createInitialState('caja-determinista');
    const first = resolveEventOption(state, 'corte_luz', 'luz_comprar');
    const second = resolveEventOption(state, 'corte_luz', 'luz_comprar');
    expect(state.inventory).toHaveLength(0);
    expect(first.inventory[0].id).toBe(second.inventory[0].id);
    expect(first.campaign.storyLog.some((beat) => beat.title.includes('Corte de Luz'))).toBe(true);
  });

  it('builds newspapers from the campaign rather than a fixed headline', () => {
    const state = createInitialState('prensa');
    state.dossier.alias = 'Barón de la Carpeta Final';
    state.debt = 8000;
    const edition = generateNewspaperEdition(state);
    expect(edition.headline).toContain('BARÓN DE LA CARPETA FINAL');
    expect(edition.text).toContain('8.000');
  });
});


describe('Diversidad procedural', () => {
  it('generates hundreds of structurally safe lots with useful diversity', () => {
    const names = new Set<string>();
    for (let index = 0; index < 500; index += 1) {
      const lot = generarLote([], [], createRNG(`bulk-${index}`), {
        motifs: ['paloma accionista', 'formulario húmedo'],
        normalityResidual: 40
      });
      names.add(lot.nombre_item);
      expect(lot.id).toBeTruthy();
      expect(lot.puja_inicial).toBeGreaterThan(0);
      expect(JSON.stringify(lot)).not.toMatch(/<script|onerror=/i);
    }
    expect(names.size).toBeGreaterThan(120);
  });
});
