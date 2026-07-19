import { describe, expect, it } from 'vitest';
import { createDefaultDossier } from '../campaign/dossier';
import { selectNarrativeEvent } from '../campaign/events';
import { createRNG } from '../generators/lotGenerator';
import { createInitialState, gameReducer } from '../state/store';
import type { CampaignMode } from '../campaign/types';
import type { GameState } from '../types';

function advanceOneStep(state: GameState, index: number): GameState {
  switch (state.status) {
    case 'INTRO':
      return gameReducer(state, { type: 'START_GAME', seed: state.seed });
    case 'DOSSIER_SCREEN':
      return gameReducer(state, {
        type: 'SUBMIT_DOSSIER',
        dossier: { ...createDefaultDossier(), anomalyFrequency: 'febril', absurdityLevel: 90 },
        traces: [],
        seed: state.seed
      });
    case 'PROLOGUE_SCREEN':
      return gameReducer(state, {
        type: 'SUBMIT_PROLOGUE',
        choices: {
          alias: `Postor ${index}`,
          treatment: 'Persona Natural Sospechosa',
          reason: 'Criterio nulo',
          initialDebt: 0,
          personalItemName: index % 3 === 0 ? 'Silla de campaña acelerada' : '',
          confession: index % 2 === 0 ? 'Abro proyectos para no terminarlos' : '',
          seed: state.seed
        }
      });
    case 'OMEN_SCREEN':
      return gameReducer(state, { type: 'CHOOSE_OMEN', omenId: state.campaign.omenChoices[0].id });
    case 'LOT_REVEAL':
      if (index % 4 === 0 && state.campaign.influence >= 1) {
        return gameReducer(state, { type: 'USE_AUCTION_TRICK', trick: 'appraise' });
      }
      if (index % 3 === 0 && state.activeBid <= state.budget) {
        return gameReducer(state, { type: 'PLAYER_BID', amount: Math.min(state.budget, state.activeBid + 1) });
      }
      return gameReducer(state, { type: 'PASS_LOT' });
    case 'BIDDING':
      return gameReducer(state, { type: 'RESOLVE_LOT' });
    case 'LOT_WON':
    case 'LOT_LOST':
    case 'INTERMISSION':
      return gameReducer(state, { type: 'NEXT_LOT' });
    case 'BARGAIN_SCREEN': {
      const bargain = state.campaign.pendingBargains[0];
      return bargain
        ? gameReducer(state, { type: 'ACCEPT_HOUSE_BARGAIN', bargainId: bargain.id })
        : gameReducer(state, { type: 'DECLINE_HOUSE_BARGAINS' });
    }
    case 'ANOMALY_SCREEN': {
      const choice = state.campaign.delirium.currentAnomaly?.choices[0];
      return choice ? gameReducer(state, { type: 'RESOLVE_ANOMALY', choiceId: choice.id }) : state;
    }
    case 'NEWSPAPER_SCREEN':
      return gameReducer(state, { type: 'DISMISS_NEWSPAPER' });
    case 'EVENT_SCREEN': {
      const event = selectNarrativeEvent(state, createRNG(`${state.seed}:${state.turnCount}:sim-event`));
      return gameReducer(state, { type: 'SELECT_EVENT_OPTION', eventId: event.id, optionId: event.options[0].id });
    }
    case 'TALLER_SCREEN':
    case 'TRIBUNAL_SCREEN':
    case 'TUNELES_SCREEN':
      return gameReducer(state, { type: 'NAVIGATE_AREA', area: 'salon' });
    case 'FINAL_APPRAISAL':
    case 'BANKRUPTCY':
      return state;
    default:
      return state;
  }
}

function simulate(seed: string, mode: CampaignMode, maxSteps = 500): { state: GameState; steps: number; statuses: Set<string> } {
  let state = gameReducer(createInitialState(seed), { type: 'START_GAME', seed });
  state = gameReducer(state, { type: 'SET_CAMPAIGN_MODE', mode });
  const statuses = new Set<string>();
  let steps = 0;
  let repeatedSignature = '';
  let repeatedCount = 0;

  while (steps < maxSteps) {
    statuses.add(state.status);
    if (state.status === 'FINAL_APPRAISAL' || state.status === 'BANKRUPTCY') break;
    if (mode === 'infinita' && state.turnCount >= 25) break;

    const signature = `${state.status}:${state.turnCount}:${state.campaign.pendingBargains.length}:${state.campaign.delirium.currentAnomaly?.id || ''}:${state.campaign.newspaperStage || ''}`;
    repeatedCount = signature === repeatedSignature ? repeatedCount + 1 : 0;
    repeatedSignature = signature;
    expect(repeatedCount, `Possible softlock for ${seed}: ${signature}`).toBeLessThan(8);

    const next = advanceOneStep(state, steps);
    expect(next).toBeDefined();
    expect(Number.isFinite(next.budget)).toBe(true);
    expect(Number.isFinite(next.debt)).toBe(true);
    expect(next.campaign.composure).toBeGreaterThanOrEqual(0);
    expect(next.campaign.houseHunger).toBeGreaterThanOrEqual(0);
    expect(next.campaign.houseHunger).toBeLessThanOrEqual(100);
    state = next;
    steps += 1;
  }

  return { state, steps, statuses };
}

describe('Simulación acelerada de campañas', () => {
  it('completes twenty brief campaigns across different procedural seeds', () => {
    for (let index = 0; index < 20; index += 1) {
      const result = simulate(`brief-${index}`, 'breve');
      expect(['FINAL_APPRAISAL', 'BANKRUPTCY']).toContain(result.state.status);
      expect(result.steps).toBeLessThan(500);
      expect(result.statuses.has('OMEN_SCREEN')).toBe(true);
    }
  });

  it('completes ten full nights without newspaper-event loops', () => {
    for (let index = 0; index < 10; index += 1) {
      const result = simulate(`complete-${index}`, 'completa', 800);
      expect(['FINAL_APPRAISAL', 'BANKRUPTCY']).toContain(result.state.status);
      expect(result.steps).toBeLessThan(800);
      expect(result.statuses.has('NEWSPAPER_SCREEN')).toBe(true);
    }
  });

  it('keeps endless campaigns advancing beyond twenty lots', () => {
    const result = simulate('endless-simulation', 'infinita', 1200);
    expect(result.state.turnCount).toBeGreaterThanOrEqual(25);
    expect(result.state.status).not.toBe('FINAL_APPRAISAL');
    expect(result.steps).toBeLessThan(1200);
  });
});
