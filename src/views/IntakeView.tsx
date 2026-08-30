import React, { useState } from 'react';
import { DomainType, OrderRecord, InputRecord } from '../parser/types';
import { parseMessageRecord } from '../parser/hybridParser';
import { db, StoredOrder } from '../db/schema';
import {
  Sparkles, CheckCircle2, MessageSquare, Send, Code, Cpu,
  Calendar, DollarSign, User, Scissors, Utensils, Zap, Cake,
  Copy, Check, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { AttributeChip } from '../components/AttributeChip';
import { VoiceIntake } from '../components/VoiceIntake';

const DOMAIN_ICONS: Record<DomainType, React.ReactNode> = {
  tailor:      <Scissors size={13} />,
  tiffin:      <Utensils size={13} />,
  electrician: <Zap size={13} />,
  baker:       <Cake size={13} />,
};

const DOMAIN_LABELS: Record<DomainType, string> = {
  tailor:      'Tailor',
  tiffin:      'Tiffin',
  electrician: 'Electrician',
  baker:       'Baker',
};

const DOMAIN_COLORS: Record<DomainType, { badge: string; glow: string; border: string }> = {
  tailor:      { badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',  glow: '#6366f1', border: '#6366f1' },
  tiffin:      { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', glow: '#10b981', border: '#10b981' },
  electrician: { badge: 'bg-yellow-50 text-yellow-700 border-yellow-200',  glow: '#eab308', border: '#eab308' },
  baker:       { badge: 'bg-orange-50 text-orange-700 border-orange-200',  glow: '#f97316', border: '#f97316' },
};

const INITIAL_SAMPLE = 'bhaiya 2 kurta chahiye navy blue, chest 40, parso tak ho jayega kya? last time jaisa hi';

export const IntakeView: React.FC<{ onOrderCreated?: () => void }> = ({ onOrderCreated }) => {
  const { t } = useLanguage();
  const [message, setMessage]             = useState(INITIAL_SAMPLE);
  const [isParsing, setIsParsing]         = useState(false);
  const [parsedRecord, setParsedRecord]   = useState<OrderRecord | null>(null);
  const [successMsg, setSuccessMsg]       = useState('');
  const [showInspector, setShowInspector] = useState(false);
  const [copied, setCopied]               = useState(false);
  const [tiltStyle, setTiltStyle]         = useState<React.CSSProperties>({});

  const handleParseText = async (textToParse: string) => {
    if (!textToParse.trim()) return;
    setIsParsing(true);
    setSuccessMsg('');
    setCopied(false);

    const inputRec: InputRecord = {
      id: `order-${Date.now()}`,
      received_at: new Date().toISOString(),
      message: textToParse.trim(),
    };

    const result = await parseMessageRecord(inputRec);
    setParsedRecord(result);
    setIsParsing(false);
  };

  const handleParse = () => handleParseText(message);

  const handleSaveOrder = async () => {
    if (!parsedRecord) return;
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const stored: StoredOrder = {
      id: orderId,
      ...parsedRecord,
      status: parsedRecord.needs_clarification ? 'NEEDS_CLARIFICATION' : 'SYNCED',
      device_id: 'local_device',
      updated_at: new Date().toISOString(),
    };
    await db.orders.put(stored);
    setSuccessMsg(`Order ${orderId} saved to IndexedDB!`);
    setParsedRecord(null);
    if (onOrderCreated) onOrderCreated();
  };

  const handleCopyReply = () => {
    if (!parsedRecord?.whatsappReply) return;
    navigator.clipboard.writeText(parsedRecord.whatsappReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    if (!parsedRecord?.whatsappReply) return;
    window.open(`https://wa.me/?text=${encodeURIComponent(parsedRecord.whatsappReply)}`, '_blank');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r    = e.currentTarget.getBoundingClientRect();
    const x    = e.clientX - r.left - r.width  / 2;
    const y    = e.clientY - r.top  - r.height / 2;
    const rx   = (y / (r.height / 2)) * -5;
    const ry   = (x / (r.width  / 2)) * 5;
    setTiltStyle({ transform: `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale3d(1.01,1.01,1.01)` });
  };

  const handleMouseLeave = () =>
    setTiltStyle({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)' });

  const domainColors = parsedRecord?.detectedDomain
    ? DOMAIN_COLORS[parsedRecord.detectedDomain]
    : { badge: 'bg-indigo-950 text-indigo-300 border-indigo-700', glow: '#6366f1', border: '#6366f1' };

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Page Header */}
      <div>
        <h2 className="text-lg font-semibold text-[#111111]">Unified Order Intake</h2>
        <p className="text-xs text-[#7b7b78] mt-0.5">Hindi / Hinglish voice or text parsing • 4 operator domains</p>
      </div>

      {/* Input Card */}
      <div
        className="card"
        style={{ borderColor: domainColors.border + '60' }}
      >
        <VoiceIntake
          onTranscriptChange={(t) => setMessage(t)}
          onListeningComplete={() => { if (message.trim()) handleParseText(message); }}
          domainGlowColor={domainColors.glow}
        />

        {/* Message bubble input */}
        <div
          className="rounded-xl p-3 mb-3 border border-[#d3cec6] bg-[#faf8f5]"
          style={{ borderLeft: `3px solid #ff5600` }}
        >
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-transparent text-xs text-[#111111] placeholder-[#7b7b78] focus:outline-none resize-none"
            placeholder="Type or speak customer order in Hindi/Hinglish (Tailor, Tiffin, Electrician, Baker)..."
          />
        </div>

        <button
          onClick={handleParse}
          disabled={isParsing}
          className="ic-btn-fin w-full sm:w-auto"
        >
          <Sparkles size={16} />
          {isParsing ? 'Parsing & Auto-Detecting…' : t('parseBtn')}
        </button>
      </div>

      {/* Parsed Smart-Card */}
      {parsedRecord && (
        <div className="card-tilt-wrapper">
          <div
            className="card card-tilt-inner animate-card-enter"
            style={{ borderColor: domainColors.border + '80', ...tiltStyle }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Card Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-[#ff5600]">
                <CheckCircle2 size={16} /> Parsed Smart-Card
              </h3>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${parsedRecord.needs_clarification ? 'bg-amber-50 border border-amber-200 text-amber-700' : 'bg-emerald-50 border border-emerald-200 text-emerald-700'}`}>
                {parsedRecord.needs_clarification ? '⚠ Needs Clarification' : '✓ Ready'}
              </span>
            </div>

            {/* Domain & Engine Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {parsedRecord.detectedDomain && (
                <span className={`badge border ${domainColors.badge} animate-chip-pop`}>
                  {DOMAIN_ICONS[parsedRecord.detectedDomain]}
                  {DOMAIN_LABELS[parsedRecord.detectedDomain]} · Auto-Detected
                </span>
              )}
              <span className="badge bg-[#faf8f5] border-[#d3cec6] text-[#111111]">
                <Cpu size={11} />
                {parsedRecord.engineUsed === 'gemini-flash'
                  ? 'Gemini 1.5 Flash (Online)'
                  : 'Local NLP Engine (Offline)'}
              </span>
              <span className="badge bg-[#faf8f5] border-[#d3cec6] text-[#626260]">
                ⚡ {parsedRecord.latencyMs}ms · {(parsedRecord.confidence * 100).toFixed(0)}% conf.
              </span>
            </div>

            {/* Order Details */}
            <div className="bg-[#faf8f5] rounded-xl p-4 border border-[#d3cec6] mb-4 space-y-3">
              {/* Customer row */}
              <div className="flex items-center gap-2">
                <User size={14} className="text-[#7b7b78] shrink-0" />
                <span className="font-semibold text-[#111111] text-sm">
                  {parsedRecord.customer || 'Unspecified Customer'}
                </span>
              </div>

              {/* Meta badges */}
              <div className="flex flex-wrap gap-2">
                {parsedRecord.due_date && (
                  <span className="badge bg-white border-[#d3cec6] text-[#111111]">
                    <Calendar size={11} /> {parsedRecord.due_date}
                  </span>
                )}
                {parsedRecord.amount !== null && (
                  <span className="badge bg-emerald-50 border-emerald-200 text-emerald-700">
                    <DollarSign size={11} /> ₹{parsedRecord.amount}
                  </span>
                )}
                {parsedRecord.references_prior_order && (
                  <span className="badge bg-amber-50 border-amber-200 text-amber-700">
                    🔁 Repeat Order
                  </span>
                )}
              </div>

              {/* Items */}
              {parsedRecord.items.map((it, idx) => (
                <div key={idx} className="pt-2 border-t border-[#e5e0d8]">
                  <p className="text-sm font-semibold text-[#111111] mb-1.5">
                    <span className="text-[#ff5600]">{it.quantity}×</span> {it.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(it.attributes).map(([k, v], aIdx) => (
                      <AttributeChip
                        key={k}
                        attrKey={k}
                        value={v}
                        domain={parsedRecord.detectedDomain}
                        index={aIdx}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp Reply Bubble */}
            {parsedRecord.whatsappReply && (
              <div className="whatsapp-bubble mb-4 bg-white border border-[#d3cec6] p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="flex items-center gap-1.5 text-[11px] text-[#27ae60] font-semibold">
                    <MessageSquare size={11} /> WhatsApp Confirmation Reply
                  </span>
                  <button
                    onClick={handleCopyReply}
                    className="flex items-center gap-1 bg-[#111111] hover:bg-[#222222] text-white text-[11px] px-2.5 py-1 rounded-lg transition-colors"
                  >
                    {copied ? <Check size={11} /> : <Copy size={11} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-sm text-[#111111] italic leading-relaxed mb-3">
                  "{parsedRecord.whatsappReply}"
                </p>
                <button
                  onClick={handleOpenWhatsApp}
                  className="flex items-center gap-2 ic-btn-primary text-sm px-4 py-2"
                >
                  <Send size={14} /> Send via WhatsApp
                </button>
              </div>
            )}

            {/* Action Row */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowInspector(!showInspector)}
                className="ic-btn-secondary text-xs"
              >
                <Code size={13} />
                {showInspector ? 'Hide Inspector' : 'JSON Inspector'}
                {showInspector ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
              <button onClick={handleSaveOrder} className="ic-btn-fin text-xs">
                {t('confirmSave')}
              </button>
            </div>

            {/* JSON Inspector */}
            {showInspector && (
              <div className="animate-fade-in mt-3 bg-white rounded-xl p-4 border border-[#d3cec6] shadow-sm">
                <p className="text-xs font-semibold text-[#ff5600] mb-1">Rule Explanation</p>
                <p className="text-xs text-[#626260] mb-3">{parsedRecord.ruleExplanation}</p>
                <p className="text-[10px] text-[#7b7b78] font-bold uppercase mb-1">Raw schema.json output</p>
                <pre className="text-[11px] text-[#111111] bg-[#faf8f5] p-3 rounded-lg overflow-x-auto leading-relaxed border border-[#e5e0d8]">
                  {JSON.stringify(parsedRecord, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success Banner */}
      {successMsg && (
        <div className="animate-fade-in flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-semibold">
          <CheckCircle2 size={16} /> {successMsg}
        </div>
      )}
    </div>
  );
};
