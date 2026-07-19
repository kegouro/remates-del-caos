import React, { useReducer, useEffect, useState, useCallback } from 'react';

import { gameReducer, createInitialState } from '../game/state/store';
import { loadGameState, saveGameState, clearAllLocalData, getUnlockedAchievements } from '../game/persistence/save';



import type { PrologueChoices, CampaignMode } from '../game/campaign/types';
import { speakText } from '../audio/tts';
import { synth } from '../audio/synth';
import { ChatRoom } from '../components/ChatRoom';
import { Saloon } from '../components/Saloon';
import { Inventory } from '../components/Inventory';
import { DossierOnboarding } from '../components/DossierOnboarding';
import { DossierPanel } from '../components/DossierPanel';
import { AnomalyScene } from '../components/AnomalyScene';
import { StoryLedger } from '../components/StoryLedger';
import { OmenSelection } from '../components/OmenSelection';
import { HouseBargainScene } from '../components/HouseBargainScene';
import { RitualArchive } from '../components/RitualArchive';
import { generarTasacionFinal, createRNG } from '../game/generators/lotGenerator';
import { getCampaignEnding } from '../game/campaign/endings';
import { selectNarrativeEvent } from '../game/campaign/events';
import { startMinigame, type MinigameState } from '../game/campaign/minigames';
import { getPlayerEpithet } from '../game/campaign/epithets';
import { copyRunSummary, downloadRunCertificate } from '../game/sharing/resultCard';
import { copyNewspaperEdition, downloadNewspaperEdition } from '../game/sharing/newspaperCard';
import '../styles/App.css';

