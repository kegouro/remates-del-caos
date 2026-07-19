import React, { useEffect, useState } from 'react';
import type { GameState } from '../game/types';
import type { GameAction } from '../game/state/store';
import { simulateNextAuctionStep } from '../game/engine/auction';

import { createRNG } from '../game/generators/lotGenerator';
import { speakText } from '../audio/tts';
import { synth } from '../audio/synth';
import { DebtPaper } from './DebtPaper';
import { formatAuctionAmount, getAuctionCapacity, getAuctionCurrencyLabel } from '../game/campaign/auctionFormats';
import { getOmenProgress } from '../game/campaign/omens';
import { CORE_CHARACTERS, isCharacterId } from '../game/campaign/characters';

interface SaloonProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export const Saloon: React.FC<SaloonProps> = ({ state, dispatch }) => {
  const [countdown, setCountdown] = useState<number>(3);
  const [userInputBid, setUserInputBid] = useState<number | null>(null);

  const lot = state.currentLot;
  const auctionFormat = state.campaign.auctionFormat;
  const bidCapacity = getAuctionCapacity(state);
  const lotIsSealed = Boolean(lot && auctionFormat.hidesLot && (state.status === 'LOT_REVEAL' || state.status === 'BIDDING'));
  const displayAmount = (amount: number) => formatAuctionAmount(auctionFormat, amount);

  // Calculate bid increment dynamically on render
  const bidIncrement = lot 
    ? Math.round(Math.max(100, Math.floor(lot.puja_inicial * 0.1)) / 50) * 50 
    : 100;

  // Resolve custom bid value on render
  const activeCustomBid = userInputBid !== null 
    ? userInputBid 
    : state.activeBid + bidIncrement;
  const activeOmen = state.campaign.chosenOmen;
  const omenProgress = activeOmen ? getOmenProgress(state, activeOmen) : null;
  const dialogueSpeaker = state.dialogueBubble
    ? (isCharacterId(state.dialogueBubble.character)
      ? CORE_CHARACTERS[state.dialogueBubble.character].name
      : state.dialogueBubble.character)
    : '';

