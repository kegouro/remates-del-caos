import React from 'react';
import type { HouseBargain } from '../game/campaign/types';

interface HouseBargainSceneProps {
  bargains: HouseBargain[];
  hunger: number;
  alias: string;
  onAccept: (bargainId: string) => void;
  onDecline: () => void;
}

export const HouseBargainScene: React.FC<HouseBargainSceneProps> = ({ bargains, hunger, alias, onAccept, onDecline }) => (
  <main className="house-bargain-screen">
    <section className="house-bargain-card">
      <p className="eyebrow">OFERTA DIRECTA DE LA PROPIEDAD INMUEBLE</p>
      <h1>La casa tiene hambre, {alias || 'postor'}.</h1>
      <p className="house-bargain-intro">
        Las molduras se acercan. Una puerta que no estaba allí abre una carpeta y ofrece tres contratos.
        Ninguno utiliza la palabra sacrificio, lo que resulta administrativamente preocupante.
      </p>

      <div className="house-hunger-contract" aria-label={`Hambre de la casa ${hunger} de 100`}>
        <span>Hambre arquitectónica</span>
        <div><i style={{ width: `${hunger}%` }} /></div>
        <strong>{hunger}%</strong>
      </div>

      <div className="house-bargain-grid">
        {bargains.map((bargain) => (
          <article key={bargain.id} className="house-bargain-option">
            <span className="house-bargain-motif">{bargain.motif}</span>
            <h2>{bargain.title}</h2>
            <p>{bargain.description}</p>
            <dl>
              <div><dt>ENTREGAS</dt><dd>{bargain.costLabel}</dd></div>
              <div><dt>RECIBES</dt><dd>{bargain.rewardLabel}</dd></div>
            </dl>
            <small>{bargain.warning}</small>
            <button type="button" className="btn-gothic" onClick={() => onAccept(bargain.id)}>
              Firmar sin leer dos veces
            </button>
          </article>
        ))}
      </div>

      <button type="button" className="btn-gothic btn-pass house-bargain-decline" onClick={onDecline}>
        Rechazar todos los contratos y alimentar el resentimiento del edificio
      </button>
    </section>
  </main>
);
