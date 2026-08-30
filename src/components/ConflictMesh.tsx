import React from 'react';

export interface MeshOpToken {
  id: string;
  lamport: number;
  deviceId: string;
  path: string;
  value: any;
  status: 'conflicted' | 'resolved';
}

interface ConflictMeshProps {
  ops?: MeshOpToken[];
  onOpSelect?: (op: MeshOpToken) => void;
}

export const ConflictMesh: React.FC<ConflictMeshProps> = ({ ops = [], onOpSelect }) => {
  const sampleOps: MeshOpToken[] = ops.length > 0 ? ops : [
    { id: 'op-1', lamport: 1, deviceId: 'device_A', path: 'due_date', value: '2026-09-08', status: 'resolved' },
    { id: 'op-2', lamport: 1, deviceId: 'device_B', path: 'amount', value: 1500, status: 'resolved' },
    { id: 'op-3', lamport: 2, deviceId: 'device_A', path: 'items[0].quantity', value: 3, status: 'conflicted' },
    { id: 'op-4', lamport: 2, deviceId: 'device_B', path: 'items[0].quantity', value: 5, status: 'conflicted' }
  ];

  const hasConflicted = sampleOps.some(o => o.status === 'conflicted');

  return (
    <div style={{ backgroundColor: '#020617', padding: '16px', borderRadius: '12px', border: '1px solid #334155', marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
          CRDT Op-Log Directed Mesh Visualizer
        </h4>
        <span className="badge" style={{ backgroundColor: hasConflicted ? '#451a03' : '#064e3b', color: hasConflicted ? '#fbbf24' : '#34d399' }}>
          {hasConflicted ? 'Active Conflicts' : 'Mesh Converged'}
        </span>
      </div>

      <svg viewBox="0 0 400 180" style={{ width: '100%', height: 'auto', background: '#0f172a', borderRadius: '8px' }}>
        <defs>
          <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-indigo" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Directed Edge Streams */}
        <path
          d="M 80 90 Q 200 40 320 90"
          fill="none"
          stroke={hasConflicted ? '#f59e0b' : '#10b981'}
          strokeWidth="2"
          strokeDasharray={hasConflicted ? '6 4' : 'none'}
        />
        <path
          d="M 320 90 Q 200 140 80 90"
          fill="none"
          stroke={hasConflicted ? '#f59e0b' : '#10b981'}
          strokeWidth="2"
          strokeDasharray={hasConflicted ? '6 4' : 'none'}
        />

        {/* Device A Node */}
        <g transform="translate(80, 90)">
          <circle r="24" fill="#020617" stroke="#38bdf8" strokeWidth="3" filter="url(#glow-cyan)" />
          <text textAnchor="middle" dy="-2" fill="#38bdf8" fontSize="10" fontWeight="bold">Device A</text>
          <text textAnchor="middle" dy="12" fill="#94a3b8" fontSize="8">Client</text>
        </g>

        {/* Device B Node */}
        <g transform="translate(320, 90)">
          <circle r="24" fill="#020617" stroke="#818cf8" strokeWidth="3" filter="url(#glow-indigo)" />
          <text textAnchor="middle" dy="-2" fill="#818cf8" fontSize="10" fontWeight="bold">Device B</text>
          <text textAnchor="middle" dy="12" fill="#94a3b8" fontSize="8">Client</text>
        </g>

        {/* Op Tokens floating on stream */}
        {sampleOps.map((op, idx) => {
          const isA = op.deviceId.includes('A');
          const posX = isA ? 160 + idx * 25 : 240 - idx * 25;
          const posY = isA ? 55 + (idx % 2) * 10 : 125 - (idx % 2) * 10;
          const strokeColor = op.status === 'conflicted' ? '#f59e0b' : '#10b981';

          return (
            <g
              key={op.id || idx}
              transform={`translate(${posX}, ${posY})`}
              onClick={() => onOpSelect && onOpSelect(op)}
              style={{ cursor: 'pointer' }}
            >
              <rect x="-24" y="-12" width="48" height="24" rx="12" fill="#1e293b" stroke={strokeColor} strokeWidth="1.5" />
              <text textAnchor="middle" dy="3" fill="#f8fafc" fontSize="9" fontWeight="bold">
                L:{op.lamport}
              </text>
            </g>
          );
        })}
      </svg>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '8px', fontSize: '0.75rem', color: '#94a3b8' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#38bdf8' }}></span> Device A (Cyan)
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#818cf8' }}></span> Device B (Indigo)
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span> Conflicted Edge
        </span>
      </div>
    </div>
  );
};
