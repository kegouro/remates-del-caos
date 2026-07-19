import type { GameState } from '../types';

const SAVE_KEY = 'remates_del_caos_save_v1';
const PROFILE_KEY = 'remates_del_caos_profile_v1';
const SESSION_KEY = 'remates_del_caos_session_v1';

export interface GlobalProfile {
  musicOn: boolean;
  voiceOn: boolean;
  volumeMusic: number;
  volumeVoice: number;
  unlockedAchievements: string[];
  highScore: number; // max budget reached or max items bought
}

export function saveGameState(state: GameState) {
  if (typeof window === 'undefined') return;

  // 1. Save the active run in sessionStorage (excluding confessions and chat)
  const serializableState = {
    status: state.status,
    budget: state.budget,
    debt: state.debt,
    debtTurns: state.debtTurns,
    prestige: state.prestige,
    curse: state.curse,
    inventory: state.inventory,
    currentLot: state.currentLot,
    pastLots: state.pastLots,
    turnCount: state.turnCount,
    activeBid: state.activeBid,
    highestBidder: state.highestBidder,
    biddingActive: state.biddingActive,
    rivals: state.rivals,
    bidsLog: state.bidsLog,
    seed: state.seed,
    ghostBribed: state.ghostBribed,
    campaign: state.campaign,
    prologue: state.prologue ? { ...state.prologue, confession: '' } : null,
    dossierTraces: []
  };

  try {
    sessionStorage.setItem(SAVE_KEY, JSON.stringify(serializableState));
  } catch (e) {
    console.error("Failed to save game state to sessionStorage:", e);
  }

  // 2. Save confessions and chatHistory to sessionStorage (ephemeral data)
  const sessionData = {
    chatHistory: state.chatHistory,
    confessions: state.confessions,
    dossier: state.dossier,
    dossierTraces: state.dossierTraces
  };

  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  } catch (e) {
    console.error("Failed to save session data to sessionStorage:", e);
  }

  // 3. Save profile/settings to localStorage
  const profile: GlobalProfile = {
    musicOn: state.musicOn,
    voiceOn: state.voiceOn,
    volumeMusic: state.volumeMusic,
    volumeVoice: state.volumeVoice,
    unlockedAchievements: getUnlockedAchievements(state),
    highScore: Math.max(loadGlobalProfile().highScore, state.inventory.length)
  };

  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error("Failed to save profile to localStorage:", e);
  }
}

export function loadGlobalProfile(): GlobalProfile {
  const defaultProfile: GlobalProfile = {
    musicOn: false,
    voiceOn: true,
    volumeMusic: 0.3,
    volumeVoice: 0.8,
    unlockedAchievements: [],
    highScore: 0
  };

  if (typeof window === 'undefined') return defaultProfile;

  try {
    const data = localStorage.getItem(PROFILE_KEY);
    if (data) {
      return { ...defaultProfile, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error("Failed to load global profile:", e);
  }
  return defaultProfile;
}

export function loadGameState(state: GameState): GameState {
  if (typeof window === 'undefined') return state;

  const profile = loadGlobalProfile();
  let loadedState = { ...state };

  try {
    // 1. Rehydrate settings
    loadedState.musicOn = profile.musicOn;
    loadedState.voiceOn = profile.voiceOn;
    loadedState.volumeMusic = profile.volumeMusic;
    loadedState.volumeVoice = profile.volumeVoice;

    // 2. Rehydrate game loop
    const saveData = sessionStorage.getItem(SAVE_KEY) || localStorage.getItem(SAVE_KEY);
    if (saveData) {
      const parsed = JSON.parse(saveData);
      loadedState = {
        ...loadedState,
        ...parsed
      };
    }

    // 3. Rehydrate session chat and confessions
    const sessionData = sessionStorage.getItem(SESSION_KEY);
    if (sessionData) {
      const parsed = JSON.parse(sessionData);
      loadedState.chatHistory = parsed.chatHistory || loadedState.chatHistory;
      loadedState.confessions = parsed.confessions || loadedState.confessions;
      loadedState.dossier = parsed.dossier || loadedState.dossier;
      loadedState.dossierTraces = parsed.dossierTraces || loadedState.dossierTraces;
    }
  } catch (e) {
    console.error("Failed to load game state:", e);
  }

  return loadedState;
}

export function clearAllLocalData() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SAVE_KEY);
    sessionStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(PROFILE_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error("Failed to clear local data:", e);
  }
}

