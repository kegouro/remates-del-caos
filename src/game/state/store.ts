import type { GameState, InventoryItem, Bidder, ChatMessage } from '../types';
import type { CampaignMode, CampaignAct, PrologueChoices, BidderDossier, DossierTrace } from '../campaign/types';
import { resolveEventOption, selectNarrativeEvent } from '../campaign/events';
import { resolveMinigameResult } from '../campaign/minigames';
import { BOSSES, applyBossActiveMechanic } from '../campaign/bosses';
import { createDefaultDossier, addDossierTrace } from '../campaign/dossier';
import { createInitialDelirium, generateMicroEvent, maybeScheduleAnomaly, resolveAnomalyChoice } from '../campaign/delirium';
import { generateContextualRoast } from '../campaign/roasts';
import { chooseAuctionFormat, getAuctionCapacity, formatAuctionAmount, NORMAL_AUCTION_FORMAT } from '../campaign/auctionFormats';
import { appendStoryBeat, makeStoryBeat } from '../campaign/story';
import { generateNewspaperEdition } from '../campaign/newspaper';
import { adjustRelationship, isCharacterId } from '../campaign/characters';
import { generateOmenChoices, resolveChosenOmen } from '../campaign/omens';
import { generateHouseBargains, shouldOfferHouseBargain } from '../campaign/bargains';
import { getDailyChallenge } from '../campaign/daily';
import { detectSecretRitual } from '../campaign/rituals';


import { generarLote, generarConsejoFantasma, generarJuicioRata, generarVeredictoSanguino, createRNG, generarFusion } from '../generators/lotGenerator';




// ==============================================================================
// INITIAL STATE CREATOR
// ==============================================================================
export function createInitialState(seed?: string): GameState {
  const finalSeed = seed || Math.random().toString(36).substring(2, 9);
  const dossier = createDefaultDossier();
  const initialDelirium = createInitialDelirium(finalSeed, dossier, createRNG(`${finalSeed}:director`));
  
  const initialRivals: Bidder[] = [
    { id: 'rival_filomena', nombre: 'Dona Filomena Liquidez', presupuesto: 15000, personalidad: 'Impulsiva y agresiva', agresividad: 0.8, grudge: 0, wins: 0, tell: 'Golpea la paleta contra su copa cuando está a punto de sobrepujar.', obsession: 'objetos dañados y descuentos obscenos' },
    { id: 'rival_notario', nombre: 'El Notario Sin Rostro', presupuesto: 8000, personalidad: 'Calculador y frio', agresividad: 0.35, grudge: 0, wins: 0, tell: 'Ordena sus papeles cuando ya decidió retirarse.', obsession: 'contratos, documentos y procedencias dudosas' },
    { id: 'rival_nino', nombre: 'Nino Indice', presupuesto: 12000, personalidad: 'Especulador incomprensible', agresividad: 0.6, grudge: 0, wins: 0, tell: 'Murmura porcentajes primos antes de una puja irracional.', obsession: 'tendencias, tecnología obsoleta y cifras imposibles' }
  ];

  return {
    status: 'INTRO',
    budget: 10000,
    debt: 0,
    debtTurns: 0,
    prestige: 0,
    curse: 0,
    inventory: [],
    currentLot: null,
    pastLots: [],
    turnCount: 1,
    activeBid: 0,
    highestBidder: '',
    biddingActive: false,
    rivals: initialRivals,
    bidsLog: [],
    chatHistory: {
      subastador: [],
      fantasma: [],
      rata: [],
      sanguino: [],
      fiscal: [],
      engrudo: [],
      balance: [],
      viuda: [],
      notario: [],
      nino: [],
      filomena: [],
      cardenas: [],
      ujier: [],
      infanta: [],
      garantia: [],
      cobradora: []
    },
    confessions: [],
    seed: finalSeed,
    musicOn: false,
    voiceOn: true,
    volumeMusic: 0.3,
    volumeVoice: 0.8,
    ghostBribed: false,
    dialogueBubble: null,
    campaign: {
      mode: 'breve',
      act: 'PROLOGUE',
      debtSplits: { bancaria: 0, espectral: 0, moral: 0, sanguino: 0, unremembered: 0 },
      composure: 100,
      influence: 5,
      soulFragments: 0,
      suspicion: 0,
      relationships: {},
      factionsReputation: {},
      activeMissions: [],
      completedMissions: [],
      discoveredRituals: [],
      daysChallenge: false,
      dailyChallenge: null,
      currentArea: 'salon',
      inspectedItemId: null,
      activeBossId: null,
      newspaperHeadline: null,
      newspaperText: null,
      newspaperStage: null,
      lastNewspaperTurn: -1,
      soulSold: false,
      patienceBelisario: 100,
      precedentsCount: 0,
      delirium: initialDelirium,
      auctionFormat: NORMAL_AUCTION_FORMAT,
      storyLog: [makeStoryBeat(0, 'casa', 'La invitación incorrecta', 'Mortaja, Martillo & Cía. registró la llegada de un postor que todavía no había cometido su primera mala decisión.', 2)],
      consecutivePasses: 0,
      lostByOneCount: 0,
      houseDisposition: 0,
      houseHunger: 12,
      audienceMood: 0,
      omenChoices: [],
      chosenOmen: null,
      omenCompleted: false,
      omenMessage: null,
      lotIntelRevealed: false,
      auctionTricksUsed: [],
      pendingBargains: [],
      lastBargainTurn: -1
    },
    prologue: null,
    dossier,
    dossierTraces: []
  };
}

function resolveSecretRitual(state: GameState): GameState {
  const ritual = detectSecretRitual(state);
  if (!ritual) return state;

  let prestige = state.prestige;
  let curse = state.curse;
  let influence = state.campaign.influence;
  let soulFragments = state.campaign.soulFragments;
  let suspicion = state.campaign.suspicion;
  let houseHunger = state.campaign.houseHunger;
  let normalityResidual = state.campaign.delirium.normalityResidual;
  let relationships = state.campaign.relationships;

  if (ritual.id === 'chair_trinity') {
    influence += 3;
    prestige += 5;
    normalityResidual = Math.max(0, normalityResidual - 7);
  } else if (ritual.id === 'seventh_refusal') {
    influence += 7;
    prestige += 10;
    houseHunger = 0;
  } else if (ritual.id === 'final_reincidence') {
    soulFragments += 1;
    prestige += 8;
    normalityResidual = Math.max(0, normalityResidual - 5);
  } else if (ritual.id === 'rat_coronation') {
    soulFragments += 2;
    prestige += 15;
    curse += 3;
    relationships = adjustRelationship(relationships, 'rata', { trust: 8, fear: 2 });
  } else {
    influence += 2;
    soulFragments += 1;
    suspicion = Math.min(100, suspicion + 6);
  }

  return {
    ...state,
    prestige,
    curse,
    dialogueBubble: {
      character: ritual.speaker,
      text: `${ritual.title}. ${ritual.description} Recompensa registrada: ${ritual.reward}.`
    },
    campaign: {
      ...state.campaign,
      influence,
      soulFragments,
      suspicion,
      houseHunger,
      relationships,
      discoveredRituals: [...state.campaign.discoveredRituals, ritual.id],
      delirium: {
        ...state.campaign.delirium,
        normalityResidual,
        dormantCallbacks: [...state.campaign.delirium.dormantCallbacks, ritual.motif].slice(-12)
      },
      storyLog: appendStoryBeat(state.campaign.storyLog, makeStoryBeat(
        state.turnCount,
        'casa',
        ritual.title,
        ritual.description,
        5,
        ritual.motif
      ))
    }
  };
}

function evolveInventoryAgency(inventory: InventoryItem[], state: GameState, rng: () => number): { inventory: InventoryItem[]; event: string | null } {
  if (!inventory.length || rng() > Math.min(0.42, 0.06 + state.curse * 0.018 + (100 - state.campaign.delirium.normalityResidual) / 300)) {
    return { inventory, event: null };
  }
  const index = Math.floor(rng() * inventory.length);
  const selected = inventory[index];
  const progression: NonNullable<InventoryItem['agency']>[] = ['Dormido', 'Inquieto', 'Consciente', 'Sindicalizado', 'Litigante', 'Propietario'];
  const current = selected.agency || 'Dormido';
  const next = progression[Math.min(progression.length - 1, progression.indexOf(current) + 1)];
  const updated = inventory.map((item, itemIndex) => itemIndex === index ? {
    ...item,
    agency: next,
    desire: next === 'Inquieto'
      ? 'Ser colocado lejos de otros objetos que todavía creen en la propiedad privada.'
      : next === 'Consciente'
        ? 'Recibir nombre, salario y derecho a corregir su propia procedencia.'
        : next === 'Sindicalizado'
          ? 'Negociar descansos, ventilación y una participación en futuras pujas.'
          : next === 'Litigante'
            ? 'Demandar al postor por almacenamiento emocional negligente.'
            : 'Figurar como propietario legal de quien pagó por él.',
    callbackText: `${selected.nombre_item} avanzó al estado jurídico ${next}.`
  } : item);
  return { inventory: updated, event: `${selected.nombre_item} acaba de figurar como ${next}. Nadie recuerda haber presentado la solicitud.` };
}

