import { describe, expect, it } from 'vitest';
import { generateOmenChoices } from '../campaign/omens';
import { generateHouseBargains, shouldOfferHouseBargain } from '../campaign/bargains';
import { getRivalLimit } from '../engine/auction';
import { createRNG } from '../generators/lotGenerator';
import { buildSafeRunSummary } from '../sharing/resultCard';
import { buildSafeNewspaperText } from '../sharing/newspaperCard';
import { createInitialState, gameReducer } from '../state/store';
import type { AuctionLot } from '../types';

const LOT: AuctionLot = {
  id: 'lote-trucos',
  nombre_item: 'Escritura de una silla que todavía no existe',
  descripcion: 'Documento con astillas anticipadas.',
  puja_inicial: 1000,
  letra_pequena: 'El comprador hereda las patas cuando aparezcan.',
  es_elite: false,
  rareza: 'Dudoso',
  categoria: 'Documento legal dudoso',
  valor_estimado: 2400,
  valor_real: 12,
  comentario_rata: 'Demasiado papel para tan poca silla.'
};

describe('Presagios contractuales', () => {
  it('generates three deterministic and distinct omens from the same dossier', () => {
    const state = createInitialState('omens-seed');
    state.dossier.habits = ['Renombrar carpetas para sentir avance'];
    const first = generateOmenChoices(state, createRNG('omens-seed:omens'));
    const second = generateOmenChoices(state, createRNG('omens-seed:omens'));
    expect(first).toEqual(second);
    expect(first).toHaveLength(3);
    expect(new Set(first.map((omen) => omen.id)).size).toBe(3);
  });

  it('pays a prophecy once and interrupts the next transition with a ceremonial intermission', () => {
    let state = createInitialState('prophecy-payment');
    const omen = generateOmenChoices(state, createRNG('force-third')).find((item) => item.id === 'third_refusal') || {
      id: 'third_refusal' as const,
      title: 'LA TERCERA NEGATIVA',
      prophecy: 'Tres negativas.',
      condition: 'Pasa tres veces.',
      rewardLabel: '+3 Influencia, +1 Fragmento',
      motif: 'puertas'
    };
    state.campaign.chosenOmen = omen;
    state.campaign.consecutivePasses = 3;
    const influenceBefore = state.campaign.influence;

    state = gameReducer(state, { type: 'NEXT_LOT' });
    expect(state.status).toBe('INTERMISSION');
    expect(state.campaign.omenCompleted).toBe(true);
    expect(state.campaign.influence).toBe(influenceBefore + 3);
    expect(state.campaign.soulFragments).toBe(1);

    const paidInfluence = state.campaign.influence;
    state.campaign.delirium.anomalyBudget = 0;
    state = gameReducer(state, { type: 'NEXT_LOT' });
    expect(state.campaign.influence).toBe(paidInfluence);
  });
});

describe('Maniobras y memoria rival', () => {
  it('spends influence to reveal a confidential valuation', () => {
    let state = createInitialState('appraise-trick');
    state.currentLot = { ...LOT };
    state.status = 'LOT_REVEAL';
    state.campaign.influence = 3;
    state = gameReducer(state, { type: 'USE_AUCTION_TRICK', trick: 'appraise' });
    expect(state.campaign.influence).toBe(2);
    expect(state.campaign.lotIntelRevealed).toBe(true);
    expect(state.dialogueBubble?.text).toMatch(/2[,.]400/) ;
  });

  it('turns a soul fragment into a cheaper but more cursed opening', () => {
    let state = createInitialState('rewrite-trick');
    state.currentLot = { ...LOT };
    state.activeBid = LOT.puja_inicial;
    state.status = 'LOT_REVEAL';
    state.campaign.soulFragments = 1;
    state = gameReducer(state, { type: 'USE_AUCTION_TRICK', trick: 'rewrite' });
    expect(state.currentLot?.puja_inicial).toBe(700);
    expect(state.activeBid).toBe(700);
    expect(state.campaign.soulFragments).toBe(0);
    expect(state.curse).toBe(2);
  });

  it('makes grudges expensive and scandal temporarily weakens a rival', () => {
    const state = createInitialState('grudge-limit');
    const calm = { ...state.rivals[0], grudge: 0 };
    const angry = { ...state.rivals[0], grudge: 8 };
    const shaken = { ...angry, shakenUntilTurn: 4 };
    const calmLimit = getRivalLimit(calm, 1000, 'Maldito', state.seed, 4);
    const angryLimit = getRivalLimit(angry, 1000, 'Maldito', state.seed, 4);
    const shakenLimit = getRivalLimit(shaken, 1000, 'Maldito', state.seed, 4);
    expect(angryLimit).toBeGreaterThan(calmLimit);
    expect(shakenLimit).toBeLessThan(angryLimit);
  });

  it('rewards aggressively theatrical bids with audience attention', () => {
    let state = createInitialState('audience-bid');
    state.currentLot = { ...LOT };
    state.activeBid = 1000;
    state.status = 'LOT_REVEAL';
    state = gameReducer(state, { type: 'PLAYER_BID', amount: 1600 });
    expect(state.campaign.audienceMood).toBeGreaterThanOrEqual(12);
    expect(state.prestige).toBe(2);
    expect(state.rivals.every((rival) => (rival.grudge || 0) >= 1)).toBe(true);
  });
});



