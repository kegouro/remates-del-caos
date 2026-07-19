import type { GameState, Bidder } from '../types';

// ==============================================================================
// RIVAL BIDDING AI SIMULATOR
// ==============================================================================
export interface AuctionAction {
  type: 'RIVAL_BID' | 'RIVAL_PASS' | 'NO_ACTION';
  bidderName?: string;
  amount?: number;
}

// Calculate the maximum limit a rival is willing to pay for the current lot
export function getRivalLimit(bidder: Bidder, initialBid: number, rareza: string, seed: string, turnCount: number): number {
  // Simple deterministic calculation based on bidder parameters and lot rareza
  let multiplier = 1.2;
  switch (rareza) {
    case 'Comun': multiplier = 1.3; break;
    case 'Dudoso': multiplier = 1.5; break;
    case 'Vergonzoso': multiplier = 1.8; break;
    case 'Maldito': multiplier = 2.1; break;
    case 'Patrimonial': multiplier = 2.5; break;
    case 'Elite': multiplier = 3.0; break;
    case 'Irrepetible': multiplier = 3.5; break;
  }

  // Factor in aggressiveness (e.g. Filomena is very aggressive, Notario is conservative)
  const grudgeBoost = Math.min(0.32, (bidder.grudge || 0) * 0.035);
  const shakenPenalty = bidder.shakenUntilTurn === turnCount ? 0.28 : 0;
  const effectiveAggression = Math.max(0.05, Math.min(1.35, bidder.agresividad + grudgeBoost - shakenPenalty));
  const aggressivenessFactor = 0.5 + effectiveAggression * 0.8;
  
  // Deterministic factor based on seed and turn to add variance
  let hash = 0;
  const hashKey = seed + bidder.id + turnCount;
  for (let i = 0; i < hashKey.length; i++) {
    hash = (hashKey.charCodeAt(i) + (hash << 6) + (hash >> 16) - hash) & 0xffffff;
  }
  const variance = 0.85 + (hash % 30) / 100; // 0.85 to 1.15

  return Math.floor(initialBid * multiplier * aggressivenessFactor * variance);
}

export function simulateNextAuctionStep(state: GameState, rng: () => number): AuctionAction {
  if (!state.currentLot || state.highestBidder === '') {
    return { type: 'NO_ACTION' };
  }

  const initialBid = state.currentLot.puja_inicial;
  const currentBid = state.activeBid;
  const rareza = state.currentLot.rareza;

  // Filter rivals that have not passed and have enough budget
  const activeRivals = state.rivals.filter(rival => {
    const limit = getRivalLimit(rival, initialBid, rareza, state.seed, state.turnCount);
    // If current bid is already equal or higher than their limit, they pass
    if (currentBid >= limit) return false;
    // If they can't afford the next increment
    const increment = Math.max(100, Math.floor(initialBid * 0.1));
    if (currentBid + increment > rival.presupuesto) return false;
    // They must not be the current highest bidder
    if (state.highestBidder === rival.nombre) return false;
    
    return true;
  });

  if (activeRivals.length === 0) {
    // If someone is current highest bidder and nobody wants to bid more
    return { type: 'NO_ACTION' };
  }

  // Pick one active rival to bid based on their aggressiveness
  // Sort by aggressiveness + randomness
  const sorted = activeRivals.map(rival => ({
    rival,
    score: Math.max(0, rival.agresividad + (rival.grudge || 0) * 0.03 - (rival.shakenUntilTurn === state.turnCount ? 0.3 : 0)) * 0.6 + rng() * 0.4
  })).sort((a, b) => b.score - a.score);

  const selectedRival = sorted[0].rival;

  // Bidding increment: 10% of initial bid, rounded to nearest 50, minimum 100
  const incrementRaw = Math.max(100, Math.floor(initialBid * 0.1));
  const increment = Math.round(incrementRaw / 50) * 50;
  const newBid = currentBid + increment;

  return {
    type: 'RIVAL_BID',
    bidderName: selectedRival.nombre,
    amount: newBid
  };
}
