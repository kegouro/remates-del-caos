import type { StoryBeat } from '../game/campaign/types';

interface StoryLedgerProps {
  entries: StoryBeat[];
  onClose: () => void;
}

const KIND_LABELS: Record<StoryBeat['kind'], string> = {
  lote: 'REMATE',
  deuda: 'OBLIGACIÓN',
  relacion: 'VÍNCULO',
  anomalia: 'ANOMALÍA',
  objeto: 'BIEN CON OPINIONES',
  confesion: 'DECLARACIÓN',
  juicio: 'PRECEDENTE',
  casa: 'LA CASA'
};

export function StoryLedger({ entries, onClose }: StoryLedgerProps) {
  const important = [...entries].sort((a, b) => b.turn - a.turn || b.importance - a.importance);
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="story-ledger-title">
      <section className="story-ledger paper-panel">
        <header className="story-ledger-header">
          <div>
            <p className="eyebrow">LIBRO DE ACTAS INCREÍBLES PERO LEGALMENTE OCURRIDAS</p>
            <h2 id="story-ledger-title">La noche ya está desarrollando jurisprudencia</h2>
          </div>
          <button type="button" className="btn-gothic-sm" onClick={onClose}>Cerrar archivo</button>
        </header>
        <p className="story-ledger-intro">
          La casa conserva accidentes, pérdidas, declaraciones y cambios de realidad. Los detalles privados no aparecen completos aquí.
        </p>
        <div className="story-ledger-list">
          {important.length === 0 ? (
            <p className="empty-ledger">Todavía no ha ocurrido nada defendible.</p>
          ) : important.map((entry) => (
            <article key={entry.id} className={`story-beat importance-${entry.importance}`}>
              <div className="story-beat-stamp">
                <span>{KIND_LABELS[entry.kind]}</span>
                <strong>LOTE {entry.turn}</strong>
              </div>
              <div>
                <h3>{entry.title}</h3>
                <p>{entry.text}</p>
                {entry.motif && <small>Motivo recurrente: {entry.motif}</small>}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
