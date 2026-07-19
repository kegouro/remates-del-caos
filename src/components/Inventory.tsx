import React from 'react';
import type { InventoryItem } from '../game/types';


interface InventoryProps {
  inventory: InventoryItem[];
  onSellItem: (itemId: string) => void;
  debt: number;
  onHearPetition?: (itemId: string) => void;
}

function purchaseLabel(item: InventoryItem): string {
  if (item.moneda_compra === 'compostura') return `${item.precio_compra} COM`;
  if (item.moneda_compra === 'prestigio') return `${item.precio_compra} PRE`;
  return `$${item.precio_compra.toLocaleString()}`;
}

export const Inventory: React.FC<InventoryProps> = ({ inventory, onSellItem, debt, onHearPetition }) => {
  return (
    <div className="inventory-box">
      <div className="panel-header" style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.1)' }}>
        ◈ Patrimonio Inexplicable ({inventory.length} bienes legalmente discutibles) ◈
      </div>

      {inventory.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '25px', color: 'var(--color-text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>
          No has adquirido ningun lote inútil todavía. Tu dignidad sigue intacta por ahora.
        </div>
      ) : (
        <div className="inventory-grid">
          {inventory.map((item) => {
            const sellPrice = Math.floor(item.precio_compra * 0.7);
            return (
              <div key={item.id} className="inventory-item-card">
                <div className="inv-item-header">
                  <div className="inv-item-name">{item.nombre_item}</div>
                  <div className="inv-item-price">{purchaseLabel(item)}</div>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-gold)', fontStyle: 'italic', marginBottom: '5px' }}>
                  {item.categoria} (Rareza: {item.rareza})
                </div>
                <p className="inv-item-desc">"{item.descripcion}"</p>
                <div className="inv-item-curse">
                  Consecuencia: {item.letra_pequena}
                </div>
                {item.agency && item.agency !== 'Dormido' && (
                  <div className="item-agency-box">
                    <strong>Estado jurídico: {item.agency}</strong>
                    <span>{item.petitionText || item.desire || item.callbackText || 'El objeto está preparando una declaración.'}</span>
                    {onHearPetition && item.petitionAgency !== item.agency && (
                      <button type="button" className="object-petition-button" onClick={() => onHearPetition(item.id)}>
                        Escuchar petición formal
                      </button>
                    )}
                  </div>
                )}
                {item.motifs?.length ? <div className="item-motifs">Motivo: {item.motifs.join(' · ')}</div> : null}
                
                {debt > 0 && (
                  <button
                    className="btn-sell-item"
                    onClick={() => onSellItem(item.id)}
                  >
                    Vender a Liquidadores por ${sellPrice.toLocaleString()} (tasación de emergencia)
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default Inventory;
