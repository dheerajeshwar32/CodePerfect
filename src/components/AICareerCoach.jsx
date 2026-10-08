import React, { useState, useEffect } from 'react';
import { ChevronLeft, Target, Rocket, Shield, Activity, ArrowUpRight, Cpu } from 'lucide-react';

export default function AICareerCoach({ onClose, userProfile }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col font-sans animate-in fade-in duration-500 overflow-hidden" style={{ backgroundColor: '#0B1120' }}>
      
      {/* Top Navbar */}
      <div className="h-20 border-b border-white/10 px-8 flex items-center justify-between z-20" style={{ backgroundColor: 'rgba(11, 17, 32, 0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white shadow-sm">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-500"></span>
              </span>
              <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-400 uppercase tracking-widest">Live Analysis</span>
            </div>
            <span className="text-xl font-medium text-white tracking-wide">AI Career Coach</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex-grow flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[600px] bg-fuchsia-500/10 blur-[100px] rounded-full animate-pulse"></div>
          </div>
          <Cpu className="w-16 h-16 text-fuchsia-400 animate-bounce mb-6" />
          <h2 className="text-3xl font-light text-white mb-2">Analyzing Your Trajectory</h2>
          <p className="text-slate-400 font-mono text-sm tracking-widest uppercase animate-pulse">Computing neural pathways...</p>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto p-8 relative">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-fuchsia-500/5 to-purple-600/5 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            
            {/* Global Ranking Card */}
            <div className="col-span-1 md:col-span-2 bg-[#121929] border border-white/5 rounded-[32px] p-8 relative overflow-hidden group hover:border-fuchsia-500/30 transition-all duration-500">
              <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-fuchsia-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center border border-fuchsia-500/20 shadow-[0_0_20px_rgba(217,70,239,0.15)]">
                  <Target className="w-7 h-7 text-fuchsia-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Global Percentile</h3>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Among 2.4M Verified Engineers</p>
                </div>
              </div>

              <div className="flex items-end gap-6 mb-8">
                <h1 className="text-8xl font-light text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 tracking-tighter">94<span className="text-4xl text-slate-500">th</span></h1>
                <div className="pb-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                    <ArrowUpRight className="w-4 h-4" /> +2% this month
                  </div>
                </div>
              </div>

              <div className="w-full bg-[#0B1120] h-4 rounded-full overflow-hidden border border-white/5 relative">
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 to-fuchsia-500 w-[94%] shadow-[0_0_20px_rgba(217,70,239,0.8)]"></div>
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="col-span-1 bg-[#121929] border border-white/5 rounded-[32px] p-8 flex flex-col hover:border-blue-500/30 transition-all duration-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                  <Rocket className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white">AI Strategy</h3>
              </div>
              
              <div className="flex-grow">
                <p className="text-slate-300 font-light leading-relaxed mb-6">
                  To breach the <strong className="text-white">99th percentile</strong> and unlock elite $300k+ enterprise roles, our neural network recommends the following action plan:
                </p>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-sm text-slate-400">Complete the <span className="text-white font-medium">Distributed Systems Code Arena</span>.</span>
                  </li>
                  <li className="flex gap-3">
                    <Activity className="w-5 h-5 text-blue-400 shrink-0" />
                    <span className="text-sm text-slate-400">Improve your Voice AI response latency by 1.2s.</span>
                  </li>
                </ul>
              </div>

              <button className="w-full py-4 mt-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold transition-all hover:scale-[1.02]">
                Initiate Training
              </button>
            </div>

            {/* Dream Companies Matrix */}
            <div className="col-span-1 md:col-span-3 bg-[#121929] border border-white/5 rounded-[32px] p-8 hover:border-emerald-500/30 transition-all duration-500">
              <h3 className="text-xl font-bold text-white mb-6">Enterprise Compatibility</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'Apple', match: 88, color: 'text-slate-200', bg: 'bg-slate-200' },
                  { name: 'Google', match: 92, color: 'text-blue-400', bg: 'bg-blue-400' },
                  { name: 'Meta', match: 96, color: 'text-blue-600', bg: 'bg-blue-600' }
                ].map((company) => (
                  <div key={company.name} className="bg-[#0B1120] border border-white/5 rounded-2xl p-6 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors">
                    <div>
                      <h4 className={`text-2xl font-bold ${company.color} mb-1`}>{company.name}</h4>
                      <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Neural Match</div>
                    </div>
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-white/5" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className={company.color} strokeWidth="3" strokeDasharray={`${company.match}, 100`} stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span className="absolute text-sm font-bold text-white">{company.match}%</span>
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

