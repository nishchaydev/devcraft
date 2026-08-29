import React, { useState, useEffect } from 'react';
import { db, ConflictRecord } from '../db/schema';
import { runScenario1, runScenario2, runScenario3 } from '../sync/simulator';
import { AlertTriangle, ShieldCheck, Play, CheckCircle } from 'lucide-react';

export const ConflictView: React.FC = () => {
  const [conflicts, setConflicts] = useState<ConflictRecord[]>([]);
  const [simLogs, setSimLogs] = useState<string[]>([]);

  const loadConflicts = async () => {
    const list = await db.conflicts.filter(c => c.surfaced_to_operator).toArray();
    setConflicts(list.sort((a, b) => b.timestamp.localeCompare(a.timestamp)));
  };

  useEffect(() => {
    loadConflicts();
    const interval = setInterval(loadConflicts, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleResolveConflict = async (conflictId: string) => {
    await db.conflicts.update(conflictId, { surfaced_to_operator: false, operator_action: 'DISMISS' });
    loadConflicts();
  };

  const handleRunSimulator = () => {
    const s1 = runScenario1();
    const s2 = runScenario2();
    const s3 = runScenario3();

    setSimLogs([
      `Scenario 1 (Disjoint Field Edits): Deterministic = ${s1.isDeterministic ? 'PASS ✅' : 'FAIL ❌'}`,
      `Scenario 2 (Concurrent Scalar Edit): Deterministic = ${s2.isDeterministic ? 'PASS ✅' : 'FAIL ❌'}, Surfaced Conflicts = ${s2.surfacedConflictsCount}`,
      `Scenario 3 (Delete vs Update): Deterministic = ${s3.isDeterministic ? 'PASS ✅' : 'FAIL ❌'}, Surfaced Conflicts = ${s3.surfacedConflictsCount}`
    ]);
  };

  return (
    <div style={{ padding: '16px' }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle color="#f59e0b" size={20} /> Conflict Resolution Center
        </h2>
      </div>

      <div className="card" style={{ borderColor: '#6366f1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#e2e8f0' }}>
            Test C Multi-Device Simulator (Judge Tool)
          </h3>
          <button onClick={handleRunSimulator} className="btn-primary" style={{ minHeight: '36px', padding: '0 12px', width: 'auto' }}>
            <Play size={14} /> Run Scenarios 1, 2, 3
          </button>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '10px' }}>
          Simulates Scenarios 1, 2, and 3 from <code>conflict_scenarios.md</code> across dual devices to verify $Sync(A \rightarrow B) == Sync(B \rightarrow A)$ invariance.
        </p>

        {simLogs.length > 0 && (
          <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px', fontSize: '0.85rem', fontFamily: 'monospace' }}>
            {simLogs.map((log, idx) => (
              <div key={idx} style={{ color: log.includes('PASS') ? '#34d399' : '#f87171', marginBottom: '4px' }}>
                {log}
              </div>
            ))}
          </div>
        )}
      </div>

      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', margin: '16px 0 8px 0' }}>
        Surfaced Conflicts Queue ({conflicts.length})
      </h3>

      {conflicts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '24px', color: '#34d399' }}>
          <ShieldCheck size={32} style={{ margin: '0 auto 8px auto' }} />
          <p style={{ fontWeight: 600 }}>All device sync states converged! Zero pending conflicts.</p>
        </div>
      ) : (
        conflicts.map(conf => (
          <div key={conf.conflict_id} className="card" style={{ borderColor: '#f59e0b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="badge badge-conflicted">{conf.scenario}</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Order: {conf.order_id}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', margin: '10px 0', fontSize: '0.85rem' }}>
              <div style={{ backgroundColor: '#064e3b', padding: '8px', borderRadius: '6px' }}>
                <span style={{ color: '#34d399', fontWeight: 700, display: 'block', fontSize: '0.75rem' }}>WINNING EDIT ({conf.winning_op.device_id})</span>
                <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                  Path: {conf.winning_op.target_path}<br/>
                  Val: {JSON.stringify(conf.winning_op.value)}
                </div>
              </div>

              <div style={{ backgroundColor: '#450a0a', padding: '8px', borderRadius: '6px' }}>
                <span style={{ color: '#f87171', fontWeight: 700, display: 'block', fontSize: '0.75rem' }}>SURFACED LOST EDIT ({conf.losing_op.device_id})</span>
                <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                  Path: {conf.losing_op.target_path}<br/>
                  Val: {JSON.stringify(conf.losing_op.value)}
                </div>
              </div>
            </div>

            <button onClick={() => handleResolveConflict(conf.conflict_id)} className="btn-secondary" style={{ width: '100%', minHeight: '36px', fontSize: '0.85rem' }}>
              <CheckCircle size={14} /> Mark Resolved / Acknowledge
            </button>
          </div>
        ))
      )}
    </div>
  );
};
