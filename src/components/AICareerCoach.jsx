import React, { useState, useEffect } from 'react';
import { ChevronLeft, Target, Rocket, Shield, Activity, ArrowUpRight, Cpu } from 'lucide-react';

export default function AICareerCoach({ onClose, userProfile }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col font-sans animate-in fade-in duration-500 overflow-hidden bg-[#F6F8FC] dark:bg-[#0E1229]">
      
      {/* Top Navbar */}
      <div className="h-20 border-b border-[#E2E8F8] dark:border-[#252D58] px-8 flex items-center justify-between z-20 bg-white/80 dark:bg-[#0E1229]/80 backdrop-blur-2xl">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="p-2 rounded-full bg-[#F4F7FF] dark:bg-[#1B2244] hover:bg-[#EEF2FF] dark:hover:bg-[#1E264D] transition-colors text-[#848DB3] hover:text-[#2D325A] dark:hover:text-[#F0F4FF]">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5268FF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5268FF]"></span>
              </span>
              <span className="text-xs font-bold text-[#5268FF] uppercase tracking-widest">Live Analysis</span>
            </div>
            <span className="text-xl font-medium text-[#2D325A] dark:text-[#F0F4FF] tracking-wide">AI Career Coach</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex-grow flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[600px] bg-[#5268FF]/10 blur-[100px] rounded-full animate-pulse"></div>
          </div>
          <Cpu className="w-16 h-16 text-[#5268FF] animate-bounce mb-6" />
          <h2 className="text-3xl font-normal text-[#2D325A] dark:text-[#F0F4FF] mb-2">Analyzing Your Trajectory</h2>
          <p className="text-[#848DB3] text-sm tracking-widest uppercase animate-pulse">Computing career pathways...</p>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto p-8 relative">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#5268FF]/5 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            
            {/* Global Ranking Card - Velvety Dusk Navy Hero */}
            <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-[#343A68] via-[#2D325A] to-[#222647] border border-[#5268FF]/30 rounded-[32px] p-8 relative overflow-hidden group hover:border-[#5268FF]/50 transition-colors duration-500 shadow-lg">
              <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#5268FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-[#5268FF]/20 flex items-center justify-center border border-[#5268FF]/30">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Global Percentile</h3>
                  <p className="text-xs text-white/70 uppercase tracking-widest font-bold">Among 2.4M Verified Engineers</p>
                </div>
              </div>

              <div className="flex items-end gap-6 mb-8">
                <h1 className="text-8xl font-extrabold text-white tracking-tighter">94<span className="text-4xl text-white/50">th</span></h1>
                <div className="pb-4">
                  <div className="flex items-center gap-2 text-[#34D399] font-bold bg-[#059669]/20 px-3 py-1.5 rounded-lg border border-[#059669]/30">
                    <ArrowUpRight className="w-4 h-4" /> +2% this month
                  </div>
                </div>
              </div>

              <div className="w-full bg-[#1E264D] h-4 rounded-full overflow-hidden border border-white/10 relative">
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#5268FF] to-[#00E5FF] w-[94%] shadow-[0_0_20px_rgba(82,104,255,0.6)]"></div>
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="col-span-1 bg-white dark:bg-[#151A36] border border-[#E2E8F8] dark:border-[#252D58] rounded-[32px] p-8 flex flex-col hover:border-[#5268FF]/30 transition-colors duration-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] dark:bg-[#1E264D] flex items-center justify-center border border-[#C7D4FF] dark:border-[#334185]">
                  <Rocket className="w-6 h-6 text-[#5268FF]" />
                </div>
                <h3 className="text-xl font-bold text-[#2D325A] dark:text-[#F0F4FF]">AI Strategy</h3>
              </div>
              
              <div className="flex-grow">
                <p className="text-[#5A628A] dark:text-[#9BA6D1] font-normal leading-relaxed mb-6">
                  To breach the <strong className="text-[#2D325A] dark:text-[#F0F4FF] font-semibold">99th percentile</strong> and unlock elite $300k+ enterprise roles, our AI recommends the following action plan:
                </p>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <Shield className="w-5 h-5 text-[#059669] shrink-0" />
                    <span className="text-sm text-[#5A628A] dark:text-[#9BA6D1]">Complete the <span className="text-[#2D325A] dark:text-[#F0F4FF] font-medium">Distributed Systems Code Arena</span>.</span>
                  </li>
                  <li className="flex gap-3">
                    <Activity className="w-5 h-5 text-[#5268FF] shrink-0" />
                    <span className="text-sm text-[#5A628A] dark:text-[#9BA6D1]">Improve your Voice AI response latency by 1.2s.</span>
                  </li>
                </ul>
              </div>

              <button className="w-full py-4 mt-6 bg-[#5268FF] hover:bg-[#4256E8] text-white font-semibold rounded-xl shadow-[0_6px_20px_rgba(82,104,255,0.3)] transition-transform active:scale-[0.98]">
                Initiate Training
              </button>
            </div>

            {/* Dream Companies Matrix */}
            <div className="col-span-1 md:col-span-3 bg-white dark:bg-[#151A36] border border-[#E2E8F8] dark:border-[#252D58] rounded-[32px] p-8 hover:border-[#059669]/30 transition-colors duration-500">
              <h3 className="text-xl font-bold text-[#2D325A] dark:text-[#F0F4FF] mb-6">Enterprise Compatibility</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'Apple', match: 88, circleColor: '#5268FF' },
                  { name: 'Google', match: 92, circleColor: '#059669' },
                  { name: 'Meta', match: 96, circleColor: '#0EA5E9' }
                ].map((company) => (
                  <div key={company.name} className="bg-[#F4F7FF] dark:bg-[#1B2244] border border-[#DCE6FA] dark:border-[#2B3566] rounded-2xl p-6 flex items-center justify-between cursor-pointer hover:bg-[#EEF2FF] dark:hover:bg-[#1E264D] transition-colors">
                    <div>
                      <h4 className="text-2xl font-bold text-[#2D325A] dark:text-[#F0F4FF] mb-1">{company.name}</h4>
                      <div className="text-xs text-[#848DB3] dark:text-[#6E78A3] uppercase tracking-widest font-bold">Neural Match</div>
                    </div>
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-[#E2E8F8] dark:text-[#252D58]" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path strokeWidth="3" strokeDasharray={`${company.match}, 100`} stroke={company.circleColor} fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span className="absolute text-sm font-bold text-[#2D325A] dark:text-[#F0F4FF]">{company.match}%</span>
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
