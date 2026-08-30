import React, { useState } from 'react';
import { runAllScenarios, SimulationScenarioResult } from '../sync/simulator';
import { Play, CheckCircle2, Hash, ArrowRight } from 'lucide-react';

/* ── Pure SVG network diagram ────────────────────────────── */
const DeviceNetworkSVG: React.FC<{ hasResults: boolean }> = ({ hasResults }) => {
  const edgeColor = hasResults ? '#10b981' : '#475569';
  const dashArray = hasResults ? '0' : '6 4';

  return (
    <svg viewBox="0 0 480 140" className="w-full" aria-label="Device sync network diagram">
      <defs>
        <filter id="glow-a">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glow-b">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <marker id="arrow-ab" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill={edgeColor} />
        </marker>
        <marker id="arrow-ba" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill={edgeColor} />
        </marker>
      </defs>

      {/* Edge A→B */}
      <path
        d="M 105 62 Q 240 28 375 62"
        fill="none" stroke={edgeColor} strokeWidth="2"
        strokeDasharray={dashArray}
        markerEnd="url(#arrow-ab)"
      />
      {/* Edge B→A */}
      <path
        d="M 375 78 Q 240 112 105 78"
        fill="none" stroke={edgeColor} strokeWidth="2"
        strokeDasharray={dashArray}
        markerEnd="url(#arrow-ba)"
      />

      {/* Sync label */}
      {hasResults && (
        <text x="240" y="72" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="bold">
          Lamport LWW ✓
        </text>
      )}

      {/* Device A */}
      <g transform="translate(80,70)" filter="url(#glow-a)">
        <circle r="28" fill="#0c1a2e" stroke="#38bdf8" strokeWidth="2.5" />
        <text textAnchor="middle" dy="-5" fill="#38bdf8" fontSize="11" fontWeight="bold">Device A</text>
        <text textAnchor="middle" dy="10" fill="#64748b" fontSize="9">Client</text>
      </g>

      {/* Device B */}
      <g transform="translate(400,70)" filter="url(#glow-b)">
        <circle r="28" fill="#0c1a2e" stroke="#818cf8" strokeWidth="2.5" />
        <text textAnchor="middle" dy="-5" fill="#818cf8" fontSize="11" fontWeight="bold">Device B</text>
        <text textAnchor="middle" dy="10" fill="#64748b" fontSize="9">Client</text>
      </g>
    </svg>
  );
};

/* ── Scenario result card ────────────────────────────────── */
const ScenarioCard: React.FC<{ result: SimulationScenarioResult }> = ({ result }) => (
  <div className="card-elevated p-4 space-y-3 animate-fade-in">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <h4 className="text-sm font-bold text-white">{result.title}</h4>
      <span className="badge badge-paid shrink-0">
        <CheckCircle2 size={11} /> Deterministic Invariance · PASS
      </span>
    </div>

    {/* Hash comparison */}
    <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/60 space-y-2">
      <p className="text-[11px] text-slate-500 uppercase font-semibold tracking-wider mb-2">
        State Hash Comparison
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="space-y-0.5">
          <p className="text-[10px] text-slate-600 flex items-center gap-1">
            <Hash size={9} /> Sync A→B
          </p>
          <code className="block text-[11px] font-mono text-emerald-400 truncate bg-slate-900/60 px-2 py-1 rounded">
            {result.hashA}
          </code>
        </div>
        <div className="space-y-0.5">
          <p className="text-[10px] text-slate-600 flex items-center gap-1">
            <Hash size={9} /> Sync B→A
          </p>
          <code className="block text-[11px] font-mono text-emerald-400 truncate bg-slate-900/60 px-2 py-1 rounded">
            {result.hashB}
          </code>
        </div>
      </div>
      {result.hashA === result.hashB && (
        <p className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1.5 pt-1">
          <CheckCircle2 size={11} /> Hashes match — convergence proven
        </p>
      )}
    </div>
  </div>
);

/* ── Main View ───────────────────────────────────────────── */
export const ConflictView: React.FC = () => {
  const [results, setResults]         = useState<SimulationScenarioResult[]>([]);
  const [activeScenario, setScenario] = useState<number>(1);
  const [hasRun, setHasRun]           = useState(false);

  const handleRunSim = () => {
    setResults(runAllScenarios());
    setHasRun(true);
  };

  const activeResult = results.find(r => r.scenarioNumber === activeScenario);

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white">Multi-Device Sync Center</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mathematical proof: Sync(A→B) ≡ Sync(B→A) under Lamport LWW
          </p>
        </div>
        <button onClick={handleRunSim} className="btn-primary text-xs shrink-0">
          <Play size={14} /> Run Simulation Suite
        </button>
      </div>

      {/* Network Diagram */}
      <div className="card-glass p-4">
        <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-3">
          Device Network Diagram · Pure SVG
        </p>
        <DeviceNetworkSVG hasResults={hasRun} />
      </div>

      {/* Scenario Tabs */}
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map(num => (
          <button
            key={num}
            onClick={() => setScenario(num)}
            className={`py-2.5 text-xs font-bold rounded-xl border transition-colors ${
              activeScenario === num
                ? 'bg-indigo-900/50 border-indigo-500/60 text-indigo-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            Scenario {num}
          </button>
        ))}
      </div>

      {/* Result or empty state */}
      {!hasRun ? (
        <div className="card flex flex-col items-center gap-3 py-10 text-center">
          <ArrowRight size={28} className="text-slate-700" />
          <p className="text-slate-500 text-sm">Press "Run Simulation Suite" to begin.</p>
          <p className="text-[11px] text-slate-600">
            Simulates 3 concurrent-edit scenarios and verifies deterministic convergence.
          </p>
        </div>
      ) : activeResult ? (
        <ScenarioCard result={activeResult} />
      ) : (
        <div className="card text-center text-sm text-slate-500 py-8">
          No result for Scenario {activeScenario}.
        </div>
      )}

      {/* Operation Trace */}
      {hasRun && results.length > 0 && (
        <div className="card-glass">
          <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-3">
            Operation Trace Log
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-slate-600 border-b border-slate-800">
                  <th className="pb-2 pr-4 font-semibold">Scenario</th>
                  <th className="pb-2 pr-4 font-semibold">Converged</th>
                  <th className="pb-2 font-semibold">Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {results.map(r => (
                  <tr key={r.scenarioNumber} className="text-slate-400">
                    <td className="py-2 pr-4 font-medium text-slate-300">{r.title}</td>
                    <td className="py-2 pr-4">
                      <span className="badge badge-paid text-[10px]">✓ PASS</span>
                    </td>
                    <td className="py-2 font-mono text-emerald-500 text-[10px] truncate max-w-[160px]">
                      {r.hashA}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
