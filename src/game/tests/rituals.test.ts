import { describe, expect, it } from 'vitest';
import { detectSecretRitual } from '../campaign/rituals';
import { createInitialState, gameReducer } from '../state/store';
import type { InventoryItem } from '../types';

function chair(id: string): InventoryItem {
  return {
    id,
    nombre_item: `Silla ceremonial ${id}`,
    descripcion: 'Asiento que rechaza la función de sentarse.',
    puja_inicial: 100,
    letra_pequena: 'Exige voto en reuniones.',
    es_elite: false,
    rareza: 'Dudoso',
    categoria: 'Reliquia doméstica',
    precio_compra: 100,
    procedencia: 'Sala de espera de una institución inexistente',
    valor_estimado: 20,
    valor_real: 1,
    peso_legal: 2,
    efecto_pasivo: 'Ocupa jerarquía.',
    comentario_rata: 'Tres sillas ya constituyen burocracia.',
    degradacion: 0
  };
}

describe('Rituales secretos', () => {
  it('detects the chair trinity without exposing it before the condition exists', () => {
    const state = createInitialState('chair-ritual');
    expect(detectSecretRitual(state)).toBeNull();
    state.inventory = [chair('a'), chair('b'), chair('c')];
    expect(detectSecretRitual(state)?.id).toBe('chair_trinity');
  });

  it('resolves a ritual once, rewards the player and records jurisprudence', () => {
    let state = createInitialState('chair-resolution');
    state.status = 'LOT_WON';
    state.inventory = [chair('a'), chair('b'), chair('c')];
    state.campaign.delirium.anomalyBudget = 0;
    state = gameReducer(state, { type: 'NEXT_LOT' });
    expect(state.status).toBe('INTERMISSION');
    expect(state.campaign.discoveredRituals).toContain('chair_trinity');
    expect(state.campaign.influence).toBe(8);
    expect(state.prestige).toBe(5);
    expect(state.campaign.storyLog.some((beat) => beat.title.includes('TRINIDAD'))).toBe(true);

    const influence = state.campaign.influence;
    state = gameReducer(state, { type: 'NEXT_LOT' });
    expect(state.campaign.influence).toBe(influence);
  });

  it('recognizes palindromic debt as a bilateral signature', () => {
    const state = createInitialState('palindrome-debt');
    state.debt = 1221;
    expect(detectSecretRitual(state)?.id).toBe('palindromic_debt');
  });
});
