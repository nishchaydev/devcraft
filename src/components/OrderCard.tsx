import React from 'react';
import { StoredOrder } from '../db/schema';
import { Calendar, User, AlertCircle } from 'lucide-react';

export const OrderCard: React.FC<{ order: StoredOrder; onClick?: () => void }> = ({ order, onClick }) => {
  const isOverdue = order.due_date && order.due_date < new Date().toISOString().split('T')[0];
  const isToday = order.due_date && order.due_date === new Date().toISOString().split('T')[0];

  return (
    <div className="card animate-fade-in" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={16} color="#94a3b8" />
            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#f8fafc' }}>
              {order.customer || 'Unspecified Customer'}
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>ID: {order.id}</span>
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {order.needs_clarification && (
            <span className="badge badge-clarify">
              <AlertCircle size={12} /> CLARIFY
            </span>
          )}
          <span className={`badge badge-${order.status.toLowerCase()}`}>
            {order.status}
          </span>
        </div>
      </div>

      <div style={{ margin: '10px 0', padding: '8px 12px', backgroundColor: '#0f172a', borderRadius: '6px' }}>
        {order.items.length === 0 ? (
          <span style={{ fontSize: '0.875rem', color: '#ef4444', fontStyle: 'italic' }}>No identifiable item parsed</span>
        ) : (
          order.items.map((item, idx) => (
            <div key={idx} style={{ fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between', borderBottom: idx < order.items.length - 1 ? '1px solid #1e293b' : 'none', padding: '4px 0' }}>
              <span style={{ fontWeight: 600, color: '#e2e8f0' }}>
                {item.quantity}x {item.description}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                {Object.entries(item.attributes).map(([k, v]) => `${k}: ${v}`).join(' · ')}
              </span>
            </div>
          ))
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: '#94a3b8', marginTop: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={14} color={isOverdue ? '#ef4444' : isToday ? '#fbbf24' : '#94a3b8'} />
          <span style={{ color: isOverdue ? '#ef4444' : isToday ? '#fbbf24' : '#94a3b8', fontWeight: isOverdue || isToday ? 700 : 400 }}>
            {order.due_date ? `${order.due_date} ${isOverdue ? '(OVERDUE)' : isToday ? '(TODAY)' : ''}` : 'No deadline'}
          </span>
        </div>

        {order.amount !== null && (
          <span style={{ fontWeight: 700, fontSize: '1rem', color: '#34d399' }}>
            ₹{order.amount.toLocaleString('en-IN')}
          </span>
        )}
      </div>
    </div>
  );
};