export const App: React.FC = () => {
  const [state, dispatch] = useReducer(gameReducer, createInitialState());
  const [showAchievements, setShowAchievements] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [helpTab, setHelpTab] = useState<'concepts' | 'modes' | 'loop'>('concepts');
  const [showDossier, setShowDossier] = useState(false);
  const [showStoryLedger, setShowStoryLedger] = useState(false);
  const [showRitualArchive, setShowRitualArchive] = useState(false);
  const [copyNotice, setCopyNotice] = useState('');

  // Prologue states
  const [prologueChoices, setPrologueChoices] = useState<PrologueChoices>({
    alias: '',
    treatment: 'Excelentisimo Insolvente',
    reason: 'Evasion de tasas',
    initialDebt: 1000,
    personalItemName: '',
    confession: '',
    seed: ''
  });

  // Minigame states
  const [activeMinigame, setActiveMinigame] = useState<MinigameState | null>(null);
  const [minigameInput, setMinigameInput] = useState('');
  const [minigameTimeLeft, setMinigameTimeLeft] = useState(0);

  // Workshop states
  const [fuseItemAId, setFuseItemAId] = useState<string>('');
  const [fuseItemBId, setFuseItemBId] = useState<string>('');

  // 1. Initial State Load from Local Storage on mount
  useEffect(() => {
    const rehydrated = loadGameState(state);
    dispatch({ type: 'LOAD_SAVE', state: rehydrated });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. State persistence trigger on state updates
  useEffect(() => {
    if (state.status !== 'INTRO' && state.status !== 'DOSSIER_SCREEN' && state.status !== 'PROLOGUE_SCREEN') {
      saveGameState(state);
    }
  }, [state]);

  // 3. Audio Synth start toggle
  useEffect(() => {
    if (state.musicOn && state.status !== 'INTRO' && state.status !== 'DOSSIER_SCREEN' && state.status !== 'PROLOGUE_SCREEN') {
      synth.start(state.volumeMusic);
    } else {
      synth.stop();
    }
  }, [state.musicOn, state.status, state.volumeMusic]);

  // 4. Volume change sync
  useEffect(() => {
    if (state.musicOn) {
      synth.setVolume(state.volumeMusic);
    }
  }, [state.volumeMusic, state.musicOn]);

  // 5. Play sound effects on screen states
  useEffect(() => {
    if (state.status === 'BANKRUPTCY') {
      synth.playBankruptcyScreech();
      if (state.voiceOn) {
        const rng = createRNG(state.seed + state.turnCount);
        const verdict = generarTasacionFinal(state.inventory, rng);
        speakText(verdict, 'subastador', state.volumeVoice);
      }
    }
  }, [state.status, state.voiceOn, state.volumeVoice, state.seed, state.turnCount, state.inventory]);

  const handleCompleteMinigame = useCallback((isSuccess: boolean) => {
    setActiveMinigame(null);
    dispatch({ type: 'COMPLETE_MINIGAME', success: isSuccess, gameType: activeMinigame?.type || 'firma' });
  }, [activeMinigame]);

  // 6. Minigame timer countdown
  useEffect(() => {
    if (!activeMinigame || minigameTimeLeft <= 0) return;
    const interval = setInterval(() => {
      setMinigameTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          handleCompleteMinigame(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeMinigame, minigameTimeLeft, handleCompleteMinigame]);

  const handleStartOnboarding = () => {
    dispatch({ type: 'START_GAME' });
  };

  const handleReset = () => {
    if (window.confirm('¿Declarar nulidad del remate y reiniciar todos tus records?')) {
      clearAllLocalData();
      dispatch({ type: 'RESET_GAME' });
    }
  };

  const handleNextTurn = () => {
    dispatch({ type: 'NEXT_LOT' });
  };

  const handleStartMinigame = (type: 'firma' | 'timbre' | 'tasacion') => {
    const game = startMinigame(type, state.seed + state.turnCount);
    setActiveMinigame(game);
    setMinigameTimeLeft(game.timeLeft);
    setMinigameInput('');
  };


  const handleMinigameSubmit = () => {
    if (!activeMinigame) return;
    if (activeMinigame.type === 'firma') {
      const match = minigameInput.trim() === activeMinigame.answer;
      handleCompleteMinigame(match);
    } else if (activeMinigame.type === 'tasacion') {
      const val = Number(minigameInput);
      const answerVal = Number(activeMinigame.answer);
      const diff = Math.abs(val - answerVal);
      handleCompleteMinigame(diff <= 200);
    }
  };

  const achievements = getUnlockedAchievements(state);

  // Derive evaluation text for ending during render
  const campaignEnding = (state.status === 'FINAL_APPRAISAL' || state.status === 'BANKRUPTCY') ? getCampaignEnding(state) : null;

  // --- RENDERING SCENE INTRO ---
  if (state.status === 'INTRO') {
    return (
      <div className="intro-container">
        <h1 className="game-title">Remates del Caos</h1>
        <p className="game-subtitle">Adjudicado al Peor Postor</p>
        <p className="intro-desc" style={{ marginTop: '20px' }}>
          Tienes diez mil pesos, ningun criterio y una silla reservada en el subsuelo clandestino de 
          <strong> Mortaja, Martillo & Cia</strong>.
          <br /><br />
          Pujar por reliquias inutiles contra otros postores corruptos, esquivar maldiciones y saldar 
          tus deudas con Don Sanguino antes de quedar en bancarrota es tu unica salvacion.
        </p>

        <button className="btn-gothic btn-large" onClick={handleStartOnboarding}>
          Abrir las puertas del salon
        </button>

        <div style={{ marginTop: '30px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          Al abrir el salon autorizas el uso de sonido sintetizado en el navegador.
        </div>
      </div>
    );
  }

  if (state.status === 'DOSSIER_SCREEN') {
    return (
      <DossierOnboarding
        initialSeed={state.seed}
        onComplete={(dossier, traces, seed) => dispatch({ type: 'SUBMIT_DOSSIER', dossier, traces, seed })}
      />
    );
  }

  // --- RENDERING SCENE PROLOGUE (ONBOARDING) ---
  if (state.status === 'PROLOGUE_SCREEN') {
    return (
      <div className="game-container" style={{ maxWidth: '700px', margin: '4vh auto' }}>
        <div className="panel-header">◈ PROLOGO: LA INVITACION INCORRECTA ◈</div>
        <div className="lot-deck" style={{ borderColor: 'var(--color-gold)' }}>
          <p className="lot-desc" style={{ fontStyle: 'italic', fontSize: '0.95rem' }}>
            Llega a tus manos una correspondencia lacrada dirigida al Marques del Embargo...
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
            <div className="settings-row">
              <label>Alias/Nombre:</label>
              <input
                type="text"
                className="bid-num-input"
                style={{ width: '60%' }}
                placeholder="Ingresa tu nombre..."
                value={prologueChoices.alias}
                onChange={e => setPrologueChoices({ ...prologueChoices, alias: e.target.value })}
              />
            </div>

            <div className="settings-row">
              <label>Tratamiento Pomposo:</label>
              <select
                className="npc-select"
                style={{ width: '60%' }}
                value={prologueChoices.treatment}
                onChange={e => setPrologueChoices({ ...prologueChoices, treatment: e.target.value })}
              >
                <option value="Excelentisimo Insolvente">Excelentísimo Insolvente</option>
                <option value="Viuda Fiscal">Viuda Fiscal</option>
                <option value="Baron del Pago Minimo">Barón del Pago Mínimo</option>
                <option value="Heredero por Error">Heredero por Error</option>
                <option value="Acreedor Sentimental">Acreedor Sentimental</option>
                <option value="Persona Natural Sospechosa">Persona Natural Sospechosa</option>
              </select>
            </div>

            <div className="settings-row">
              <label>Motivo de Asistencia:</label>
              <select
                className="npc-select"
                style={{ width: '60%' }}
                value={prologueChoices.reason}
                onChange={e => setPrologueChoices({ ...prologueChoices, reason: e.target.value })}
              >
                <option value="Evasion de tasas">Huir de las tasas aduaneras</option>
                <option value="Perdida de dignidad">Comprar reliquias rotas</option>
                <option value="Lavado de reliquias">Lavado de bienes y herencias</option>
                <option value="Criterio nulo">Por pura curiosidad masoquista</option>
              </select>
            </div>

            <div className="settings-row">
              <label>Deuda Inicial (+ Presupuesto):</label>
              <input
                type="range"
                className="volume-slider"
                min="0"
                max="3000"
                step="500"
                value={prologueChoices.initialDebt}
                onChange={e => setPrologueChoices({ ...prologueChoices, initialDebt: Number(e.target.value) })}
              />
              <span style={{ color: 'var(--color-gold)' }}>${prologueChoices.initialDebt} pesos</span>
            </div>

            <div className="settings-row">
              <label>Objeto Ridiculo:</label>
              <input
                type="text"
                className="bid-num-input"
                style={{ width: '60%' }}
                placeholder="ej: Un calcetin con papas..."
                value={prologueChoices.personalItemName}
                onChange={e => setPrologueChoices({ ...prologueChoices, personalItemName: e.target.value })}
              />
            </div>

            <div className="settings-row">
              <label>Confesion Inicial:</label>
              <input
                type="text"
                className="bid-num-input"
                style={{ width: '60%' }}
                placeholder="ej: Le robe el libro mayor a mi jefe..."
                value={prologueChoices.confession}
                onChange={e => setPrologueChoices({ ...prologueChoices, confession: e.target.value })}
              />
            </div>

            <div className="settings-row">
              <label>Formato de Campaña:</label>
              <select
                className="npc-select"
                style={{ width: '60%' }}
                value={state.campaign.mode}
                onChange={e => dispatch({ type: 'SET_CAMPAIGN_MODE', mode: e.target.value as CampaignMode })}
              >
                <option value="breve">Remate Breve (6 lotes, 2 actos, 2 jefes)</option>
                <option value="completa">Noche Completa (13 lotes, 5 actos, 5 jefes)</option>
                <option value="infinita">Remate Interminable (jefes y periódicos cíclicos)</option>
              </select>
            </div>

            <div className="settings-row daily-toggle-row">
              <label className="checkbox-line">
                <input
                  type="checkbox"
                  checked={state.campaign.daysChallenge}
                  onChange={(event) => dispatch({ type: 'SET_DAILY_CHALLENGE', enabled: event.target.checked })}
                />
                Activar Remate del Día · misma semilla y desgracia para todos
              </label>
            </div>

            {state.campaign.daysChallenge && state.campaign.dailyChallenge && (
              <div className="daily-preview">
                <strong>{state.campaign.dailyChallenge.label}</strong>
                <span>{state.campaign.dailyChallenge.description}</span>
                <small>{state.campaign.dailyChallenge.rule} · {state.campaign.dailyChallenge.date} UTC</small>
              </div>
            )}

            <div className="settings-row">
              <label>Semilla de partida (Opcional):</label>
              <input
                type="text"
                className="bid-num-input"
                style={{ width: '60%' }}
                placeholder={state.campaign.daysChallenge ? 'Determinada por el calendario fiscal' : 'Aleatoria...'}
                value={state.campaign.daysChallenge ? (state.campaign.dailyChallenge?.seed || '') : prologueChoices.seed}
                disabled={state.campaign.daysChallenge}
                onChange={e => setPrologueChoices({ ...prologueChoices, seed: e.target.value })}
              />
            </div>
          </div>

          <button
            className="btn-gothic btn-large"
            style={{ marginTop: '30px', width: '100%' }}
            onClick={() => dispatch({ type: 'SUBMIT_PROLOGUE', choices: { ...prologueChoices, seed: prologueChoices.seed || Math.random().toString(36).substring(2, 9) } })}
          >
            Firmar la fianza e ingresar al Salón
          </button>
        </div>
      </div>
    );
  }

  if (state.status === 'OMEN_SCREEN') {
    return (
      <OmenSelection
        omens={state.campaign.omenChoices}
        alias={state.dossier.alias}
        onChoose={(omenId) => dispatch({ type: 'CHOOSE_OMEN', omenId })}
      />
    );
  }

  if (state.status === 'BARGAIN_SCREEN') {
    return (
      <HouseBargainScene
        bargains={state.campaign.pendingBargains}
        hunger={state.campaign.houseHunger}
        alias={state.dossier.alias}
        onAccept={(bargainId) => dispatch({ type: 'ACCEPT_HOUSE_BARGAIN', bargainId })}
        onDecline={() => dispatch({ type: 'DECLINE_HOUSE_BARGAINS' })}
      />
    );
  }

  if (state.status === 'ANOMALY_SCREEN' && state.campaign.delirium.currentAnomaly) {
    return (
      <AnomalyScene
        anomaly={state.campaign.delirium.currentAnomaly}
        normalityResidual={state.campaign.delirium.normalityResidual}
        onChoose={(choiceId) => dispatch({ type: 'RESOLVE_ANOMALY', choiceId })}
      />
    );
  }

  if (state.status === 'INTERMISSION') {
    return (
      <main className="intermission-screen">
        <section className="paper-panel intermission-card">
          <p className="eyebrow">PRECEDENTE INCORPORADO AL EXPEDIENTE</p>
          <h1>La casa reanuda operaciones</h1>
          <p>{state.dialogueBubble?.text || 'El salón recoloca sus paredes y continúa como si nada hubiera ocurrido.'}</p>
          <div className="normality-gauge">
            <span>Normalidad residual</span>
            <div><i style={{ width: `${state.campaign.delirium.normalityResidual}%` }} /></div>
            <strong>{state.campaign.delirium.normalityResidual}%</strong>
          </div>
          <button type="button" className="btn-gothic btn-large" onClick={handleNextTurn}>
            Volver al remate antes de que cambie de opinión
          </button>
        </section>
      </main>
    );
  }

  // --- RENDERING SCENE NEWSPAPER_SCREEN ---
  if (state.status === 'NEWSPAPER_SCREEN') {
    return (
      <div className="game-container" style={{ maxWidth: '600px', margin: '6vh auto' }}>
        <div className="panel-header" style={{ color: 'var(--color-text)', borderBottom: '2px double var(--color-text-muted)' }}>
          ◈ EL AVALUO NACIONAL ◈
        </div>
        <div className="lot-deck" style={{ background: '#1c1b18', color: '#1a1a1a', border: '3px solid #332d20', padding: '30px' }}>
          <h2 style={{ fontFamily: 'var(--font-gothic)', textAlign: 'center', fontSize: '1.7rem', color: '#000', margin: '15px 0' }}>
            {state.campaign.newspaperHeadline || 'CONTINÚAN LAS SUBASAS EN EL TEATRO'}
          </h2>
          <hr style={{ borderColor: '#000' }} />
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#222', fontStyle: 'serif' }}>
            {state.campaign.newspaperText || 'Las deudas crecen en el sumidero subterráneo a medida que caen las ofertas.'}
          </p>
          <hr style={{ borderColor: '#000' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#555', marginTop: '10px' }}>
            <span>Acto Actual: {state.campaign.act}</span>
            <span>Semilla: {state.seed}</span>
          </div>

          <div className="newspaper-actions">
            <button className="btn-gothic" onClick={() => downloadNewspaperEdition(state)}>
              Emitir portada PNG
            </button>
            <button
              className="btn-gothic"
              onClick={async () => {
                try {
                  const copied = await copyNewspaperEdition(state);
                  setCopyNotice(copied ? 'Portada copiada sin confesiones crudas.' : 'El portapapeles rechazó la edición.');
                } catch {
                  setCopyNotice('El portapapeles exigió derecho a réplica.');
                }
              }}
            >
              Copiar edición
            </button>
            <button
              className="btn-gothic btn-large"
              style={{ background: '#332d20', color: '#f5f0e1' }}
              onClick={() => dispatch({ type: 'DISMISS_NEWSPAPER' })}
            >
              Leer y doblar el periódico
            </button>
          </div>
          {copyNotice && <p className="copy-notice" aria-live="polite">{copyNotice}</p>}
        </div>
      </div>
    );
  }

  // --- RENDERING SCENE EVENT_SCREEN ---
  if (state.status === 'EVENT_SCREEN') {
    const activeEvent = selectNarrativeEvent(state, createRNG(state.seed + state.turnCount));

    return (
      <div className="game-container" style={{ maxWidth: '600px', margin: '8vh auto' }}>
        <div className="panel-header">{activeEvent.title}</div>
        <div className="lot-deck" style={{ borderColor: 'var(--color-gold)' }}>
          <p className="lot-desc" style={{ fontSize: '1.1rem' }}>
            {activeEvent.description}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' }}>
            {activeEvent.options.map((opt, i) => (
              <button
                key={i}
                className="btn-gothic btn-large"
                style={{ textAlign: 'left', fontSize: '0.95rem' }}
                onClick={() => dispatch({ type: 'SELECT_EVENT_OPTION', eventId: activeEvent.id, optionId: opt.id })}
              >
                ◈ {opt.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- RENDERING SCENE TALLER_SCREEN ---
  if (state.status === 'TALLER_SCREEN') {
    return (
      <div className="game-container" style={{ maxWidth: '700px', margin: '4vh auto' }}>
        <div className="panel-header">◈ RESTAURACIONES SAN EXPEDITO ◈</div>
        <div className="lot-deck" style={{ borderColor: 'var(--color-gold)' }}>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <p className="lot-desc">
                <strong>Maese Engrudo</strong> te saluda mascando cola fria seca:
                "Falsifico, restauro y remiendo basuras conceptuales. Traeme dos objetos si quieres hacer una fusion."
              </p>
              {state.dialogueBubble && state.dialogueBubble.character === 'engrudo' && (
                <p style={{ color: 'var(--color-gold)', fontStyle: 'italic' }}>
                  "{state.dialogueBubble.text}"
                </p>
              )}
            </div>
          </div>

          <div style={{ border: '1px solid rgba(212, 175, 55, 0.2)', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
            <h3 style={{ color: 'var(--color-gold)', fontSize: '0.9rem', marginBottom: '10px' }}>◈ FUSION CLANDESTINA ◈</h3>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <select className="npc-select" value={fuseItemAId} onChange={e => setFuseItemAId(e.target.value)}>
                <option value="">Selecciona Item A...</option>
                {state.inventory.map(i => <option key={i.id} value={i.id}>{i.nombre_item}</option>)}
              </select>
              <span>+</span>
              <select className="npc-select" value={fuseItemBId} onChange={e => setFuseItemBId(e.target.value)}>
                <option value="">Selecciona Item B...</option>
                {state.inventory.map(i => <option key={i.id} value={i.id}>{i.nombre_item}</option>)}
              </select>
              <button
                className="btn-gothic-sm"
                onClick={() => {
                  if (fuseItemAId && fuseItemBId) {
                    dispatch({ type: 'FUSE_ITEMS', itemAId: fuseItemAId, itemBId: fuseItemBId });
                    setFuseItemAId('');
                    setFuseItemBId('');
                  }
                }}
              >
                Fusionar ($500)
              </button>
            </div>
          </div>

          <div style={{ border: '1px solid rgba(212, 175, 55, 0.2)', padding: '15px', borderRadius: '5px' }}>
            <h3 style={{ color: 'var(--color-gold)', fontSize: '0.9rem', marginBottom: '10px' }}>◈ MODIFICACIONES ◈</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {state.inventory.map(item => (
                <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span>{item.nombre_item}</span>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button className="btn-gothic-sm" onClick={() => dispatch({ type: 'REPAIR_ITEM', itemId: item.id })}>Reparar ($300)</button>
                    <button className="btn-gothic-sm" onClick={() => dispatch({ type: 'CLEAN_CURSE', itemId: item.id })}>Limpiar ($400)</button>
                    <button className="btn-gothic-sm" onClick={() => dispatch({ type: 'FORGE_CERTIFICATE', itemId: item.id })}>Timbrar Elite ($350)</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <button className="btn-gothic" style={{ marginTop: '20px', width: '100%' }} onClick={() => dispatch({ type: 'NAVIGATE_AREA', area: 'salon' })}>
            Volver al Salón de Subastas
          </button>
        </div>
      </div>
    );
  }

  // --- RENDERING SCENE TRIBUNAL_SCREEN ---
  if (state.status === 'TRIBUNAL_SCREEN') {
    return (
      <div className="game-container" style={{ maxWidth: '600px', margin: '6vh auto' }}>
        <div className="panel-header">◈ TRIBUNAL DE BIENES MORALMENTE INMUEBLES ◈</div>
        <div className="lot-deck" style={{ borderColor: 'var(--color-red)' }}>
          <p className="lot-desc">
            La <strong>Fiscal Serafina Timbre</strong> te mira con desprecio contable sobre su pila de formularios firmados.
          </p>

          <div style={{ margin: '15px 0', padding: '10px', background: 'rgba(255,0,0,0.05)', border: '1px solid var(--color-red)' }}>
            <h3 style={{ color: 'var(--color-red-bright)', fontSize: '0.95rem', marginBottom: '8px' }}>Cargos Registrados:</h3>
            <ul style={{ paddingLeft: '15px' }}>
              <li>Sospecha Fiscal acumulada: {state.campaign.suspicion}%</li>
              {state.campaign.soulSold && <li>Venta de alma sin timbre fiscal autorizado</li>}
              {state.curse > 10 && <li>Contrabando moral agravado</li>}
            </ul>
          </div>

          {activeMinigame ? (
            <div style={{ border: '1px solid var(--color-gold)', padding: '15px', marginTop: '20px' }}>
              <div className="lot-title" style={{ fontSize: '1rem', color: 'var(--color-gold)' }}>MINIJUEGO ACTIVO: LA DEFENSA</div>
              <p style={{ margin: '10px 0' }}>{activeMinigame.prompt}</p>
              <input
                type="text"
                className="bid-num-input"
                style={{ width: '100%', marginBottom: '10px' }}
                value={minigameInput}
                onChange={e => setMinigameInput(e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--color-red-bright)' }}>Tiempo restante: {minigameTimeLeft}s</span>
                <button className="btn-gothic-sm" onClick={handleMinigameSubmit}>Estampar Defensa</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '25px' }}>
              <button className="btn-gothic btn-large" onClick={() => handleStartMinigame('firma')}>
                ◈ Presentar Aval de Firma Rápida (Minijuego Firma)
              </button>
              <button className="btn-gothic btn-large" onClick={() => handleStartMinigame('timbre')}>
                ◈ Absolución por Timbres (Minijuego Timbre)
              </button>
              <button className="btn-gothic btn-large" onClick={() => handleStartMinigame('tasacion')}>
                ◈ Defensa Contable Pericial (Minijuego Tasación)
              </button>
            </div>
          )}

          <button className="btn-gothic" style={{ marginTop: '25px', width: '100%' }} onClick={() => dispatch({ type: 'NAVIGATE_AREA', area: 'salon' })}>
            Volver al Salón de Subastas
          </button>
        </div>
      </div>
    );
  }

  // --- RENDERING SCENE TUNELES_SCREEN ---
  if (state.status === 'TUNELES_SCREEN') {
    return (
      <div className="game-container" style={{ maxWidth: '600px', margin: '6vh auto' }}>
        <div className="panel-header">◈ TÚNELES DEL SUMIDERO ◈</div>
        <div className="lot-deck" style={{ borderColor: 'var(--color-gold)' }}>
          <p className="lot-desc">
            El duque <strong>Sir Roquefort III</strong> se limpia la corona con una pelusa gigante:
            "El abismo tiene mas liquidez de la que tu oficina jamas soñara. ¿Vienes a entregar tu patrimonio moral?"
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' }}>
            <button className="btn-gothic btn-large" onClick={() => dispatch({ type: 'SELL_SOUL' })}>
              ◈ Ceder el alma y extinguir todas tus deudas
            </button>
          </div>

          <button className="btn-gothic" style={{ marginTop: '25px', width: '100%' }} onClick={() => dispatch({ type: 'NAVIGATE_AREA', area: 'salon' })}>
            Volver al Salón de Subastas
          </button>
        </div>
      </div>
    );
  }

  // --- RENDERING SCENE BANKRUPTCY & FINAL APPRAISAL (CAMPAIGN ENDINGS) ---
  if (state.status === 'BANKRUPTCY' || state.status === 'FINAL_APPRAISAL') {
    return (
      <div className="game-container" style={{ maxWidth: '800px', margin: '5vh auto' }}>
        <div className="game-title-container">
          <h1 className="game-title" style={{ color: state.status === 'BANKRUPTCY' ? 'var(--color-red-bright)' : 'var(--color-gold)' }}>
            {state.status === 'BANKRUPTCY' ? '◈ BANCARROTA ABSOLUTA ◈' : '◈ EL AMANECER DEL REMATE ◈'}
          </h1>
          <p className="game-subtitle">Fin del Remate Clandestino</p>
        </div>

        <div className="lot-deck" style={{ borderColor: 'var(--color-gold)', boxShadow: '0 0 25px rgba(212, 175, 55, 0.25)' }}>
          <div className="lot-title" style={{ color: 'var(--color-gold)', borderColor: 'rgba(212, 175, 55, 0.2)' }}>
            {campaignEnding?.title || 'Veredicto de Liquidacion Forzosa'}
          </div>
          <p className="lot-desc" style={{ fontSize: '1.15rem', color: 'var(--color-text)' }}>
            "{campaignEnding?.description || 'Bancarrota absoluta registrada.'}"

          </p>
        </div>

        <div className="dashboard-metrics" style={{ marginBottom: '25px' }}>
          <div className="metric-card">
            <div className="metric-label">Lotes Adquiridos</div>
            <div className="metric-val">{state.inventory.length}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Presupuesto final</div>
            <div className="metric-val" style={{ color: 'var(--color-gold)' }}>
              ${state.budget.toLocaleString()}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Prestigio</div>
            <div className="metric-val">{state.prestige} ◈</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Maldicion</div>
            <div className="metric-val">{state.curse} ✥</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Compostura</div>
            <div className="metric-val">{state.campaign.composure}%</div>
          </div>
        </div>

        <Inventory
          inventory={state.inventory}
          onSellItem={() => {}}
          debt={state.debt}
        />

        <div className="ending-acta-preview">
          <h3>Últimos precedentes de la noche</h3>
          {state.campaign.storyLog.slice(-3).reverse().map((beat) => (
            <article key={beat.id}>
              <strong>{beat.title}</strong>
              <span>{beat.text}</span>
            </article>
          ))}
          <small>Semilla de la pesadilla: {state.seed}</small>
        </div>

        <div style={{ marginTop: '25px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button className="btn-gothic" onClick={() => setShowStoryLedger(true)}>
            Abrir Libro de Actas Completo
          </button>
          <button
            className="btn-gothic"
            onClick={() => campaignEnding && downloadRunCertificate(state, campaignEnding)}
          >
            Emitir certificado de ruina · PNG
          </button>
          <button
            className="btn-gothic"
            onClick={async () => {
              if (!campaignEnding) return;
              try {
                const copied = await copyRunSummary(state, campaignEnding);
                setCopyNotice(copied ? 'Acta copiada sin confesiones privadas.' : 'El portapapeles rechazó la diligencia.');
              } catch {
                setCopyNotice('El portapapeles se declaró fuera de jurisdicción.');
              }
            }}
          >
            Copiar acta compartible
          </button>
          <button className="btn-gothic btn-large" onClick={handleReset}>
            Volver a Entrar al Salon (Reiniciar)
          </button>
        </div>
        {copyNotice && <p className="copy-notice" aria-live="polite">{copyNotice}</p>}
        {showStoryLedger && (
          <StoryLedger entries={state.campaign.storyLog} onClose={() => setShowStoryLedger(false)} />
        )}
      </div>
    );
  }

  // --- RENDERING MAIN ACTIVE GAMEPLAY SCENE ---
  return (
    <div className={`game-container reality-${state.campaign.delirium.normalityResidual <= 20 ? 'liquidated' : state.campaign.delirium.normalityResidual <= 55 ? 'unstable' : 'licensed'} curse-${Math.min(4, Math.floor(state.curse / 5))}`}>
      <div className="game-title-container">
        <h1 className="game-title">Mortaja, Martillo & Cía.</h1>
        <p className="game-subtitle">
          {getPlayerEpithet(state)}<br />
          Acto Actual: {state.campaign.act} | {state.campaign.mode === 'breve' ? 'Remate Breve' : state.campaign.mode === 'completa' ? 'Noche Completa' : 'Remate Interminable'}
        </p>
      </div>

      {state.campaign.daysChallenge && state.campaign.dailyChallenge && (
        <section className="daily-challenge-banner" aria-label="Remate del día activo">
          <span>REMATE DEL DÍA · {state.campaign.dailyChallenge.date} UTC</span>
          <strong>{state.campaign.dailyChallenge.label}</strong>
          <p>{state.campaign.dailyChallenge.description}</p>
          <small>{state.campaign.dailyChallenge.rule}</small>
        </section>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-gothic-sm" onClick={() => setShowHelp(!showHelp)}>
            Ayuda/Reglas
          </button>
          <button className="btn-gothic-sm" onClick={() => setShowAchievements(!showAchievements)}>
            Logros ({achievements.length})
          </button>
          <button className="btn-gothic-sm" onClick={() => setShowDossier(true)}>
            Mi Expediente
          </button>
          <button className="btn-gothic-sm" onClick={() => setShowStoryLedger(true)}>
            Libro de Actas ({state.campaign.storyLog.length})
          </button>
        </div>
        <button className="btn-gothic-sm btn-red" onClick={handleReset}>
          Reiniciar
        </button>
      </div>

      <div className="dashboard-metrics">
        <div className="metric-card">
          <div className="metric-label">Presupuesto/Liquidez</div>
          <div className="metric-val" style={{ color: 'var(--color-gold)' }}>
            ${state.budget.toLocaleString()}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Deuda Total</div>
          <div className="metric-val" style={{ color: 'var(--color-red-bright)' }}>
            ${state.debt.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '3px' }}>
            B: ${state.campaign.debtSplits.bancaria} | S: ${state.campaign.debtSplits.sanguino} | E: ${state.campaign.debtSplits.espectral}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Prestigio</div>
          <div className="metric-val">{state.prestige} ◈</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Maldición</div>
          <div className="metric-val" style={{ color: 'var(--color-red)' }}>{state.curse} ✥</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Compostura</div>
          <div className="metric-val">{state.campaign.composure}%</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Sospecha Fiscal</div>
          <div className="metric-val">{state.campaign.suspicion}%</div>
        </div>
        <div className="metric-card normality-card">
          <div className="metric-label">Normalidad Residual</div>
          <div className="metric-val">{state.campaign.delirium.normalityResidual}%</div>
          <small>{state.campaign.delirium.activeRealityRule || 'La realidad conserva licencia provisional'}</small>
        </div>
        <button type="button" className="metric-card ritual-card ritual-card-button" onClick={() => setShowRitualArchive(true)}>
          <div className="metric-label">Rituales Descubiertos</div>
          <div className="metric-val">{state.campaign.discoveredRituals.length} ◌</div>
          <small>{state.campaign.discoveredRituals.length ? 'Abrir catálogo de delitos litúrgicos.' : 'Consultar indicios bajo sello.'}</small>
        </button>
        <div className="metric-card format-card">
          <div className="metric-label">Reglamento de Puja</div>
          <div className="metric-val metric-format">{state.campaign.auctionFormat.name}</div>
          <small>{state.campaign.auctionFormat.currency}</small>
        </div>
      </div>

      {/* Point & Click Area Navigation Bar */}
      <div className="poi-navigation-bar" style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '20px 0', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', paddingBottom: '15px' }}>
        <button className="btn-gothic-sm active" onClick={() => dispatch({ type: 'NAVIGATE_AREA', area: 'salon' })}>◈ Salón de Pujas</button>
        <button className="btn-gothic-sm" onClick={() => dispatch({ type: 'NAVIGATE_AREA', area: 'taller' })}>◈ Taller Clandestino</button>
        <button className="btn-gothic-sm" onClick={() => dispatch({ type: 'NAVIGATE_AREA', area: 'tribunal' })}>◈ Tribunal de Bienes</button>
        <button className="btn-gothic-sm" onClick={() => dispatch({ type: 'NAVIGATE_AREA', area: 'tuneles' })}>◈ Túneles del Sumidero</button>
      </div>

      {showHelp && (
        <div className="help-box" style={{ border: '1px solid var(--color-gold)', padding: '20px', marginBottom: '20px', background: '#0e0d0a', borderRadius: '6px', boxShadow: '0 4px 20px rgba(0,0,0,0.9)' }}>
          <h3 style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-gothic)', textAlign: 'center', marginTop: 0, borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '10px' }}>
            ◈ GUÍA Y REGLAMENTO DEL SUBSUELO ◈
          </h3>
          
          <div className="help-tabs" style={{ display: 'flex', gap: '5px', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
            <button className={`btn-gothic-sm ${helpTab === 'concepts' ? 'active' : ''}`} style={{ flex: 1, fontSize: '0.72rem' }} onClick={() => setHelpTab('concepts')}>1. Conceptos y Métricas</button>
            <button className={`btn-gothic-sm ${helpTab === 'modes' ? 'active' : ''}`} style={{ flex: 1, fontSize: '0.72rem' }} onClick={() => setHelpTab('modes')}>2. Modos de Juego</button>
            <button className={`btn-gothic-sm ${helpTab === 'loop' ? 'active' : ''}`} style={{ flex: 1, fontSize: '0.72rem' }} onClick={() => setHelpTab('loop')}>3. Mecánica y Áreas</button>
          </div>

          <div className="help-tab-content" style={{ fontSize: '0.85rem', lineHeight: '1.6', color: 'var(--color-text-primary)' }}>
            {helpTab === 'concepts' && (
              <div>
                <strong style={{ color: 'var(--color-gold)' }}>• Presupuesto (Liquidez):</strong> Tu dinero para pujar. Si se acaba y tienes deudas al finalizar el acto, quebrarás. Evita quedar en $0.<br />
                <strong style={{ color: 'var(--color-red-bright)' }}>• Deuda Total:</strong> Dinero prestado por Don Sanguino o bancos. Si supera los <span style={{ color: 'var(--color-red-bright)', fontWeight: 'bold' }}>$5.000</span>, el panel de subastas se bloqueará con un pagaré hasta que abones dinero para reducir la deuda por debajo de ese umbral.<br />
                <strong style={{ color: 'var(--color-gold)' }}>• Prestigio:</strong> Reputación en el salón. Se gana ganando subastas valiosas o resolviendo eventos. Sirve para algunas transacciones avanzadas.<br />
                <strong style={{ color: 'var(--color-red)' }}>• Maldición (✥):</strong> Aumenta con objetos malditos. Si es muy alta, corrompe la realidad provocando anomalías y distorsiones extremas.<br />
                <strong style={{ color: 'var(--color-gold)' }}>• Compostura:</strong> Tu salud mental. Puedes liquidarla en contratos con la casa, pero si llega al 0% serás expulsado por histeria.<br />
                <strong style={{ color: 'var(--color-red-bright)' }}>• Sospecha Fiscal:</strong> Nivel de vigilancia de la Fiscal. Se reduce superando minijuegos de defensa en el Tribunal. Si llega a 100%, serás auditado.
              </div>
            )}

            {helpTab === 'modes' && (
              <div>
                <strong style={{ color: 'var(--color-gold)' }}>• Remate Breve:</strong> Ideal para aprender las mecánicas del juego de forma rápida (consta de 6 lotes distribuidos en 2 actos, con 2 enfrentamientos de jefes).<br />
                <strong style={{ color: 'var(--color-gold)' }}>• Noche Completa:</strong> La experiencia de campaña equilibrada estándar (consta de 13 lotes a lo largo de 5 actos, con 5 jefes y fluctuaciones de periódicos).<br />
                <strong style={{ color: 'var(--color-gold)' }}>• Remate Interminable:</strong> Un modo de resistencia cíclico. Jefes, portadas de prensa y subastas se repiten infinitamente hasta que la realidad o tu saldo colapsen.<br />
                <strong style={{ color: 'var(--color-gold)' }}>• Remate del Día (Desafío Diario):</strong> Se activa marcando la casilla en el prólogo. Usa una semilla común y modificadores fijos basados en el calendario UTC para comparar tu desempeño diario con otros insolventes de forma offline.
              </div>
            )}

            {helpTab === 'loop' && (
              <div>
                <strong style={{ color: 'var(--color-gold)' }}>• Subasta en Tiempo Real:</strong> Debes pujar más que tus oponentes. Los rivales tienen tics y rencores; si los presionas mucho, pujarán agresivamente. Puedes usar **Maniobras** (sabotear, filtrar tasaciones) gastando influencia o fragmentos de alma.<br />
                <strong style={{ color: 'var(--color-gold)' }}>• Confesionario (Chat):</strong> Envía declaraciones escritas a los personajes de la izquierda. Si escribes sobre palabras clave (dinero, deuda, secreto, alma, muerte, jefe), te darán respuestas contextuales para conocer sus debilidades y secretos.<br />
                <strong style={{ color: 'var(--color-gold)' }}>• Áreas de Navegación:</strong> Usa la barra de puntos de interés:<br />
                &nbsp;&nbsp;<em>- Taller Clandestino:</em> Fusiona dos objetos para crear reliquias únicas o límpialos de maldición.<br />
                &nbsp;&nbsp;<em>- Tribunal de Bienes:</em> Resuelve minijuegos (escribir firmas veloces, calcular tasaciones) para anular sospecha fiscal.<br />
                &nbsp;&nbsp;<em>- Túneles del Sumidero:</em> Visita a Sir Roquefort para ceder tu alma a cambio de extinguir todas tus deudas.
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px', borderTop: '1px solid rgba(212,175,55,0.1)', paddingTop: '10px' }}>
            <button className="btn-gothic-sm" onClick={() => setShowHelp(false)}>
              Entendido
            </button>
          </div>
        </div>
      )}

      {showAchievements && (
        <div className="help-box" style={{ border: '1px solid var(--color-gold)', padding: '15px', marginBottom: '20px' }}>
          <div className="panel-header" style={{ fontSize: '0.95rem' }}>🏆 Logros Desbloqueados 🏆</div>
          {achievements.length === 0 ? (
            <div style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
              Ningún logro desbloqueado todavía. Sigue acumulando deudas y maldiciones.
            </div>
          ) : (
            <ul className="achievement-list">
              {achievements.map((ach, i) => (
                <li key={i} className="achievement-item">
                  ◈ {ach}
                </li>
              ))}
            </ul>
          )}
          <button className="btn-gothic-sm" style={{ marginTop: '10px', width: '100%' }} onClick={() => setShowAchievements(false)}>
            Cerrar Panel
          </button>
        </div>
      )}

      {state.campaign.delirium.microEvent && (
        <aside className="micro-event" aria-live="polite">
          <span>◌</span>
          <p>{state.campaign.delirium.microEvent}</p>
        </aside>
      )}

      {showStoryLedger && (
        <StoryLedger entries={state.campaign.storyLog} onClose={() => setShowStoryLedger(false)} />
      )}

      {showRitualArchive && (
        <RitualArchive discovered={state.campaign.discoveredRituals} onClose={() => setShowRitualArchive(false)} />
      )}

      {showDossier && (
        <DossierPanel
          dossier={state.dossier}
          traces={state.dossierTraces}
          motifs={state.campaign.delirium.motifs}
          normalityResidual={state.campaign.delirium.normalityResidual}
          onDeleteField={(field) => dispatch({ type: 'DELETE_DOSSIER_FIELD', field })}
          onClose={() => setShowDossier(false)}
        />
      )}

      <div className="game-layout">
        <div>
          <ChatRoom state={state} dispatch={dispatch} />

          <div className="settings-box">
            <div style={{ fontFamily: 'var(--font-gothic)', color: 'var(--color-gold)', fontSize: '0.85rem', borderBottom: '1px solid rgba(212, 175, 55, 0.1)', paddingBottom: '5px', marginBottom: '8px' }}>
              ◈ Opciones del Salón ◈
            </div>
            <div className="settings-row">
              <label>Música de fondo:</label>
              <input
                type="checkbox"
                checked={state.musicOn}
                onChange={() => dispatch({ type: 'TOGGLE_MUSIC' })}
              />
            </div>
            <div className="settings-row">
              <label>Volumen música:</label>
              <input
                type="range"
                className="volume-slider"
                min="0"
                max="1"
                step="0.1"
                value={state.volumeMusic}
                onChange={(e) => dispatch({ type: 'SET_VOLUME_MUSIC', val: Number(e.target.value) })}
              />
            </div>
            <div className="settings-row">
              <label>Voces TTS:</label>
              <input
                type="checkbox"
                checked={state.voiceOn}
                onChange={() => dispatch({ type: 'TOGGLE_VOICE' })}
              />
            </div>
            <div className="settings-row">
              <label>Volumen voces:</label>
              <input
                type="range"
                className="volume-slider"
                min="0"
                max="1"
                step="0.1"
                value={state.volumeVoice}
                onChange={(e) => dispatch({ type: 'SET_VOLUME_VOICE', val: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {(state.status === 'LOT_WON' || state.status === 'LOT_LOST') ? (
            <div className="panel-right">
              <div className="lot-deck" style={{ borderColor: state.status === 'LOT_WON' ? 'var(--color-gold)' : 'var(--color-red)' }}>
                <div className="lot-title" style={{ color: state.status === 'LOT_WON' ? 'var(--color-gold)' : 'var(--color-red-bright)' }}>
                  {state.status === 'LOT_WON' ? '◈ Lote Adjudicado ◈' : '◈ Lote Perdido ◈'}
                </div>
                
                {state.dialogueBubble && (
                  <p className="lot-desc" style={{ fontStyle: 'italic', fontSize: '1.15rem' }}>
                    "{state.dialogueBubble.text}"
                  </p>
                )}

                <button className="btn-gothic btn-large" onClick={handleNextTurn}>
                  Continuar al Siguiente Lote
                </button>
              </div>
            </div>
          ) : (
            <Saloon key={state.currentLot ? state.currentLot.id : 'no-lot'} state={state} dispatch={dispatch} />
          )}

          <Inventory
            inventory={state.inventory}
            onSellItem={(itemId) => dispatch({ type: 'SELL_ITEM', itemId })}
            onHearPetition={(itemId) => dispatch({ type: 'HEAR_OBJECT_PETITION', itemId })}
            debt={state.debt}
          />
        </div>
      </div>
    </div>
  );
};
export default App;
