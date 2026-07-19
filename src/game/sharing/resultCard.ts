import type { GameState } from '../types';
import { getPlayerEpithet, getRunEpitaph } from '../campaign/epithets';

interface EndingLike {
  title: string;
  description: string;
}

function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function safeWorstPurchase(state: GameState): string {
  if (!state.inventory.length) return 'Ninguna. La cobardía conservó toda la liquidez.';
  const item = [...state.inventory].sort((a, b) => {
    const lossA = a.precio_compra - (a.valor_real || 0);
    const lossB = b.precio_compra - (b.valor_real || 0);
    return lossB - lossA;
  })[0];
  return `${item.nombre_item} · pagó ${item.moneda_compra === 'liquidez' || !item.moneda_compra ? `$${item.precio_compra.toLocaleString()}` : `${item.precio_compra} ${item.moneda_compra}`}`;
}

export function buildSafeRunSummary(state: GameState, ending: EndingLike): string {
  return [
    'REMATES DEL CAOS · ACTA FINAL',
    getPlayerEpithet(state),
    ending.title,
    `Lotes: ${state.inventory.length}`,
    `Liquidez: $${state.budget.toLocaleString()}`,
    `Deuda: $${state.debt.toLocaleString()}`,
    `Prestigio: ${state.prestige}`,
    `Maldición: ${state.curse}`,
    `Normalidad residual: ${state.campaign.delirium.normalityResidual}%`,
    `Rituales descubiertos: ${state.campaign.discoveredRituals.length}`,
    `Precedentes inscritos: ${state.campaign.storyLog.length}`,
    `Peor adquisición: ${safeWorstPurchase(state)}`,
    `Epitafio: ${getRunEpitaph(state)}`,
    state.campaign.dailyChallenge ? `Remate del día: ${state.campaign.dailyChallenge.label} (${state.campaign.dailyChallenge.date})` : '',
    `Semilla: ${state.seed}`
  ].filter(Boolean).join('\n');
}

export async function copyRunSummary(state: GameState, ending: EndingLike): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return false;
  await navigator.clipboard.writeText(buildSafeRunSummary(state, ending));
  return true;
}

export function downloadRunCertificate(state: GameState, ending: EndingLike): void {
  if (typeof document === 'undefined') return;
  const canvas = document.createElement('canvas');
  canvas.width = 1400;
  canvas.height = 900;
  const context = canvas.getContext('2d');
  if (!context) return;

  const gradient = context.createLinearGradient(0, 0, 1400, 900);
  gradient.addColorStop(0, '#080706');
  gradient.addColorStop(0.55, '#17100e');
  gradient.addColorStop(1, '#050404');
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = '#d4af37';
  context.lineWidth = 5;
  context.strokeRect(34, 34, canvas.width - 68, canvas.height - 68);
  context.lineWidth = 1;
  context.strokeRect(54, 54, canvas.width - 108, canvas.height - 108);

  context.textAlign = 'center';
  context.fillStyle = '#d4af37';
  context.font = '700 32px Georgia, serif';
  context.fillText('MORTAJA, MARTILLO & CÍA.', 700, 112);
  context.font = '700 70px Georgia, serif';
  context.fillText('CERTIFICADO DE RUINA', 700, 190);
  context.fillStyle = '#b8a990';
  context.font = 'italic 25px Georgia, serif';
  context.fillText('Adjudicado al peor postor', 700, 232);

  context.fillStyle = '#eee2ca';
  context.font = '600 31px Georgia, serif';
  const titleLines = wrapText(context, getPlayerEpithet(state), 1120).slice(0, 2);
  titleLines.forEach((line, index) => context.fillText(line, 700, 310 + index * 40));

  context.fillStyle = '#c54a55';
  context.font = '700 31px Georgia, serif';
  context.fillText(ending.title.toUpperCase(), 700, 410);

  const stats = [
    ['LIQUIDEZ', `$${state.budget.toLocaleString()}`],
    ['DEUDA', `$${state.debt.toLocaleString()}`],
    ['LOTES', String(state.inventory.length)],
    ['PRESTIGIO', String(state.prestige)],
    ['MALDICIÓN', String(state.curse)],
    ['NORMALIDAD', `${state.campaign.delirium.normalityResidual}%`]
  ];
  stats.forEach(([label, value], index) => {
    const column = index % 3;
    const row = Math.floor(index / 3);
    const x = 310 + column * 390;
    const y = 500 + row * 105;
    context.fillStyle = '#8f806b';
    context.font = '18px Arial, sans-serif';
    context.fillText(label, x, y);
    context.fillStyle = '#e0c56a';
    context.font = '700 34px Georgia, serif';
    context.fillText(value, x, y + 42);
  });

  context.fillStyle = '#c9baa1';
  context.font = 'italic 25px Georgia, serif';
  const epitaphLines = wrapText(context, getRunEpitaph(state), 1080).slice(0, 3);
  epitaphLines.forEach((line, index) => context.fillText(line, 700, 735 + index * 34));

  context.fillStyle = '#776b5a';
  context.font = '16px monospace';
  context.fillText(`SEMILLA ${state.seed} · EXPEDIENTE SIN CONFESIONES EXPORTADAS`, 700, 844);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `certificado-ruina-${state.seed}.png`;
    anchor.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}
