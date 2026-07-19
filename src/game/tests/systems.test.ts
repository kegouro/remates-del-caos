import { describe, expect, it } from 'vitest';
import { chooseAuctionFormat, NORMAL_AUCTION_FORMAT } from '../campaign/auctionFormats';
import { CORE_CHARACTERS, getRelationship } from '../campaign/characters';
import { createInitialState, gameReducer } from '../state/store';
import type { AuctionLot } from '../types';

const TEST_LOT: AuctionLot = {
  id: 'format-lot',
  nombre_item: 'Contrato de prueba que ya está decepcionado',
  descripcion: 'Documento de laboratorio administrativo.',
  puja_inicial: 10,
  letra_pequena: 'El comprador acepta convertirse en ejemplo.',
  es_elite: false,
  rareza: 'Dudoso',
  categoria: 'Documento legal dudoso'
};

describe('Formatos de subasta', () => {
  it('selects a special format under extreme delirium pressure', () => {
    const state = createInitialState('format-seed');
    state.turnCount = 5;
    state.prestige = 50;
    state.campaign.composure = 80;
    state.campaign.delirium.absurdity = 100;
    state.campaign.delirium.normalityResidual = 0;
    const format = chooseAuctionFormat(state, () => 0);
    expect(format.id).not.toBe(NORMAL_AUCTION_FORMAT.id);
  });

  it('charges composture instead of liquidity', () => {
    let state = createInitialState('composure-auction');
    state.currentLot = { ...TEST_LOT };
    state.status = 'BIDDING';
    state.activeBid = 10;
    state.highestBidder = 'Tú';
    state.campaign.auctionFormat = {
      id: 'compostura', name: 'Subasta por Compostura', description: 'test', currency: 'compostura', hidesLot: false, debtOnWin: 0, curseOnWin: 1
    };
    state = gameReducer(state, { type: 'RESOLVE_LOT' });
    expect(state.budget).toBe(10000);
    expect(state.campaign.composure).toBe(90);
    expect(state.inventory[0].moneda_compra).toBe('compostura');
  });

  it('turns testamentary victory into inherited debt', () => {
    let state = createInitialState('testament-auction');
    state.currentLot = { ...TEST_LOT, puja_inicial: 1000 };
    state.status = 'BIDDING';
    state.activeBid = 1000;
    state.highestBidder = 'Tú';
    state.campaign.auctionFormat = {
      id: 'testamentaria', name: 'Subasta testamentaria', description: 'test', currency: 'liquidez', hidesLot: false, debtOnWin: 0.5, curseOnWin: 2
    };
    state = gameReducer(state, { type: 'RESOLVE_LOT' });
    expect(state.debt).toBe(500);
    expect(state.campaign.debtSplits.unremembered).toBe(500);
    expect(state.curse).toBeGreaterThanOrEqual(3);
  });
});

describe('Memoria institucional', () => {
  it('ships sixteen characters with distinct dossiers', () => {
    const characters = Object.values(CORE_CHARACTERS);
    expect(characters).toHaveLength(16);
    expect(new Set(characters.map((character) => character.secret)).size).toBe(16);
    expect(characters.every((character) => character.desire && character.wound && character.roastLens)).toBe(true);
  });

  it('changes relationships and records a safe story beat after confession', () => {
    const state = createInitialState('relationship-seed');
    const next = gameReducer(state, {
      type: 'SUBMIT_CONFESSION',
      character: 'fiscal',
      text: '<img src=x onerror=alert(1)> abandono todo cuando deja de parecer épico',
      reply: 'Anexo recibido.'
    });
    expect(getRelationship(next, 'fiscal').trust).toBeGreaterThan(0);
    expect(next.confessions.join('')).not.toContain('<');
    expect(next.campaign.storyLog.some((beat) => beat.kind === 'confesion')).toBe(true);
  });

  it('records loans as both debt and narrative precedent', () => {
    const state = createInitialState('loan-story');
    const next = gameReducer(state, { type: 'REQUEST_LOAN' });
    expect(getRelationship(next, 'sanguino').debt).toBe(3000);
    expect(next.campaign.storyLog.some((beat) => beat.title.includes('Sanguino'))).toBe(true);
  });
});
