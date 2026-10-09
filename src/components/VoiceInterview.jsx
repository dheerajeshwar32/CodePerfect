import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, PhoneOff } from 'lucide-react';

export default function VoiceInterview({ onClose, jobTitle = "Senior Software Engineer" }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("Initializing secure neural connection...");
  const [userSpeech, setUserSpeech] = useState("");
  const [timer, setTimer] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const recognitionRef = useRef(null);

  const isListeningRef = useRef(isListening);
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    if (!hasStarted) return;
    let interval = setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [hasStarted]);

  useEffect(() => {
    // Setup Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const piece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += piece;
          } else {
            interimTranscript += piece;
          }
        }
        
        setUserSpeech(prev => {
          return finalTranscript || interimTranscript || prev;
        });
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          setTranscript("Microphone access denied. Please check permissions.");
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        if (isListeningRef.current && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
          }
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setTranscript("Listening...");
        setUserSpeech("");
      } catch (e) {
        console.error("Failed to start recognition", e);
      }
    } else if (!isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  useEffect(() => {
    if (!hasStarted) return;
    
    const speak = (text) => {
      if ('speechSynthesis' in window) {
        if (text === "(Waiting for your response...)" || text.startsWith("Initializing") || text === "Listening...") return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        const voices = window.speechSynthesis.getVoices();
        const aiVoice = voices.find(v => v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Google US English') || v.name.includes('UK English Female')) || voices[0];
        if (aiVoice) utterance.voice = aiVoice;
        window.speechSynthesis.speak(utterance);
      }
    };

    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }

    const sequence = [
      "Hello. I'm your AI technical interviewer.",
      `Let's discuss your experience for the ${jobTitle} role.`,
      "Can you describe a time when you had to optimize a complex system?",
      "(Waiting for your response...)"
    ];
    let i = 0;
    
    const startDelay = setTimeout(() => {
      setTranscript(sequence[0]);
      speak(sequence[0]);
      i++;
      
      const seqInterval = setInterval(() => {
        if (i < sequence.length) {
          setTranscript(sequence[i]);
          speak(sequence[i]);
          i++;
        } else {
          setIsListening(true);
          clearInterval(seqInterval);
        }
      }, 4000);
      
    }, 1000);

    return () => {
      clearTimeout(startDelay);
    };
  }, [jobTitle, hasStarted]);

  const handleStart = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
    } catch (err) {
      console.warn("Audio permission delayed or denied", err);
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const unlockAudio = new SpeechSynthesisUtterance('Hello');
      unlockAudio.volume = 0.01;
      window.speechSynthesis.speak(unlockAudio);
    }
    setHasStarted(true);
    setTranscript("Connection established. Waiting for AI...");
  };

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
            
            {/* Visualizer bars if AI speaking (when NOT listening to user) */}
            {!isListening && hasStarted && (
              <div className="flex gap-1 items-center h-12">
                {[1, 2, 3, 4, 5].map((bar) => (
                  <div key={bar} className="w-1.5 bg-white rounded-full animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDuration: `${0.2 + Math.random()*0.3}s` }}></div>
                ))}
              </div>
            )}
            
            {/* Listening indicator when listening to user */}
            {isListening && (
              <div className="absolute inset-0 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin opacity-50"></div>
            )}
          </div>
        </div>

        {/* Subtitles */}
        <div className="h-32 flex flex-col items-center justify-center mb-12 w-full max-w-3xl">
          {!isListening ? (
             <p className="text-3xl md:text-4xl text-center font-light text-white tracking-wide leading-relaxed animate-in slide-in-from-bottom-4 transition-all">
               "{transcript}"
             </p>
          ) : (
            <div className="w-full">
              <p className="text-sm text-emerald-400 font-mono mb-2 text-center uppercase tracking-widest">You are speaking...</p>
              <p className="text-2xl md:text-3xl text-center font-light text-white/90 tracking-wide leading-relaxed animate-in slide-in-from-bottom-2">
                {userSpeech || "..."}
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-8">
          {!hasStarted ? (
            <button 
              onClick={handleStart}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-10 rounded-full text-lg shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all active:scale-95 tracking-wide"
            >
              Start Interview
            </button>
          ) : (
            <button 
              onClick={() => setIsListening(!isListening)}
              className={`w-16 h-16 rounded-full flex items-center justify-center border transition-all ${isListening ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
              title={isListening ? "Mute Microphone" : "Unmute Microphone"}
            >
              {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>
          )}
          
          <button 
            onClick={onClose}
            className="w-20 h-20 rounded-full bg-red-500/90 hover:bg-red-600 flex items-center justify-center text-white shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all active:scale-95"
            title="End Interview"
          >
            <PhoneOff className="w-8 h-8" />
          </button>
        </div>

      </div>
    </div>
  );
}
