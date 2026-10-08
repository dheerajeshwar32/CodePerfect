import { useState, useEffect } from 'react';

export default function CodeArena({ jobTitle, skillsToProve, onClose, onComplete }) {
  const [code, setCode] = useState(`// Welcome to the Live Code Arena
// Prove your skills for: ${jobTitle}
// Required Skills: ${skillsToProve}

function solveChallenge() {
  // Write your God-Tier code here...
  
  
  return true;
}
`);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState(null); // 'success' | 'fail'

  const handleVerify = () => {
    setIsVerifying(true);
    // Simulate real-time execution and AI evaluation
    setTimeout(() => {
      setIsVerifying(false);
      setResult('success');
      setTimeout(() => {
        onComplete();
      }, 2000);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/80 backdrop-blur-3xl p-4 sm:p-8">
      <div className="bg-navy-900 w-full max-w-5xl h-full max-h-[800px] rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,240,255,0.1)] flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer hover:bg-red-500" onClick={onClose}></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            <span className="ml-4 text-sm font-bold text-slate-400 tracking-widest uppercase">Arena / {jobTitle}</span>
          </div>
          <button onClick={handleVerify} disabled={isVerifying || result === 'success'} className="px-5 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-sm font-bold tracking-wide hover:bg-blue-500 hover:text-white transition-all disabled:opacity-50">
            {isVerifying ? 'Evaluating Neural Matrix...' : result === 'success' ? 'Verified!' : 'Run & Verify'}
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-grow flex relative">
          <div className="w-12 border-r border-white/5 bg-black/10 flex flex-col items-center py-4 text-xs text-slate-600 select-none">
            {[...Array(20)].map((_, i) => <div key={i} className="mb-1">{i + 1}</div>)}
          </div>
          <textarea
            className="flex-grow bg-transparent text-slate-300 p-4 font-mono text-sm focus:outline-none resize-none leading-loose"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
          />
          
          {/* Overlay Result */}
          {result === 'success' && (
            <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-500">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/50 mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Cryptographic Verification Passed</h2>
              <p className="text-emerald-400 font-medium">Your skills have been injected into the Spatial Matrix.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

