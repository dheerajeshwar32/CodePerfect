import React, { useMemo } from 'react';

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Briefcase, TrendingUp, Award, Zap, Code, Star } from 'lucide-react';

export default function Dashboard({ userProfile, jobMatches, onBack }) {
  
  // Dummy data if real profile isn't generated yet
  const profile = userProfile || {
    summary: "Experienced professional seeking new opportunities in tech.",
    experienceYears: 3,
    skills: ["React", "JavaScript", "Problem Solving"]
  };

  const hasMatches = jobMatches && jobMatches.length > 0;

  // Generate salary trajectory based on matched jobs or defaults
  const salaryData = useMemo(() => {
    let baseSalary = 80000;
    if (hasMatches) {
       const salaries = jobMatches.map(j => {
          const match = j.salary?.match(/\\$(\\d+)[kK]/);
          return match ? parseInt(match[1]) * 1000 : null;
       }).filter(Boolean);
       if (salaries.length > 0) {
         baseSalary = salaries.reduce((a, b) => a + b) / salaries.length;
       }
    }
    
    return [
      { year: '2024', expected: baseSalary * 0.9 },
      { year: '2025', expected: baseSalary },
      { year: '2026', expected: baseSalary * 1.15 },
      { year: '2027', expected: baseSalary * 1.35 },
      { year: '2028', expected: baseSalary * 1.60 },
    ];
  }, [jobMatches, hasMatches]);

  const skillData = useMemo(() => {
    return [
      { subject: 'Frontend', A: 85, fullMark: 100 },
      { subject: 'Backend', A: profile.experienceYears > 4 ? 75 : 45, fullMark: 100 },
      { subject: 'System Design', A: profile.experienceYears * 10 + 20, fullMark: 100 },
      { subject: 'Soft Skills', A: 90, fullMark: 100 },
      { subject: 'Leadership', A: profile.experienceYears > 5 ? 80 : 40, fullMark: 100 },
    ];
  }, [profile]);

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in pb-20">
      
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold text-white tracking-tight mb-2">Your Career Hub</h2>
          <p className="text-slate-400">AI-driven analytics and market demand for your profile.</p>
        </div>
        <button 
          onClick={onBack}
          className="bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-white/10 transition-colors"
        >
          View Matches
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Profile Card */}
        <div className="transform transition-all duration-500 hover:scale-[1.02] h-full lg:col-span-2">
          <div className="bg-navy-900 border border-apple-border rounded-[32px] p-8 h-full shadow-apple relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 group-hover:bg-blue-500/20 transition-all duration-700"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">AI Profile Summary</h3>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Extracted from Resume</p>
                </div>
              </div>
              
              <p className="text-slate-300 text-lg leading-relaxed font-light mb-8">
                "{profile.summary}"
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-navy-950/40 rounded-2xl p-4 border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Experience</p>
                  <p className="text-2xl font-bold text-white">{profile.experienceYears} <span className="text-sm text-slate-400 font-normal">Years</span></p>
                </div>
                <div className="bg-navy-950/40 rounded-2xl p-4 border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Top Skills</p>
                  <p className="text-2xl font-bold text-white">{profile.skills ? profile.skills.length : 0}</p>
                </div>
                <div className="bg-navy-950/40 rounded-2xl p-4 border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Market Fit</p>
                  <p className="text-2xl font-bold text-emerald-400">Top 15%</p>
                </div>
                <div className="bg-navy-950/40 rounded-2xl p-4 border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Matched Jobs</p>
                  <p className="text-2xl font-bold text-blue-400">{jobMatches?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skill Radar */}
        <div className="transform transition-all duration-500 hover:scale-[1.02] h-full lg:col-span-1">
          <div className="bg-navy-900 border border-apple-border rounded-[32px] p-6 h-full shadow-apple flex flex-col items-center justify-center relative">
            <h3 className="absolute top-6 left-6 text-sm font-bold text-white uppercase tracking-widest">Skill Radar</h3>
            <div className="w-full h-[250px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Skills" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Salary Trajectory */}
        <div className="transform transition-all duration-500 hover:scale-[1.02] w-full">
          <div className="bg-navy-900 border border-apple-border rounded-[32px] p-8 shadow-apple relative">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Salary Trajectory</h3>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Based on AI Market Demand</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salaryData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="year" stroke="#475569" tick={{fill: '#94a3b8', fontSize: 12}} dy={10} axisLine={false} tickLine={false} />
                  <YAxis 
                    stroke="#475569" 
                    tick={{fill: '#94a3b8', fontSize: 12}} 
                    tickFormatter={(value) => `$${value/1000}k`}
                    axisLine={false} 
                    tickLine={false}
                  />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Expected']}
                  />
                  <Line type="monotone" dataKey="expected" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#10b981', stroke: '#0f172a', strokeWidth: 2 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Verification Badges */}
        <div className="transform transition-all duration-500 hover:scale-[1.02] w-full">
          <div className="bg-navy-900 border border-apple-border rounded-[32px] p-8 shadow-apple h-full relative overflow-hidden">
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]"></div>
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Skill Verifications</h3>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Algorithm Boosters</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                <Award className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              
              <div className="bg-navy-950/50 border border-white/5 rounded-2xl p-5 flex items-center justify-between group hover:border-purple-500/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                    <Code className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">React Developer</h4>
                    <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Verified (Top 5%)
                    </p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs font-bold uppercase tracking-widest">
                  View
                </button>
              </div>

              {profile.skills && profile.skills.slice(0, 2).map((skill, i) => (
                <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-center justify-between group hover:border-blue-500/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{skill}</h4>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                        Unverified
                      </p>
                    </div>
                  </div>
                  <button className="text-blue-400 hover:text-white px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-all text-xs font-bold uppercase tracking-widest">
                    Take Test
                  </button>
                </div>
              ))}

            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

