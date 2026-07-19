import type { DeliriumAnomaly } from '../game/campaign/types';

interface Props {
  anomaly: DeliriumAnomaly;
  normalityResidual: number;
  onChoose: (choiceId: string) => void;
}

export function AnomalyScene({ anomaly, normalityResidual, onChoose }: Props) {
  return (
    <main className={`anomaly-screen severity-${anomaly.severity}`}>
      <div className="anomaly-vignette" />
      <section className="anomaly-document">
        <p className="eyebrow">ANOMALÍA {anomaly.severity}/5 · NORMALIDAD RESIDUAL {normalityResidual}%</p>
        <div className="anomaly-seal">!</div>
        <h1>{anomaly.title}</h1>
        <p>{anomaly.description}</p>
        <div className="anomaly-choices">
          {anomaly.choices.map((choice) => (
            <button key={choice.id} type="button" onClick={() => onChoose(choice.id)}>
              <strong>{choice.label}</strong>
              <span>{choice.hint}</span>
            </button>
          ))}
        </div>
        <small>La casa archivará esta decisión y podrá utilizarla como precedente.</small>
      </section>
    </main>
  );
}
