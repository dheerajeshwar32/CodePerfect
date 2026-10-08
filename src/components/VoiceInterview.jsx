import React, { useState, useEffect } from 'react';
import { Mic, MicOff, PhoneOff } from 'lucide-react';

export default function VoiceInterview({ onClose, jobTitle = "Senior Software Engineer" }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("Initializing secure neural connection...");
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    interval = setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Fake sequence of AI speaking
    const sequence = [
      "Hello. I'm your AI technical interviewer.",
      `Let's discuss your experience for the ${jobTitle} role.`,
      "Can you describe a time when you had to optimize a complex system?",
      "(Waiting for your response...)"
    ];
    let i = 0;
    const seqInterval = setInterval(() => {
      if (i < sequence.length) {
        setTranscript(sequence[i]);
        i++;
      } else {
        setIsListening(true);
        clearInterval(seqInterval);
      }
    }, 3000);
    return () => clearInterval(seqInterval);
  }, [jobTitle]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/95 backdrop-blur-2xl animate-in fade-in duration-500">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px] opacity-20 mix-blend-screen" style={{
          background: 'radial-gradient(circle, rgba(0,240,255,0.8) 0%, rgba(168,0,255,0.2) 100%)'
        }}></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl p-8 flex flex-col items-center">
        
        {/* Top Bar */}
        <div className="w-full flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-mono text-sm uppercase tracking-widest">Live Session</span>
          </div>
          <div className="text-white/60 font-mono text-xl tracking-widest">{formatTime(timer)}</div>
        </div>

        {/* AI Orb */}
        <div className="relative mb-16">
          <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-300 ${!isListening ? 'scale-110 shadow-[0_0_80px_rgba(0,240,255,0.6)]' : 'scale-100 shadow-[0_0_30px_rgba(0,240,255,0.3)]'}`}
               style={{
                 background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, rgba(0,240,255,0.8) 20%, rgba(168,0,255,0.8) 60%, rgba(11,17,32,1) 100%)',
                 boxShadow: 'inset -10px -10px 40px rgba(0,0,0,0.5)'
               }}>
            
            {/* Visualizer bars if speaking */}
            {!isListening && (
              <div className="flex gap-1 items-center h-12">
                {[1, 2, 3, 4, 5].map((bar) => (
                  <div key={bar} className="w-1.5 bg-white rounded-full animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDuration: `${0.2 + Math.random()*0.3}s` }}></div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Subtitles */}
        <div className="h-24 flex items-center justify-center mb-12">
          <p className="text-3xl md:text-4xl text-center font-light text-white tracking-wide leading-relaxed animate-in slide-in-from-bottom-4">
            "{transcript}"
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setIsListening(!isListening)}
            className={`w-16 h-16 rounded-full flex items-center justify-center border transition-all ${isListening ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20'}`}
          >
            {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </button>
          
          <button 
            onClick={onClose}
            className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all active:scale-95"
          >
            <PhoneOff className="w-8 h-8" />
          </button>
        </div>

      </div>
    </div>
  );
}
