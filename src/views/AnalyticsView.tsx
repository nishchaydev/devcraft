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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#d3cec6] pb-4">
        <div>
          <h2 className="text-xl font-semibold text-[#111111] flex items-center gap-2">
            <span>⚡</span> Operational Query Hub
          </h2>
          <p className="text-xs text-[#7b7b78] mt-0.5">
            100% Offline • Zero-Scroll IndexedDB Intelligence
          </p>
        </div>
        <button
          onClick={handleSeed}
          className="ic-btn-primary text-xs py-2 px-3"
        >
          <span>⚡</span> Reset &amp; Seed 20 Live Orders
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
            <div className="text-xs font-semibold text-[#111111]">Due Today</div>
            <div className="text-[11px] text-[#7b7b78]">Overdue &amp; deadlines</div>
          </div>
        </button>

        <button
          onClick={() => { setSearchQuery('Which customers owe money?'); runQuery('Which customers owe money?'); }}
          className="metric-btn"
        >
          <span className="text-xl">💰</span>
          <div>
            <div className="text-xs font-semibold text-[#111111]">Unpaid Balances</div>
            <div className="text-[11px] text-[#7b7b78]">Udhar &amp; receivables</div>
          </div>
        </button>

        <button
          onClick={() => { setSearchQuery('What did Rahul order last time?'); runQuery('What did Rahul order last time?'); }}
          className="metric-btn"
        >
          <span className="text-xl">👤</span>
          <div>
            <div className="text-xs font-semibold text-[#111111]">Customer History</div>
            <div className="text-[11px] text-[#7b7b78]">Specs &amp; prior orders</div>
          </div>
        </button>

        <button
          onClick={() => { setSearchQuery('What is my committed capacity this week?'); runQuery('What is my committed capacity this week?'); }}
          className="metric-btn"
        >
          <span className="text-xl">📊</span>
          <div>
            <div className="text-xs font-semibold text-[#111111]">Committed Capacity</div>
            <div className="text-[11px] text-[#7b7b78]">7-day workload grid</div>
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
          className="absolute right-2 top-2 ic-btn-fin text-xs py-1.5 px-4"
        >
          {isProcessing ? '...' : 'Query'}
        </button>
      </div>

      {/* Query Result Card */}
      {queryResult && (
        <div className="card space-y-4 border-[#d3cec6]">
          <div className="flex justify-between items-start gap-3 border-b border-[#d3cec6] pb-3">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#ff5600] font-semibold">
                {queryResult.intent}
              </div>
              <h3 className="text-lg font-semibold text-[#111111] mt-0.5">
                {queryResult.title}
              </h3>
            </div>
            {queryResult.summaryValue && (
              <div className="text-right">
                <div className="text-xl font-bold text-[#ff5600]">
                  {queryResult.summaryValue}
                </div>
                {queryResult.secondaryInfo && (
                  <div className="text-[11px] text-[#7b7b78]">
                    {queryResult.secondaryInfo}
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="text-xs text-[#626260] italic bg-[#faf8f5] p-2.5 rounded-lg border border-[#d3cec6]">
            💡 {queryResult.explanation}
          </p>

          {/* Customer Specs Section if matched */}
          {queryResult.customerSpecs && (
            <div className="bg-white p-3.5 rounded-xl border border-[#d3cec6] space-y-2 shadow-sm">
              <h4 className="text-xs font-semibold text-[#111111]">
                Last Order Specifications for {queryResult.customerSpecs.customerName}
              </h4>
              <div className="space-y-1.5">
                {queryResult.customerSpecs.items.map((item, i) => (
                  <div key={i} className="text-xs flex items-center justify-between bg-[#faf8f5] px-3 py-2 rounded-lg border border-[#e5e0d8]">
                    <span className="font-semibold text-[#111111]">
                      <span className="text-[#ff5600]">{item.quantity}x</span> {item.description}
                    </span>
                    {item.attributes && (
                      <div className="flex gap-1">
                        {Object.entries(item.attributes).map(([k, v]) => (
                          <span key={k} className="text-[10px] bg-white text-[#626260] px-2 py-0.5 rounded border border-[#d3cec6]">
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
                      ? 'bg-[#eb5757]/10 border-[#eb5757]/30 text-[#eb5757]'
                      : day.status === 'NORMAL'
                      ? 'bg-[#27ae60]/10 border-[#27ae60]/30 text-[#27ae60]'
                      : 'bg-[#faf8f5] border-[#d3cec6] text-[#7b7b78]'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase">{day.dayName}</span>
                  <span className="text-base font-black">{day.count}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white font-mono border border-[#d3cec6]">
                    {day.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Matched Orders List */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-semibold text-[#7b7b78]">
              Matched Orders ({queryResult.matchedOrders.length})
            </h4>
            {queryResult.matchedOrders.length === 0 ? (
              <p className="text-xs text-[#7b7b78] italic">No matching orders found.</p>
            ) : (
              queryResult.matchedOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white border border-[#d3cec6] rounded-xl p-3 flex flex-col sm:flex-row justify-between sm:items-center gap-3 shadow-sm"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#111111] text-sm">
                        {ord.customer || 'Unspecified'}
                      </span>
                      <span className="text-[10px] font-mono text-[#7b7b78]">
                        {ord.id}
                      </span>
                    </div>
                    <div className="text-xs text-[#626260] mt-0.5">
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