  // AI Bidding Timer Loop
  useEffect(() => {
    if (state.status !== 'BIDDING' || !state.biddingActive) return;

    const interval = setInterval(() => {
      const rng = createRNG(state.seed + state.turnCount + state.bidsLog.length);
      const action = simulateNextAuctionStep(state, rng);

      if (action.type === 'RIVAL_BID' && action.bidderName && action.amount) {
        dispatch({
          type: 'RIVAL_BID',
          bidderName: action.bidderName,
          amount: action.amount
        });
        synth.playGavelKnock();
        setCountdown(3); // Reset countdown on new bid
      } else {
        // Decrement countdown if no new bids are placed
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            synth.playGavelKnock();
            dispatch({ type: 'RESOLVE_LOT' });
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1800);

    return () => clearInterval(interval);
  }, [state, dispatch]);

  // Speech triggers for subastador dialogue bubbles
  useEffect(() => {
    if (state.dialogueBubble && state.voiceOn) {
      speakText(state.dialogueBubble.text, state.dialogueBubble.character, state.volumeVoice);
    }
  }, [state.dialogueBubble, state.voiceOn, state.volumeVoice]);

  const handleStartAuction = () => {
    dispatch({ type: 'PLAYER_BID', amount: state.activeBid });
    setCountdown(3);
  };

  const handleBid = () => {
    if (activeCustomBid > bidCapacity) return;
    dispatch({ type: 'PLAYER_BID', amount: activeCustomBid });
    setUserInputBid(null); // Reset local input after bidding
    setCountdown(3);
  };

  const handlePass = () => {
    dispatch({ type: 'PASS_LOT' });
  };

  const handleLoan = () => {
    dispatch({ type: 'REQUEST_LOAN' });
  };

  const handlePayLoan = () => {
    dispatch({ type: 'PAY_LOAN', amount: state.budget });
  };

  const handleSellSoul = () => {
    dispatch({ type: 'SELL_SOUL' });
  };

  const handleAuctionTrick = (trick: 'appraise' | 'scandal' | 'rewrite') => {
    dispatch({ type: 'USE_AUCTION_TRICK', trick });
  };

  const handleCloseDialogue = () => {
    dispatch({ type: 'CLEAR_DIALOGUE' });
  };

  return (
    <div className="panel-right">
      {/* Metrics Dashboard */}
      <div className="dashboard-metrics">
        <div className="metric-card">
          <div className="metric-label">Liquidez</div>
          <div className="metric-val">${state.budget.toLocaleString()}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Deuda Acumulada</div>
          <div className={`metric-val ${state.debt > 0 ? 'debt-alert' : ''}`}>
            ${state.debt.toLocaleString()}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Prestigio Fraudulento</div>
          <div className="metric-val">{state.prestige} ◈</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Maldicion Patrimonial</div>
          <div className="metric-val">{state.curse} ✥</div>
        </div>
      </div>

      <section className="salon-pulse" aria-label="Pulso del salón">
        <div>
          <span>Ánimo del público</span>
          <div className="pulse-track"><i style={{ width: `${Math.max(0, Math.min(100, (state.campaign.audienceMood + 100) / 2))}%` }} /></div>
          <strong>{state.campaign.audienceMood > 25 ? 'Sediento de escándalo' : state.campaign.audienceMood < -25 ? 'Hostilmente sobrio' : 'Atento'}</strong>
        </div>
        <div>
          <span>Hambre de la Casa</span>
          <div className="pulse-track hunger"><i style={{ width: `${state.campaign.houseHunger}%` }} /></div>
          <strong>{state.campaign.houseHunger >= 75 ? 'Exige consecuencias' : state.campaign.houseHunger >= 40 ? 'Está oliendo tus deudas' : 'Temporalmente alimentada'}</strong>
        </div>
        <div>
          <span>Normalidad residual</span>
          <div className="pulse-track normality"><i style={{ width: `${state.campaign.delirium.normalityResidual}%` }} /></div>
          <strong>{state.campaign.delirium.normalityResidual}%</strong>
        </div>
      </section>

      {activeOmen && omenProgress && (
        <section className={`active-omen ${state.campaign.omenCompleted ? 'fulfilled' : ''}`}>
          <div>
            <span>{state.campaign.omenCompleted ? 'PRESAGIO CUMPLIDO' : 'PRESAGIO ACTIVO'}</span>
            <strong>{activeOmen.title}</strong>
          </div>
          <p>{state.campaign.omenCompleted ? state.campaign.omenMessage : activeOmen.condition}</p>
          <div className="omen-progress-track">
            <i style={{ width: `${Math.min(100, (omenProgress.current / omenProgress.target) * 100)}%` }} />
          </div>
          <small>{omenProgress.current} / {omenProgress.target} · {omenProgress.label}</small>
        </section>
      )}

      {/* Dialogue Bubble Card */}
      {state.dialogueBubble && (
        <div className="dialogue-bubble-box">
          <div className="dialogue-bubble-speaker">{dialogueSpeaker}</div>
          <div className="dialogue-bubble-text">
            "{state.dialogueBubble.text}"
          </div>
          <button className="btn-gothic-sm" style={{ padding: '4px 8px' }} onClick={handleCloseDialogue}>
            X
          </button>
        </div>
      )}

      <section className={`auction-format-banner format-${auctionFormat.id}`} aria-label="Formato de subasta actual">
        <div>
          <span>REGLAMENTO TEMPORAL</span>
          <strong>{auctionFormat.name}</strong>
        </div>
        <p>{auctionFormat.description}</p>
      </section>

      <details className="rival-tells">
        <summary>Leer los tics de los postores rivales</summary>
        <div className="rival-tell-grid">
          {state.rivals.map((rival) => (
            <article key={rival.id} className={rival.shakenUntilTurn === state.turnCount ? 'shaken' : ''}>
              <strong>{rival.nombre}</strong>
              <span>{rival.tell}</span>
              <small>Obsesión: {rival.obsession} · Rencor: {rival.grudge || 0} · Victorias: {rival.wins || 0}</small>
            </article>
          ))}
        </div>
      </details>

      {/* Lot presentation Card */}
      {lot && (
        <div className="lot-deck">
          {lot.es_elite && <div className="lot-badge-elite">Lote Especial de Elite</div>}
          <div className="lot-title">Lote #{state.turnCount}: {lotIsSealed ? 'CONTENIDO LACRADO POR ORDEN NOTARIAL' : lot.nombre_item}</div>
          
          <div className="lot-meta-tags">
            <div className="tag">Categoria: {lot.categoria}</div>
            <div className="tag">Rareza: {lot.rareza}</div>
            <div className="tag">Peso Curse: +{lot.es_elite ? 3 : 1} ✥</div>
          </div>

          <p className="lot-desc">"{lotIsSealed ? 'El Notario Sin Rostro ha retirado la descripción. Pujarás usando apenas la rareza, la categoría y tu historial de decisiones cuestionables.' : lot.descripcion}"</p>
          {!lotIsSealed && lot.callbackText && <p className="lot-callback">{lot.callbackText}</p>}
          {lot.agency && lot.agency !== 'Dormido' && (
            <div className="lot-agency">El lote figura como <strong>{lot.agency}</strong> y podría declarar durante un juicio.</div>
          )}
          {state.campaign.lotIntelRevealed && (
            <div className="lot-intel">
              <strong>INFORME CLANDESTINO DE ROQUEFORT</strong>
              <span>Estimación pública: ${(lot.valor_estimado || lot.puja_inicial * 2).toLocaleString()}</span>
              <span>Valor real probable: ${(lot.valor_real || 0).toLocaleString()}</span>
              <em>{lot.comentario_rata || 'El patrimonio humano continúa bajo observación.'}</em>
            </div>
          )}

          <div className="lot-bid-row">
            <div className="initial-bid-label">Apertura en {getAuctionCurrencyLabel(auctionFormat)}:</div>
            <div className="initial-bid-val">{displayAmount(lot.puja_inicial)}</div>
          </div>
        </div>
      )}

      {/* Ghost bribe reveal if leaked */}
      {state.ghostBribed && lot && (
        <div className="ghost-leak-box">
          <div className="ghost-leak-title">◈ Casimiro Coiman revela la letra pequeña:</div>
          <div className="ghost-leak-text">"{lot.letra_pequena}"</div>
        </div>
      )}

      {lot && (
        <section className="auction-tricks" aria-label="Maniobras clandestinas">
          <div className="tricks-heading">
            <strong>MANIOBRAS CLANDESTINAS</strong>
            <span>Influencia {state.campaign.influence} · Fragmentos {state.campaign.soulFragments}</span>
          </div>
          <div className="trick-buttons">
            <button
              type="button"
              className="btn-gothic-sm"
              disabled={state.campaign.influence < 1 || state.campaign.auctionTricksUsed.includes('appraise')}
              onClick={() => handleAuctionTrick('appraise')}
            >
              Filtrar tasación · 1 INF
            </button>
            <button
              type="button"
              className="btn-gothic-sm"
              disabled={state.campaign.influence < 2 || state.campaign.auctionTricksUsed.includes('scandal')}
              onClick={() => handleAuctionTrick('scandal')}
            >
              Sembrar escándalo · 2 INF
            </button>
            <button
              type="button"
              className="btn-gothic-sm"
              disabled={state.status !== 'LOT_REVEAL' || state.campaign.soulFragments < 1 || state.campaign.auctionTricksUsed.includes('rewrite')}
              onClick={() => handleAuctionTrick('rewrite')}
            >
              Reescribir apertura · 1 ALMA
            </button>
          </div>
        </section>
      )}

      {/* Bidding Room Console */}
      {lot && (
        <div className="bidding-room-box">
          {/* Debt blocker notebook paper scrap overlay */}
          {state.debt > 5000 && (
            <DebtPaper
              debt={state.debt}
              onPayOff={handlePayLoan}
              onSellSoul={handleSellSoul}
            />
          )}

          {state.status === 'LOT_REVEAL' ? (
            <div style={{ textAlign: 'center', padding: '30px' }}>
              <p style={{ fontStyle: 'italic', marginBottom: '20px' }}>
                Don Belisario Martillazo espera a que abras el martillo para iniciar el remate.
              </p>
              <button className="btn-gothic btn-large" onClick={handleStartAuction}>
                Iniciar {auctionFormat.name} en {displayAmount(lot.puja_inicial)}
              </button>
            </div>
          ) : (
            <>
              <div className="auction-live-board">
                <div className="live-bid-display">
                  <div className="live-bid-label">Puja activa en {getAuctionCurrencyLabel(auctionFormat)}</div>
                  <div className="live-bid-val">{displayAmount(state.activeBid)}</div>
                  <div className="live-bidder-name">Liderando: {state.highestBidder}</div>
                  
                  {state.biddingActive && (
                    <div style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--color-red-bright)', fontWeight: 'bold' }}>
                      Martillazo en: {countdown === 3 && '◈ ◈ ◈'} {countdown === 2 && '◈ ◈ ◇'} {countdown === 1 && '◈ ◇ ◇'}
                    </div>
                  )}
                </div>

                <div className="live-bids-log">
                  {state.bidsLog.slice(-5).map((log, i) => {
                    const isPlayer = log.includes('Tú');
                    return (
                      <div key={i} className={`log-entry ${isPlayer ? 'player-entry' : 'npc-entry'}`}>
                        {log}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bidding-controls-row">
                <div className="bid-input-container">
                  <div className="bid-input-label">Oferta en {getAuctionCurrencyLabel(auctionFormat)} · disponible {bidCapacity}</div>
                  <input
                    type="number"
                    className="bid-num-input"
                    min={state.activeBid + bidIncrement}
                    value={activeCustomBid}
                    onChange={(e) => setUserInputBid(Number(e.target.value))}
                  />
                </div>

                <div className="btn-row">
                  <button
                    className="btn-gothic"
                    disabled={activeCustomBid <= state.activeBid || activeCustomBid > bidCapacity}
                    onClick={handleBid}
                  >
                    Ofrecer {displayAmount(activeCustomBid)}
                  </button>
                  <button className="btn-gothic btn-pass" onClick={handlePass}>
                    Paso / Retirarse
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Don Sanguino Loan and Soul Exchange Desk */}
      <div className="loan-section">
        <div style={{ fontFamily: 'var(--font-gothic)', color: 'var(--color-gold)', fontSize: '0.9rem', borderBottom: '1px solid rgba(212, 175, 55, 0.1)', paddingBottom: '6px' }}>
          ◈ Escritorio de Finanzas Clandestinas (Don Sanguino) ◈
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '8px 0' }}>
          ¿Sin dinero para pujar? Don Sanguino te presta $2,500 en efectivo por un interes de $3,000.
          Paga tus deudas acumuladas usando tu presupuesto o vende tu alma a la Rata para saldar el 100% de la deuda (aumenta tu maldicion en +5 ✥).
        </p>

        <div className="loan-actions-row">
          <button
            className="btn-gothic-sm"
            onClick={handleLoan}
          >
            Pedir Prestamo (+$2,500)
          </button>
          <button
            className="btn-gothic-sm"
            disabled={state.debt <= 0 || state.budget <= 0}
            onClick={handlePayLoan}
          >
            Abonar a Deuda (${Math.min(state.budget, state.debt).toLocaleString()})
          </button>
          <button
            className="btn-gothic-sm"
            style={{ borderColor: 'var(--color-red)', color: 'var(--color-red-bright)' }}
            disabled={state.debt <= 0}
            onClick={handleSellSoul}
          >
            Vender Alma (Saldar Deuda)
          </button>
        </div>
      </div>
    </div>
  );
};
export default Saloon;
