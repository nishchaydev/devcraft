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
      <div className="flex items-center gap-2 text-xs text-amber-700 mb-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
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
          backgroundColor: isListening ? '#fff0f0' : '#fff5f0',
          border: `2px solid ${isListening ? '#ef4444' : '#ff5600'}`,
          boxShadow: isListening ? '0 0 18px rgba(239,68,68,0.2)' : '0 2px 8px rgba(255,86,0,0.15)',
        }}
        title={isListening ? 'Stop voice input' : 'Start voice input (Hindi/Hinglish)'}
      >
        {isListening
          ? <MicOff size={20} className="text-red-500 animate-pulse" />
          : <Mic size={20} className="text-[#ff5600]" />
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
                style={{ backgroundColor: '#ff5600' }}
              />
            ))}
          </div>
          <span className="text-xs text-[#ff5600] font-semibold truncate">
            Listening… {interimTranscript && `"${interimTranscript.slice(-30)}"`}
          </span>
        </div>
      ) : (
        <p className="text-xs text-[#7b7b78]">
          Tap mic to dictate in Hindi / Hinglish{' '}
          <em className="text-[#626260]">("2 kurta navy blue…")</em>
        </p>
      )}
    </div>
  );
};
