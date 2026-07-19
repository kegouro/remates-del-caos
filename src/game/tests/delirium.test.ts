import { describe, expect, it } from 'vitest';
import {
  buildDossierFromAnswers,
  createDefaultDossier,
  selectQuestionnaireSubset
} from '../campaign/dossier';
import {
  createInitialDelirium,
  maybeScheduleAnomaly,
  resolveAnomalyChoice
} from '../campaign/delirium';
import { createRNG, generarLote } from '../generators/lotGenerator';
import { createInitialState, gameReducer } from '../state/store';


describe('Expediente procedural', () => {
  it('selects a deterministic and category-diverse questionnaire', () => {
    const first = selectQuestionnaireSubset('paloma-417', 12);
    const second = selectQuestionnaireSubset('paloma-417', 12);
    expect(first.map((question) => question.id)).toEqual(second.map((question) => question.id));
    expect(new Set(first.map((question) => question.category)).size).toBeGreaterThanOrEqual(6);
  });

  it('turns answers into reusable dossier fields without preserving markup', () => {
    const questions = selectQuestionnaireSubset('sanitization', 6);
    const answers = Object.fromEntries(questions.map((question, index) => [
      question.id,
      index === 0 ? '<script>mi silla con ropa</script>' : `respuesta procedural ${index}`
    ]));
    const dossier = buildDossierFromAnswers(createDefaultDossier(), answers, questions);
    const serialized = JSON.stringify(dossier);
    expect(serialized).not.toContain('<script>');
    expect(serialized).toContain('mi silla con ropa/script');
  });

  it('generates lots that directly reuse authorized dossier material', () => {
    const dossier = createDefaultDossier();
    dossier.alias = 'Barón del Archivo Final';
    dossier.embarrassingObjects = ['una carpeta llamada final_final_v12'];
    dossier.habits = ['renombrar proyectos en vez de terminarlos'];

    const lot = generarLote([], [], () => 0.1, {
      dossier,
      motifs: ['palomas accionistas'],
      normalityResidual: 28
    });

    const combined = `${lot.nombre_item} ${lot.descripcion} ${lot.letra_pequena}`;
    expect(combined).toMatch(/final_final_v12|renombrar proyectos/);
    expect(lot.motifs).toContain('palomas accionistas');
    expect(lot.callbackText).toBeDefined();
  });
});


describe('Director de delirio', () => {
  it('creates deterministic motifs for the same dossier and seed', () => {
    const dossier = createDefaultDossier();
    const a = createInitialDelirium('same-seed', dossier, createRNG('same-seed'));
    const b = createInitialDelirium('same-seed', dossier, createRNG('same-seed'));
    expect(a.motifs).toEqual(b.motifs);
    expect(a.anomalyBudget).toBe(b.anomalyBudget);
  });

  it('schedules an anomaly when the configured pressure and budget allow it', () => {
    const state = createInitialState('anomaly-seed');
    state.turnCount = 6;
    state.dossier.anomalyFrequency = 'realidad_sin_licencia';
    state.campaign.delirium.lastAnomalyTurn = 0;
    state.campaign.delirium.anomalyBudget = 12;
    state.curse = 9;
    const anomaly = maybeScheduleAnomaly(state, () => 0.01);
    expect(anomaly).not.toBeNull();
    expect(anomaly?.choices.length).toBeGreaterThanOrEqual(2);
  });

  it('resolves anomalies without trapping the campaign', () => {
    const state = createInitialState('resolve-seed');
    state.turnCount = 7;
    state.campaign.delirium.currentAnomaly = {
      id: 'buttons_union',
      title: 'LOS BOTONES DECLARAN HUELGA',
      description: 'Prueba sindical.',
      character: 'subastador',
      severity: 2,
      motif: 'sindicato de botones',
      choices: [
        { id: 'sign', label: 'Firmar', hint: 'Prueba' },
        { id: 'break', label: 'Romper', hint: 'Prueba' }
      ]
    };
    const resolved = resolveAnomalyChoice(state, 'sign');
    expect(resolved.status).toBe('INTERMISSION');
    expect(resolved.campaign.delirium.currentAnomaly).toBeNull();
    expect(resolved.campaign.delirium.anomalyHistory).toContain('buttons_union');
  });

  it('records confessions as session dossier ammunition', () => {
    const state = createInitialState('confession-seed');
    const next = gameReducer(state, {
      type: 'SUBMIT_CONFESSION',
      character: 'fantasma',
      text: '<b>abandono proyectos cuando se vuelven difíciles</b>',
      reply: 'Registrado.'
    });
    expect(next.confessions[0]).not.toContain('<');
    expect(next.dossier.fictionalWeaknesses[0]).toContain('abandono proyectos');
    expect(next.dossierTraces.some((trace) => trace.field === 'fictionalWeaknesses')).toBe(true);
  });
});
