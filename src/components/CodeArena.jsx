import { useState } from 'react';

export default function CodeArena({ jobTitle, skillsToProve, userName, onClose, onComplete }) {
  const [code, setCode] = useState(`// Welcome to the Live Code Arena, ${userName}!
// Prove your skills for: ${jobTitle}
// Required Skills: ${skillsToProve}

function solveChallenge() {
  // Write your production-ready code here...
  
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F6F8FC]/80 dark:bg-[#0E1229]/80 backdrop-blur-2xl p-4 sm:p-8 animate-in fade-in duration-300">
      <div className="bg-white/95 dark:bg-[#151A36]/95 w-full max-w-5xl h-full max-h-[800px] rounded-3xl border border-[#E2E8F8] dark:border-[#252D58] shadow-[0_20px_60px_-15px_rgba(45,50,90,0.15)] flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F8] dark:border-[#252D58] bg-[#F4F7FF]/50 dark:bg-[#11152B]/50">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#EF4444] cursor-pointer hover:opacity-80 transition-opacity" onClick={onClose} title="Close"></div>
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
            <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
            <span className="ml-4 text-xs font-bold text-[#848DB3] dark:text-[#6E78A3] tracking-widest uppercase">Arena / {jobTitle}</span>
          </div>
          <button 
            onClick={handleVerify} 
            disabled={isVerifying || result === 'success'} 
            className="px-5 py-2 bg-[#EEF2FF] dark:bg-[#1E264D] text-[#5268FF] border border-[#C7D4FF] dark:border-[#334185] rounded-xl text-xs font-bold tracking-wide hover:bg-[#5268FF] hover:text-white transition-colors disabled:opacity-50"
          >
            {isVerifying ? 'Evaluating Skill Proof...' : result === 'success' ? 'Verified!' : 'Run & Verify'}
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-grow flex relative bg-[#FAFCFF] dark:bg-[#0E1229]">
          <div className="w-12 border-r border-[#E2E8F8] dark:border-[#252D58] bg-[#F4F7FF] dark:bg-[#11152B] flex flex-col items-center py-4 text-xs text-[#848DB3] select-none font-mono">
            {[...Array(20)].map((_, i) => <div key={i} className="mb-1">{i + 1}</div>)}
          </div>
          <textarea
            className="flex-grow bg-transparent text-[#2D325A] dark:text-[#F0F4FF] p-4 font-mono text-base md:text-sm focus:outline-none resize-none leading-loose"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
          />
          
          {/* Overlay Result */}
          {result === 'success' && (
            <div className="absolute inset-0 bg-[#ECFDF5]/90 dark:bg-[#064E3B]/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-500 z-20">
              <div className="w-20 h-20 bg-[#059669]/20 rounded-full flex items-center justify-center border border-[#059669]/50 mb-4 shadow-[0_0_30px_rgba(5,150,105,0.3)]">
                <svg className="w-10 h-10 text-[#059669]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h2 className="text-3xl font-extrabold text-[#2D325A] dark:text-[#F0F4FF] mb-2">Skill Verification Passed</h2>
              <p className="text-[#059669] font-semibold">Your skills have been validated and updated in your matrix.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
