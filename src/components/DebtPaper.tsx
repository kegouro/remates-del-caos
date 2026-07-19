import React from 'react';

interface DebtPaperProps {
  debt: number;
  onPayOff: () => void;
  onSellSoul: () => void;
}

export const DebtPaper: React.FC<DebtPaperProps> = ({ debt, onPayOff, onSellSoul }) => {
  return (
    <div className="debt-blocker-overlay">
      <div className="debt-paper-scrap">
        <div className="debt-paper-title">PAGAR LO QUE DEBES</div>
        <div className="debt-paper-text">
          Don Sanguino ha bloqueado los controles de la subasta.
          Debes un total de ${debt.toLocaleString()} pesos.
          <br />
          No podras pujar ni pasar hasta abonar tu saldo o vender tu alma a Sir Roquefort III.
        </div>
        <div style={{ marginTop: '15px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button className="btn-gothic-sm" onClick={onPayOff}>
            Abonar todo lo posible
          </button>
          <button className="btn-gothic-sm" style={{ borderColor: '#8b0000', color: '#ff3333' }} onClick={onSellSoul}>
            Vender Alma al Duque
          </button>
        </div>
      </div>
    </div>
  );
};
export default DebtPaper;