// ==============================================================================
// REDUCER ACTIONS
// ==============================================================================
export type GameAction =
  | { type: 'START_GAME'; seed?: string }
  | { type: 'SET_CAMPAIGN_MODE'; mode: CampaignMode }
  | { type: 'SET_DAILY_CHALLENGE'; enabled: boolean }
  | { type: 'SUBMIT_DOSSIER'; dossier: BidderDossier; traces: DossierTrace[]; seed: string }
  | { type: 'DELETE_DOSSIER_FIELD'; field: keyof BidderDossier }
  | { type: 'SUBMIT_PROLOGUE'; choices: PrologueChoices }
  | { type: 'CHOOSE_OMEN'; omenId: string }
  | { type: 'ACCEPT_HOUSE_BARGAIN'; bargainId: string }
  | { type: 'DECLINE_HOUSE_BARGAINS' }
  | { type: 'NAVIGATE_AREA'; area: 'salon' | 'taller' | 'tribunal' | 'tuneles' | 'archivo' | 'capilla' }
  | { type: 'FUSE_ITEMS'; itemAId: string; itemBId: string }
  | { type: 'REPAIR_ITEM'; itemId: string }
  | { type: 'CLEAN_CURSE'; itemId: string }
  | { type: 'FORGE_CERTIFICATE'; itemId: string }
  | { type: 'COMPLETE_MINIGAME'; success: boolean; gameType: 'firma' | 'timbre' | 'tasacion' }
  | { type: 'SELECT_EVENT_OPTION'; eventId: string; optionId: string }
  | { type: 'DISMISS_NEWSPAPER' }
  | { type: 'RESOLVE_ANOMALY'; choiceId: string }
  | { type: 'INSPECT_ITEM'; itemId: string | null }
  | { type: 'NEXT_LOT' }
  | { type: 'PLAYER_BID'; amount: number }
  | { type: 'RIVAL_BID'; bidderName: string; amount: number }
  | { type: 'RIVAL_PASS'; bidderName: string }
  | { type: 'RESOLVE_LOT' }
  | { type: 'PASS_LOT' }
  | { type: 'REQUEST_LOAN' }
  | { type: 'PAY_LOAN'; amount: number }
  | { type: 'SELL_ITEM'; itemId: string }
  | { type: 'HEAR_OBJECT_PETITION'; itemId: string }
  | { type: 'SELL_SOUL' }
  | { type: 'USE_AUCTION_TRICK'; trick: 'appraise' | 'scandal' | 'rewrite' }
  | { type: 'BRIBE_GHOST' }
  | { type: 'SUBMIT_CONFESSION'; character: string; text: string; reply: string }
  | { type: 'TOGGLE_MUSIC' }
  | { type: 'TOGGLE_VOICE' }
  | { type: 'SET_VOLUME_MUSIC'; val: number }
  | { type: 'SET_VOLUME_VOICE'; val: number }
  | { type: 'RESET_GAME' }
  | { type: 'TRIGGER_DIALOGUE'; character: string; text: string }
  | { type: 'CLEAR_DIALOGUE' }
  | { type: 'LOAD_SAVE'; state: GameState };


