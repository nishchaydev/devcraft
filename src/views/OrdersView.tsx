import React, { useState, useEffect } from 'react';
import { db, StoredOrder } from '../db/schema';
import { OrderCard } from '../components/OrderCard';
import { Search, Plus, Package } from 'lucide-react';

const FILTER_CHIPS = [
  { key: 'ALL',        label: 'All'           },
  { key: 'DUE_TODAY',  label: 'Due Today'     },
  { key: 'UNPAID',     label: 'Unpaid'        },
  { key: 'CLARIFY',    label: 'Needs Clarity' },
  { key: 'DELIVERED',  label: 'Delivered'     },
  { key: 'CONFLICTED', label: 'Conflicted'    },
];

export const OrdersView: React.FC<{ onNewOrderClick?: () => void }> = ({ onNewOrderClick }) => {
  const [orders, setOrders]           = useState<StoredOrder[]>([]);
  const [search, setSearch]           = useState('');
  const [filterStatus, setFilter]     = useState('ALL');

  const loadOrders = async () => {
    const list = await db.orders.filter(o => !o.is_deleted).toArray();
    setOrders(list.sort((a, b) => b.updated_at.localeCompare(a.updated_at)));
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleMarkPaid = async (id: string, isPaid: boolean) => {
    await db.orders.update(id, {
      is_paid: isPaid,
      paid_at: isPaid ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    });
    loadOrders();
  };

  const handleStatusChange = async (id: string, status: any) => {
    await db.orders.update(id, { status, updated_at: new Date().toISOString() });
    loadOrders();
  };

  const handleDelete = async (id: string) => {
    await db.orders.update(id, { is_deleted: true, updated_at: new Date().toISOString() });
    loadOrders();
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const filtered = orders.filter(o => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (
        !(o.customer?.toLowerCase().includes(q)) &&
        !o.id.toLowerCase().includes(q) &&
        !o.items.some(it => it.description.toLowerCase().includes(q))
      ) return false;
    }
    if (filterStatus === 'DUE_TODAY')  return o.due_date === todayStr;
    if (filterStatus === 'UNPAID')     return !o.is_paid && (o.amount || 0) > 0;
    if (filterStatus === 'DELIVERED')  return o.status === 'DELIVERED';
    if (filterStatus === 'CONFLICTED') return o.status === 'CONFLICTED';
    if (filterStatus === 'CLARIFY')    return o.needs_clarification;
    return true;
  });

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-white">Orders Feed</h2>
          <p className="text-xs text-slate-500 mt-0.5">{filtered.length} orders · live from IndexedDB</p>
        </div>
        {onNewOrderClick && (
          <button onClick={onNewOrderClick} className="btn-primary text-xs px-3 py-2">
            <Plus size={14} /> New Order
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search customer, order ID, or item…"
          className="input-field pl-9"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {FILTER_CHIPS.map(chip => (
          <button
            key={chip.key}
            onClick={() => setFilter(chip.key)}
            className={`filter-chip ${filterStatus === chip.key ? 'filter-chip-active' : ''}`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 py-12 text-center">
          <Package size={32} className="text-slate-700" />
          <p className="text-slate-500 text-sm">No orders match this filter.</p>
          {onNewOrderClick && (
            <button onClick={onNewOrderClick} className="btn-primary text-xs">
              <Plus size={14} /> Add First Order
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onMarkPaid={handleMarkPaid}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
