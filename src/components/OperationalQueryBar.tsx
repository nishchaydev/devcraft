import React, { useState, useEffect } from 'react';
import { OperationalQueryEngine, DebtorSummary, DayCapacity } from '../query/operationalQueries';
import { StoredOrder, db } from '../db/schema';
import { Calendar, DollarSign, History, BarChart2, Search, Zap } from 'lucide-react';
import { AttributeChip } from './AttributeChip';

export const OperationalQueryBar: React.FC<{ onRefreshNeeded?: () => void }> = ({ onRefreshNeeded }) => {
  const [activeTab, setActiveTab] = useState<'DUE' | 'RECEIVABLES' | 'SPECS' | 'CAPACITY'>('DUE');
  const [nlQuery, setNlQuery] = useState('');
  
  // Query Results
  const [dueData, setDueData] = useState<{ dueToday: StoredOrder[]; overdue: StoredOrder[] }>({ dueToday: [], overdue: [] });
  const [receivablesData, setReceivablesData] = useState<{ totalReceivables: number; debtors: DebtorSummary[] }>({ totalReceivables: 0, debtors: [] });
  const [selectedCustomer, setSelectedCustomer] = useState('Sarita Didi');
  const [lastOrderSpecs, setLastOrderSpecs] = useState<StoredOrder | null>(null);
  const [capacityData, setCapacityData] = useState<DayCapacity[]>([]);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const loadActiveQuery = async () => {
    if (activeTab === 'DUE') {
      const res = await OperationalQueryEngine.getDueAndOverdue();
      setDueData(res);
    } else if (activeTab === 'RECEIVABLES') {
      const res = await OperationalQueryEngine.getCustomerReceivables();
      setReceivablesData(res);
    } else if (activeTab === 'SPECS') {
      const res = await OperationalQueryEngine.getCustomerLastOrderSpecs(selectedCustomer);
      setLastOrderSpecs(res);
    } else if (activeTab === 'CAPACITY') {
      const res = await OperationalQueryEngine.getCommittedCapacityThisWeek();
      setCapacityData(res);
    }
  };

  useEffect(() => {
    loadActiveQuery();
  }, [activeTab, selectedCustomer]);

  const handleNlSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = nlQuery.toLowerCase().trim();
    if (!q) return;

    if (q.includes('money') || q.includes('owe') || q.includes('udhar') || q.includes('balance') || q.includes('receivable')) {
      setActiveTab('RECEIVABLES');
    } else if (q.includes('due') || q.includes('today') || q.includes('overdue') || q.includes('pending')) {
      setActiveTab('DUE');
    } else if (q.includes('capacity') || q.includes('week') || q.includes('workload') || q.includes('load')) {
      setActiveTab('CAPACITY');
    } else {
      setSelectedCustomer(q);
      setActiveTab('SPECS');
    }
  };

  const handleMarkPaid = async (orderIds: string[]) => {
    for (const id of orderIds) {
      await db.orders.update(id, {
        is_paid: true,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    setFeedbackMsg('Payment recorded! Receivables updated.');
    loadActiveQuery();
    if (onRefreshNeeded) onRefreshNeeded();
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  return (
    <div className="card-glass animate-fade-in" style={{ padding: '16px', marginBottom: '16px', borderColor: '#6366f1' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
          <Zap size={18} color="#facc15" /> Ask Shop Floor (Offline NL & 1-Click Queries)
        </h3>
        <span className="badge" style={{ backgroundColor: '#1e1b4b', color: '#818cf8', border: '1px solid #4338ca' }}>
          100% Offline IndexedDB
        </span>
      </div>

      {/* Offline Natural Language Search Input */}
      <form onSubmit={handleNlSearch} style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            value={nlQuery}
            onChange={e => setNlQuery(e.target.value)}
            placeholder='Ask e.g. "who owes money", "due today", "Sarita didi", "capacity"...'
            className="input-field"
            style={{ paddingLeft: '32px', marginBottom: 0, fontSize: '0.8rem' }}
          />
          <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
        <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0 14px', minHeight: '36px', fontSize: '0.8rem' }}>
          Search
        </button>
      </form>

      {feedbackMsg && (
        <div style={{ backgroundColor: '#064e3b', color: '#34d399', padding: '8px', borderRadius: '6px', fontSize: '0.78rem', marginBottom: '10px', fontWeight: 600 }}>
          {feedbackMsg}
        </div>
      )}

      {/* 4 Quick Action Pills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('DUE')}
          style={{
            backgroundColor: activeTab === 'DUE' ? '#7f1d1d' : '#1e293b',
            color: activeTab === 'DUE' ? '#fca5a5' : '#94a3b8',
            border: `1px solid ${activeTab === 'DUE' ? '#dc2626' : '#334155'}`,
            padding: '8px 4px',
            fontSize: '0.72rem',
            fontWeight: 700,
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px'
          }}
        >
          <Calendar size={14} />
          <span>Due & Overdue</span>
        </button>

        <button
          onClick={() => setActiveTab('RECEIVABLES')}
          style={{
            backgroundColor: activeTab === 'RECEIVABLES' ? '#064e3b' : '#1e293b',
            color: activeTab === 'RECEIVABLES' ? '#34d399' : '#94a3b8',
            border: `1px solid ${activeTab === 'RECEIVABLES' ? '#059669' : '#334155'}`,
            padding: '8px 4px',
            fontSize: '0.72rem',
            fontWeight: 700,
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px'
          }}
        >
          <DollarSign size={14} />
          <span>Who Owes Money</span>
        </button>

        <button
          onClick={() => setActiveTab('SPECS')}
          style={{
            backgroundColor: activeTab === 'SPECS' ? '#312e81' : '#1e293b',
            color: activeTab === 'SPECS' ? '#a5b4fc' : '#94a3b8',
            border: `1px solid ${activeTab === 'SPECS' ? '#6366f1' : '#334155'}`,
            padding: '8px 4px',
            fontSize: '0.72rem',
            fontWeight: 700,
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px'
          }}
        >
          <History size={14} />
          <span>Last Order Specs</span>
        </button>

        <button
          onClick={() => setActiveTab('CAPACITY')}
          style={{
            backgroundColor: activeTab === 'CAPACITY' ? '#451a03' : '#1e293b',
            color: activeTab === 'CAPACITY' ? '#fde047' : '#94a3b8',
            border: `1px solid ${activeTab === 'CAPACITY' ? '#d97706' : '#334155'}`,
            padding: '8px 4px',
            fontSize: '0.72rem',
            fontWeight: 700,
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px'
          }}
        >
          <BarChart2 size={14} />
          <span>Capacity Week</span>
        </button>
      </div>

      {/* Query Answers Area */}
      <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
        {/* Q1: Due Today & Overdue */}
        {activeTab === 'DUE' && (
          <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <div style={{ flex: 1, backgroundColor: 'rgba(220, 38, 38, 0.2)', border: '1px solid #dc2626', padding: '8px', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.7rem', color: '#fca5a5', fontWeight: 700 }}>OVERDUE ORDERS</span>
                <h4 style={{ fontSize: '1.25rem', color: '#ef4444', margin: '2px 0 0 0', fontWeight: 900 }}>{dueData.overdue.length}</h4>
              </div>
              <div style={{ flex: 1, backgroundColor: 'rgba(217, 119, 6, 0.2)', border: '1px solid #d97706', padding: '8px', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.7rem', color: '#fde047', fontWeight: 700 }}>DUE TODAY (Aug 30)</span>
                <h4 style={{ fontSize: '1.25rem', color: '#fbbf24', margin: '2px 0 0 0', fontWeight: 900 }}>{dueData.dueToday.length}</h4>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
              {[...dueData.overdue, ...dueData.dueToday].map((o) => (
                <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#020617', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem' }}>
                  <div>
                    <span style={{ fontWeight: 700, color: '#f8fafc' }}>{o.customer || 'Unspecified'}</span>
                    <span style={{ color: '#94a3b8', marginLeft: '6px' }}>
                      ({o.items.map(it => `${it.quantity} ${it.description}`).join(', ')})
                    </span>
                  </div>
                  <span className="badge" style={{ backgroundColor: o.due_date! < '2026-08-30' ? '#450a0a' : '#451a03', color: o.due_date! < '2026-08-30' ? '#f87171' : '#fbbf24' }}>
                    {o.due_date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Q2: Who Owes Money */}
        {activeTab === 'RECEIVABLES' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', backgroundColor: 'rgba(6, 78, 59, 0.4)', padding: '8px', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: '#a7f3d0', fontWeight: 700 }}>TOTAL OUTSTANDING RECEIVABLES</span>
              <span style={{ fontSize: '1.1rem', color: '#34d399', fontWeight: 900 }}>₹{receivablesData.totalReceivables.toLocaleString('en-IN')}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
              {receivablesData.debtors.map(d => (
                <div key={d.customer} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#020617', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem' }}>
                  <div>
                    <span style={{ fontWeight: 700, color: '#f8fafc' }}>{d.customer}</span>
                    <span style={{ fontSize: '0.68rem', color: '#64748b', marginLeft: '6px' }}>({d.orderCount} unpaid order)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 800, color: '#fbbf24' }}>₹{d.totalOwed}</span>
                    <button
                      onClick={() => handleMarkPaid(d.orderIds)}
                      style={{ backgroundColor: '#059669', color: '#ffffff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Mark Paid
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Q3: Customer Last Order Specs */}
        {activeTab === 'SPECS' && (
          <div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
              <select
                value={selectedCustomer}
                onChange={e => setSelectedCustomer(e.target.value)}
                className="input-field"
                style={{ marginBottom: 0, fontSize: '0.75rem', padding: '6px' }}
              >
                <option value="Sarita Didi">Sarita Didi</option>
                <option value="Ramesh Ji">Ramesh Ji</option>
                <option value="Anil Ji">Anil Ji</option>
                <option value="Kavita">Kavita</option>
                <option value="Meena Aunty">Meena Aunty</option>
              </select>
            </div>

            {lastOrderSpecs ? (
              <div style={{ backgroundColor: '#020617', padding: '10px', borderRadius: '6px', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, color: '#38bdf8' }}>{lastOrderSpecs.customer} (Last Order Specs)</span>
                  <span style={{ color: '#94a3b8' }}>Due: {lastOrderSpecs.due_date}</span>
                </div>
                {lastOrderSpecs.items.map((it, idx) => (
                  <div key={idx} style={{ marginTop: '4px', borderTop: idx > 0 ? '1px solid #1e293b' : 'none', paddingTop: '4px' }}>
                    <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{it.quantity}x {it.description}</span>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '2px' }}>
                      {Object.entries(it.attributes).map(([k, v], aIdx) => (
                        <AttributeChip key={k} attrKey={k} value={v} domain={(lastOrderSpecs as any).detectedDomain || 'tiffin'} index={aIdx} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>No prior order history found for "{selectedCustomer}"</span>
            )}
          </div>
        )}

        {/* Q4: Capacity Week */}
        {activeTab === 'CAPACITY' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
            {capacityData.map((c) => (
              <div key={c.dateStr} style={{ backgroundColor: '#020617', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: 700, color: '#f8fafc' }}>{c.dayLabel}</span>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginLeft: '6px' }}>({c.itemSummary})</span>
                </div>
                <span className="badge" style={{ backgroundColor: c.isHighLoad ? '#450a0a' : '#064e3b', color: c.isHighLoad ? '#f87171' : '#34d399' }}>
                  {c.totalItems} items {c.isHighLoad ? '(High Load)' : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
