import type { StoryBeat } from './types';

export function makeStoryBeat(
  turn: number,
  kind: StoryBeat['kind'],
  title: string,
  text: string,
  importance: StoryBeat['importance'] = 2,
  motif?: string
): StoryBeat {
  const safeTitle = title.replace(/[<>]/g, '').slice(0, 90);
  const safeText = text.replace(/[<>]/g, '').slice(0, 360);
  return {
    id: `${turn}-${kind}-${Math.abs(hash(`${safeTitle}:${safeText}`))}`,
    turn,
    kind,
    title: safeTitle,
    text: safeText,
    motif,
    importance
  };
}

export function appendStoryBeat(log: StoryBeat[], beat: StoryBeat, limit = 60): StoryBeat[] {
  if (log.some((entry) => entry.id === beat.id)) return log;
  return [...log, beat].slice(-limit);
}

function hash(value: string): number {
  let result = 0;
  for (let i = 0; i < value.length; i += 1) result = ((result << 5) - result + value.charCodeAt(i)) | 0;
  return result;
}
