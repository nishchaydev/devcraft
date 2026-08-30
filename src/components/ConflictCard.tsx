import React, { useState } from 'react';
import { ConflictRecord, db } from '../db/schema';
import { Check, Edit3, ShieldAlert } from 'lucide-react';

interface ConflictCardProps {
  conflict: ConflictRecord;
  onResolved?: () => void;
}

export const ConflictCard: React.FC<ConflictCardProps> = ({ conflict, onResolved }) => {
  const [customVal, setCustomVal] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleResolveWinner = async () => {
    await db.conflicts.update(conflict.conflict_id, {
      surfaced_to_operator: false,
      operator_action: 'DISMISS'
    });

    if (onResolved) onResolved();
  };

  const handleResolveOther = async () => {
    await db.conflicts.update(conflict.conflict_id, {
      surfaced_to_operator: false,
      operator_action: 'RESTORE_LOSING_VAL'
    });

    // Apply losing op value to target order in IndexedDB
    const targetOrder = await db.orders.get(conflict.order_id);
    if (targetOrder) {
      if (conflict.winning_op.target_path === 'amount') {
        targetOrder.amount = typeof conflict.losing_op.value === 'number' ? conflict.losing_op.value : parseInt(conflict.losing_op.value, 10);
      } else if (conflict.winning_op.target_path === 'due_date') {
        targetOrder.due_date = String(conflict.losing_op.value);
      }
      await db.orders.put(targetOrder);
    }

    if (onResolved) onResolved();
  };

  const handleResolveCustom = async () => {
    if (!customVal.trim()) return;

    await db.conflicts.update(conflict.conflict_id, {
      surfaced_to_operator: false,
      operator_action: 'MANUAL_OVERRIDE'
    });

    const targetOrder = await db.orders.get(conflict.order_id);
    if (targetOrder) {
      if (conflict.winning_op.target_path === 'amount') {
        targetOrder.amount = parseInt(customVal.trim(), 10) || targetOrder.amount;
      } else if (conflict.winning_op.target_path === 'due_date') {
        targetOrder.due_date = customVal.trim();
      }
      await db.orders.put(targetOrder);
    }

    setShowCustomInput(false);
    if (onResolved) onResolved();
  };

  const isDeleteVsUpdate = conflict.scenario === 'SCENARIO_3_DELETE_VS_UPDATE' || conflict.winning_op.op_type.includes('DELETE') || conflict.losing_op.op_type.includes('DELETE');

  return (
    <div className="card-glass animate-card-enter" style={{ padding: '16px', marginBottom: '16px', borderColor: '#f59e0b' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldAlert size={18} color="#f59e0b" />
          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fbbf24' }}>
            {conflict.scenario}
          </span>
        </div>
        <span className="badge" style={{ backgroundColor: '#451a03', color: '#fde68a', border: '1px solid #b45309', fontSize: '0.7rem' }}>
          Lamport Ticks L:{conflict.winning_op.lamport_clock} vs L:{conflict.losing_op.lamport_clock}
        </span>
      </div>

      <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '12px' }}>
        Order ID: <strong>{conflict.order_id}</strong> | Field: <code>{conflict.winning_op.target_path}</code>
      </p>

      {/* Side-by-Side Comparison Table */}
      <div style={{ overflowX: 'auto', marginBottom: '14px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#0f172a', color: '#94a3b8', borderBottom: '1px solid #334155', textAlign: 'left' }}>
              <th style={{ padding: '8px 10px' }}>Target Path</th>
              <th style={{ padding: '8px 10px' }}>Winning Edit ({conflict.winning_op.device_id})</th>
              <th style={{ padding: '8px 10px' }}>Surfaced Lost Edit ({conflict.losing_op.device_id})</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #1e293b' }}>
              <td style={{ padding: '10px', color: '#cbd5e1', fontWeight: 600 }}>
                <code>{conflict.winning_op.target_path}</code>
              </td>

              {/* Winning Op Column */}
              <td style={{ padding: '10px', backgroundColor: 'rgba(6, 78, 59, 0.3)' }}>
                {isDeleteVsUpdate && conflict.winning_op.op_type.includes('DELETE') ? (
                  <span style={{ color: '#ef4444', fontWeight: 700 }}>
                    🗑️ Item Deleted
                  </span>
                ) : (
                  <span style={{ color: '#34d399', fontWeight: 700 }}>
                    {JSON.stringify(conflict.winning_op.value)}
                  </span>
                )}
                <span style={{ marginLeft: '6px', color: '#34d399', fontWeight: 800 }}>✓ Winner</span>
              </td>

              {/* Losing Op Column */}
              <td style={{ padding: '10px', backgroundColor: 'rgba(69, 26, 3, 0.3)' }}>
                {isDeleteVsUpdate && conflict.losing_op.op_type.includes('DELETE') ? (
                  <span style={{ color: '#ef4444', textDecoration: 'line-through', fontWeight: 700 }}>
                    🗑️ Item Deleted
                  </span>
                ) : (
                  <span style={{ color: '#fbbf24', textDecoration: 'line-through' }}>
                    {JSON.stringify(conflict.losing_op.value)}
                  </span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Resolution Action Buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={handleResolveWinner}
          className="btn-primary"
          style={{ backgroundColor: '#10b981', flex: 1, minHeight: '36px', fontSize: '0.8rem' }}
        >
          <Check size={14} /> Keep Winner ({JSON.stringify(conflict.winning_op.value)})
        </button>

        <button
          onClick={handleResolveOther}
          className="btn-secondary"
          style={{ flex: 1, minHeight: '36px', fontSize: '0.8rem' }}
        >
          Use Other Value
        </button>

        <button
          onClick={() => setShowCustomInput(!showCustomInput)}
          className="btn-secondary"
          style={{ minHeight: '36px', fontSize: '0.8rem' }}
        >
          <Edit3 size={14} /> Custom
        </button>
      </div>

      {/* Inline Custom Override Input */}
      {showCustomInput && (
        <div style={{ marginTop: '10px', display: 'flex', gap: '6px' }} className="animate-fade-in">
          <input
            type="text"
            className="input-field"
            style={{ margin: 0, fontSize: '0.85rem' }}
            placeholder="Enter custom override value..."
            value={customVal}
            onChange={e => setCustomVal(e.target.value)}
          />
          <button onClick={handleResolveCustom} className="btn-primary" style={{ minWidth: '80px', backgroundColor: '#6366f1', minHeight: '40px' }}>
            Apply
          </button>
        </div>
      )}
    </div>
  );
};
