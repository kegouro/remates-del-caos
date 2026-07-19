import type { BidderDossier, DossierTrace } from '../game/campaign/types';

interface Props {
  dossier: BidderDossier;
  traces: DossierTrace[];
  motifs: string[];
  normalityResidual: number;
  onDeleteField: (field: keyof BidderDossier) => void;
  onClose: () => void;
}

const fieldLabels: Partial<Record<keyof BidderDossier, string>> = {
  habits: 'Hábitos',
  embarrassingObjects: 'Objetos vergonzosos',
  fictionalWeaknesses: 'Debilidades ficticias',
  recurringWords: 'Palabras recurrentes',
  aestheticPreferences: 'Preferencias estéticas',
  suspiciousTimes: 'Horas sospechosas',
  emotionalCurrencies: 'Monedas emocionales',
  inventedCrimes: 'Delitos inventados',
  fileMetadataList: 'Metadatos de archivos',
  pastedEvidence: 'Evidencia textual',
  wallpaperMetadata: 'Evidencia cromática'
};

export function DossierPanel({ dossier, traces, motifs, normalityResidual, onDeleteField, onClose }: Props) {
  const fields = Object.keys(fieldLabels) as (keyof BidderDossier)[];
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="dossier-ledger" role="dialog" aria-modal="true" aria-labelledby="ledger-title" onMouseDown={(event) => event.stopPropagation()}>
        <header>
          <div>
            <p className="eyebrow">LIBRO DE DATOS ENTREGADOS</p>
            <h2 id="ledger-title">Expediente innecesariamente completo</h2>
          </div>
          <button type="button" className="btn-gothic-sm" onClick={onClose}>Cerrar</button>
        </header>

        <div className="ledger-summary">
          <span>Intensidad: <strong>{dossier.preferredInsultIntensity}</strong></span>
          <span>Normalidad residual: <strong>{normalityResidual}%</strong></span>
          <span>Motivos activos: <strong>{motifs.join(' · ')}</strong></span>
        </div>

        <div className="ledger-list">
          {fields.map((field) => {
            const values = dossier[field];
            const trace = traces.find((item) => item.field === field);
            let display: string;
            if (Array.isArray(values)) {
              if (!values.length) return null;
              display = field === 'fileMetadataList'
                ? (values as { name: string; size: number }[]).map((item) => `${item.name} (${Math.max(1, Math.round(item.size / 1024))} KB)`).join(' · ')
                : (values as unknown[]).map(String).join(' · ');
            } else if (field === 'wallpaperMetadata' && values && typeof values === 'object') {
              const wallpaper = values as BidderDossier['wallpaperMetadata'];
              display = `${wallpaper?.description || 'Imagen voluntaria'} · ${wallpaper?.colors.join(', ') || ''}`;
            } else if (typeof values === 'string') {
              if (!values.trim()) return null;
              display = values;
            } else return null;
            return (
              <article key={field}>
                <div>
                  <span>{fieldLabels[field]}</span>
                  <strong>{display}</strong>
                  <small>
                    Fuente: {trace?.source || 'Expediente apócrifo'} · Usos: {trace?.uses.join(', ') || 'lotes y diálogos'}
                  </small>
                </div>
                <button type="button" className="ledger-delete" onClick={() => onDeleteField(field)}>
                  Quemar dato
                </button>
              </article>
            );
          })}
        </div>
        <p className="privacy-footnote">Borrar un campo impide sus usos futuros. La casa fingirá que nunca lo supo, aunque se resentirá administrativamente.</p>
      </section>
    </div>
  );
}
