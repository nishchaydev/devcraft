import React, { useState, useEffect } from 'react';
import { db, StoredOrder } from '../db/schema';
import { OrderCard } from '../components/OrderCard';
import { Search, Plus } from 'lucide-react';

export const OrdersView: React.FC<{ onNewOrderClick: () => void }> = ({ onNewOrderClick }) => {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const loadOrders = async () => {
    const list = await db.orders.filter(o => !o.is_deleted).toArray();
    setOrders(list.sort((a, b) => b.updated_at.localeCompare(a.updated_at)));
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 1500);
    return () => clearInterval(interval);
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredOrders = orders.filter(o => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchCustomer = o.customer && o.customer.toLowerCase().includes(q);
      const matchId = o.id.toLowerCase().includes(q);
      const matchItems = o.items.some(it => it.description.toLowerCase().includes(q));
      if (!matchCustomer && !matchId && !matchItems) return false;
    }

    if (filterStatus === 'DUE_TODAY') return o.due_date === todayStr;
    if (filterStatus === 'UNPAID') return o.amount !== null && o.amount > 0;
    if (filterStatus === 'CONFLICTED') return o.status === 'CONFLICTED';
    if (filterStatus === 'CLARIFY') return o.needs_clarification;

    return true;
  });

  return (
    <div style={{ padding: '16px' }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
          Orders Feed ({filteredOrders.length})
        </h2>
        <button onClick={onNewOrderClick} className="btn-primary" style={{ minHeight: '40px', padding: '0 12px', width: 'auto' }}>
          <Plus size={16} /> New Order
        </button>
      </div>

      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '16px' }} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search customer, order ID, or item..."
          className="input-field"
          style={{ paddingLeft: '40px' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '12px' }}>
        {[
          { key: 'ALL', label: 'All' },
          { key: 'DUE_TODAY', label: 'Due Today' },
          { key: 'UNPAID', label: 'Unpaid' },
          { key: 'CONFLICTED', label: 'Conflicted' },
          { key: 'CLARIFY', label: 'Clarification' }
        ].map(chip => (
          <button
            key={chip.key}
            onClick={() => setFilterStatus(chip.key)}
            style={{
              backgroundColor: filterStatus === chip.key ? '#6366f1' : '#1e293b',
              color: filterStatus === chip.key ? '#ffffff' : '#94a3b8',
              border: '1px solid #475569',
              padding: '4px 12px',
              fontSize: '0.75rem',
              borderRadius: '9999px',
              minHeight: '32px',
              whiteSpace: 'nowrap'
            }}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '32px 16px', color: '#94a3b8' }}>
          <p>No orders found matching the filter.</p>
        </div>
      ) : (
        filteredOrders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))
      )}
    </div>
  );
};
