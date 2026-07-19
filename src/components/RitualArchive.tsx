import { SECRET_RITUALS, type SecretRitualId } from '../game/campaign/rituals';

interface RitualArchiveProps {
  discovered: string[];
  onClose: () => void;
}

const VEILED_CLUES: Record<SecretRitualId, string> = {
  chair_trinity: 'Tres lugares destinados al reposo deberán aceptar un cargo ejecutivo.',
  seventh_refusal: 'La casa aprende lentamente que una negativa también puede convertirse en alimento.',
  final_reincidence: 'Cuando demasiadas cosas juran ser definitivas, alguna termina adquiriendo alma.',
  rat_coronation: 'Una corona no reconoce nobleza mientras su portador conserve todo lo que lo hacía humano.',
  palindromic_debt: 'Hay cifras capaces de mirarse al espejo y firmar por ambos lados.'
};

export function RitualArchive({ discovered, onClose }: RitualArchiveProps) {
  const known = new Set(discovered);
  const rituals = Object.values(SECRET_RITUALS);

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="ritual-archive-title">
      <section className="ritual-archive paper-panel">
        <header className="story-ledger-header">
          <div>
            <p className="eyebrow">CATÁLOGO DE CEREMONIAS QUE LA CASA NIEGA PRACTICAR</p>
            <h2 id="ritual-archive-title">Rituales, coincidencias y delitos litúrgicos</h2>
          </div>
          <button type="button" className="btn-gothic-sm" onClick={onClose}>Cerrar relicario</button>
        </header>

        <p className="story-ledger-intro">
          Los rituales no se seleccionan. Ocurren cuando tus decisiones forman una figura suficientemente absurda para que el edificio la reconozca como tradición.
        </p>

        <div className="ritual-archive-grid">
          {rituals.map((ritual, index) => {
            const unlocked = known.has(ritual.id);
            return (
              <article key={ritual.id} className={`ritual-entry ${unlocked ? 'ritual-unlocked' : 'ritual-veiled'}`}>
                <div className="ritual-number">RITO {String(index + 1).padStart(2, '0')}</div>
                <h3>{unlocked ? ritual.title : 'RITO BAJO SELLO'}</h3>
                <p>{unlocked ? ritual.description : VEILED_CLUES[ritual.id]}</p>
                <footer>
                  <span>{unlocked ? ritual.reward : 'Recompensa retenida por superstición administrativa'}</span>
                  <small>{unlocked ? `Motivo: ${ritual.motif}` : 'La casa todavía no reconoce el patrón.'}</small>
                </footer>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
