import { describe, it, expect } from 'vitest';
import { createRNG, generarLote } from '../generators/lotGenerator';
import { gameReducer, createInitialState } from '../state/store';
import { getRivalLimit } from '../engine/auction';
import { getUnlockedAchievements } from '../persistence/save';


describe('Remates del Caos - Bizarro Bidding and Loan Engines', () => {
  
  it('should generate deterministic random numbers via mulberry32 RNG', () => {
    const rng1 = createRNG('constant_seed');
    const rng2 = createRNG('constant_seed');
    expect(rng1()).toBe(rng2());
    expect(rng1()).toBe(rng2());
  });

  it('should procedurally generate lots within proper price ranges', () => {
    const rng = createRNG('test_lot_seed');
    const lot = generarLote([], [], rng);
    expect(lot.nombre_item).toBeDefined();
    expect(lot.descripcion).toBeDefined();
    expect(lot.puja_inicial).toBeGreaterThanOrEqual(100);
    expect(lot.puja_inicial).toBeLessThanOrEqual(2000);
    expect(lot.letra_pequena).toBeDefined();
  });

  it('should accurately calculate bid limits for rival bidders based on rarity', () => {
    const bidder = { id: 'test_bidder', nombre: 'Test Bidder', presupuesto: 10000, personalidad: 'Impulsiva', agresividad: 0.8 };
    const limitComun = getRivalLimit(bidder, 500, 'Comun', 'test_seed', 1);
    const limitElite = getRivalLimit(bidder, 500, 'Elite', 'test_seed', 1);
    
    // Elite lots should warrant higher bid limits
    expect(limitElite).toBeGreaterThan(limitComun);
  });

  it('should process player bids and decrease active budget inside reducer', () => {
    let state = createInitialState('test_reducer_seed');
    state.status = 'LOT_REVEAL';
    state.currentLot = {
      id: 'l_1',
      nombre_item: 'Un frasco de sebo capilar',
      descripcion: 'Huele mal.',
      puja_inicial: 500,
      letra_pequena: 'Diarrea emocional.',
      es_elite: false,
      rareza: 'Comun',
      categoria: 'Fluido'
    };
    state.activeBid = 500;
    
    // Player bids 600
    state = gameReducer(state, { type: 'PLAYER_BID', amount: 600 });
    expect(state.activeBid).toBe(600);
    expect(state.highestBidder).toBe('Tú');
    
    // Resolve lot
    state = gameReducer(state, { type: 'RESOLVE_LOT' });
    expect(state.status).toBe('LOT_WON');
    expect(state.budget).toBe(10000 - 600);
    expect(state.inventory.length).toBe(1);
    expect(state.inventory[0].nombre_item).toBe('Un frasco de sebo capilar');
  });

  it('should correctly process loan requests and accrue interest', () => {
    let state = createInitialState('loan_seed');
    
    // Request loan from Don Sanguino
    state = gameReducer(state, { type: 'REQUEST_LOAN' });
    expect(state.budget).toBe(12500); // 10000 + 2500
    expect(state.debt).toBe(3000);
    expect(state.debtTurns).toBe(1);

    // Pay off debt fully
    state = gameReducer(state, { type: 'PAY_LOAN', amount: 3000 });
    expect(state.budget).toBe(9500);
    expect(state.debt).toBe(0);
    expect(state.debtTurns).toBe(0);
  });

  it('should trigger bankruptcy when budget falls below 100 and new turn is initiated', () => {
    let state = createInitialState('bankrupt_seed');
    state.budget = 50;
    state.debt = 1000;
    
    state = gameReducer(state, { type: 'NEXT_LOT' });
    expect(state.status).toBe('BANKRUPTCY');
  });

  it('should unlock achievements for the player under corresponding conditions', () => {
    const state = createInitialState('ach_seed');
    
    // No achievements initially
    let ach = getUnlockedAchievements(state);
    expect(ach.length).toBe(0);

    // Add 1 item
    state.inventory.push({
      id: 'l_1',
      nombre_item: 'Pantuflas de carpa',
      descripcion: 'Comodas.',
      puja_inicial: 200,
      letra_pequena: 'Estornudos.',
      es_elite: false,
      rareza: 'Comun',
      categoria: 'Calzado',
      precio_compra: 200,
      procedencia: 'Test',
      valor_estimado: 300,
      valor_real: 10,
      peso_legal: 1,
      efecto_pasivo: 'Ninguno.',
      comentario_rata: 'Feo.',
      degradacion: 0
    });

    
    ach = getUnlockedAchievements(state);
    expect(ach.some((item) => item.startsWith('Comprador Novato'))).toBe(true);
  });
});
