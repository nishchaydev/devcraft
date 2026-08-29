import React, { useState, useEffect } from 'react';
import { DomainType, OrderRecord, InputRecord } from '../parser/types';
import { parseMessageRecord } from '../parser/hybridParser';
import { db, StoredOrder } from '../db/schema';
import { Sparkles, CheckCircle2, Mic, MicOff, MessageSquare, Send, Code, Cpu, Tag, Calendar, DollarSign, User, Scissors, Utensils, Zap, Cake } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const DOMAIN_ICONS: Record<DomainType, React.ReactNode> = {
  tailor: <Scissors size={14} color="#a5b4fc" />,
  tiffin: <Utensils size={14} color="#fef08a" />,
  electrician: <Zap size={14} color="#6ee7b7" />,
  baker: <Cake size={14} color="#fbcfe8" />
};

const DOMAIN_LABELS: Record<DomainType, string> = {
  tailor: 'Tailor (Auto-Detected)',
  tiffin: 'Tiffin (Auto-Detected)',
  electrician: 'Electrician (Auto-Detected)',
  baker: 'Baker (Auto-Detected)'
};

const INITIAL_SAMPLE = "bhaiya 2 kurta chahiye navy blue, chest 40, parso tak ho jayega kya? last time jaisa hi";

export const IntakeView: React.FC<{ onOrderCreated?: () => void }> = ({ onOrderCreated }) => {
  const { t } = useLanguage();
  const [message, setMessage] = useState(INITIAL_SAMPLE);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedRecord, setParsedRecord] = useState<OrderRecord | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [showInspector, setShowInspector] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
    }
  }, []);

  const handleToggleVoice = () => {
    if (!speechSupported) {
      alert('Speech Recognition is not supported on this browser. Try Chrome / Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage(prev => (prev ? `${prev} ${transcript}` : transcript));
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleParse = async () => {
    if (!message.trim()) return;
    setIsParsing(true);
    setSuccessMsg('');

    const inputRec: InputRecord = {
      id: `order-${Date.now()}`,
      received_at: new Date().toISOString(),
      message: message.trim()
    };

    const result = await parseMessageRecord(inputRec);
    setParsedRecord(result);
    setIsParsing(false);
  };

  const handleSaveOrder = async () => {
    if (!parsedRecord) return;

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const stored: StoredOrder = {
      id: orderId,
      ...parsedRecord,
      status: parsedRecord.needs_clarification ? 'NEEDS_CLARIFICATION' : 'SYNCED',
      device_id: 'local_device',
      updated_at: new Date().toISOString()
    };

    await db.orders.put(stored);
    setSuccessMsg(`Order ${orderId} saved to IndexedDB!`);
    setParsedRecord(null);
    if (onOrderCreated) onOrderCreated();
  };

  const handleOpenWhatsApp = () => {
    if (!parsedRecord?.whatsappReply) return;
    const encoded = encodeURIComponent(parsedRecord.whatsappReply);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div style={{ padding: '16px' }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
          Unified Order Intake & Parser
        </h2>
      </div>

      {/* WhatsApp Chat Style Input Card with Speech-to-Text */}
      <div className="card" style={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MessageSquare size={16} color="#10b981" /> Paste or Speak Customer WhatsApp Note:
          </label>

          <button
            onClick={handleToggleVoice}
            style={{
              backgroundColor: isListening ? '#dc2626' : '#1e293b',
              color: isListening ? '#ffffff' : '#a7f3d0',
              border: `1px solid ${isListening ? '#ef4444' : '#059669'}`,
              padding: '4px 10px',
              fontSize: '0.75rem',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              minHeight: '32px'
            }}
          >
            {isListening ? <MicOff size={14} className="animate-pulse" /> : <Mic size={14} />}
            <span>{isListening ? 'Listening...' : 'Voice Note'}</span>
          </button>
        </div>

        <div style={{ backgroundColor: '#064e3b', padding: '12px', borderRadius: '12px 12px 12px 2px', borderLeft: '4px solid #10b981', marginBottom: '12px' }}>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#f8fafc',
              fontSize: '0.95rem',
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'inherit'
            }}
            placeholder="Type or speak customer order message (Tailor, Tiffin, Electrician, Baker)..."
          />
        </div>

        <button onClick={handleParse} disabled={isParsing} className="btn-primary" style={{ backgroundColor: '#4f46e5' }}>
          <Sparkles size={18} />
          <span>{isParsing ? 'Parsing & Auto-Detecting Operator...' : t('parseBtn')}</span>
        </button>
      </div>

      {/* Parsed Smart-Card & Auto-Detected Operator Badge */}
      {parsedRecord && (
        <div className="card animate-fade-in" style={{ borderColor: '#6366f1', marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={18} /> Parsed Order Smart-Card
            </h3>
            <span className={`badge ${parsedRecord.needs_clarification ? 'badge-clarify' : 'badge-synced'}`}>
              {parsedRecord.needs_clarification ? 'Needs Clarification' : 'Ready'}
            </span>
          </div>

          {/* Operator Auto-Detection Badge & Engine Metrics */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            {parsedRecord.detectedDomain && (
              <span className="badge" style={{ backgroundColor: '#312e81', color: '#c7d2fe', border: '1px solid #6366f1', fontSize: '0.75rem' }}>
                {DOMAIN_ICONS[parsedRecord.detectedDomain]}
                <span style={{ fontWeight: 700 }}>{DOMAIN_LABELS[parsedRecord.detectedDomain]}</span>
              </span>
            )}
            <span className="badge" style={{ backgroundColor: '#1e3a8a', color: '#60a5fa', border: '1px solid #2563eb' }}>
              <Cpu size={12} /> {parsedRecord.engineUsed === 'gemini-flash' ? 'Gemini 1.5 Flash API (Online)' : 'Local Fast-NLP Engine (Offline)'}
            </span>
            <span className="badge" style={{ backgroundColor: '#020617', color: '#a7f3d0', border: '1px solid #059669' }}>
              ⚡ {parsedRecord.latencyMs}ms | {(parsedRecord.confidence * 100).toFixed(0)}% Confidence
            </span>
          </div>

          <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <User size={16} color="#94a3b8" />
              <span style={{ fontWeight: 700, color: '#f8fafc' }}>
                Customer: {parsedRecord.customer || 'Unspecified'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {parsedRecord.due_date && (
                <span className="badge" style={{ backgroundColor: '#312e81', color: '#a5b4fc', border: '1px solid #4338ca' }}>
                  <Calendar size={12} /> Due: {parsedRecord.due_date}
                </span>
              )}
              {parsedRecord.amount !== null && (
                <span className="badge" style={{ backgroundColor: '#064e3b', color: '#6ee7b7', border: '1px solid #047857' }}>
                  <DollarSign size={12} /> ₹{parsedRecord.amount}
                </span>
              )}
              {parsedRecord.references_prior_order && (
                <span className="badge" style={{ backgroundColor: '#451a03', color: '#fde68a', border: '1px solid #b45309' }}>
                  Repeat Order ("last time jaisa")
                </span>
              )}
            </div>

            {parsedRecord.items.map((it, idx) => (
              <div key={idx} style={{ borderTop: '1px solid #1e293b', paddingTop: '6px', marginTop: '6px' }}>
                <span style={{ fontWeight: 700, color: '#e2e8f0' }}>
                  {it.quantity}x {it.description}
                </span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                  {Object.entries(it.attributes).map(([k, v]) => (
                    <span key={k} style={{ fontSize: '0.75rem', backgroundColor: '#1e293b', color: '#cbd5e1', padding: '2px 8px', borderRadius: '4px', border: '1px solid #334155' }}>
                      <Tag size={10} style={{ display: 'inline', marginRight: '4px' }} />
                      {k}: {String(v)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {parsedRecord.whatsappReply && (
            <div style={{ backgroundColor: '#064e3b', padding: '10px 12px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #059669' }}>
              <span style={{ fontSize: '0.75rem', color: '#a7f3d0', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                AUTOMATIC WHATSAPP CONFIRMATION REPLY:
              </span>
              <p style={{ fontSize: '0.85rem', color: '#f8fafc', fontStyle: 'italic', marginBottom: '8px' }}>
                "{parsedRecord.whatsappReply}"
              </p>
              <button onClick={handleOpenWhatsApp} className="btn-primary" style={{ backgroundColor: '#10b981', minHeight: '36px', fontSize: '0.85rem' }}>
                <Send size={14} /> Send WhatsApp Reply
              </button>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button onClick={() => setShowInspector(!showInspector)} className="btn-secondary" style={{ minHeight: '40px', fontSize: '0.85rem' }}>
              <Code size={14} /> {showInspector ? 'Hide AI Inspector' : 'View AI Breakdown'}
            </button>
            <button onClick={handleSaveOrder} className="btn-primary" style={{ backgroundColor: '#10b981', minHeight: '40px', fontSize: '0.85rem' }}>
              {t('confirmSave')}
            </button>
          </div>

          {showInspector && (
            <div className="animate-fade-in" style={{ backgroundColor: '#020617', padding: '12px', borderRadius: '8px', marginTop: '12px', border: '1px solid #334155' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#818cf8', marginBottom: '6px' }}>
                AI Extraction & Normative Rule Breakdown
              </h4>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px' }}>
                {parsedRecord.ruleExplanation}
              </p>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>RAW SCHEMA.JSON OUTPUT:</span>
              <pre style={{ fontSize: '0.75rem', color: '#34d399', backgroundColor: '#0f172a', padding: '8px', borderRadius: '6px', overflowX: 'auto', marginTop: '4px' }}>
                {JSON.stringify(parsedRecord, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {successMsg && (
        <div className="card animate-fade-in" style={{ backgroundColor: '#064e3b', borderColor: '#059669', color: '#34d399', fontWeight: 600, marginTop: '12px' }}>
          {successMsg}
        </div>
      )}
    </div>
  );
};