describe('Contratos de una casa hambrienta', () => {
  it('offers deterministic contracts only when hunger and timing justify the interruption', () => {
    const state = createInitialState('hungry-house');
    state.turnCount = 4;
    state.campaign.houseHunger = 55;
    expect(shouldOfferHouseBargain(state)).toBe(true);
    const first = generateHouseBargains(state, createRNG('hungry-house:bargain:4'));
    const second = generateHouseBargains(state, createRNG('hungry-house:bargain:4'));
    expect(first).toEqual(second);
    expect(first).toHaveLength(3);
  });

  it('feeds an object to the building and leaves a precedent instead of softlocking the round', () => {
    let state = createInitialState('feed-the-house');
    state.status = 'BARGAIN_SCREEN';
    state.turnCount = 4;
    state.inventory = [{
      ...LOT,
      id: 'victim-object',
      precio_compra: 1000,
      procedencia: 'Una repisa nerviosa',
      valor_estimado: 100,
      valor_real: 5,
      peso_legal: 1,
      efecto_pasivo: 'Mira las paredes.',
      comentario_rata: 'La casa mastica mejor que el propietario.',
      degradacion: 0
    }];
    state.campaign.houseHunger = 80;
    state.campaign.pendingBargains = generateHouseBargains(state, createRNG('force-feed'));
    const feed = state.campaign.pendingBargains.find((entry) => entry.id === 'feed_object');
    if (!feed) state.campaign.pendingBargains = [{
      id: 'feed_object',
      title: 'Entregar un objeto a las paredes',
      description: 'La casa exige una pieza.',
      costLabel: 'Objeto',
      rewardLabel: 'Alma',
      warning: 'No vuelve.',
      motif: 'paredes con apetito',
      available: true
    }];

    state = gameReducer(state, { type: 'ACCEPT_HOUSE_BARGAIN', bargainId: 'feed_object' });
    expect(state.status).toBe('INTERMISSION');
    expect(state.inventory).toHaveLength(0);
    expect(state.campaign.soulFragments).toBe(2);
    expect(state.campaign.houseHunger).toBe(52);
    expect(state.campaign.lastBargainTurn).toBe(4);
    expect(state.campaign.storyLog.some((beat) => beat.title.includes('Contrato con la casa'))).toBe(true);
  });

  it('turns refusal into architectural resentment but permits the next transition', () => {
    let state = createInitialState('reject-house');
    state.status = 'BARGAIN_SCREEN';
    state.turnCount = 4;
    state.campaign.houseHunger = 60;
    state.campaign.pendingBargains = generateHouseBargains(state, createRNG('reject-house:bargain:4'));
    state = gameReducer(state, { type: 'DECLINE_HOUSE_BARGAINS' });
    expect(state.status).toBe('INTERMISSION');
    expect(state.campaign.pendingBargains).toHaveLength(0);
    expect(state.campaign.houseHunger).toBe(72);
    state.campaign.delirium.anomalyBudget = 0;
    state = gameReducer(state, { type: 'NEXT_LOT' });
    expect(state.status).not.toBe('BARGAIN_SCREEN');
  });
});



