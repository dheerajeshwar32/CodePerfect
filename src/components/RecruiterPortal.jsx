import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, Map, Users, Star, Award, Zap, Code, Mic, Github, Eye, Activity } from 'lucide-react';

export default function RecruiterPortal({ onClose }) {
  const [nodes, setNodes] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
  // Generate random candidate nodes for the spatial map
  useEffect(() => {
    const roles = ['Senior React Engineer', 'Full Stack Developer', 'AI/ML Architect', 'DevOps Specialist', 'Blockchain Dev'];
    const candidates = Array.from({ length: 45 }).map((_, i) => {
      const isTopTier = Math.random() > 0.8;
      return {
        id: i,
        x: Math.random() * 90 + 5,
        y: Math.random() * 90 + 5,
        size: isTopTier ? 24 : 12 + Math.random() * 8,
        matchScore: (75 + Math.random() * 24).toFixed(1),
        voiceScore: (80 + Math.random() * 19).toFixed(1),
        codeScore: (70 + Math.random() * 29).toFixed(1),
        role: roles[Math.floor(Math.random() * roles.length)],
        pulseDelay: Math.random() * 3,
        isTopTier,
        status: isTopTier ? 'Actively Looking' : 'Passive',
        githubCommits: Math.floor(400 + Math.random() * 1500)
      };
    });
    setNodes(candidates);
  }, []);

  return (
    // Force dark mode colors here to avoid light mode bleed
    <div className="fixed inset-0 z-[100] flex flex-col text-slate-300 animate-in fade-in duration-500 overflow-hidden font-sans" style={{ backgroundColor: '#0B1120' }}>
      
      {/* Top Navbar */}
      <div className="h-20 border-b border-white/10 px-8 flex items-center justify-between z-20" style={{ backgroundColor: 'rgba(11, 17, 32, 0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 uppercase tracking-widest">God Mode Active</span>
            </div>
            <span className="text-xl font-medium text-white tracking-wide">Enterprise Talent Radar</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Credits:</span>
            <span className="text-emerald-400 font-mono font-bold tracking-widest">12,450</span>
          </div>
          <div className="h-6 w-px bg-white/10"></div>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Query neural network..." 
              className="bg-black/20 border border-white/10 rounded-full py-2.5 pl-12 pr-6 text-sm text-white w-72 focus:outline-none focus:border-cyan-500/50 transition-colors placeholder-slate-600"
            />
          </div>
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-full transition-colors text-sm font-medium text-white">
            <Filter className="w-4 h-4" /> Parameters
          </button>
        </div>
      </div>

      <div className="flex-grow flex relative">
        {/* Sidebar - Top Matches */}
        <div className="w-96 border-r border-white/10 p-6 flex flex-col z-20 overflow-y-auto" style={{ backgroundColor: 'rgba(11, 17, 32, 0.9)', backdropFilter: 'blur(10px)' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Global Neural Matches</h3>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full border border-cyan-500/20">LIVE</span>
          </div>
          
          <div className="space-y-4">
            {nodes.filter(n => n.isTopTier).slice(0, 5).map((node) => (
              <div 
                key={node.id} 
                onClick={() => setSelectedCandidate(node)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${selectedCandidate?.id === node.id ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_20px_rgba(0,240,255,0.1)]' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'}`}
              >
                {/* Glowing edge on hover */}
                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-white font-medium tracking-wide">Candidate #{1000 + node.id}</div>
                    <div className="text-xs text-slate-400 mt-1">{node.role}</div>
                  </div>
                  <div className="bg-cyan-500/20 text-cyan-400 text-xs font-bold px-2 py-1 rounded-md border border-cyan-500/20">{node.matchScore}% Match</div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="flex flex-col items-center p-2 rounded-lg bg-black/30 border border-white/5">
                    <Mic className="w-3 h-3 text-emerald-400 mb-1" />
                    <span className="text-[10px] text-slate-400">Voice AI</span>
                    <span className="text-xs text-white font-mono">{node.voiceScore}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-lg bg-black/30 border border-white/5">
                    <Code className="w-3 h-3 text-purple-400 mb-1" />
                    <span className="text-[10px] text-slate-400">Arena</span>
                    <span className="text-xs text-white font-mono">{node.codeScore}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-lg bg-black/30 border border-white/5">
                    <Github className="w-3 h-3 text-slate-300 mb-1" />
                    <span className="text-[10px] text-slate-400">Commits</span>
                    <span className="text-xs text-white font-mono">{node.githubCommits}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3D Radar Map Area */}
        <div className="flex-grow relative overflow-hidden bg-[#070B14]">
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgNDBoNDBWMEgwem0zOS0xSDFWMWgzOHYzOHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==')]"></div>
          
          {/* Radar Circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-cyan-500/20 rounded-full shadow-[0_0_50px_rgba(0,240,255,0.1)]"></div>
          
          {/* Radar Sweep Animation */}
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] origin-top-left border-l border-cyan-500/50 animate-spin pointer-events-none" style={{ animationDuration: '4s', background: 'conic-gradient(from 180deg at 0% 0%, rgba(0,240,255,0.1) 0deg, transparent 60deg)' }}></div>

          {/* Glowing Center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_30px_rgba(0,240,255,1)]"></div>

          {nodes.map(node => (
            <div 
              key={node.id} 
              onClick={() => setSelectedCandidate(node)}
              className="absolute group cursor-pointer"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div 
                className={`rounded-full shadow-[0_0_15px_rgba(0,240,255,0.4)] relative z-10 transition-transform duration-300 ${selectedCandidate?.id === node.id ? 'scale-150 bg-white ring-4 ring-cyan-500/50' : 'group-hover:scale-150 ' + (node.isTopTier ? 'bg-cyan-400' : 'bg-slate-500')}`}
                style={{ width: node.size, height: node.size }}
              ></div>
              
              {node.isTopTier && (
                <div 
                  className="absolute inset-0 rounded-full border border-cyan-400 animate-ping"
                  style={{ animationDelay: `${node.pulseDelay}s`, animationDuration: '3s' }}
                ></div>
              )}
              
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0B1120] border border-white/10 px-4 py-2 rounded-xl whitespace-nowrap z-20 pointer-events-none shadow-2xl">
                <div className="text-white text-xs font-bold tracking-wide mb-1">Candidate #{1000 + node.id}</div>
                <div className="text-[10px] text-cyan-400 mb-2">{node.role}</div>
                <div className="flex gap-3 text-[10px]">
                  <span className="text-slate-400">Match: <span className="text-white">{node.matchScore}</span></span>
                  <span className="text-slate-400">Code: <span className="text-white">{node.codeScore}</span></span>
                </div>
              </div>
            </div>
          ))}
          
        </div>

        {/* Candidate Detail Panel (Slide in from right) */}
        <div className={`absolute top-0 bottom-0 right-0 w-[450px] border-l border-white/10 bg-[#0B1120]/95 backdrop-blur-2xl p-8 transform transition-transform duration-500 ease-out z-30 flex flex-col ${selectedCandidate ? 'translate-x-0' : 'translate-x-full'}`}>
          {selectedCandidate && (
            <>
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-slate-400 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 rotate-180" />
              </button>
              
              <div className="mb-8 mt-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                  <span className="text-emerald-400 text-xs font-bold tracking-widest uppercase">{selectedCandidate.status}</span>
                </div>
                <h2 className="text-3xl font-light text-white tracking-wide mb-1">Candidate #{1000 + selectedCandidate.id}</h2>
                <p className="text-slate-400 text-sm">{selectedCandidate.role}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-black/40 border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl"></div>
                  <Mic className="w-5 h-5 text-cyan-400 mb-3" />
                  <div className="text-2xl font-light text-white mb-1">{selectedCandidate.voiceScore}%</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">AI Interview Score</div>
                </div>
                <div className="bg-black/40 border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-purple-500/10 rounded-full blur-xl"></div>
                  <Code className="w-5 h-5 text-purple-400 mb-3" />
                  <div className="text-2xl font-light text-white mb-1">{selectedCandidate.codeScore}%</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Arena Validation</div>
                </div>
              </div>

              <div className="space-y-6 flex-grow">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Verified Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Node.js', 'System Design', 'TypeScript', 'AWS'].map(skill => (
                      <span key={skill} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">{skill}</span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">GitHub Proof of Work</h4>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex items-center gap-4">
                    <Github className="w-8 h-8 text-slate-400" />
                    <div>
                      <div className="text-white font-medium">{selectedCandidate.githubCommits} Commits</div>
                      <div className="text-xs text-slate-400">in the last year</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <button className="w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-slate-200 py-4 rounded-xl font-bold transition-transform active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  <Eye className="w-5 h-5" />
                  Reveal Identity (Cost: 50 Credits)
                </button>
                <p className="text-center text-[10px] text-slate-500 mt-4 uppercase tracking-widest">Unlocks full resume & contact details</p>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
