import React from 'react';
import { StoredOrder } from '../db/schema';
import { Calendar, Trash2, CheckCircle, RotateCcw, Truck } from 'lucide-react';

interface OrderCardProps {
  order: StoredOrder;
  onMarkPaid?:     (id: string, isPaid: boolean) => void;
  onStatusChange?: (id: string, status: any)     => void;
  onDelete?:       (id: string)                  => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order, onMarkPaid, onStatusChange, onDelete,
}) => {
  const isPaid        = order.is_paid;
  const needsClarify  = order.needs_clarification || order.status === 'NEEDS_CLARIFICATION';

  return (
    <div className="card-elevated p-4 space-y-3 animate-card-enter hover:border-slate-700 transition-colors duration-150">

      {/* ── Header ──────────────────────────────── */}
      <div className="flex justify-between items-start gap-3">
        {/* Customer */}
        <div className="min-w-0">
          <p className="font-bold text-white text-sm truncate">
            {order.customer || 'Unspecified Customer'}
          </p>
          <p className="text-[11px] font-mono text-slate-600 mt-0.5">{order.id}</p>
        </div>

        {/* Status chips — right-aligned, won't overflow */}
        <div className="flex flex-wrap justify-end gap-1.5 shrink-0">
          {order.amount != null && (
            <span className={`badge ${isPaid ? 'badge-paid' : 'badge-unpaid'}`}>
              {isPaid ? '✓ PAID' : `UNPAID · ₹${order.amount}`}
            </span>
          )}
          {needsClarify && (
            <span className="badge badge-clarify text-[10px]">CLARIFY</span>
          )}
          <span className="badge bg-slate-800/80 border-slate-700/60 text-slate-400 text-[10px] font-mono">
            {order.status}
          </span>
        </div>
      </div>

      {/* ── Items Box ───────────────────────────── */}
      <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/50 space-y-2">
        {order.items.length === 0 ? (
          <p className="text-xs text-slate-600 italic">No structured items detected.</p>
        ) : (
          order.items.map((item, idx) => (
            <div key={idx} className="text-sm">
              <p className="font-semibold text-slate-200">
                <span className="text-indigo-400 font-bold">{item.quantity}×</span> {item.description}
              </p>
              {item.attributes && Object.keys(item.attributes).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {Object.entries(item.attributes).map(([k, v]) => (
                    <span key={k} className="attr-chip">
                      <span className="text-slate-500">{k}:</span> {String(v)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ── Footer ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-800/50">
        {/* Due date */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar size={12} />
          <span className={order.due_date ? 'text-slate-300 font-mono' : ''}>
            {order.due_date || 'No deadline'}
          </span>
          {order.amount != null && (
            <span className="text-amber-400 font-bold ml-2">₹{order.amount.toLocaleString()}</span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {onMarkPaid && order.amount != null && (
            <button
              onClick={() => onMarkPaid(order.id, !isPaid)}
              className={isPaid
                ? 'btn-secondary text-xs py-1.5 px-3'
                : 'btn-emerald text-xs py-1.5 px-3'}
            >
              {isPaid
                ? <><RotateCcw size={12} /> Unpaid</>
                : <><CheckCircle size={12} /> Mark Paid</>}
            </button>
          )}
          {onStatusChange && (
            <button
              onClick={() => onStatusChange(order.id, order.status === 'DELIVERED' ? 'PENDING' : 'DELIVERED')}
              className="btn-primary text-xs py-1.5 px-3"
            >
              <Truck size={12} />
              {order.status === 'DELIVERED' ? 'Pending' : 'Delivered'}
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(order.id)}
              className="btn-danger py-1.5 px-2.5"
              title="Delete order"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
