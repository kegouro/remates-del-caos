import type { GameState } from '../types';

function clean(value: string | null | undefined, fallback: string, limit: number): string {
  const sanitized = (value || '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();
  return (sanitized || fallback).slice(0, limit);
}

function wrap(context: CanvasRenderingContext2D, text: string, width: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;
    if (current && context.measureText(candidate).width > width) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  });
  if (current) lines.push(current);
  return lines;
}

export function buildSafeNewspaperText(state: GameState): string {
  const headline = clean(state.campaign.newspaperHeadline, 'EL SALÓN CONTINÚA SIN PERMISO', 160);
  const article = clean(state.campaign.newspaperText, 'La casa se negó a facilitar una versión coherente.', 700);
  return [
    'EL AVALÚO NACIONAL',
    headline,
    article,
    `Acto: ${state.campaign.act}`,
    `Liquidez: $${state.budget.toLocaleString()}`,
    `Deuda: $${state.debt.toLocaleString()}`,
    `Normalidad residual: ${state.campaign.delirium.normalityResidual}%`,
    `Semilla: ${state.seed}`
  ].join('\n');
}

export async function copyNewspaperEdition(state: GameState): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return false;
  await navigator.clipboard.writeText(buildSafeNewspaperText(state));
  return true;
}

export function downloadNewspaperEdition(state: GameState): void {
  if (typeof document === 'undefined') return;
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1500;
  const context = canvas.getContext('2d');
  if (!context) return;

  context.fillStyle = '#e9dfc5';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = '#1b1915';
  context.lineWidth = 8;
  context.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);
  context.lineWidth = 2;
  context.strokeRect(54, 54, canvas.width - 108, canvas.height - 108);

  context.fillStyle = '#171512';
  context.textAlign = 'center';
  context.font = '700 54px Georgia, serif';
  context.fillText('EL AVALÚO NACIONAL', 600, 125);
  context.font = 'italic 22px Georgia, serif';
  context.fillText('Economía · Sociedad · Obituarios preventivos', 600, 165);
  context.fillRect(80, 195, 1040, 4);

  const headline = clean(state.campaign.newspaperHeadline, 'EL SALÓN CONTINÚA SIN PERMISO', 160).toUpperCase();
  context.font = '700 54px Georgia, serif';
  const headlineLines = wrap(context, headline, 980).slice(0, 4);
  headlineLines.forEach((line, index) => context.fillText(line, 600, 290 + index * 66));

  const headlineBottom = 290 + headlineLines.length * 66;
  context.fillRect(80, headlineBottom + 10, 1040, 2);

  context.textAlign = 'left';
  context.font = '28px Georgia, serif';
  const article = clean(state.campaign.newspaperText, 'La casa se negó a facilitar una versión coherente.', 700);
  const articleLines = wrap(context, article, 900).slice(0, 18);
  articleLines.forEach((line, index) => context.fillText(line, 150, headlineBottom + 85 + index * 42));

  const statsTop = Math.min(1190, headlineBottom + 85 + articleLines.length * 42 + 55);
  context.fillRect(80, statsTop, 1040, 2);
  const stats = [
    `ACTO ${state.campaign.act}`,
    `LIQUIDEZ $${state.budget.toLocaleString()}`,
    `DEUDA $${state.debt.toLocaleString()}`,
    `NORMALIDAD ${state.campaign.delirium.normalityResidual}%`
  ];
  context.textAlign = 'center';
  context.font = '700 22px Georgia, serif';
  stats.forEach((stat, index) => context.fillText(stat, 180 + index * 280, statsTop + 55));

  context.font = 'italic 22px Georgia, serif';
  context.fillText('“La propiedad privada continúa bajo investigación.” · Sir Roquefort III', 600, 1360);
  context.font = '16px monospace';
  context.fillText(`EDICIÓN ${state.seed} · SIN CONFESIONES CRUDAS`, 600, 1415);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `avaluo-nacional-${state.seed}.png`;
    anchor.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}