describe('Peticiones del patrimonio consciente', () => {
  it('lets a conscious object file one petition per agency stage', () => {
    let state = createInitialState('object-petition');
    state.inventory = [{
      ...LOT,
      id: 'awake-object',
      precio_compra: 1000,
      procedencia: 'Un archivo con ventilación deficiente',
      valor_estimado: 100,
      valor_real: 5,
      peso_legal: 1,
      efecto_pasivo: 'Solicita personería.',
      comentario_rata: 'Tiene más iniciativa que el comprador.',
      degradacion: 0,
      agency: 'Consciente'
    }];
    state = gameReducer(state, { type: 'HEAR_OBJECT_PETITION', itemId: 'awake-object' });
    expect(state.inventory[0].petitionAgency).toBe('Consciente');
    expect(state.prestige).toBe(2);
    expect(state.campaign.suspicion).toBe(3);
    expect(state.campaign.storyLog.some((beat) => beat.title.includes('Petición'))).toBe(true);

    const prestige = state.prestige;
    state = gameReducer(state, { type: 'HEAR_OBJECT_PETITION', itemId: 'awake-object' });
    expect(state.prestige).toBe(prestige);
  });

  it('allows a proprietor object to register the player as inventory', () => {
    let state = createInitialState('owned-by-object');
    state.dossier.alias = 'José de los Anexos';
    state.inventory = [{
      ...LOT,
      id: 'owner-object',
      precio_compra: 1000,
      procedencia: 'Registro de dominio invertido',
      valor_estimado: 100,
      valor_real: 5,
      peso_legal: 9,
      efecto_pasivo: 'Posee.',
      comentario_rata: 'La escritura parece válida, lamentablemente.',
      degradacion: 0,
      agency: 'Propietario'
    }];
    state = gameReducer(state, { type: 'HEAR_OBJECT_PETITION', itemId: 'owner-object' });
    expect(state.debt).toBe(600);
    expect(state.campaign.debtSplits.unremembered).toBe(600);
    expect(state.campaign.composure).toBe(90);
    expect(state.dialogueBubble?.text).toContain('propietario de José de los Anexos');
  });
});

describe('Flujo institucional y modo interminable', () => {
  it('leaves the newspaper cycle after the event edition instead of looping forever', () => {
    let state = createInitialState('newspaper-exit');
    state.status = 'NEWSPAPER_SCREEN';
    state.campaign.newspaperStage = 'event';
    state = gameReducer(state, { type: 'DISMISS_NEWSPAPER' });
    expect(state.status).toBe('INTERMISSION');
    expect(state.campaign.newspaperStage).toBeNull();
  });

  it('cycles bosses in endless mode without triggering a final appraisal', () => {
    let state = createInitialState('endless-boss');
    state.campaign.mode = 'infinita';
    state.turnCount = 10;
    state.campaign.lastNewspaperTurn = 10;
    state.campaign.delirium.anomalyBudget = 0;
    state.status = 'LOT_WON';
    state = gameReducer(state, { type: 'NEXT_LOT' });
    expect(state.status).toBe('LOT_REVEAL');
    expect(state.campaign.activeBossId).toBe('boss_viuda');
    expect(state.currentLot?.nombre_item).toContain('JEFE INTERMINABLE');
  });

  it('creates a shareable act that omits raw confessions', () => {
    const state = createInitialState('safe-export');
    state.confessions = ['SECRETO QUE NO DEBE SALIR'];
    const summary = buildSafeRunSummary(state, { title: 'Liquidación ejemplar', description: 'Fin.' });
    expect(summary).toContain('safe-export');
    expect(summary).not.toContain('SECRETO QUE NO DEBE SALIR');
  });


  it('creates a newspaper export from the published edition without reading confessions', () => {
    const state = createInitialState('safe-newspaper');
    state.confessions = ['MATERIAL PRIVADO INÉDITO'];
    state.campaign.newspaperHeadline = 'PALOMA ASUME DIRECTORIO';
    state.campaign.newspaperText = 'El ave presentó mejores balances que la administración anterior.';
    const edition = buildSafeNewspaperText(state);
    expect(edition).toContain('PALOMA ASUME DIRECTORIO');
    expect(edition).not.toContain('MATERIAL PRIVADO INÉDITO');
  });
});
