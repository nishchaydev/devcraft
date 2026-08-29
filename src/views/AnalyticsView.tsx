import React, { useState, useEffect } from 'react';
import { QueryEngine, CustomerBalance, CapacitySummary } from '../query/queryEngine';
import { StoredOrder } from '../db/schema';
import { OrderCard } from '../components/OrderCard';
import { Calendar, DollarSign, History, BarChart3, Search } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const [activeQuery, setActiveQuery] = useState<'DUE' | 'UNPAID' | 'HISTORY' | 'CAPACITY'>('DUE');
  
  // Data States
  const [dueData, setDueData] = useState<{ overdue: StoredOrder[]; dueToday: StoredOrder[]; upcoming: StoredOrder[] }>({ overdue: [], dueToday: [], upcoming: [] });
  const [unpaidData, setUnpaidData] = useState<{ totalReceivables: number; customerLedger: CustomerBalance[] }>({ totalReceivables: 0, customerLedger: [] });
  const [capacityData, setCapacityData] = useState<CapacitySummary | null>(null);
  
  // Customer History Query state
  const [searchCustomer, setSearchCustomer] = useState('');
  const [customerHistory, setCustomerHistory] = useState<StoredOrder[]>([]);

  const loadQueryData = async () => {
    if (activeQuery === 'DUE') {
      const data = await QueryEngine.getDueOrders();
      setDueData(data);
    } else if (activeQuery === 'UNPAID') {
      const data = await QueryEngine.getUnpaidBalances();
      setUnpaidData(data);
    } else if (activeQuery === 'CAPACITY') {
      const data = await QueryEngine.getCommittedCapacity();
      setCapacityData(data);
    }
  };

  useEffect(() => {
    loadQueryData();
  }, [activeQuery]);

  const handleSearchHistory = async () => {
    if (!searchCustomer.trim()) return;
    const history = await QueryEngine.getCustomerHistory(searchCustomer.trim());
    setCustomerHistory(history);
  };

  return (
    <div style={{ padding: '16px' }} className="animate-fade-in">
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
        Offline Operational Analytics
      </h2>

      {/* Query Selector Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '16px' }}>
        {[
          { key: 'DUE', label: 'Due / Overdue', icon: Calendar },
          { key: 'UNPAID', label: 'Receivables', icon: DollarSign },
          { key: 'HISTORY', label: 'Customer History', icon: History },
          { key: 'CAPACITY', label: 'Capacity', icon: BarChart3 }
        ].map(q => {
          const Icon = q.icon;
          return (
            <button
              key={q.key}
              onClick={() => setActiveQuery(q.key as any)}
              style={{
                backgroundColor: activeQuery === q.key ? '#6366f1' : '#1e293b',
                color: activeQuery === q.key ? '#ffffff' : '#94a3b8',
                border: '1px solid #475569',
                padding: '8px 4px',
                fontSize: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600
              }}
            >
              <Icon size={16} />
              <span>{q.label}</span>
            </button>
          );
        })}
      </div>

      {/* Q1: Due & Overdue Orders View */}
      {activeQuery === 'DUE' && (
        <div>
          <div className="card" style={{ backgroundColor: '#450a0a', borderColor: '#dc2626', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f87171' }}>
              Overdue Orders ({dueData.overdue.length})
            </h3>
          </div>
          {dueData.overdue.map(o => <OrderCard key={o.id} order={o} />)}

          <div className="card" style={{ backgroundColor: '#451a03', borderColor: '#d97706', margin: '16px 0 12px 0' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fbbf24' }}>
              Due Today ({dueData.dueToday.length})
            </h3>
          </div>
          {dueData.dueToday.map(o => <OrderCard key={o.id} order={o} />)}
        </div>
      )}

      {/* Q2: Receivables & Unpaid Balances View */}
      {activeQuery === 'UNPAID' && (
        <div>
          <div className="card" style={{ backgroundColor: '#064e3b', borderColor: '#059669', marginBottom: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: '#a7f3d0' }}>Total Outstanding Receivables</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34d399', margin: '4px 0' }}>
              ₹{unpaidData.totalReceivables.toLocaleString('en-IN')}
            </h3>
          </div>

          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            Customer Ledger Balances ({unpaidData.customerLedger.length})
          </h3>

          {unpaidData.customerLedger.map(c => (
            <div key={c.customer} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '1rem' }}>{c.customer}</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>
                  {c.orderCount} unpaid order(s) · Due: {c.latestDueDate || 'N/A'}
                </span>
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fbbf24' }}>
                ₹{c.totalUnpaid.toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Q3: Customer History Lookup ("last time jaisa") */}
      {activeQuery === 'HISTORY' && (
        <div>
          <div className="card">
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#94a3b8' }}>
              Search Customer Name for Specs History:
            </label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <input
                type="text"
                value={searchCustomer}
                onChange={e => setSearchCustomer(e.target.value)}
                placeholder="e.g. Ramesh, Sunita, Meena..."
                className="input-field"
                style={{ marginBottom: 0 }}
              />
              <button onClick={handleSearchHistory} className="btn-primary" style={{ width: 'auto', padding: '0 16px' }}>
                <Search size={16} /> Search
              </button>
            </div>
          </div>

          {customerHistory.map(o => <OrderCard key={o.id} order={o} />)}
        </div>
      )}

      {/* Q4: Capacity Commitment Breakdown */}
      {activeQuery === 'CAPACITY' && capacityData && (
        <div>
          <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', textAlign: 'center', marginBottom: '12px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total Committed Orders</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#6366f1' }}>{capacityData.totalOrders}</h3>
            </div>
            <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total Committed Items</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399' }}>{capacityData.totalItems}</h3>
            </div>
          </div>

          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            Items Tally Breakdown
          </h3>
          <div className="card">
            {Object.entries(capacityData.itemCountsByDescription).map(([desc, count]) => (
              <div key={desc} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #334155' }}>
                <span style={{ textTransform: 'capitalize', color: '#e2e8f0', fontWeight: 600 }}>{desc}</span>
                <span style={{ color: '#6366f1', fontWeight: 700 }}>{count} units</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
