import { useMemo, useState } from 'react';
import {
  DOSSIER_PRESETS,
  buildDossierFromAnswers,
  buildDossierTraces,
  selectQuestionnaireSubset
} from '../game/campaign/dossier';
import type { BidderDossier, DossierTrace, RoastIntensity, AnomalyFrequency } from '../game/campaign/types';

interface Props {
  initialSeed: string;
  onComplete: (dossier: BidderDossier, traces: DossierTrace[], seed: string) => void;
}

function cloneDossier(dossier: BidderDossier): BidderDossier {
  return JSON.parse(JSON.stringify(dossier)) as BidderDossier;
}

export function DossierOnboarding({ initialSeed, onComplete }: Props) {
  const [phase, setPhase] = useState<'contract' | 'questions' | 'review'>('contract');
  const [presetKey, setPresetKey] = useState('contabilidad');
  const [seed, setSeed] = useState(initialSeed || 'mortaja');
  const [base, setBase] = useState<BidderDossier>(() => cloneDossier(DOSSIER_PRESETS.contabilidad.dossier));
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [forbiddenText, setForbiddenText] = useState('');
  const [extremeConfirmed, setExtremeConfirmed] = useState(false);

  const questions = useMemo(
    () => selectQuestionnaireSubset(seed, base.questionCount),
    [seed, base.questionCount]
  );

  const finalDossier = useMemo(() => {
    const built = buildDossierFromAnswers(base, answers, questions);
    return {
      ...built,
      forbiddenTopics: forbiddenText
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
    };
  }, [base, answers, questions, forbiddenText]);

  const choosePreset = (key: string) => {
    const preset = DOSSIER_PRESETS[key];
    if (!preset) return;
    setPresetKey(key);
    setBase(cloneDossier(preset.dossier));
    setAnswers({});
    setQuestionIndex(0);
    setExtremeConfirmed(key !== 'auditoria');
  };

  const handleEvidenceFiles = (files: FileList | null) => {
    const selected = Array.from(files || []).slice(0, 10).map((file) => ({
      name: file.name.replace(/[<>]/g, '').slice(0, 120),
      size: file.size,
      type: file.type || 'tipo/desconocido',
      lastModified: file.lastModified
    }));
    setBase((current) => ({
      ...current,
      fileMetadataList: selected,
      consentScopes: selected.length ? [...new Set([...current.consentScopes, 'files' as const])] : current.consentScopes.filter((scope) => scope !== 'files')
    }));
  };

  const handleWallpaperEvidence = (file?: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 18;
        canvas.height = 18;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) return;
        context.drawImage(image, 0, 0, 18, 18);
        const pixels = context.getImageData(0, 0, 18, 18).data;
        let red = 0; let green = 0; let blue = 0; let count = 0;
        for (let index = 0; index < pixels.length; index += 16) {
          if (pixels[index + 3] < 30) continue;
          red += pixels[index]; green += pixels[index + 1]; blue += pixels[index + 2]; count += 1;
        }
        const rgb = [Math.round(red / Math.max(1, count)), Math.round(green / Math.max(1, count)), Math.round(blue / Math.max(1, count))];
        const color = `#${rgb.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
        const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
        setBase((current) => ({
          ...current,
          wallpaperMetadata: {
            colors: [color],
            description: `evidencia visual “${file.name.replace(/[<>]/g, '').slice(0, 80)}” de luminosidad ${brightness > 128 ? 'aspiracional' : 'funeraria'}`
          },
          screenshotPalette: [color],
          screenshotBrightness: brightness > 128 ? 'claro' : 'oscuro',
          consentScopes: [...new Set([...current.consentScopes, 'screenshot' as const])]
        }));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  if (phase === 'contract') {
    return (
      <main className="dossier-screen">
        <section className="dossier-contract paper-panel">
          <p className="eyebrow">FORMULARIO 11-C · ENTREGA VOLUNTARIA DE MUNICIÓN</p>
          <h1>Declaración Jurada de Dudosa Relevancia</h1>
          <p className="dossier-lead">
            Mortaja, Martillo & Cía. puede reutilizar tus respuestas para fabricar lotes, rumores,
            cláusulas, callbacks e insultos. Todo ocurre dentro de esta sesión y en tu navegador.
          </p>

          <div className="preset-grid">
            {Object.entries(DOSSIER_PRESETS).map(([key, preset]) => (
              <button
                type="button"
                key={key}
                className={`preset-card ${presetKey === key ? 'selected' : ''}`}
                onClick={() => choosePreset(key)}
              >
                <strong>{preset.label}</strong>
                <span>{preset.description}</span>
              </button>
            ))}
          </div>

          <div className="contract-controls">
            <label>
              Profundidad del interrogatorio
              <input
                type="range"
                min="4"
                max="16"
                value={base.questionCount}
                onChange={(event) => setBase({ ...base, questionCount: Number(event.target.value) })}
              />
              <span>{base.questionCount} preguntas</span>
            </label>

            <label>
              Intensidad del roast
              <select
                value={base.preferredInsultIntensity}
                onChange={(event) => setBase({
                  ...base,
                  preferredInsultIntensity: event.target.value as RoastIntensity
                })}
              >
                <option value="cortesia">Visita diplomática</option>
                <option value="honesta">Tasación honesta</option>
                <option value="demolicion">Sangre en el balance</option>
                <option value="auditoria">Auditoría sin abogado</option>
              </select>
            </label>

            <label>
              Frecuencia de anomalías
              <select
                value={base.anomalyFrequency}
                onChange={(event) => setBase({
                  ...base,
                  anomalyFrequency: event.target.value as AnomalyFrequency
                })}
              >
                <option value="escasa">Raro pero comprensible</option>
                <option value="medida">Sueño administrado</option>
                <option value="febril">Brote administrativo</option>
                <option value="realidad_sin_licencia">La realidad perdió la licencia</option>
              </select>
            </label>

            <label>
              Concentración de absurdo
              <input
                type="range"
                min="15"
                max="100"
                value={base.absurdityLevel}
                onChange={(event) => setBase({ ...base, absurdityLevel: Number(event.target.value) })}
              />
              <span>{base.absurdityLevel}%</span>
            </label>

            <label className="checkbox-line">
              <input
                type="checkbox"
                checked={base.publicHumiliation}
                onChange={(event) => setBase({ ...base, publicHumiliation: event.target.checked })}
              />
              Autorizar humillación frente a personajes ficticios
            </label>

            <label className="checkbox-line">
              <input
                type="checkbox"
                checked={base.longCallbacks}
                onChange={(event) => setBase({ ...base, longCallbacks: event.target.checked })}
              />
              Permitir callbacks tardíos y consecuencias retroactivas
            </label>
          </div>

          <section className="voluntary-evidence">
            <div>
              <p className="eyebrow">INVENTARIO FORENSE VOLUNTARIO</p>
              <h3>Permite que la casa se burle de metadatos elegidos por ti</h3>
              <p>Los archivos no se abren ni se suben. Solo se conservan nombre, extensión, tamaño y fecha durante esta sesión.</p>
            </div>
            <label className="evidence-drop">
              Seleccionar hasta diez archivos como evidencia
              <input type="file" multiple onChange={(event) => handleEvidenceFiles(event.target.files)} />
            </label>
            {base.fileMetadataList?.length ? (
              <div className="evidence-list">
                {base.fileMetadataList.map((file) => (
                  <span key={`${file.name}-${file.lastModified}`}>{file.name} · {Math.max(1, Math.round(file.size / 1024))} KB</span>
                ))}
                <button type="button" className="ledger-delete" onClick={() => setBase({ ...base, fileMetadataList: [], consentScopes: base.consentScopes.filter((scope) => scope !== 'files') })}>
                  Destruir metadatos
                </button>
              </div>
            ) : null}

            <label>
              Mesa de evidencia textual
              <textarea
                maxLength={360}
                value={base.pastedEvidence || ''}
                placeholder="Pega una frase, nombre de proyecto o fragmento que quieras ver convertido en delito notarial..."
                onChange={(event) => setBase({
                  ...base,
                  pastedEvidence: event.target.value.replace(/[<>]/g, '').slice(0, 360),
                  consentScopes: event.target.value ? [...new Set([...base.consentScopes, 'clipboard' as const])] : base.consentScopes.filter((scope) => scope !== 'clipboard')
                })}
              />
            </label>

            <label className="evidence-drop">
              Entregar fondo de pantalla o imagen como evidencia cromática
              <input type="file" accept="image/*" onChange={(event) => handleWallpaperEvidence(event.target.files?.[0])} />
            </label>
            {base.wallpaperMetadata && (
              <div className="palette-evidence">
                <i style={{ background: base.wallpaperMetadata.colors[0] }} />
                <span>{base.wallpaperMetadata.description}</span>
                <button type="button" className="ledger-delete" onClick={() => setBase({
                  ...base, wallpaperMetadata: undefined, screenshotPalette: undefined, screenshotBrightness: undefined,
                  consentScopes: base.consentScopes.filter((scope) => scope !== 'screenshot')
                })}>Destruir evidencia visual</button>
              </div>
            )}
          </section>

          <div className="seed-row">
            <label htmlFor="dossier-seed">Semilla del expediente</label>
            <input id="dossier-seed" value={seed} onChange={(event) => setSeed(event.target.value.slice(0, 36))} />
            <button type="button" className="btn-gothic-sm" onClick={() => setSeed(Math.random().toString(36).slice(2, 10))}>
              Alterar destino
            </button>
          </div>

          <div className="contract-warning">
            <strong>Advertencia:</strong> el modo extremo no conoce tu vida. Solo recuerda lo que escribes
            y lo que haces dentro del juego, luego lo reorganiza con una crueldad documental impropia.
          </div>

          {presetKey === 'auditoria' && (
            <label className="extreme-contract">
              <input type="checkbox" checked={extremeConfirmed} onChange={(event) => setExtremeConfirmed(event.target.checked)} />
              <span>
                <strong>PEGI 18 · BAJO TU PROPIA RESPONSABILIDAD</strong>
                Autorizo lenguaje hostil, callbacks tardíos, humillación pública ficticia y uso combinado de toda evidencia que entregue voluntariamente.
              </span>
            </label>
          )}

          <div className="question-actions">
            <button type="button" className="btn-gothic-sm" onClick={() => onComplete(base, [], seed)}>
              Entrar con expediente apócrifo
            </button>
            <button type="button" className="btn-gothic btn-large" disabled={presetKey === 'auditoria' && !extremeConfirmed} onClick={() => setPhase('questions')}>
              Firmo porque evidentemente no aprendo
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (phase === 'questions') {
    const question = questions[questionIndex];
    const answer = answers[question.id] || '';
    const followup = question.reactivePrompt?.(answer) || null;
    return (
      <main className="dossier-screen">
        <section className="question-card paper-panel">
          <div className="question-progress">
            <span>INTERROGATORIO {questionIndex + 1}/{questions.length}</span>
            <div><i style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div>
          </div>
          <p className="question-category">{question.category.toUpperCase()}</p>
          <h2>{question.prompt}</h2>
          <textarea
            autoFocus
            maxLength={180}
            value={answer}
            placeholder={question.placeholder}
            onChange={(event) => setAnswers({ ...answers, [question.id]: event.target.value })}
          />
          {followup && answer.trim().length > 3 && (
            <p className="reactive-followup">El funcionario levanta la vista: “{followup}”</p>
          )}
          <p className="answer-counter">{answer.length}/180 · puedes omitir cualquier pregunta</p>
          <div className="question-actions">
            <button
              type="button"
              className="btn-gothic-sm"
              disabled={questionIndex === 0}
              onClick={() => setQuestionIndex((value) => Math.max(0, value - 1))}
            >
              Volver
            </button>
            <button
              type="button"
              className="btn-gothic"
              onClick={() => {
                if (questionIndex >= questions.length - 1) setPhase('review');
                else setQuestionIndex((value) => value + 1);
              }}
            >
              {questionIndex >= questions.length - 1 ? 'Cerrar declaración' : answer.trim() ? 'Registrar y continuar' : 'Omitir sospechosamente'}
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="dossier-screen">
      <section className="dossier-review paper-panel">
        <p className="eyebrow">EXPEDIENTE PROVISIONAL · NO APTO PARA DEFENSA LEGAL</p>
        <h1>La casa ya dispone de material</h1>
        <div className="review-grid">
          <article>
            <span>Hábitos utilizables</span>
            <strong>{finalDossier.habits.slice(0, 3).join(' · ')}</strong>
          </article>
          <article>
            <span>Objetos comprometidos</span>
            <strong>{finalDossier.embarrassingObjects.slice(0, 3).join(' · ')}</strong>
          </article>
          <article>
            <span>Debilidades ficticias</span>
            <strong>{finalDossier.fictionalWeaknesses.slice(0, 3).join(' · ')}</strong>
          </article>
          <article>
            <span>Motivos lingüísticos</span>
            <strong>{finalDossier.recurringWords.slice(0, 5).join(' · ')}</strong>
          </article>
        </div>

        <label className="forbidden-field">
          Temas que la casa no debe utilizar, separados por coma
          <input
            value={forbiddenText}
            placeholder="familia, salud, apariencia..."
            onChange={(event) => setForbiddenText(event.target.value)}
          />
        </label>

        <div className="question-actions">
          <button type="button" className="btn-gothic-sm" onClick={() => setPhase('questions')}>
            Corregir testimonio
          </button>
          <button
            type="button"
            className="btn-gothic btn-large"
            onClick={() => {
              const traces = buildDossierTraces(answers, questions);
              if (finalDossier.fileMetadataList?.length) traces.push({ field: 'fileMetadataList', source: 'Archivos elegidos voluntariamente', uses: ['nombres de lotes', 'procedencias', 'roasts'] });
              if (finalDossier.pastedEvidence) traces.push({ field: 'pastedEvidence', source: 'Mesa de evidencia textual', uses: ['callbacks', 'documentos', 'roasts'] });
              if (finalDossier.wallpaperMetadata) traces.push({ field: 'wallpaperMetadata', source: 'Imagen elegida voluntariamente', uses: ['paleta', 'lore visual', 'objetos'] });
              onComplete(finalDossier, traces, seed);
            }}
          >
            Autorizar esta humillación
          </button>
        </div>
      </section>
    </main>
  );
}
