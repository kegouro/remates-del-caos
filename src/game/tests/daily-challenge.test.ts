import { describe, expect, it } from 'vitest';
import { getDailyChallenge, getUtcDateKey } from '../campaign/daily';
import { createInitialState, gameReducer } from '../state/store';

describe('Remate del Día', () => {
  it('derives one stable challenge and seed from a UTC date', () => {
    const date = new Date('2026-07-19T23:40:00Z');
    const first = getDailyChallenge(date);
    const second = getDailyChallenge(date);
    expect(getUtcDateKey(date)).toBe('2026-07-19');
    expect(first).toEqual(second);
    expect(first.seed).toBe('remate-diario-2026-07-19');
    expect(first.rule.length).toBeGreaterThan(5);
  });

  it('overrides custom seeds and applies the selected daily opening modifier', () => {
    let state = createInitialState('private-seed');
    state = gameReducer(state, { type: 'SET_DAILY_CHALLENGE', enabled: true });
    const daily = state.campaign.dailyChallenge;
    expect(daily).not.toBeNull();

    state = gameReducer(state, {
      type: 'SUBMIT_PROLOGUE',
      choices: {
        alias: 'Postor Diario',
        treatment: 'Baron del Pago Minimo',
        reason: 'Criterio nulo',
        initialDebt: 0,
        personalItemName: '',
        confession: '',
        seed: 'seed-que-debe-ser-ignorada'
      }
    });

    expect(state.seed).toBe(daily?.seed);
    expect(state.prologue?.seed).toBe(daily?.seed);
    expect(state.campaign.dailyChallenge?.id).toBe(daily?.id);

    if (daily?.id === 'hungry_house') expect(state.campaign.houseHunger).toBe(78);
    if (daily?.id === 'fiscal_opening') expect(state.campaign.suspicion).toBe(28);
    if (daily?.id === 'soul_market') expect(state.campaign.soulFragments).toBe(2);
    if (daily?.id === 'future_installment') expect(state.campaign.debtSplits.unremembered).toBe(1800);
    if (daily?.id === 'hostile_gallery') expect(state.campaign.audienceMood).toBe(-45);
    if (daily?.id === 'inheritance_error') expect(state.prestige).toBe(10);
  });
});
