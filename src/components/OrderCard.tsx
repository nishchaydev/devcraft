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
    <div className="bg-white border border-[#d3cec6] rounded-xl p-4 space-y-3 shadow-sm animate-card-enter hover:border-[#111111] transition-colors duration-150 text-[#111111]">

      {/* ── Header ──────────────────────────────── */}
      <div className="flex justify-between items-start gap-3">
        {/* Customer */}
        <div className="min-w-0">
          <p className="font-semibold text-[#111111] text-sm truncate">
            {order.customer || 'Unspecified Customer'}
          </p>
          <p className="text-[11px] font-mono text-[#7b7b78] mt-0.5">{order.id}</p>
        </div>

        {/* Status chips — right-aligned, won't overflow */}
        <div className="flex flex-wrap justify-end gap-1.5 shrink-0">
          {order.amount != null && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isPaid ? 'bg-[#27ae60]/10 text-[#27ae60] border border-[#27ae60]/30' : 'bg-[#ff5600]/10 text-[#ff5600] border border-[#ff5600]/30'}`}>
              {isPaid ? '✓ PAID' : `UNPAID · ₹${order.amount}`}
            </span>
          )}
          {needsClarify && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#eb5757]/10 text-[#eb5757] border border-[#eb5757]/30">CLARIFY</span>
          )}
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#faf8f5] border border-[#d3cec6] text-[#626260]">
            {order.status}
          </span>
        </div>
      </div>

      {/* ── Items Box ───────────────────────────── */}
      <div className="bg-[#faf8f5] rounded-lg p-3 border border-[#e5e0d8] space-y-2">
        {order.items.length === 0 ? (
          <p className="text-xs text-[#7b7b78] italic">No structured items detected.</p>
        ) : (
          order.items.map((item, idx) => (
            <div key={idx} className="text-sm">
              <p className="font-medium text-[#111111]">
                <span className="text-[#ff5600] font-bold">{item.quantity}×</span> {item.description}
              </p>
              {item.attributes && Object.keys(item.attributes).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {Object.entries(item.attributes).map(([k, v]) => (
                    <span key={k} className="text-[11px] bg-white border border-[#d3cec6] px-2 py-0.5 rounded text-[#626260]">
                      <span className="text-[#7b7b78]">{k}:</span> {String(v)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ── Footer ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-[#e5e0d8]">
        {/* Due date */}
        <div className="flex items-center gap-1.5 text-xs text-[#7b7b78]">
          <Calendar size={12} />
          <span className={order.due_date ? 'text-[#111111] font-mono font-medium' : ''}>
            {order.due_date || 'No deadline'}
          </span>
          {order.amount != null && (
            <span className="text-[#ff5600] font-bold ml-2">₹{order.amount.toLocaleString()}</span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {onMarkPaid && order.amount != null && (
            <button
              onClick={() => onMarkPaid(order.id, !isPaid)}
              className={isPaid
                ? 'ic-btn-secondary text-xs py-1.5 px-3'
                : 'ic-btn-fin text-xs py-1.5 px-3'}
            >
              {isPaid
                ? <><RotateCcw size={12} /> Unpaid</>
                : <><CheckCircle size={12} /> Mark Paid</>}
            </button>
          )}
          {onStatusChange && (
            <button
              onClick={() => onStatusChange(order.id, order.status === 'DELIVERED' ? 'PENDING' : 'DELIVERED')}
              className="ic-btn-primary text-xs py-1.5 px-3"
            >
              <Truck size={12} />
              {order.status === 'DELIVERED' ? 'Pending' : 'Delivered'}
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(order.id)}
              className="p-1.5 text-[#eb5757] hover:bg-[#eb5757]/10 rounded border border-[#eb5757]/30 transition-colors"
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
