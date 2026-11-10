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
          } catch {
            // Safe ignore duplicate start attempt
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F6F8FC]/95 dark:bg-[#0E1229]/95 backdrop-blur-2xl animate-in fade-in duration-500">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px] opacity-20 mix-blend-screen" style={{
          background: 'radial-gradient(circle, rgba(82,104,255,0.5) 0%, rgba(45,50,90,0.15) 100%)'
        }}></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl p-4 sm:p-8">
        {/* Studio Card */}
        <div className="bg-white/95 dark:bg-[#151A36]/95 backdrop-blur-2xl border border-[#E2E8F8] dark:border-[#252D58] rounded-3xl p-6 sm:p-10 shadow-[0_16px_50px_-12px_rgba(45,50,90,0.08)] flex flex-col items-center">
          
          {/* Back Button */}
          <button onClick={onClose} className="self-start flex items-center gap-1.5 text-xs font-semibold text-[#5A628A] dark:text-[#9BA6D1] hover:text-[#5268FF] mb-6 transition-colors">
            ← Back to Dashboard
          </button>

          {/* Top Bar */}
          <div className="w-full flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#059669]"></span>
              </span>
              <span className="text-[#059669] font-mono text-sm uppercase tracking-widest">Live Session</span>
            </div>
            <div className="text-[#2D325A] dark:text-[#F0F4FF]/60 font-mono text-xl tracking-widest">{formatTime(timer)}</div>
          </div>

          {/* AI Orb */}
          <div className="relative mb-10">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-transform duration-300 ${!isListening ? 'scale-110' : 'scale-100'}`}
                 style={{
                   background: 'radial-gradient(circle at 35% 30%, #FFFFFF 0%, #7C9BFF 28%, #5268FF 62%, #2D325A 100%)',
                   boxShadow: '0 0 50px rgba(82,104,255,0.45), inset 0 2px 12px rgba(255,255,255,0.6)'
                 }}>
              
              {/* Visualizer bars if AI speaking */}
              {!isListening && hasStarted && (
                <div className="flex gap-1 items-center h-10">
                  {[
                    { bar: 1, h: '60%', d: '0.3s' },
                    { bar: 2, h: '90%', d: '0.4s' },
                    { bar: 3, h: '45%', d: '0.25s' },
                    { bar: 4, h: '80%', d: '0.35s' },
                    { bar: 5, h: '55%', d: '0.45s' },
                  ].map(({ bar, h, d }) => (
                    <div key={bar} className="w-1.5 bg-white rounded-full animate-pulse" style={{ height: h, animationDuration: d }}></div>
                  ))}
                </div>
              )}
              
              {/* Listening indicator */}
              {isListening && (
                <div className="absolute inset-0 rounded-full border-4 border-[#059669] border-t-transparent animate-spin opacity-50"></div>
              )}
            </div>
          </div>

          {/* Subtitles */}
          <div className="h-24 flex flex-col items-center justify-center mb-10 w-full">
            {!isListening ? (
               <p className="text-lg font-semibold text-[#2D325A] dark:text-[#F0F4FF] text-center leading-relaxed">
                 "{transcript}"
               </p>
            ) : (
              <div className="w-full">
                <p className="text-sm text-[#059669] font-mono mb-2 text-center uppercase tracking-widest">You are speaking...</p>
                <p className="text-lg font-semibold text-[#2D325A] dark:text-[#F0F4FF]/90 text-center leading-relaxed">
                  {userSpeech || "..."}
                </p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6">
            {!hasStarted ? (
              <button 
                onClick={handleStart}
                className="bg-[#5268FF] hover:bg-[#4256E8] text-white font-semibold py-3 px-8 rounded-full text-lg shadow-[0_6px_20px_rgba(82,104,255,0.35)] transition-transform active:scale-[0.98] tracking-wide"
              >
                Start Interview
              </button>
            ) : (
              <button 
                onClick={() => setIsListening(!isListening)}
                className={`w-14 h-14 rounded-full flex items-center justify-center border transition-colors ${isListening ? 'bg-[#059669]/20 border-[#059669]/50 text-[#059669]' : 'bg-[#F4F7FF] dark:bg-[#1B2244] border-[#DCE6FA] dark:border-[#2B3566] text-[#848DB3]'}`}
                title={isListening ? "Mute Microphone" : "Unmute Microphone"}
              >
                {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
            )}
            
            <button 
              onClick={onClose}
              className="w-16 h-16 rounded-full bg-[#EF4444]/10 hover:bg-[#EF4444]/20 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444] transition-colors active:scale-95"
              title="End Interview"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
