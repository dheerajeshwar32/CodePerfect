import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, Map, Users, Star, Award, Zap } from 'lucide-react';

export default function RecruiterPortal({ onClose }) {
  const [nodes, setNodes] = useState([]);
  
  // Generate random candidate nodes for the spatial map
  useEffect(() => {
    const candidates = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 10 + Math.random() * 20,
      score: 70 + Math.random() * 29,
      role: ['Frontend', 'Backend', 'Full Stack', 'AI/ML', 'DevOps'][Math.floor(Math.random() * 5)],
      pulseDelay: Math.random() * 2,
    }));
    setNodes(candidates);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-navy-950 text-slate-300 animate-in fade-in duration-500 overflow-hidden">
      
      {/* Top Navbar */}
      <div className="h-20 border-b border-white/10 bg-navy-900/50 backdrop-blur-xl px-8 flex items-center justify-between z-20">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 transition-colors text-slate-400 hover:text-white">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 uppercase tracking-widest">Enterprise Mode</span>
            <span className="text-xl font-medium text-white">Spatial Talent Matrix</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search skills, roles..." 
              className="bg-navy-950 border border-white/10 rounded-full py-2.5 pl-12 pr-6 text-sm text-white w-64 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-full transition-colors text-sm font-medium">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      <div className="flex-grow flex relative">
        {/* Sidebar */}
        <div className="w-80 border-r border-white/10 bg-navy-950/80 backdrop-blur-md p-6 flex flex-col z-20 overflow-y-auto">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Top Matches for "Senior React Eng"</h3>
          
          <div className="space-y-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-white font-medium">Candidate #{1000 + i*42}</div>
                    <div className="text-xs text-slate-400">Available immediately</div>
                  </div>
                  <div className="bg-purple-500/20 text-purple-400 text-xs font-bold px-2 py-1 rounded-md">9{i}% Match</div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-[10px] bg-navy-900 px-2 py-1 rounded-full text-slate-300">React</span>
                  <span className="text-[10px] bg-navy-900 px-2 py-1 rounded-full text-slate-300">TypeScript</span>
                  <span className="text-[10px] bg-navy-900 px-2 py-1 rounded-full text-emerald-400/80 border border-emerald-500/20">CodeVerified</span>
                </div>
                <button className="w-full py-2 bg-white/5 text-xs font-bold text-white rounded-xl group-hover:bg-purple-500 transition-colors">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 3D Map Area */}
        <div className="flex-grow relative bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgNDBoNDBWMEgwem0zOS0xSDFWMWgzOHYzOHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMikiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==')]">
          
          {/* Decorative background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 pointer-events-none" style={{
            background: 'radial-gradient(circle, rgba(168,0,255,0.6) 0%, rgba(0,240,255,0.2) 100%)'
          }}></div>

          {nodes.map(node => (
            <div 
              key={node.id} 
              className="absolute group cursor-pointer"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div 
                className="rounded-full bg-purple-500 shadow-[0_0_20px_rgba(168,0,255,0.6)] relative z-10 transition-transform group-hover:scale-150"
                style={{ width: node.size, height: node.size }}
              ></div>
              <div 
                className="absolute inset-0 rounded-full border border-purple-400 animate-ping"
                style={{ animationDelay: `${node.pulseDelay}s`, animationDuration: '3s' }}
              ></div>
              
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity bg-navy-900 border border-white/10 px-3 py-1.5 rounded-lg whitespace-nowrap z-20 pointer-events-none shadow-xl">
                <div className="text-white text-xs font-bold mb-0.5">{node.role}</div>
                <div className="text-[10px] text-purple-400">Match: {node.score.toFixed(1)}%</div>
              </div>
            </div>
          ))}
          
          {/* Overlay text */}
          <div className="absolute bottom-8 right-8 text-right pointer-events-none">
            <h1 className="text-6xl font-bold text-white/5 tracking-tighter">GLOBAL</h1>
            <h1 className="text-6xl font-bold text-white/5 tracking-tighter -mt-4">TALENT POOL</h1>
          </div>
          
        </div>
      </div>
    </div>
  );
}
