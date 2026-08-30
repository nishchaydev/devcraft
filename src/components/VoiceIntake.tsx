import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertTriangle } from 'lucide-react';

interface VoiceIntakeProps {
  onTranscriptChange:   (text: string) => void;
  onListeningComplete?: () => void;
  domainGlowColor?:     string;
}

export const VoiceIntake: React.FC<VoiceIntakeProps> = ({
  onTranscriptChange,
  onListeningComplete,
  domainGlowColor = '#6366f1',
}) => {
  const [isListening, setIsListening]         = useState(false);
  const [isSupported, setIsSupported]         = useState(true);
  const [interimTranscript, setInterim]       = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setIsSupported(false); return; }

    const rec = new SR();
    rec.continuous     = true;
    rec.interimResults = true;
    rec.lang           = 'hi-IN';

    rec.onresult = (event: any) => {
      let final   = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }
      setInterim(interim);
      if (final || interim) onTranscriptChange(final || interim);
    };

    rec.onerror = () => setIsListening(false);
    rec.onend   = () => {
      setIsListening(false);
      onListeningComplete?.();
    };

    recognitionRef.current = rec;
  }, [onTranscriptChange, onListeningComplete]);

  const toggle = () => {
    if (!isSupported) return;
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      onListeningComplete?.();
    } else {
      setInterim('');
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 text-xs text-amber-400 mb-3 bg-amber-950/30 border border-amber-800/40 rounded-lg px-3 py-2">
        <AlertTriangle size={13} className="shrink-0" />
        Voice input not available in this browser. Type the order below.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 mb-3">
      {/* Mic Button */}
      <button
        type="button"
        onClick={toggle}
        className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          backgroundColor: isListening ? '#7f1d1d' : '#1e1b4b',
          border: `2px solid ${isListening ? '#ef4444' : domainGlowColor}`,
          boxShadow: isListening ? `0 0 18px ${domainGlowColor}60` : '0 4px 12px rgba(0,0,0,0.4)',
        }}
        title={isListening ? 'Stop voice input' : 'Start voice input (Hindi/Hinglish)'}
      >
        {isListening
          ? <MicOff size={20} className="text-red-400 animate-pulse" />
          : <Mic size={20} style={{ color: domainGlowColor }} />
        }
      </button>

      {/* Status */}
      {isListening ? (
        <div className="flex items-center gap-3 min-w-0">
          <div className="voice-waveform shrink-0">
            {[1,2,3,4,5].map(i => (
              <div
                key={i}
                className="voice-waveform-bar"
                style={{ backgroundColor: domainGlowColor }}
              />
            ))}
          </div>
          <span className="text-xs text-sky-400 font-semibold truncate">
            Listening… {interimTranscript && `"${interimTranscript.slice(-30)}"`}
          </span>
        </div>
      ) : (
        <p className="text-xs text-slate-500">
          Tap mic to dictate in Hindi / Hinglish{' '}
          <em className="text-slate-600">("2 kurta navy blue…")</em>
        </p>
      )}
    </div>
  );
};