// ==============================================================================
// STATE REDUCER
// ==============================================================================
export function gameReducer(state: GameState, action: GameAction): GameState {
  const rng = createRNG(state.seed + state.turnCount);

  switch (action.type) {
    case 'START_GAME': {
      const newState = createInitialState(action.seed || state.seed);
      return {
        ...newState,
        status: 'DOSSIER_SCREEN'
      };
    }

    case 'SET_CAMPAIGN_MODE': {
      return {
        ...state,
        campaign: {
          ...state.campaign,
          mode: action.mode
        }
      };
    }

    case 'SET_DAILY_CHALLENGE': {
      return {
        ...state,
        campaign: {
          ...state.campaign,
          daysChallenge: action.enabled,
          dailyChallenge: action.enabled ? getDailyChallenge() : null
        }
      };
    }

    case 'SUBMIT_DOSSIER': {
      const activeSeed = action.seed || state.seed;
      const delirium = createInitialDelirium(activeSeed, action.dossier, createRNG(`${activeSeed}:dossier`));
      return {
        ...state,
        status: 'PROLOGUE_SCREEN',
        seed: activeSeed,
        dossier: action.dossier,
        dossierTraces: action.traces,
        campaign: {
          ...state.campaign,
          delirium
        }
      };
    }

    case 'DELETE_DOSSIER_FIELD': {
      const value = state.dossier[action.field];
      const clearedValue = Array.isArray(value) ? [] : typeof value === 'string' ? '' : undefined;
      return {
        ...state,
        dossier: {
          ...state.dossier,
          [action.field]: clearedValue
        },
        dossierTraces: state.dossierTraces.filter((trace) => trace.field !== action.field)
      };
    }

    case 'SUBMIT_PROLOGUE': {
      const dailyChallenge = state.campaign.daysChallenge
        ? (state.campaign.dailyChallenge || getDailyChallenge())
        : null;
      const activeSeed = dailyChallenge?.seed || action.choices.seed || state.seed;
      let startBudget = 10000 + action.choices.initialDebt;
      let startDebt = action.choices.initialDebt;
      let startPrestige = state.prestige;
      let startCurse = state.curse;
      let startInfluence = state.campaign.influence;
      let startSoulFragments = state.campaign.soulFragments;
      let startSuspicion = state.campaign.suspicion;
      let startAudienceMood = state.campaign.audienceMood;
      let startHouseHunger = state.campaign.houseHunger;
      let unrememberedDebt = 0;

      if (dailyChallenge?.id === 'hungry_house') {
        startHouseHunger = 78;
        startInfluence += 2;
      } else if (dailyChallenge?.id === 'fiscal_opening') {
        startPrestige += 8;
        startSuspicion = 28;
      } else if (dailyChallenge?.id === 'soul_market') {
        startBudget = Math.max(0, startBudget - 1000);
        startSoulFragments += 2;
        startCurse += 3;
      } else if (dailyChallenge?.id === 'future_installment') {
        startBudget += 1800;
        startDebt += 1800;
        unrememberedDebt += 1800;
      } else if (dailyChallenge?.id === 'hostile_gallery') {
        startAudienceMood = -45;
        startInfluence += 3;
        startPrestige += 6;
      } else if (dailyChallenge?.id === 'inheritance_error') {
        startBudget += 1200;
        startDebt += 1600;
        unrememberedDebt += 1600;
        startPrestige += 10;
      }

      const startInventory = [...state.inventory];
      if (action.choices.personalItemName.trim()) {
        startInventory.push({
          id: `prologue_item_${Math.floor(rng() * 100000)}`,
          nombre_item: action.choices.personalItemName,
          descripcion: 'Un objeto personal ridiculo que trajiste de tu vida anterior.',
          puja_inicial: 200,
          letra_pequena: 'Viene cargado con tus culpas.',
          es_elite: false,
          rareza: 'Comun',
          categoria: 'Miscelaneo',
          precio_compra: 200,
          procedencia: 'Tu casa anterior',
          valor_estimado: 10,
          valor_real: 0,
          peso_legal: 1,
          efecto_pasivo: 'No hace nada en absoluto.',
          comentario_rata: 'Basura nostalgica inservible.',
          degradacion: 0
        });
      }

      const startConfessions = [...state.confessions];
      if (action.choices.confession.trim()) {
        startConfessions.push(action.choices.confession);
      }

      const rngPrologue = createRNG(activeSeed);
      const personalizedDossier = {
        ...state.dossier,
        alias: action.choices.alias.trim() || state.dossier.alias,
        ceremonialTitle: action.choices.treatment
      };
      const firstLot = generarLote([], startConfessions, rngPrologue, {
        dossier: personalizedDossier,
        motifs: state.campaign.delirium.motifs,
        normalityResidual: state.campaign.delirium.normalityResidual
      });


      return {
        ...state,
        status: 'OMEN_SCREEN',
        currentLot: firstLot,
        pastLots: [firstLot.nombre_item],
        budget: startBudget,
        debt: startDebt,
        debtTurns: startDebt > 0 ? 1 : 0,
        prestige: startPrestige,
        curse: startCurse,
        inventory: startInventory,
        confessions: startConfessions,
        seed: activeSeed,
        prologue: { ...action.choices, seed: activeSeed },
        dossier: personalizedDossier,
        activeBid: firstLot.puja_inicial,
        highestBidder: 'Nadie',
        biddingActive: false,
        bidsLog: [`Don Belisario Martillazo abre la puja en $${firstLot.puja_inicial.toLocaleString()}`],
        dialogueBubble: {
          character: 'subastador',
          text: `${dailyChallenge ? `${dailyChallenge.label}. ${dailyChallenge.description} ` : ''}Primer lote de la noche: ${firstLot.nombre_item}. ${firstLot.descripcion} ¡Puja inicial en $${firstLot.puja_inicial.toLocaleString()} pesos!`
        },
        campaign: {
          ...state.campaign,
          act: 'ACT_I',
          debtSplits: {
            ...state.campaign.debtSplits,
            bancaria: action.choices.initialDebt,
            unremembered: unrememberedDebt
          },
          dailyChallenge,
          influence: startInfluence,
          soulFragments: startSoulFragments,
          suspicion: startSuspicion,
          audienceMood: startAudienceMood,
          houseHunger: startHouseHunger,
          omenChoices: generateOmenChoices({
            ...state,
            dossier: personalizedDossier,
            prologue: action.choices,
            confessions: startConfessions,
            inventory: startInventory
          }, createRNG(`${activeSeed}:omens`)),
          chosenOmen: null,
          omenCompleted: false,
          omenMessage: null
        }
      };

    }


    case 'CHOOSE_OMEN': {
      const chosen = state.campaign.omenChoices.find((omen) => omen.id === action.omenId);
      if (!chosen) return state;
      return {
        ...state,
        status: 'LOT_REVEAL',
        dialogueBubble: {
          character: 'balance',
          text: `${chosen.title}. ${chosen.prophecy} La casa niega que elegir una profecía constituya consentimiento, lo cual jurídicamente significa lo contrario.`
        },
        campaign: {
          ...state.campaign,
          chosenOmen: chosen,
          omenMessage: `Presagio activo: ${chosen.condition}`,
          storyLog: appendStoryBeat(state.campaign.storyLog, makeStoryBeat(
            0,
            'casa',
            `Presagio elegido: ${chosen.title}`,
            chosen.prophecy,
            4,
            chosen.motif
          ))
        }
      };
    }

    case 'NEXT_LOT': {
      if (state.budget < 100 && state.debt > 0) {
        return {
          ...state,
          status: 'BANKRUPTCY',
          dialogueBubble: {
            character: 'subastador',
            text: '¡Bancarrota absoluta! Fuera de mi sala de subastas antes de que libere a los sabuesos invisibles.'
          }
        };
      }

      const omenResolvedState = resolveChosenOmen(state);
      if (omenResolvedState !== state) {
        return {
          ...omenResolvedState,
          status: 'INTERMISSION'
        };
      }

      const ritualResolvedState = resolveSecretRitual(state);
      if (ritualResolvedState !== state) {
        return {
          ...ritualResolvedState,
          status: 'INTERMISSION'
        };
      }

      if (shouldOfferHouseBargain(state)) {
        const bargains = generateHouseBargains(state, createRNG(`${state.seed}:bargain:${state.turnCount}`));
        if (bargains.length > 0) {
          return {
            ...state,
            status: 'BARGAIN_SCREEN',
            campaign: {
              ...state.campaign,
              pendingBargains: bargains
            }
          };
        }
      }

      const scheduledAnomaly = maybeScheduleAnomaly(state, rng);
      if (scheduledAnomaly) {
        return {
          ...state,
          status: 'ANOMALY_SCREEN',
          campaign: {
            ...state.campaign,
            delirium: {
              ...state.campaign.delirium,
              currentAnomaly: scheduledAnomaly,
              tension: Math.min(100, state.campaign.delirium.tension + scheduledAnomaly.severity * 8)
            }
          }
        };
      }

      // Check if act transition is needed before generating the next lot
      const currentAct = state.campaign.act;
      let nextAct: CampaignAct = currentAct;
      let triggerNewspaper = false;
      let triggerEnding = false;

      const isBreve = state.campaign.mode === 'breve';
      const isCompleta = state.campaign.mode === 'completa';
      const isInfinita = state.campaign.mode === 'infinita';

      if (isBreve) {
        if (state.turnCount === 3 && currentAct === 'ACT_I') {
          nextAct = 'ACT_II';
          triggerNewspaper = true;
        } else if (state.turnCount === 5 && currentAct === 'ACT_II') {
          nextAct = 'ACT_III';
          triggerNewspaper = true;
        } else if (state.turnCount === 7) {
          triggerEnding = true;
        }
      } else if (isCompleta) {
        if (state.turnCount === 4 && currentAct === 'ACT_I') {
          nextAct = 'ACT_II';
          triggerNewspaper = true;
        } else if (state.turnCount === 7 && currentAct === 'ACT_II') {
          nextAct = 'ACT_III';
          triggerNewspaper = true;
        } else if (state.turnCount === 10 && currentAct === 'ACT_III') {
          nextAct = 'ACT_IV';
          triggerNewspaper = true;
        } else if (state.turnCount === 13 && currentAct === 'ACT_IV') {
          nextAct = 'ACT_V';
          triggerNewspaper = true;
        } else if (state.turnCount === 14) {
          triggerEnding = true;
        }
      } else if (isInfinita && state.turnCount > 1 && state.turnCount % 5 === 0 && state.campaign.lastNewspaperTurn !== state.turnCount) {
        const acts: CampaignAct[] = ['ACT_I', 'ACT_II', 'ACT_III', 'ACT_IV', 'ACT_V'];
        nextAct = acts[Math.floor(state.turnCount / 5) % acts.length];
        triggerNewspaper = true;
      }

      if (triggerEnding) {
        return {
          ...state,
          status: 'FINAL_APPRAISAL'
        };
      }

      if (triggerNewspaper) {
        const edition = generateNewspaperEdition(state);
        const storyLog = appendStoryBeat(state.campaign.storyLog, makeStoryBeat(
          state.turnCount,
          'casa',
          edition.headline,
          edition.text,
          3,
          edition.motif
        ));
        return {
          ...state,
          status: 'NEWSPAPER_SCREEN',
          campaign: {
            ...state.campaign,
            act: nextAct,
            newspaperHeadline: edition.headline,
            newspaperText: edition.text,
            newspaperStage: 'act',
            lastNewspaperTurn: state.turnCount,
            storyLog
          }
        };
      }

      // Check if boss round
      let activeBossId: string | null = null;
      let lotNamePrefix = '';
      if (isBreve) {
        if (state.turnCount === 4) {
          activeBossId = 'boss_viuda';
          lotNamePrefix = 'LOTE DE BOSS: ';
        } else if (state.turnCount === 6) {
          activeBossId = 'boss_notario';
          lotNamePrefix = 'LOTE DE BOSS: ';
        }
      } else if (isCompleta) {
        if (state.turnCount === 6) {
          activeBossId = 'boss_viuda';
          lotNamePrefix = 'LOTE DE BOSS: ';
        } else if (state.turnCount === 9) {
          activeBossId = 'boss_notario';
          lotNamePrefix = 'LOTE DE BOSS: ';
        } else if (state.turnCount === 12) {
          activeBossId = 'boss_cobradora';
          lotNamePrefix = 'LOTE DE BOSS: ';
        } else if (state.turnCount === 13) {
          activeBossId = 'boss_publico';
          lotNamePrefix = 'LOTE DE FINAL BOSS: ';
        }
      } else if (isInfinita && state.turnCount > 1 && state.turnCount % 10 === 0) {
        const endlessBosses = ['boss_viuda', 'boss_notario', 'boss_cobradora', 'boss_publico'];
        activeBossId = endlessBosses[(Math.floor(state.turnCount / 10) - 1) % endlessBosses.length];
        lotNamePrefix = 'LOTE DE JEFE INTERMINABLE: ';
      }

      // Generate Lot and occasionally replace the currency or disclosure rules.
      const formatState = { ...state, campaign: { ...state.campaign, activeBossId } };
      const auctionFormat = activeBossId ? NORMAL_AUCTION_FORMAT : chooseAuctionFormat(formatState, rng);
      const isElite = state.turnCount % 10 === 0 && !activeBossId;
      const lot = generarLote(state.pastLots, state.confessions, rng, {
        dossier: state.dossier,
        motifs: state.campaign.delirium.motifs,
        normalityResidual: state.campaign.delirium.normalityResidual,
        activeRealityRule: state.campaign.delirium.activeRealityRule
      });
      if (auctionFormat.currency === 'compostura') {
        lot.puja_inicial = Math.max(5, Math.min(state.campaign.composure, 18, Math.round(lot.puja_inicial / 130)));
      } else if (auctionFormat.currency === 'prestigio') {
        lot.puja_inicial = Math.max(5, Math.min(state.prestige, 24, Math.round(lot.puja_inicial / 100)));
      }
      if (isElite) {
        lot.nombre_item = `LOTE DE ELITE: ${lot.nombre_item}`;
        lot.puja_inicial = Math.floor(lot.puja_inicial * 2.5);
        lot.es_elite = true;
        lot.rareza = 'Elite';
      }

      if (activeBossId) {
        const bossProfile = BOSSES.find(b => b.id === activeBossId);
        lot.nombre_item = `${lotNamePrefix}${lot.nombre_item}`;
        lot.puja_inicial = Math.floor(lot.puja_inicial * 1.8);
        if (bossProfile) {
          lot.descripcion = `Pujas vigiladas por ${bossProfile.nombre}. "${bossProfile.introLine}"`;
        }
      }

      // Calculate debt and passive inventory effects without mutating the previous state.
      const interestRate = 1.08;
      const updatedDebtSplits = {
        bancaria: Math.floor(state.campaign.debtSplits.bancaria * interestRate),
        espectral: Math.floor(state.campaign.debtSplits.espectral * interestRate),
        moral: Math.floor(state.campaign.debtSplits.moral * interestRate),
        sanguino: Math.floor(state.campaign.debtSplits.sanguino * interestRate),
        unremembered: Math.floor(state.campaign.debtSplits.unremembered * interestRate)
      };
      let composureDamage = 0;
      let nextSuspicion = state.campaign.suspicion;
      for (const item of state.inventory) {
        if (item.efecto_pasivo.includes('Deuda Bancaria')) updatedDebtSplits.bancaria += 100;
        if (item.efecto_pasivo.includes('Sospecha')) nextSuspicion = Math.min(100, nextSuspicion + 2);
        if (item.efecto_pasivo.includes('Compostura')) composureDamage += 5;
      }
      const newDebt = Object.values(updatedDebtSplits).reduce((sum, value) => sum + value, 0);
      const newDebtTurns = newDebt > 0 ? state.debtTurns + 1 : 0;
      const agencyEvolution = evolveInventoryAgency(state.inventory, state, rng);
      const microEvent = agencyEvolution.event || generateMicroEvent(state, rng);
      const formatBeat = makeStoryBeat(
        state.turnCount,
        'casa',
        auctionFormat.name,
        auctionFormat.description,
        auctionFormat.id === 'normal' ? 1 : 3,
        state.campaign.delirium.motifs[0]
      );

      return {
        ...state,
        status: 'LOT_REVEAL',
        currentLot: lot,
        inventory: agencyEvolution.inventory,
        pastLots: [...state.pastLots, lot.nombre_item],
        activeBid: lot.puja_inicial,
        highestBidder: 'Nadie',
        biddingActive: false,
        bidsLog: [`Don Belisario Martillazo abre ${auctionFormat.name} en ${formatAuctionAmount(auctionFormat, lot.puja_inicial)}`],
        rivals: state.rivals.map(r => ({
          ...r,
          presupuesto: r.presupuesto + Math.floor(rng() * 1000)
        })),
        ghostBribed: false,
        debt: newDebt,
        debtTurns: newDebtTurns,
        dialogueBubble: {
          character: activeBossId ? activeBossId.replace('boss_', '') : 'subastador',
          text: activeBossId
            ? `¡Atencion! Se subasta el lote especial de ${BOSSES.find(b => b.id === activeBossId)?.nombre}. Apertura: ${formatAuctionAmount(auctionFormat, lot.puja_inicial)}.`
            : `${auctionFormat.name}: ${lot.nombre_item}. ${lot.descripcion} Apertura: ${formatAuctionAmount(auctionFormat, lot.puja_inicial)}.`
        },
        campaign: {
          ...state.campaign,
          activeBossId: activeBossId,
          auctionFormat,
          storyLog: appendStoryBeat(state.campaign.storyLog, formatBeat),
          debtSplits: updatedDebtSplits,
          suspicion: nextSuspicion,
          composure: Math.max(0, state.campaign.composure - composureDamage),
          lotIntelRevealed: false,
          auctionTricksUsed: [],
          audienceMood: state.campaign.audienceMood > 0
            ? Math.max(0, state.campaign.audienceMood - 5)
            : Math.min(0, state.campaign.audienceMood + 5),
          houseHunger: Math.min(100, state.campaign.houseHunger + 2 + Math.floor(newDebt / 5000)),
          delirium: {
            ...state.campaign.delirium,
            microEvent,
            anomalyBudget: Math.min(14, state.campaign.delirium.anomalyBudget + 1),
            tension: Math.max(0, state.campaign.delirium.tension - 10)
          }
        }
      };
    }

    case 'PLAYER_BID': {
      if (action.amount > getAuctionCapacity(state)) {
        return state;
      }
      const aggressiveBid = action.amount >= state.activeBid + Math.max(300, Math.floor(state.activeBid * 0.45));
      return {
        ...state,
        status: 'BIDDING',
        activeBid: action.amount,
        highestBidder: 'Tú',
        prestige: state.prestige + (aggressiveBid ? 2 : 0),
        bidsLog: [...state.bidsLog, `Tú has pujado ${formatAuctionAmount(state.campaign.auctionFormat, action.amount)}${aggressiveBid ? ' con violencia ceremonial' : ''}`],
        biddingActive: true,
        rivals: state.rivals.map((rival) => ({ ...rival, grudge: Math.min(12, (rival.grudge || 0) + (aggressiveBid ? 1 : 0)) })),
        dialogueBubble: {
          character: 'subastador',
          text: aggressiveBid
            ? `¡Una puja ofensivamente grande! El público despierta y tus rivales anotan tu nombre con tinta venenosa.`
            : `¡Puja de ${formatAuctionAmount(state.campaign.auctionFormat, action.amount)} por el desastre de la primera fila!`
        },
        campaign: {
          ...state.campaign,
          audienceMood: Math.min(100, state.campaign.audienceMood + (aggressiveBid ? 12 : 4)),
          houseHunger: Math.max(0, state.campaign.houseHunger - (aggressiveBid ? 4 : 1))
        }
      };
    }

    case 'RIVAL_BID': {
      let activeBid = action.amount;
      let bidsLogText = `${action.bidderName} ofrece ${formatAuctionAmount(state.campaign.auctionFormat, action.amount)}`;
      let dialogueBubbleText = `¡${action.bidderName} ofrece ${formatAuctionAmount(state.campaign.auctionFormat, action.amount)}!`;
      let extraMutation = {};

      if (state.campaign.activeBossId) {
        const mechanic = applyBossActiveMechanic(state, action.amount);
        activeBid = mechanic.nextBid;
        bidsLogText = mechanic.bidsLogText;
        dialogueBubbleText = mechanic.bidsLogText;
        if (mechanic.stateMutation) {
          extraMutation = mechanic.stateMutation;
        }
      }

      return {
        ...state,
        ...extraMutation,
        activeBid: activeBid,
        highestBidder: action.bidderName,
        bidsLog: [...state.bidsLog, bidsLogText],
        dialogueBubble: {
          character: state.campaign.activeBossId ? state.campaign.activeBossId.replace('boss_', '') : 'subastador',
          text: dialogueBubbleText
        },
        campaign: {
          ...state.campaign,
          audienceMood: Math.min(100, state.campaign.audienceMood + 3)
        }
      };
    }


    case 'RIVAL_PASS': {
      return {
        ...state,
        bidsLog: [...state.bidsLog, `${action.bidderName} se retira de la puja.`]
      };
    }

    case 'RESOLVE_LOT': {
      if (!state.currentLot) return state;
      const format = state.campaign.auctionFormat;
      const formattedCost = formatAuctionAmount(format, state.activeBid);

      if (state.highestBidder === 'Tú') {
        const cost = state.activeBid;
        const lotItem: InventoryItem = {
          ...state.currentLot,
          precio_compra: cost,
          moneda_compra: format.currency,
          procedencia: state.currentLot.procedencia || 'Desconocida',
          valor_estimado: state.currentLot.valor_estimado || cost * 2,
          valor_real: state.currentLot.valor_real || 0,
          peso_legal: state.currentLot.peso_legal || 1,
          efecto_pasivo: state.currentLot.efecto_pasivo || 'Ninguno.',
          comentario_rata: state.currentLot.comentario_rata || 'Sin comentarios.',
          degradacion: state.currentLot.degradacion || 0
        };

        let nextBudget = state.budget;
        let nextPrestige = state.prestige + (state.currentLot.es_elite ? 30 : 10) + Math.max(0, Math.floor(state.campaign.audienceMood / 20));
        let nextComposure = state.campaign.composure;
        if (format.currency === 'liquidez') nextBudget -= cost;
        if (format.currency === 'prestigio') nextPrestige = Math.max(0, nextPrestige - cost);
        if (format.currency === 'compostura') nextComposure = Math.max(0, nextComposure - cost);

        const inheritedDebt = Math.floor(cost * format.debtOnWin);
        const curseGain = (state.currentLot.es_elite ? 3 : 1) + format.curseOnWin;
        const roast = generateContextualRoast(state, 'subastador', rng);
        const storyBeat = makeStoryBeat(
          state.turnCount,
          'lote',
          `Adjudicado: ${state.currentLot.nombre_item}`,
          `${state.dossier.alias} ganó mediante ${format.name} por ${formattedCost}. ${state.currentLot.callbackText || state.currentLot.letra_pequena}`,
          state.currentLot.es_elite ? 4 : format.id === 'normal' ? 2 : 3,
          state.currentLot.motifs?.[0]
        );

        return {
          ...state,
          status: 'LOT_WON',
          budget: nextBudget,
          debt: state.debt + inheritedDebt,
          prestige: nextPrestige,
          curse: state.curse + curseGain,
          inventory: [...state.inventory, lotItem],
          rivals: state.rivals.map((rival) => ({
            ...rival,
            grudge: Math.min(12, (rival.grudge || 0) + (state.bidsLog.some((entry) => entry.includes(rival.nombre)) ? 1 : 0))
          })),
          turnCount: state.turnCount + 1,
          biddingActive: false,
          dialogueBubble: {
            character: 'subastador',
            text: `¡Adjudicado! ${state.currentLot.nombre_item} es tuyo por ${formattedCost}. ${roast} Consecuencia inevitable: ${state.currentLot.letra_pequena}.${inheritedDebt ? ` Además heredas $${inheritedDebt.toLocaleString()} en obligaciones.` : ''}`
          },
          campaign: {
            ...state.campaign,
            composure: nextComposure,
            consecutivePasses: 0,
            debtSplits: {
              ...state.campaign.debtSplits,
              unremembered: state.campaign.debtSplits.unremembered + inheritedDebt
            },
            relationships: adjustRelationship(state.campaign.relationships, 'subastador', { trust: 1, fear: state.currentLot.es_elite ? 2 : 0 }),
            storyLog: appendStoryBeat(state.campaign.storyLog, storyBeat),
            houseDisposition: Math.min(20, state.campaign.houseDisposition + 1),
            audienceMood: Math.min(100, state.campaign.audienceMood + (state.currentLot.es_elite ? 18 : 8)),
            houseHunger: Math.max(0, state.campaign.houseHunger - (state.currentLot.es_elite ? 12 : 6)),
            delirium: {
              ...state.campaign.delirium,
              dormantCallbacks: [...state.campaign.delirium.dormantCallbacks, `Compró ${state.currentLot.nombre_item} por ${formattedCost}`].slice(-12),
              tension: Math.min(100, state.campaign.delirium.tension + 5)
            }
          }
        };
      }

      const roast = generateContextualRoast(state, 'rata', rng);
      const playerBidWasRecent = [...state.bidsLog].reverse().find((entry) => entry.includes('pujado') || entry.includes('ofrece'))?.includes('Tú') ?? false;
      const storyBeat = makeStoryBeat(
        state.turnCount,
        'lote',
        `Perdido: ${state.currentLot.nombre_item}`,
        `${state.highestBidder} arrebató el lote por ${formattedCost}. La casa archivó la vacilación.`,
        playerBidWasRecent ? 3 : 1,
        state.currentLot.motifs?.[0]
      );
      return {
        ...state,
        status: 'LOT_LOST',
        rivals: state.rivals.map((rival) => rival.nombre === state.highestBidder
          ? { ...rival, wins: (rival.wins || 0) + 1, grudge: Math.max(0, (rival.grudge || 0) - 1) }
          : rival),
        turnCount: state.turnCount + 1,
        biddingActive: false,
        dialogueBubble: {
          character: 'subastador',
          text: `¡Adjudicado a ${state.highestBidder} por ${formattedCost}! ${roast}`
        },
        campaign: {
          ...state.campaign,
          lostByOneCount: state.campaign.lostByOneCount + (playerBidWasRecent ? 1 : 0),
          relationships: adjustRelationship(state.campaign.relationships, 'rata', { trust: 1, suspicion: playerBidWasRecent ? 1 : 0 }),
          storyLog: appendStoryBeat(state.campaign.storyLog, storyBeat),
          audienceMood: Math.min(100, state.campaign.audienceMood + 5),
          houseHunger: Math.min(100, state.campaign.houseHunger + 4),
          delirium: {
            ...state.campaign.delirium,
            dormantCallbacks: [...state.campaign.delirium.dormantCallbacks, `Perdió ${state.currentLot.nombre_item} ante ${state.highestBidder}`].slice(-12)
          }
        }
      };
    }

    case 'PASS_LOT': {
      const insult = generateContextualRoast(state, 'subastador', rng);
      const passes = state.campaign.consecutivePasses + 1;
      return {
        ...state,
        status: 'LOT_LOST',
        turnCount: state.turnCount + 1,
        biddingActive: false,
        dialogueBubble: {
          character: 'subastador',
          text: passes >= 3
            ? `${insult} Tercer lote rechazado. La casa ha empezado a sospechar que conservas criterio y considera eso una infracción.`
            : insult
        },
        campaign: {
          ...state.campaign,
          consecutivePasses: passes,
          patienceBelisario: Math.max(0, state.campaign.patienceBelisario - 8),
          audienceMood: Math.max(-100, state.campaign.audienceMood - 10),
          houseHunger: Math.min(100, state.campaign.houseHunger + 8),
          relationships: adjustRelationship(state.campaign.relationships, 'subastador', { trust: -1, suspicion: 1 }),
          storyLog: appendStoryBeat(state.campaign.storyLog, makeStoryBeat(
            state.turnCount,
            'lote',
            'El postor se negó a empeorar',
            `${state.dossier.alias} dejó pasar ${state.currentLot?.nombre_item || 'un lote'} y elevó su racha de abstinencia patrimonial a ${passes}.`,
            passes >= 3 ? 3 : 1
          ))
        }
      };
    }


    case 'ACCEPT_HOUSE_BARGAIN': {
      const bargain = state.campaign.pendingBargains.find((entry) => entry.id === action.bargainId);
      if (!bargain) return state;

      let nextState: GameState = {
        ...state,
        status: 'INTERMISSION',
        campaign: {
          ...state.campaign,
          pendingBargains: [],
          lastBargainTurn: state.turnCount
        }
      };
      let consequence: string;

      if (bargain.id === 'feed_object') {
        const victim = [...state.inventory].sort((a, b) => (a.valor_real || a.precio_compra) - (b.valor_real || b.precio_compra))[0];
        if (!victim) return state;
        nextState = {
          ...nextState,
          inventory: state.inventory.filter((item) => item.id !== victim.id),
          campaign: {
            ...nextState.campaign,
            soulFragments: nextState.campaign.soulFragments + 2,
            houseHunger: Math.max(0, nextState.campaign.houseHunger - 28)
          }
        };
        consequence = `Las paredes mastican ${victim.nombre_item}. Durante varios segundos el edificio parece recordar una infancia.`;
      } else if (bargain.id === 'applause_loan') {
        nextState = {
          ...nextState,
          budget: state.budget + 1500,
          debt: state.debt + 2200,
          prestige: state.prestige + 8,
          campaign: {
            ...nextState.campaign,
            debtSplits: { ...nextState.campaign.debtSplits, moral: nextState.campaign.debtSplits.moral + 2200 },
            audienceMood: Math.min(100, nextState.campaign.audienceMood + 18),
            houseHunger: Math.min(100, nextState.campaign.houseHunger + 6)
          }
        };
        consequence = 'El público aplaude una hazaña todavía no realizada. La ovación queda hipotecada y empieza a cobrar intereses.';
      } else if (bargain.id === 'sell_composure') {
        nextState = {
          ...nextState,
          campaign: {
            ...nextState.campaign,
            composure: Math.max(0, nextState.campaign.composure - 18),
            influence: nextState.campaign.influence + 4,
            houseHunger: Math.max(0, nextState.campaign.houseHunger - 14)
          }
        };
        consequence = 'Una moldura absorbe tu capacidad de fingir normalidad. Ahora posee mejor postura que tú.';
      } else if (bargain.id === 'lease_name') {
        nextState = {
          ...nextState,
          budget: state.budget + 900,
          prestige: Math.max(0, state.prestige - 12),
          campaign: {
            ...nextState.campaign,
            soulFragments: nextState.campaign.soulFragments + 1,
            delirium: {
              ...nextState.campaign.delirium,
              activeRealityRule: `El nombre de ${state.dossier.alias || 'el postor'} pertenece temporalmente al edificio.`
            }
          }
        };
        consequence = 'Tu nombre es retirado de la conversación, doblado en cuatro y archivado bajo “activos de pronunciación dudosa”.';
      } else if (bargain.id === 'fiscal_ratification') {
        nextState = {
          ...nextState,
          prestige: state.prestige + 12,
          curse: state.curse + 2,
          campaign: {
            ...nextState.campaign,
            influence: nextState.campaign.influence + 2,
            suspicion: Math.min(100, nextState.campaign.suspicion + 16)
          }
        };
        consequence = 'Serafina estampa el Sello Número Cero sobre una mentira. La mentira adquiere domicilio, abogado y opinión.';
      } else {
        nextState = {
          ...nextState,
          budget: state.budget + 1800,
          debt: state.debt + 1800,
          campaign: {
            ...nextState.campaign,
            debtSplits: { ...nextState.campaign.debtSplits, unremembered: nextState.campaign.debtSplits.unremembered + 1800 },
            houseHunger: Math.max(0, nextState.campaign.houseHunger - 8)
          }
        };
        consequence = 'Una versión futura de ti recibe un cobro. Desde algún lugar temporalmente ilegal llega un insulto amortiguado.';
      }

      return {
        ...nextState,
        debtTurns: nextState.debt > state.debt
          ? state.debtTurns + 1
          : (nextState.debt === 0 ? 0 : state.debtTurns),
        dialogueBubble: { character: 'subastador', text: consequence },
        campaign: {
          ...nextState.campaign,
          storyLog: appendStoryBeat(nextState.campaign.storyLog, makeStoryBeat(
            state.turnCount,
            'casa',
            `Contrato con la casa: ${bargain.title}`,
            consequence,
            4,
            bargain.motif
          ))
        }
      };
    }

    case 'DECLINE_HOUSE_BARGAINS': {
      return {
        ...state,
        status: 'INTERMISSION',
        dialogueBubble: {
          character: 'subastador',
          text: 'Rechazas los tres contratos. El edificio acepta tu decisión con la madurez emocional de una caldera tapiada.'
        },
        campaign: {
          ...state.campaign,
          pendingBargains: [],
          lastBargainTurn: state.turnCount,
          houseHunger: Math.min(100, state.campaign.houseHunger + 12),
          delirium: {
            ...state.campaign.delirium,
            tension: Math.min(100, state.campaign.delirium.tension + 10)
          },
          storyLog: appendStoryBeat(state.campaign.storyLog, makeStoryBeat(
            state.turnCount,
            'casa',
            'La casa fue rechazada',
            `${state.dossier.alias || 'El postor'} rechazó tres contratos y convirtió una negociación inmobiliaria en resentimiento arquitectónico.`,
            3,
            'paredes ofendidas'
          ))
        }
      };
    }

    case 'USE_AUCTION_TRICK': {
      if (!state.currentLot || state.campaign.auctionTricksUsed.includes(action.trick)) return state;

      if (action.trick === 'appraise') {
        if (state.campaign.influence < 1) return state;
        return {
          ...state,
          campaign: {
            ...state.campaign,
            influence: state.campaign.influence - 1,
            lotIntelRevealed: true,
            auctionTricksUsed: [...state.campaign.auctionTricksUsed, action.trick],
            relationships: adjustRelationship(state.campaign.relationships, 'rata', { trust: 1 })
          },
          dialogueBubble: {
            character: 'rata',
            text: `Tasación confidencial: ${state.currentLot.nombre_item} podría valer $${(state.currentLot.valor_estimado || state.currentLot.puja_inicial * 2).toLocaleString()}. Valor real probable: $${(state.currentLot.valor_real || 0).toLocaleString()}. ${state.currentLot.comentario_rata || 'Su valor emocional continúa siendo negativo.'}`
          }
        };
      }

      if (action.trick === 'scandal') {
        if (state.campaign.influence < 2) return state;
        const target = [...state.rivals].sort((a, b) => (b.agresividad + (b.grudge || 0) * 0.03) - (a.agresividad + (a.grudge || 0) * 0.03))[0];
        if (!target) return state;
        return {
          ...state,
          rivals: state.rivals.map((rival) => rival.id === target.id
            ? { ...rival, shakenUntilTurn: state.turnCount, grudge: Math.min(12, (rival.grudge || 0) + 3) }
            : rival),
          campaign: {
            ...state.campaign,
            influence: state.campaign.influence - 2,
            suspicion: Math.min(100, state.campaign.suspicion + 8),
            audienceMood: Math.min(100, state.campaign.audienceMood + 12),
            auctionTricksUsed: [...state.campaign.auctionTricksUsed, action.trick]
          },
          dialogueBubble: {
            character: 'fantasma',
            text: `Casimiro filtra un documento que vincula a ${target.nombre} con una sociedad dedicada a importar aplausos falsificados. Su paleta tiembla, pero recordará esto.`
          }
        };
      }

      if (state.campaign.soulFragments < 1 || state.status !== 'LOT_REVEAL') return state;
      const rewrittenOpening = Math.max(1, Math.floor(state.currentLot.puja_inicial * 0.7));
      return {
        ...state,
        currentLot: { ...state.currentLot, puja_inicial: rewrittenOpening, letra_pequena: `${state.currentLot.letra_pequena} La apertura fue reescrita usando un fragmento de alma no certificado.` },
        activeBid: rewrittenOpening,
        bidsLog: [`El Notario Sin Rostro reescribe la apertura en ${formatAuctionAmount(state.campaign.auctionFormat, rewrittenOpening)}.`],
        curse: state.curse + 2,
        campaign: {
          ...state.campaign,
          soulFragments: state.campaign.soulFragments - 1,
          houseHunger: Math.min(100, state.campaign.houseHunger + 10),
          auctionTricksUsed: [...state.campaign.auctionTricksUsed, action.trick],
          delirium: {
            ...state.campaign.delirium,
            normalityResidual: Math.max(0, state.campaign.delirium.normalityResidual - 8)
          }
        },
        dialogueBubble: {
          character: 'notario',
          text: `La cifra inicial era una interpretación. Ahora es otra interpretación, más barata y jurídicamente venenosa.`
        }
      };
    }

    case 'REQUEST_LOAN': {
      // Loan details
      const loanAmount = 2500;
      const debtAmount = 3000;
      const veredicto = `${generarVeredictoSanguino(true, rng)} ${generateContextualRoast(state, 'sanguino', rng)}`;

      return {
        ...state,
        budget: state.budget + loanAmount,
        debt: state.debt + debtAmount,
        debtTurns: state.debtTurns + 1,
        dialogueBubble: {
          character: 'sanguino',
          text: veredicto
        },
        campaign: {
          ...state.campaign,
          debtSplits: {
            ...state.campaign.debtSplits,
            sanguino: state.campaign.debtSplits.sanguino + debtAmount
          },
          relationships: adjustRelationship(state.campaign.relationships, 'sanguino', { trust: 2, debt: debtAmount, fear: 1 }),
          houseHunger: Math.min(100, state.campaign.houseHunger + 7),
          audienceMood: Math.min(100, state.campaign.audienceMood + 4),
          storyLog: appendStoryBeat(state.campaign.storyLog, makeStoryBeat(
            state.turnCount,
            'deuda',
            'Don Sanguino amplía la relación',
            `${state.dossier.alias} recibió $${loanAmount.toLocaleString()} y aceptó devolver $${debtAmount.toLocaleString()}, además de cualquier futuro que estuviera sin vigilancia.`,
            3
          ))
        }
      };
    }


    case 'PAY_LOAN': {
      const payAmount = Math.min(action.amount, state.debt, state.budget);
      if (payAmount <= 0) return state;

      const remainingDebt = state.debt - payAmount;

      // Deduct from splits proportionally
      let leftover = payAmount;
      const splits = { ...state.campaign.debtSplits };

      const order: (keyof typeof splits)[] = ['sanguino', 'bancaria', 'espectral', 'moral', 'unremembered'];
      order.forEach(k => {
        if (leftover <= 0) return;
        const ded = Math.min(splits[k], leftover);
        splits[k] -= ded;
        leftover -= ded;
      });

      return {
        ...state,
        budget: state.budget - payAmount,
        debt: remainingDebt,
        debtTurns: remainingDebt === 0 ? 0 : state.debtTurns,
        dialogueBubble: {
          character: 'sanguino',
          text: remainingDebt === 0 
            ? 'Deuda saldada por ahora, sabandija. Pero estare vigilando tu tacañeria.'
            : `Recibo tus $${payAmount.toLocaleString()}. Todavia me debes $${remainingDebt.toLocaleString()}.`
        },
        campaign: {
          ...state.campaign,
          debtSplits: splits,
          relationships: adjustRelationship(state.campaign.relationships, 'sanguino', { trust: 1, debt: -payAmount }),
          storyLog: appendStoryBeat(state.campaign.storyLog, makeStoryBeat(
            state.turnCount,
            'deuda',
            remainingDebt === 0 ? 'Pago sospechosamente completo' : 'Abono sin liberación',
            `${state.dossier.alias} pagó $${payAmount.toLocaleString()} y todavía figura con $${remainingDebt.toLocaleString()} de deuda.`,
            remainingDebt === 0 ? 3 : 1
          ))
        }
      };
    }


    case 'SELL_ITEM': {
      const item = state.inventory.find(i => i.id === action.itemId);
      if (!item) return state;

      // Sell back for 70% of purchase price
      const sellPrice = Math.floor(item.precio_compra * 0.7);
      const filteredInventory = state.inventory.filter(i => i.id !== action.itemId);

      return {
        ...state,
        budget: state.budget + sellPrice,
        inventory: filteredInventory,
        prestige: Math.max(0, state.prestige - 5),
        dialogueBubble: {
          character: 'rata',
          text: `Malbaratando tu patrimonio inexplicable por $${sellPrice.toLocaleString()}... Una transaccion digna de tu calana.`
        }
      };
    }

    case 'HEAR_OBJECT_PETITION': {
      const item = state.inventory.find((entry) => entry.id === action.itemId);
      const agency = item?.agency || 'Dormido';
      if (!item || agency === 'Dormido' || item.petitionAgency === agency) return state;

      let petition = '';
      let budgetDelta = 0;
      let prestigeDelta = 0;
      let curseDelta = 0;
      let composureDelta = 0;
      let influenceDelta = 0;
      let suspicionDelta = 0;
      let unrememberedDebt = 0;

      if (agency === 'Inquieto') {
        petition = `${item.nombre_item} solicita ser almacenado lejos de los objetos que aún creen en la propiedad privada. Alega ambiente laboral conceptualmente hostil.`;
        influenceDelta = 1;
      } else if (agency === 'Consciente' || agency === 'Hostil') {
        petition = `${item.nombre_item} exige nombre propio, salario retroactivo y el derecho a corregir la descripción donde lo llamaste “compra”.`;
        prestigeDelta = 2;
        suspicionDelta = 3;
      } else if (agency === 'Sindicalizado') {
        petition = `${item.nombre_item} presenta el primer convenio colectivo del Patrimonio Inexplicable. La cuota sindical ya fue descontada.`;
        budgetDelta = -Math.min(250, state.budget);
        influenceDelta = 2;
        curseDelta = 1;
      } else if (agency === 'Litigante') {
        petition = `${item.nombre_item} inicia una demanda por almacenamiento emocional negligente, falta de ventilación y uso reiterado como metáfora.`;
        suspicionDelta = 12;
        composureDelta = -7;
      } else {
        petition = `${item.nombre_item} deposita una escritura donde figura como propietario de ${state.dossier.alias || 'su comprador'}. La casa encuentra el documento “sorprendentemente sólido”.`;
        unrememberedDebt = 600;
        curseDelta = 2;
        composureDelta = -10;
      }

      const nextDebt = state.debt + unrememberedDebt;
      return {
        ...state,
        budget: Math.max(0, state.budget + budgetDelta),
        debt: nextDebt,
        prestige: Math.max(0, state.prestige + prestigeDelta),
        curse: state.curse + curseDelta,
        inventory: state.inventory.map((entry) => entry.id === item.id ? {
          ...entry,
          petitionAgency: agency,
          petitionText: petition
        } : entry),
        dialogueBubble: { character: 'rata', text: petition },
        campaign: {
          ...state.campaign,
          composure: Math.max(0, state.campaign.composure + composureDelta),
          influence: state.campaign.influence + influenceDelta,
          suspicion: Math.min(100, state.campaign.suspicion + suspicionDelta),
          debtSplits: {
            ...state.campaign.debtSplits,
            unremembered: state.campaign.debtSplits.unremembered + unrememberedDebt
          },
          audienceMood: Math.min(100, state.campaign.audienceMood + 8),
          storyLog: appendStoryBeat(state.campaign.storyLog, makeStoryBeat(
            state.turnCount,
            'objeto',
            `Petición de ${item.nombre_item}`,
            petition,
            agency === 'Propietario' ? 5 : agency === 'Litigante' ? 4 : 3,
            item.motifs?.[0]
          ))
        }
      };
    }

    case 'SELL_SOUL': {
      const ratInsult = generarJuicioRata(rng);
      return {
        ...state,
        debt: 0,
        debtTurns: 0,
        curse: state.curse + 6,
        dialogueBubble: {
          character: 'rata',
          text: `He comprado tu alma miserable. Tu deuda esta saldada en todos los registros. Siente el peso del sumidero: ${ratInsult}`
        },
        campaign: {
          ...state.campaign,
          soulSold: true,
          composure: Math.max(0, state.campaign.composure - 20),
          debtSplits: { bancaria: 0, espectral: 0, moral: 0, sanguino: 0, unremembered: 0 },
          relationships: adjustRelationship(state.campaign.relationships, 'rata', { trust: 6, debt: state.debt, fear: 2 }),
          storyLog: appendStoryBeat(state.campaign.storyLog, makeStoryBeat(
            state.turnCount,
            'relacion',
            'Sir Roquefort adquiere una garantía inmaterial',
            `${state.dossier.alias} vendió su alma para extinguir $${state.debt.toLocaleString()} de deuda y recibió a cambio una posición no remunerada en la nobleza murina.`,
            5,
            'la corona de Sir Roquefort'
          ))
        }
      };
    }

    case 'NAVIGATE_AREA': {
      let nextStatus = state.status;
      if (action.area === 'taller') nextStatus = 'TALLER_SCREEN';
      else if (action.area === 'tribunal') nextStatus = 'TRIBUNAL_SCREEN';
      else if (action.area === 'tuneles') nextStatus = 'TUNELES_SCREEN';
      else if (action.area === 'salon') nextStatus = 'LOT_REVEAL';

      return {
        ...state,
        status: nextStatus,
        campaign: {
          ...state.campaign,
          currentArea: action.area
        }
      };
    }

    case 'FUSE_ITEMS': {
      const itemA = state.inventory.find(i => i.id === action.itemAId);
      const itemB = state.inventory.find(i => i.id === action.itemBId);
      if (!itemA || !itemB || state.budget < 500) return state;

      const fused = generarFusion(itemA, itemB, rng);
      const updatedInventory = state.inventory.filter(i => i.id !== action.itemAId && i.id !== action.itemBId);
      updatedInventory.push(fused);

      return {
        ...state,
        budget: state.budget - 500,
        inventory: updatedInventory,
        curse: state.curse + 2,
        campaign: {
          ...state.campaign,
          composure: Math.max(0, state.campaign.composure - 15)
        },
        dialogueBubble: {
          character: 'engrudo',
          text: `He mezclado sus almas. Contempla el resultado: "${fused.nombre_item}". Cobro $500 por la cirugia conceptual.`
        }
      };
    }

    case 'REPAIR_ITEM': {
      const item = state.inventory.find(i => i.id === action.itemId);
      if (!item || state.budget < 300) return state;

      const updatedInventory = state.inventory.map(i => i.id === action.itemId ? { ...i, degradacion: 0 } : i);
      return {
        ...state,
        budget: state.budget - 300,
        inventory: updatedInventory,
        dialogueBubble: {
          character: 'engrudo',
          text: `Objeto ${item.nombre_item} restaurado como nuevo. Eso te cuesta $300 pesos en efectivo.`
        }
      };
    }

    case 'CLEAN_CURSE': {
      const item = state.inventory.find(i => i.id === action.itemId);
      if (!item || state.budget < 400) return state;

      return {
        ...state,
        budget: state.budget - 400,
        curse: Math.max(0, state.curse - 2),
        dialogueBubble: {
          character: 'engrudo',
          text: `He lavado las emanaciones espirituales del objeto. Tu alma se siente un poco mas ligera.`
        }
      };
    }

    case 'FORGE_CERTIFICATE': {
      const item = state.inventory.find(i => i.id === action.itemId);
      if (!item || state.budget < 350) return state;

      const updatedInventory = state.inventory.map(i => i.id === action.itemId ? {
        ...i,
        rareza: 'Elite',
        es_elite: true,
        valor_estimado: Math.floor(i.valor_estimado * 1.8)
      } : i);

      return {
        ...state,
        budget: state.budget - 350,
        inventory: updatedInventory,
        campaign: {
          ...state.campaign,
          suspicion: Math.min(100, state.campaign.suspicion + 12)
        },
        dialogueBubble: {
          character: 'engrudo',
          text: `Certificado de autenticidad imperial timbrado. Tu sospecha fiscal sube, pero el tasador de aduanas pagara mas por el.`
        }
      };
    }

    case 'COMPLETE_MINIGAME': {
      const completedState = resolveMinigameResult(state, action.success, action.gameType);
      return {
        ...completedState,
        status: 'LOT_REVEAL'
      };
    }

    case 'SELECT_EVENT_OPTION': {
      const resolved = resolveEventOption(state, action.eventId, action.optionId);
      return {
        ...resolved,
        status: 'NEWSPAPER_SCREEN',
        campaign: {
          ...resolved.campaign,
          newspaperStage: 'event'
        }
      };
    }

    case 'DISMISS_NEWSPAPER': {
      if (state.campaign.newspaperStage === 'event') {
        return {
          ...state,
          status: 'INTERMISSION',
          campaign: {
            ...state.campaign,
            newspaperStage: null
          },
          dialogueBubble: {
            character: 'ujier',
            text: 'El incidente fue incorporado al expediente. La casa recoloca los muebles para que parezca que nada tuvo consecuencias.'
          }
        };
      }
      const chosenEvent = selectNarrativeEvent(state, rng);
      return {
        ...state,
        status: 'EVENT_SCREEN',
        campaign: {
          ...state.campaign,
          newspaperStage: 'act'
        },
        dialogueBubble: {
          character: 'ujier',
          text: `Ha ocurrido un evento en los pasillos: ${chosenEvent.title}. Toma una decision.`
        }
      };
    }

    case 'RESOLVE_ANOMALY': {
      const anomaly = state.campaign.delirium.currentAnomaly;
      const resolved = resolveAnomalyChoice(state, action.choiceId);
      if (!anomaly) return resolved;
      return {
        ...resolved,
        campaign: {
          ...resolved.campaign,
          storyLog: appendStoryBeat(resolved.campaign.storyLog, makeStoryBeat(
            state.turnCount,
            'anomalia',
            anomaly.title,
            `${anomaly.description} Decisión registrada: ${action.choiceId}.`,
            anomaly.severity,
            anomaly.motif
          )),
          houseDisposition: Math.max(-20, Math.min(20, resolved.campaign.houseDisposition + anomaly.severity - 2))
        }
      };
    }

    case 'INSPECT_ITEM': {
      return {
        ...state,
        campaign: {
          ...state.campaign,
          inspectedItemId: action.itemId
        }
      };
    }

    case 'BRIBE_GHOST': {
      if (state.budget < 150 || state.ghostBribed || !state.currentLot) return state;
      const advice = generarConsejoFantasma(rng);
      return {
        ...state,
        budget: state.budget - 150,
        ghostBribed: true,
        dialogueBubble: {
          character: 'fantasma',
          text: `Trato hecho... la letra pequena de esta basura es: "${state.currentLot.letra_pequena}". ${advice}`
        },
        campaign: {
          ...state.campaign,
          relationships: adjustRelationship(state.campaign.relationships, 'fantasma', { trust: 2, suspicion: 1, debt: 150 }),
          storyLog: appendStoryBeat(state.campaign.storyLog, makeStoryBeat(
            state.turnCount,
            'relacion',
            'Integridad espectral liquidada',
            `Casimiro vendió la letra pequeña de ${state.currentLot.nombre_item} por $150 y afirmó que era una tarifa administrativa.`,
            2
          ))
        }
      };
    }

    case 'SUBMIT_CONFESSION': {
      const charKey = action.character as keyof typeof state.chatHistory;
      if (!state.chatHistory[charKey]) return state;

      const updatedHistory = {
        ...state.chatHistory,
        [charKey]: [
          ...state.chatHistory[charKey],
          { role: 'user', text: action.text } as ChatMessage,
          { role: 'npc', text: action.reply } as ChatMessage
        ]
      };

      const cleanConfession = action.text.replace(/[<>]/g, '').slice(0, 220);
      return {
        ...state,
        chatHistory: updatedHistory,
        confessions: [...state.confessions, cleanConfession],
        dossier: {
          ...state.dossier,
          fictionalWeaknesses: [cleanConfession, ...state.dossier.fictionalWeaknesses].slice(0, 8)
        },
        dossierTraces: addDossierTrace(
          state.dossierTraces,
          'fictionalWeaknesses',
          `Confesionario de ${action.character}`,
          'Diálogo y generación procedural'
        ),
        campaign: {
          ...state.campaign,
          relationships: isCharacterId(action.character)
            ? adjustRelationship(state.campaign.relationships, action.character, { trust: 2, suspicion: 1 })
            : state.campaign.relationships,
          storyLog: appendStoryBeat(state.campaign.storyLog, makeStoryBeat(
            state.turnCount,
            'confesion',
            `Declaración entregada a ${action.character}`,
            'La casa recibió una confesión voluntaria y la archivó para callbacks, objetos y futuras faltas de respeto.',
            2
          )),
          delirium: {
            ...state.campaign.delirium,
            dormantCallbacks: [...state.campaign.delirium.dormantCallbacks, cleanConfession].slice(-12)
          }
        },
        dialogueBubble: {
          character: action.character,
          text: action.reply
        }
      };
    }

    case 'TOGGLE_MUSIC': {
      return { ...state, musicOn: !state.musicOn };
    }

    case 'TOGGLE_VOICE': {
      return { ...state, voiceOn: !state.voiceOn };
    }

    case 'SET_VOLUME_MUSIC': {
      return { ...state, volumeMusic: action.val };
    }

    case 'SET_VOLUME_VOICE': {
      return { ...state, volumeVoice: action.val };
    }

    case 'TRIGGER_DIALOGUE': {
      return {
        ...state,
        dialogueBubble: {
          character: action.character,
          text: action.text
        }
      };
    }

    case 'CLEAR_DIALOGUE': {
      return { ...state, dialogueBubble: null };
    }

    case 'RESET_GAME': {
      const s = createInitialState();
      return {
        ...s,
        status: 'INTRO'
      };
    }

    case 'LOAD_SAVE': {
      const defaults = createInitialState(action.state.seed);
      const loadedCampaign = action.state.campaign || defaults.campaign;
      return {
        ...defaults,
        ...action.state,
        dossier: {
          ...defaults.dossier,
          ...(action.state.dossier || {})
        },
        dossierTraces: action.state.dossierTraces || defaults.dossierTraces,
        campaign: {
          ...defaults.campaign,
          ...loadedCampaign,
          debtSplits: {
            ...defaults.campaign.debtSplits,
            ...(loadedCampaign.debtSplits || {})
          },
          delirium: {
            ...defaults.campaign.delirium,
            ...(loadedCampaign.delirium || {})
          }
        }
      };
    }


    default:
      return state;
  }
}
