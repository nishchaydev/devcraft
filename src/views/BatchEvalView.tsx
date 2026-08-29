import { useState } from 'react';
import { InputRecord, OutputRecord } from '../parser/types';
import { parseMessageRecord } from '../parser/hybridParser';
import { Play, Download, FileText } from 'lucide-react';

export const BatchEvalView = () => {
  const [jsonText, setJsonText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [predictions, setPredictions] = useState<OutputRecord[]>([]);
  const [stats, setStats] = useState<{ total: number; durationMs: number; avgMs: number } | null>(null);

  const handleRunBatch = async () => {
    if (!jsonText.trim()) return;
    setIsProcessing(true);
    setStats(null);
    setPredictions([]);

    try {
      const records: InputRecord[] = JSON.parse(jsonText.trim());
      const startTime = Date.now();
      const output: OutputRecord[] = [];

      for (let i = 0; i < records.length; i++) {
        const parsed = await parseMessageRecord(records[i]);
        output.push({
          id: records[i].id,
          ...parsed
        });
      }

      const durationMs = Date.now() - startTime;
      setPredictions(output);
      setStats({
        total: records.length,
        durationMs,
        avgMs: durationMs / records.length
      });
    } catch (e: any) {
      alert(`JSON Parse Error: ${e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(predictions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "sample_submission.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{ padding: '16px' }} className="animate-fade-in">
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FileText color="#6366f1" size={20} /> Test A Batch Evaluation Tool (Judge Panel)
      </h2>

      <div className="card">
        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#94a3b8' }}>
          Paste Held-Out <code>messages_test.json</code> Input File Payload:
        </label>
        <textarea
          rows={6}
          value={jsonText}
          onChange={e => setJsonText(e.target.value)}
          placeholder='[{"id":"test-0001","domain":"tailor","received_at":"2026-08-29T10:14:00+05:30","message":"..."}]'
          className="input-field"
          style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
        />

        <button onClick={handleRunBatch} disabled={isProcessing || !jsonText.trim()} className="btn-primary">
          <Play size={16} />
          <span>{isProcessing ? 'Processing Batch...' : 'Run Test A Batch Parser'}</span>
        </button>
      </div>

      {stats && (
        <div className="card animate-fade-in" style={{ borderColor: '#10b981', backgroundColor: '#064e3b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399' }}>
                Batch Execution Complete ✅
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#a7f3d0' }}>
                Processed {stats.total} messages in {stats.durationMs}ms ({stats.avgMs.toFixed(2)}ms / message).
              </p>
            </div>
            <button onClick={handleDownload} className="btn-secondary" style={{ width: 'auto', padding: '0 12px', minHeight: '36px' }}>
              <Download size={14} /> Export JSON
            </button>
          </div>
        </div>
      )}

      {predictions.length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            Generated Predictions Output ({predictions.length})
          </h3>
          <pre style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px', fontSize: '0.75rem', color: '#34d399', overflowX: 'auto', maxHeight: '300px' }}>
            {JSON.stringify(predictions.slice(0, 3), null, 2)}
            {predictions.length > 3 ? '\n... (showing first 3 records)' : ''}
          </pre>
        </div>
      )}
    </div>
  );
};
