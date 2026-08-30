import React, { useState, useEffect } from 'react';
import { db } from '../db/schema';
import { processOperationalNLQuery, QueryResult } from '../query/queryEngine';
import { seedInitialDemoOrders } from '../db/demoSeeder';
import { liveQuery } from 'dexie';

export const AnalyticsView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('What is due today and overdue?');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [ordersCount, setOrdersCount] = useState<number>(0);

  useEffect(() => {
    const sub = liveQuery(() => db.orders.count()).subscribe({
      next: (count) => setOrdersCount(count || 0)
    });
    return () => sub.unsubscribe();
  }, []);

  const runQuery = async (text: string) => {
    setIsProcessing(true);
    try {
      const res = await processOperationalNLQuery(text);
      setQueryResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    runQuery(searchQuery);
  }, [ordersCount]);

  const handleSeed = async () => {
    await seedInitialDemoOrders(true);
    runQuery(searchQuery);
  };

  const handleMarkPaid = async (orderId: string, currentStatus: boolean | undefined) => {
    await db.orders.update(orderId, {
      is_paid: !currentStatus,
      paid_at: !currentStatus ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    });
    runQuery(searchQuery);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24 animate-card-enter">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⚡</span> Operational Query Hub
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            100% Offline • Zero-Scroll IndexedDB Intelligence
          </p>
        </div>
        <button
          onClick={handleSeed}
          className="btn-primary text-xs"
        >
          <span>⚡</span> Reset & Seed 20 Live Orders
        </button>
      </div>

      {/* 4 Quick Preset Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => { setSearchQuery('What is due today and overdue?'); runQuery('What is due today and overdue?'); }}
          className="metric-btn"
        >
          <span className="text-xl">📅</span>
          <div>
            <div className="text-xs font-bold text-white">Due Today</div>
            <div className="text-[11px] text-slate-400">Overdue & deadlines</div>
          </div>
        </button>

        <button
          onClick={() => { setSearchQuery('Which customers owe money?'); runQuery('Which customers owe money?'); }}
          className="metric-btn"
        >
          <span className="text-xl">💰</span>
          <div>
            <div className="text-xs font-bold text-white">Unpaid Balances</div>
            <div className="text-[11px] text-slate-400">Udhar & receivables</div>
          </div>
        </button>

        <button
          onClick={() => { setSearchQuery('What did Rahul order last time?'); runQuery('What did Rahul order last time?'); }}
          className="metric-btn"
        >
          <span className="text-xl">👤</span>
          <div>
            <div className="text-xs font-bold text-white">Customer History</div>
            <div className="text-[11px] text-slate-400">Specs & prior orders</div>
          </div>
        </button>

        <button
          onClick={() => { setSearchQuery('What is my committed capacity this week?'); runQuery('What is my committed capacity this week?'); }}
          className="metric-btn"
        >
          <span className="text-xl">📊</span>
          <div>
            <div className="text-xs font-bold text-white">Committed Capacity</div>
            <div className="text-[11px] text-slate-400">7-day workload grid</div>
          </div>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') runQuery(searchQuery); }}
          placeholder="Ask anything (e.g. 'What did Rahul order last time?', 'Who owes more than 500?', 'due today')..."
          className="query-search-bar pr-24"
        />
        <button
          onClick={() => runQuery(searchQuery)}
          className="absolute right-2 top-2 btn-primary text-xs py-1.5 px-4"
        >
          {isProcessing ? '...' : 'Query'}
        </button>
      </div>

      {/* Query Result Card */}
      {queryResult && (
        <div className="card space-y-4 border-indigo-500/30">
          <div className="flex justify-between items-start gap-3 border-b border-slate-800 pb-3">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-bold">
                {queryResult.intent}
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {queryResult.title}
              </h3>
            </div>
            {queryResult.summaryValue && (
              <div className="text-right">
                <div className="text-xl font-black text-amber-400">
                  {queryResult.summaryValue}
                </div>
                {queryResult.secondaryInfo && (
                  <div className="text-[11px] text-slate-400">
                    {queryResult.secondaryInfo}
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="text-xs text-slate-300 italic bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            💡 {queryResult.explanation}
          </p>

          {/* Customer Specs Section if matched */}
          {queryResult.customerSpecs && (
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-200">
                Last Order Specifications for {queryResult.customerSpecs.customerName}
              </h4>
              <div className="space-y-1.5">
                {queryResult.customerSpecs.items.map((item, i) => (
                  <div key={i} className="text-xs flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                    <span className="font-semibold text-white">
                      <span className="text-indigo-400">{item.quantity}x</span> {item.description}
                    </span>
                    {item.attributes && (
                      <div className="flex gap-1">
                        {Object.entries(item.attributes).map(([k, v]) => (
                          <span key={k} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                            {k}: {String(v)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Capacity Heatmap Grid */}
          {queryResult.capacityHeatmap && (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2">
              {queryResult.capacityHeatmap.map((day, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center gap-1 ${
                    day.status === 'HIGH'
                      ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                      : day.status === 'NORMAL'
                      ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase">{day.dayName}</span>
                  <span className="text-base font-black">{day.count}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-950 font-mono">
                    {day.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Matched Orders List */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-slate-400">
              Matched Orders ({queryResult.matchedOrders.length})
            </h4>
            {queryResult.matchedOrders.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No matching orders found.</p>
            ) : (
              queryResult.matchedOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-3 flex flex-col sm:flex-row justify-between sm:items-center gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">
                        {ord.customer || 'Unspecified'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {ord.id}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5">
                      {ord.items.map((it) => `${it.quantity}x ${it.description}`).join(', ')}
                    </div>
                    {ord.due_date && (
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        📅 Due: <span className="text-slate-300 font-mono">{ord.due_date}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <span
                      className={`chip ${
                        ord.is_paid ? 'chip-paid' : 'chip-unpaid'
                      }`}
                    >
                      {ord.is_paid ? 'PAID' : `UNPAID (₹${ord.amount || 0})`}
                    </span>

                    {!ord.is_paid && (
                      <button
                        onClick={() => handleMarkPaid(ord.id, ord.is_paid)}
                        className="btn-emerald"
                      >
                        ✓ Mark Paid
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