// Achievements are derived from fictional game state only. Raw confessions never enter their labels.
export function getUnlockedAchievements(state: GameState): string[] {
  const achievements = new Set<string>(loadGlobalProfile().unlockedAchievements);
  const add = (condition: boolean, label: string) => { if (condition) achievements.add(label); };
  const agencyRank = ['Dormido', 'Inquieto', 'Consciente', 'Hostil', 'Sindicalizado', 'Litigante', 'Propietario'];
  const highestAgency = state.inventory.reduce((rank, item) => Math.max(rank, agencyRank.indexOf(item.agency || 'Dormido')), 0);
  const dossierAmmunition = [
    ...state.dossier.habits,
    ...state.dossier.fictionalWeaknesses,
    ...state.dossier.embarrassingObjects,
    ...(state.dossier.fileMetadataList || []).map((file) => file.name)
  ].length;
  const usedCharacters = Object.values(state.chatHistory).filter((messages) => messages.some((message) => message.role === 'user')).length;

  add(state.inventory.length >= 1, 'Comprador Novato · Adquiriste tu primera porquería');
  add(state.inventory.length >= 5, 'Acumulador del Sumidero · Cinco objetos ya dependen de tu criterio');
  add(state.curse >= 5, 'Cuerpo de Ectoplasma · Tu patrimonio empezó a respirar');
  add(state.debt >= 5000, 'Insolvencia Solemne · Debes más de $5.000 a la noche');
  add(state.campaign.soulSold, 'Desalmado Fiscal · Vendiste tu garantía inmaterial');
  add(state.campaign.delirium.anomalyHistory.length >= 1, 'Primer Precedente · Sobreviviste una anomalía documentada');
  add(state.campaign.delirium.anomalyHistory.length >= 5, 'La Casa Perdió la Licencia · Cinco anomalías te reconocen');
  add(state.campaign.delirium.normalityResidual <= 0, 'Normalidad Liquidada · Ya no queda nada que fingir');
  add(highestAgency >= agencyRank.indexOf('Consciente'), 'Patrimonio Despierto · Un objeto sabe quién eres');
  add(highestAgency >= agencyRank.indexOf('Propietario'), 'Comprador Comprado · Tu inventario figura como dueño');
  add(state.campaign.auctionFormat.id !== 'normal', 'Moneda Inadecuada · Pujaste con algo que no era dinero');
  add(dossierAmmunition >= 8, 'Expediente Autoincriminatorio · Entregaste material para ocho anexos');
  add(usedCharacters >= 8, 'Consejo de Enemigos · Ocho personajes ya tienen una opinión');
  add(state.campaign.storyLog.length >= 20, 'Archivo Innecesariamente Completo · Veinte precedentes y ninguna absolución');
  add(state.campaign.lostByOneCount >= 2, 'El Peso Faltante · Perdiste por uno más de una vez');
  add(state.campaign.consecutivePasses >= 3, 'Huelga Personal · Tres lotes no consiguieron destruirte');
  add(state.dossier.fileMetadataList?.some((file) => /final(?:_|\s|-)*final|v\d+/i.test(file.name)) || false, 'Versión Definitiva Reincidente · La evidencia contiene otro final');
  add(state.campaign.omenCompleted, 'Profecía Autocumplida · Hiciste exactamente lo que juraste evitar');
  add(state.campaign.storyLog.some((beat) => beat.title.startsWith('Contrato con la casa')), 'Arrendatario Comestible · Firmaste directamente con el edificio');
  add(state.campaign.storyLog.some((beat) => beat.title === 'La casa fue rechazada'), 'Paredes Ofendidas · Rechazaste una negociación inmobiliaria consciente');
  add(state.campaign.audienceMood >= 75, 'Favorito del Gallinero · El público exige otra mala decisión');
  add(state.campaign.houseHunger >= 90, 'Arquitectura Famélica · El edificio ya distingue tu olor');
  add(state.campaign.auctionTricksUsed.length >= 3, 'Manual de Competencia Desleal · Usaste tres maniobras en un mismo lote');
  add(state.campaign.mode === 'infinita' && state.turnCount >= 20, 'Funcionario de Planta · Sobreviviste veinte lotes sin encontrar salida');
  add(state.campaign.storyLog.some((beat) => beat.title.startsWith('Petición de')), 'Libertad de Objeto · Escuchaste a una compra formular derechos');
  add(state.campaign.daysChallenge, 'Contribuyente del Día · Aceptaste la misma desgracia que el resto del calendario');
  add(state.campaign.discoveredRituals.length >= 1, 'Ocultista Contable · Activaste un ritual que el tutorial negó conocer');
  add(state.campaign.discoveredRituals.length >= 3, 'Liturgia de los Cachureos · Tres rituales ya te reconocen como oficiante');
  return [...achievements];
}
