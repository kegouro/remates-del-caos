import type { Omen } from '../game/campaign/types';

interface OmenSelectionProps {
  omens: Omen[];
  alias: string;
  onChoose: (omenId: string) => void;
}

export function OmenSelection({ omens, alias, onChoose }: OmenSelectionProps) {
  return (
    <main className="omen-screen">
      <section className="omen-intro">
        <p className="eyebrow">MADAME BALANCE · AUDITORÍA DE FUTUROS POSIBLES</p>
        <h1>Elige la desgracia que deseas reconocer como destino</h1>
        <p>
          La médium coloca tres expedientes sobre una balanza suspendida. Todos llevan el nombre de{' '}
          <strong>{alias || 'una persona legalmente discutible'}</strong>. Solo uno puede convertirse en precedente.
        </p>
      </section>

      <section className="omen-grid" aria-label="Presagios disponibles">
        {omens.map((omen, index) => (
          <article className="omen-card" key={omen.id}>
            <span className="omen-number">PRESAGIO {String(index + 1).padStart(2, '0')}</span>
            <h2>{omen.title}</h2>
            <p className="omen-prophecy">“{omen.prophecy}”</p>
            <dl>
              <div>
                <dt>Condición</dt>
                <dd>{omen.condition}</dd>
              </div>
              <div>
                <dt>Pago de la casa</dt>
                <dd>{omen.rewardLabel}</dd>
              </div>
            </dl>
            <button type="button" className="btn-gothic" onClick={() => onChoose(omen.id)}>
              Firmar este futuro
            </button>
          </article>
        ))}
      </section>

      <p className="omen-footnote">
        La Casa no garantiza que la profecía sea cierta. La Casa sí garantiza que intentará cobrarla.
      </p>
    </main>
  );
}
