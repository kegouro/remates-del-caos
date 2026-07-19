import { useEffect, useRef, useState } from 'react';
import type { GameState } from '../game/types';
import type { GameAction } from '../game/state/store';
import { createRNG } from '../game/generators/lotGenerator';
import { generateContextualRoast } from '../game/campaign/roasts';
import {
  CORE_CHARACTERS,
  getCharacterObservation,
  getRelationship,
  isSecretUnlocked,
  getCharacterLocalReply,
  type CharacterId
} from '../game/campaign/characters';
import { speakText } from '../audio/tts';

interface ChatRoomProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

function RelationMeter({ label, value }: { label: string; value: number }) {
  const percentage = Math.max(0, Math.min(100, 50 + value * 3));
  return (
    <div className="relation-meter">
      <span>{label}</span>
      <div><i style={{ width: `${percentage}%` }} /></div>
      <strong>{value}</strong>
    </div>
  );
}

export function ChatRoom({ state, dispatch }: ChatRoomProps) {
  const [activeNpc, setActiveNpc] = useState<CharacterId>('subastador');
  const [inputText, setInputText] = useState('');
  const [showLore, setShowLore] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const currentNpc = CORE_CHARACTERS[activeNpc];
  const history = state.chatHistory[activeNpc] || [];
  const relation = getRelationship(state, activeNpc);
  const secretUnlocked = isSecretUnlocked(state, activeNpc);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history.length]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const userText = inputText.trim().slice(0, 220);
    setInputText('');

    const rng = createRNG(`${state.seed}:${activeNpc}:${state.turnCount}:${history.length}`);
    const localReply = getCharacterLocalReply(activeNpc, userText, rng);
    const contextual = rng() < 0.68 ? generateContextualRoast(state, activeNpc, rng) : '';
    const replyText = `${localReply}${contextual ? ` ${contextual}` : ''}`;

    dispatch({
      type: 'SUBMIT_CONFESSION',
      character: activeNpc,
      text: userText,
      reply: replyText
    });

    if (state.voiceOn) speakText(replyText, activeNpc, state.volumeVoice);
  };

  const handleBribe = () => {
    if (state.budget < 150) return;
    dispatch({ type: 'BRIBE_GHOST' });
    const reply = `Trato hecho. La letra pequeña dice: “${state.currentLot?.letra_pequena}”. No le digas al jefe; el jefe ya pagó por saber que te lo conté.`;
    if (state.voiceOn) speakText(reply, 'fantasma', state.volumeVoice);
  };

  return (
    <aside className="panel-left character-panel">
      <div className="panel-header">◈ Testigos, Acreedores y Otras Formas de Público ◈</div>

      <div className="npc-select-wrapper">
        <select
          className="npc-select"
          value={activeNpc}
          onChange={(event) => {
            setActiveNpc(event.target.value as CharacterId);
            setShowLore(false);
          }}
        >
          {Object.values(CORE_CHARACTERS).map((character) => (
            <option key={character.id} value={character.id}>{character.name} · {character.title}</option>
          ))}
        </select>
      </div>

      <div className="npc-portrait-container character-portrait-frame">
        {currentNpc.image ? (
          <img src={currentNpc.image} alt={`Retrato de ${currentNpc.name}`} className="npc-portrait" />
        ) : (
          <div className={`npc-sigil portrait-${currentNpc.id}`} role="img" aria-label={`Sello heráldico de ${currentNpc.name}`}>
            <span>{currentNpc.sigil}</span>
            <i aria-hidden="true" />
          </div>
        )}
        <span className={`character-disposition disposition-${activeNpc}`}>{getCharacterObservation(state, activeNpc)}</span>
      </div>

      <div className="npc-meta">
        <div className="npc-name">{currentNpc.name}</div>
        <div className="npc-title-line">{currentNpc.title}</div>
        <p className="npc-desc">{currentNpc.publicDescription}</p>
      </div>

      <div className="relationship-grid" aria-label={`Relación con ${currentNpc.name}`}>
        <RelationMeter label="Confianza" value={relation.trust} />
        <RelationMeter label="Temor" value={relation.fear} />
        <RelationMeter label="Sospecha" value={relation.suspicion} />
      </div>

      <button type="button" className="btn-gothic-sm lore-toggle" onClick={() => setShowLore((value) => !value)}>
        {showLore ? 'Cerrar expediente del personaje' : 'Abrir expediente del personaje'}
      </button>

      {showLore && (
        <section className="character-lore">
          <p><span>Nombre completo</span>{currentNpc.fullName}</p>
          <p><span>Personalidad</span>{currentNpc.personality.join(' · ')}</p>
          <p><span>Forma de hablar</span>{currentNpc.speech}</p>
          <p><span>Herida central</span>{currentNpc.wound}</p>
          <p><span>Deseo</span>{currentNpc.desire}</p>
          <p className={secretUnlocked ? 'secret-open' : 'secret-locked'}>
            <span>Secreto</span>
            {secretUnlocked ? currentNpc.secret : 'CLASIFICADO. Requiere confianza, temor o deuda suficiente.'}
          </p>
        </section>
      )}

      {activeNpc === 'fantasma' && (
        <div className="character-special-action">
          {state.ghostBribed ? (
            <div className="bribe-complete">Casimiro ya vendió su integridad durante este lote.</div>
          ) : (
            <button
              className="btn-gothic"
              disabled={state.budget < 150 || !state.currentLot}
              onClick={handleBribe}
            >
              Sobornar al espectro ($150)
            </button>
          )}
        </div>
      )}

      <div className="confessional-title">◈ Confesionario de Fracasos ◈</div>
      <div className="chat-log-box" aria-live="polite">
        {history.map((message, index) => (
          <div key={`${message.role}-${index}`} className={message.role === 'user' ? 'chat-bubble-u' : 'chat-bubble-n'}>
            {message.role === 'user' ? 'Tú: ' : `${currentNpc.name}: `}
            {message.text}
          </div>
        ))}
        <div ref={chatBottomRef} />
      </div>

      <div className="chat-input-wrapper">
        <input
          type="text"
          maxLength={220}
          className="chat-input"
          placeholder="Entrega una contradicción, hábito o fracaso..."
          value={inputText}
          onChange={(event) => setInputText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') handleSend();
          }}
        />
        <button className="btn-gothic-sm" onClick={handleSend}>Enviar</button>
      </div>
      <div className="local-data-note">
        Esta declaración vive en la sesión local. Podrás quemarla desde Mi Expediente.
      </div>
    </aside>
  );
}

export default ChatRoom;
