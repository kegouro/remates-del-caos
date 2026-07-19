import type { GameState } from '../types';

export function getPlayerEpithet(state: GameState): string {
  const alias = state.dossier.alias || state.prologue?.alias || 'Postor Incógnito';
  const awake = state.inventory.some((item) => item.agency && item.agency !== 'Dormido');

  let title = 'Persona Natural Sospechosa';
  if (state.campaign.soulSold) title = 'Activo Desalmado del Sumidero';
  else if (state.campaign.delirium.normalityResidual <= 0) title = 'Liquidador de la Normalidad';
  else if (state.debt >= 12000) title = 'Archiduque del Sobregiro Perpetuo';
  else if (state.campaign.suspicion >= 70) title = 'Contribuyente de Interés Paranormal';
  else if (awake && state.inventory.length >= 5) title = 'Curador de Patrimonios que Devuelven la Mirada';
  else if (state.prestige >= 70) title = 'Marqués de la Validación Comprada';
  else if (state.curse >= 12) title = 'Albacea de Objetos Mal Aconsejados';
  else if (state.campaign.consecutivePasses >= 3) title = 'Santo Patrono de la Abstinencia Patrimonial';
  else if (state.inventory.length >= 5) title = 'Acumulador con Personalidad Jurídica Pendiente';
  else if (state.campaign.audienceMood >= 60) title = 'Favorito Temporal del Público Inestable';
  else if (state.campaign.houseHunger >= 75) title = 'Aperitivo Reconocido por la Casa';

  return `${alias}, ${title}`;
}

export function getRunEpitaph(state: GameState): string {
  if (state.campaign.soulSold) return 'Pagó todas sus deudas salvo la única que ya no podía localizar dentro de sí.';
  if (state.debt > state.budget * 2) return 'Entró buscando una ganga y salió convertido en garantía.';
  if (state.inventory.some((item) => item.agency === 'Propietario')) return 'Adquirió objetos hasta que uno de ellos corrigió el orden de propiedad.';
  if (state.campaign.delirium.normalityResidual <= 0) return 'Fue la última persona en recordar que aquello debía parecer normal.';
  if (state.inventory.length === 0) return 'No compró nada. La casa considera esto una forma agravada de resistencia.';
  if (state.prestige >= 70) return 'Fue observado, aplaudido y finalmente tasado por el mismo público que intentó impresionar.';
  return 'Murió financieramente como vivió administrativamente: firmando donde indicaba la flecha.';
}
