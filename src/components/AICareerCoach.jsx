import React, { useState, useEffect } from 'react';
import { ChevronLeft, Target, Rocket, Shield, Activity, ArrowUpRight, Cpu } from 'lucide-react';

export default function AICareerCoach({ onClose, userProfile: _userProfile }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col font-sans animate-in fade-in duration-500">
      
      {/* Live Analysis Back-Header in Main Content Flow */}
      <div className="max-w-5xl w-full mx-auto pt-2 pb-6 px-1 sm:px-0 flex items-center gap-3">
        <button 
          onClick={onClose} 
          className="p-2 rounded-full bg-slate-100 dark:bg-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.15] transition-colors text-[#1D1D1F] dark:text-white cursor-pointer"
          title="Back to Dashboard"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Live Analysis</span>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-sm font-semibold text-[#1D1D1F] dark:text-white">AI Career Coach</span>
        </div>
      </div>

      {loading ? (
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center py-20 relative">
          <Cpu className="w-12 h-12 text-[#5268FF] animate-bounce mb-4" />
          <h2 className="text-2xl font-bold text-[#1D1D1F] dark:text-white mb-2">Analyzing Your Trajectory</h2>
          <p className="text-xs font-bold tracking-widest uppercase text-[#6E6E73] dark:text-[#94A3B8] animate-pulse">Computing career pathways...</p>
        </div>
      ) : (
        <div className="w-full max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Global Ranking Card */}
            <div className="col-span-1 md:col-span-2 bg-white dark:bg-[#13182B] border border-slate-200/80 dark:border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden group hover:border-[#5268FF]/30 transition-colors duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-[#5268FF]/10 flex items-center justify-center border border-[#5268FF]/20 text-[#5268FF]">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1D1D1F] dark:text-white">Global Percentile</h3>
                  <p className="text-[11px] font-bold tracking-wider uppercase text-[#6E6E73] dark:text-[#94A3B8]">Among 2.4M Verified Engineers</p>
                </div>
              </div>

              <div className="flex items-end gap-6 mb-8">
                <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight text-[#1D1D1F] dark:text-white">
                  94<span className="text-2xl font-bold text-[#6E6E73] dark:text-[#94A3B8] ml-1">th</span>
                </h1>
                <div className="pb-2">
                  <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +2% this month
                  </div>
                </div>
              </div>

              <div className="w-full bg-slate-100 dark:bg-[#0B0F19] h-3.5 rounded-full overflow-hidden border border-slate-200/80 dark:border-white/[0.08] relative">
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#5268FF] to-[#38BDF8] w-[94%] rounded-full shadow-[0_0_12px_rgba(82,104,255,0.4)]"></div>
              </div>
            </div>

            {/* AI Recommendation Strategy */}
            <div className="col-span-1 bg-white dark:bg-[#13182B] border border-slate-200/80 dark:border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:border-[#5268FF]/30 transition-colors duration-500">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#5268FF]/10 flex items-center justify-center border border-[#5268FF]/20 text-[#5268FF]">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1D1D1F] dark:text-white">AI Strategy</h3>
                </div>
                
                <p className="text-[#6E6E73] dark:text-[#94A3B8] text-sm leading-relaxed mb-6 font-normal">
                  To breach the <strong className="text-[#1D1D1F] dark:text-white font-semibold">99th percentile</strong> and unlock elite $300k+ enterprise roles, our AI recommends the following action plan:
                </p>
                
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-[#6E6E73] dark:text-[#94A3B8]">Complete the <span className="text-[#1D1D1F] dark:text-white font-medium">Distributed Systems Code Arena</span>.</span>
                  </li>
                  <li className="flex gap-3">
                    <Activity className="w-5 h-5 text-[#5268FF] shrink-0 mt-0.5" />
                    <span className="text-sm text-[#6E6E73] dark:text-[#94A3B8]">Improve your Voice AI response latency by 1.2s.</span>
                  </li>
                </ul>
              </div>

              <button className="w-full py-3.5 mt-6 bg-[#5268FF] hover:bg-[#4355E8] text-white font-semibold rounded-2xl shadow-[0_4px_14px_rgba(82,104,255,0.3)] transition-transform active:scale-[0.98] cursor-pointer text-sm">
                Initiate Training
              </button>
            </div>

            {/* Dream Companies Matrix */}
            <div className="col-span-1 md:col-span-3 bg-white dark:bg-[#13182B] border border-slate-200/80 dark:border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-[#1D1D1F] dark:text-white mb-6">Enterprise Compatibility</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'Apple', match: 88, circleColor: '#5268FF' },
                  { name: 'Google', match: 92, circleColor: '#10B981' },
                  { name: 'Meta', match: 96, circleColor: '#0EA5E9' }
                ].map((company) => (
                  <div key={company.name} className="bg-slate-50 dark:bg-[#0B0F19] border border-slate-200/80 dark:border-white/[0.08] rounded-2xl p-5 flex items-center justify-between hover:border-[#5268FF]/30 transition-colors">
                    <div>
                      <h4 className="text-xl font-bold text-[#1D1D1F] dark:text-white mb-0.5">{company.name}</h4>
                      <div className="text-[10px] font-bold tracking-wider uppercase text-[#6E6E73] dark:text-[#94A3B8]">Neural Match</div>
                    </div>
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-slate-200 dark:text-white/[0.08]" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path strokeWidth="3" strokeDasharray={`${company.match}, 100`} stroke={company.circleColor} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span className="absolute text-xs font-bold text-[#1D1D1F] dark:text-white">{company.match}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
