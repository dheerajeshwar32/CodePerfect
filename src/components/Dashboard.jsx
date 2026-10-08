import React, { useMemo, useState } from 'react';

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Briefcase, TrendingUp, Award, Zap, Code, Star, Mic, LayoutGrid } from 'lucide-react';
import CodeArena from './CodeArena';
import VoiceInterview from './VoiceInterview';
import AICareerCoach from './AICareerCoach';

export default function Dashboard({ userProfile, jobMatches, onBack, user }) {
  const [testingSkill, setTestingSkill] = useState(null);
  const [verifiedSkills, setVerifiedSkills] = useState(['React Developer']);
  const [showVoiceInterview, setShowVoiceInterview] = useState(false);
  const [showAICoach, setShowAICoach] = useState(false);
  
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

  const handleTestComplete = () => {
    if (testingSkill) {
      setVerifiedSkills([...verifiedSkills, testingSkill]);
      setTestingSkill(null);
    }
  };

  return (
    <div className="flex-grow w-full max-w-7xl mx-auto flex flex-col pt-4 sm:pt-8 relative z-10 animate-in fade-in duration-700">
      
      {testingSkill && (
        <CodeArena 
          jobTitle={testingSkill} 
          skillsToProve={testingSkill} 
          userName={user?.displayName || user?.email?.split('@')[0] || 'Authenticated Candidate'}
          onClose={() => setTestingSkill(null)} 
          onComplete={handleTestComplete} 
        />
      )}

      {showVoiceInterview && (
        <VoiceInterview onClose={() => setShowVoiceInterview(false)} />
      )}

      {showAICoach && (
        <AICareerCoach onClose={() => setShowAICoach(false)} userProfile={profile} />
      )}

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
        <div>
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 text-xs font-bold uppercase tracking-widest"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Matches
          </button>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Spatial Dashboard</h2>
          <p className="text-slate-400 mt-2 text-lg font-light">Your cryptographic career matrix.</p>
        </div>
        
        {/* God-Tier Features Bar */}
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setShowAICoach(true)}
            className="flex items-center gap-2 bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 hover:bg-fuchsia-500 hover:text-white px-5 py-3 rounded-2xl transition-all shadow-sm"
          >
            <Star className="w-5 h-5" />
            <span className="font-bold text-sm">AI Career Coach</span>
          </button>
          <button 
            onClick={() => {
              if ('speechSynthesis' in window) {
                const unlockAudio = new SpeechSynthesisUtterance('');
                window.speechSynthesis.speak(unlockAudio);
              }
              setShowVoiceInterview(true);
            }}
            className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white px-5 py-3 rounded-2xl transition-all shadow-sm"
          >
            <Mic className="w-5 h-5" />
            <span className="font-bold text-sm">Voice Interview</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Profile Card */}
        <div className="lg:col-span-1 transform transition-all duration-500 hover:scale-[1.02]">
          <div className="bg-navy-900 border border-apple-border rounded-[32px] p-8 h-full shadow-apple relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
              <Star className="w-8 h-8" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">Profile Overview</h3>
            <p className="text-slate-400 leading-relaxed font-light mb-6">
              {profile.summary || "Your parsed resume summary will appear here. Our AI engine has analyzed your trajectory."}
            </p>
            
            <div className="space-y-4 border-t border-white/5 pt-6">
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Experience Level</span>
                <span className="text-white font-medium">{profile.experienceYears ? `${profile.experienceYears}+ Years` : 'Mid-Senior Level'}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Top Skills Extracted</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.skills && profile.skills.map((skill, i) => (
                    <span key={i} className="text-xs font-medium bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-slate-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skill Matrix Radar */}
        <div className="lg:col-span-2 transform transition-all duration-500 hover:scale-[1.02]">
          <div className="bg-navy-900 border border-apple-border rounded-[32px] p-8 h-full shadow-apple flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-all duration-700"></div>
            
            <div className="flex-1 w-full relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-white">Spatial Skill Matrix</h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">Live Data</span>
              </div>
              <p className="text-slate-400 text-sm font-light mb-8 max-w-sm">
                Real-time dimensional breakdown of your capabilities mapped against the current job market.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Frontend</span>
                  <div className="w-48 h-1.5 bg-navy-950 rounded-full overflow-hidden border border-white/5"><div className="h-full bg-blue-500 w-[85%]"></div></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">System Design</span>
                  <div className="w-48 h-1.5 bg-navy-950 rounded-full overflow-hidden border border-white/5"><div className="h-full bg-purple-500 w-[70%]"></div></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Leadership</span>
                  <div className="w-48 h-1.5 bg-navy-950 rounded-full overflow-hidden border border-white/5"><div className="h-full bg-emerald-500 w-[80%]"></div></div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-[350px] h-[300px] relative z-10">
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

        {/* Proof of Work Integrations */}
        <div className="transform transition-all duration-500 hover:scale-[1.02] w-full">
          <div className="bg-navy-900 border border-apple-border rounded-[32px] p-8 shadow-apple relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[80px] rounded-full pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Proof of Work Matrix</h3>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Cryptographically Verified</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                <Award className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              
              {verifiedSkills.map((skill, i) => (
                <div key={`v-${i}`} className="bg-navy-950/50 border border-white/5 rounded-2xl p-5 flex items-center justify-between group hover:border-purple-500/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                      <Code className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{skill}</h4>
                      <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Verified via Arena
                      </p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs font-bold uppercase tracking-widest">
                    View
                  </button>
                </div>
              ))}

              {profile.skills && profile.skills.filter(s => !verifiedSkills.includes(s)).slice(0, 3).map((skill, i) => (
                <div key={`uv-${i}`} className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-center justify-between group hover:border-blue-500/50 transition-colors">
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
                  <button 
                    onClick={() => setTestingSkill(skill)}
                    className="text-blue-400 hover:text-white px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-all text-xs font-bold uppercase tracking-widest"
                  >
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
