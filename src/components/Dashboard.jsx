import React, { useMemo, useState, lazy, Suspense } from 'react';

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Briefcase, TrendingUp, Award, Zap, Code, Star, Mic } from 'lucide-react';

const CodeArena = lazy(() => import('./CodeArena'));
const VoiceInterview = lazy(() => import('./VoiceInterview'));
const AICareerCoach = lazy(() => import('./AICareerCoach'));

const DEFAULT_PROFILE = {
  summary: "Experienced professional seeking new opportunities in tech.",
  experienceYears: 3,
  skills: ["React", "JavaScript", "Problem Solving"]
};

export default function Dashboard({ userProfile, jobMatches, onBack, user }) {
  const [testingSkill, setTestingSkill] = useState(null);
  const [verifiedSkills, setVerifiedSkills] = useState(['React Developer']);
  const [showVoiceInterview, setShowVoiceInterview] = useState(false);
  const [showAICoach, setShowAICoach] = useState(false);
  
  // Stable reference fallback if profile is not generated
  const profile = userProfile || DEFAULT_PROFILE;

  const hasMatches = jobMatches && jobMatches.length > 0;

  // Generate salary trajectory based on matched jobs or defaults
  const salaryData = useMemo(() => {
    let baseSalary = 80000;
    if (hasMatches) {
       const salaries = jobMatches.map(j => {
          const match = j.salary?.match(/\$(\d+)[kK]/);
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

  // If AI Career Coach is open, render directly in flow under main KYC Navbar
  if (showAICoach) {
    return (
      <div className="flex-grow w-full max-w-5xl mx-auto flex flex-col pt-2 sm:pt-4 relative z-10 animate-in fade-in duration-500">
        <Suspense fallback={
          <div className="flex-grow flex flex-col items-center justify-center p-12">
            <div className="w-10 h-10 border-2 border-slate-200 dark:border-white/[0.08] border-t-[#5268FF] rounded-full animate-spin mb-4"></div>
            <span className="text-xs font-semibold text-[#86868B] dark:text-[#94A3B8] tracking-widest uppercase">Loading AI Coach...</span>
          </div>
        }>
          <AICareerCoach onClose={() => setShowAICoach(false)} userProfile={profile} />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="flex-grow w-full max-w-7xl mx-auto flex flex-col pt-4 sm:pt-8 relative z-10 animate-in fade-in duration-700">
      
      {testingSkill && (
        <Suspense fallback={null}>
          <CodeArena 
            jobTitle={testingSkill} 
            skillsToProve={testingSkill} 
            userName={user ? (user.displayName || user.email?.split('@')[0] || 'Authenticated User') : 'Guest User'}
            onClose={() => setTestingSkill(null)} 
            onComplete={handleTestComplete} 
          />
        </Suspense>
      )}

      {showVoiceInterview && (
        <Suspense fallback={null}>
          <VoiceInterview onClose={() => setShowVoiceInterview(false)} />
        </Suspense>
      )}

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
        <div>
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 text-[#6E6E73] dark:text-[#94A3B8] hover:text-[#5268FF] transition-colors mb-4 text-xs font-semibold uppercase tracking-widest cursor-pointer"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Matches
          </button>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1D1D1F] dark:text-white tracking-tight">Spatial Dashboard</h2>
          <p className="text-[#6E6E73] dark:text-[#94A3B8] mt-2 text-lg font-normal">Your complete career intelligence overview.</p>
        </div>
        
        {/* Feature Buttons */}
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setShowAICoach(true)}
            className="flex items-center gap-2 bg-[#EEF2FF] dark:bg-[#1E264D] hover:bg-[#E0E7FF] dark:hover:bg-[#252D6D] text-[#5268FF] border border-[#C7D4FF] dark:border-[#334185] font-semibold px-5 py-3 rounded-2xl transition-colors shadow-sm cursor-pointer"
          >
            <Star className="w-5 h-5" />
            <span className="text-sm">AI Career Coach</span>
          </button>
          <button 
            onClick={() => {
              if ('speechSynthesis' in window) {
                const unlockAudio = new SpeechSynthesisUtterance('');
                window.speechSynthesis.speak(unlockAudio);
              }
              setShowVoiceInterview(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-[#5268FF] to-[#2D325A] hover:opacity-95 text-white font-semibold px-5 py-3 rounded-2xl shadow-[0_4px_14px_rgba(82,104,255,0.3)] transition-transform active:scale-[0.98] cursor-pointer"
          >
            <Mic className="w-5 h-5" />
            <span className="text-sm">Voice Interview</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Profile Card */}
        <div className="lg:col-span-1 transition-shadow hover:shadow-[0_16px_40px_-10px_rgba(45,50,90,0.12)]">
          <div className="bg-white dark:bg-[#13182B] border border-slate-200/80 dark:border-white/[0.08] rounded-3xl p-8 h-full shadow-sm">
            
            <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] dark:bg-[#1E264D] flex items-center justify-center text-[#5268FF] mb-6 border border-[#C7D4FF] dark:border-[#334185]">
              <Star className="w-7 h-7" />
            </div>
            
            <h3 className="text-2xl font-bold text-[#1D1D1F] dark:text-white mb-2">Profile Overview</h3>
            <p className="text-[#6E6E73] dark:text-[#94A3B8] leading-relaxed font-normal mb-6">
              {profile.summary || "Your parsed resume summary will appear here. Our AI engine has analyzed your trajectory."}
            </p>
            
            <div className="space-y-4 border-t border-slate-200/80 dark:border-white/[0.08] pt-6">
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-[#86868B] dark:text-[#94A3B8] font-bold mb-1">Experience Level</span>
                <span className="text-[#1D1D1F] dark:text-white font-medium">{profile.experienceYears ? `${profile.experienceYears}+ Years` : 'Mid-Senior Level'}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-[#86868B] dark:text-[#94A3B8] font-bold mb-1">Top Skills Extracted</span>
                <div className="flex flex-wrap gap-2 mt-2 max-h-[140px] overflow-y-auto pr-1">
                  {profile.skills && profile.skills.map((skill, i) => (
                    <span key={i} className="text-xs font-medium bg-slate-100 dark:bg-white/[0.06] text-[#1D1D1F] dark:text-white border border-slate-200/80 dark:border-white/[0.08] px-2.5 py-1 rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skill Matrix Radar */}
        <div className="lg:col-span-2 transition-shadow hover:shadow-[0_16px_40px_-10px_rgba(45,50,90,0.12)]">
          <div className="bg-white dark:bg-[#13182B] border border-slate-200/80 dark:border-white/[0.08] rounded-3xl p-8 h-full shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#5268FF]/5 blur-[80px] rounded-full pointer-events-none"></div>
            
            <div className="flex-1 w-full relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-[#1D1D1F] dark:text-white">Spatial Skill Matrix</h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase bg-[#EEF2FF] dark:bg-[#1E264D] text-[#5268FF] border border-[#C7D4FF] dark:border-[#334185]">Live Data</span>
              </div>
              <p className="text-[#6E6E73] dark:text-[#94A3B8] text-sm font-normal mb-8 max-w-sm">
                Real-time dimensional breakdown of your capabilities mapped against the current job market.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#86868B] dark:text-[#94A3B8] uppercase tracking-widest">Frontend</span>
                  <div className="w-48 h-1.5 bg-slate-100 dark:bg-[#0B0F19] rounded-full overflow-hidden border border-slate-200/80 dark:border-white/[0.08]"><div className="h-full bg-[#5268FF] w-[85%]"></div></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#86868B] dark:text-[#94A3B8] uppercase tracking-widest">System Design</span>
                  <div className="w-48 h-1.5 bg-slate-100 dark:bg-[#0B0F19] rounded-full overflow-hidden border border-slate-200/80 dark:border-white/[0.08]"><div className="h-full bg-[#6366F1] w-[70%]"></div></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#86868B] dark:text-[#94A3B8] uppercase tracking-widest">Leadership</span>
                  <div className="w-48 h-1.5 bg-slate-100 dark:bg-[#0B0F19] rounded-full overflow-hidden border border-slate-200/80 dark:border-white/[0.08]"><div className="h-full bg-[#0EA5E9] w-[80%]"></div></div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-[350px] h-[300px] relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                  <PolarGrid stroke="rgba(82,104,255,0.12)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#86868B', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Skills" dataKey="A" stroke="#5268FF" fill="#5268FF" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Salary Trajectory */}
        <div className="transition-shadow hover:shadow-[0_16px_40px_-10px_rgba(45,50,90,0.12)] w-full">
          <div className="bg-white dark:bg-[#13182B] border border-slate-200/80 dark:border-white/[0.08] rounded-3xl p-8 shadow-sm relative">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-[#1D1D1F] dark:text-white mb-1">Salary Trajectory</h3>
                <p className="text-xs text-[#86868B] dark:text-[#94A3B8] uppercase tracking-widest font-bold">Based on AI Market Demand</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salaryData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(82,104,255,0.06)" vertical={false} />
                  <XAxis dataKey="year" stroke="#86868B" tick={{fill: '#86868B', fontSize: 12}} dy={10} axisLine={false} tickLine={false} />
                  <YAxis 
                    stroke="#86868B" 
                    tick={{fill: '#86868B', fontSize: 12}} 
                    tickFormatter={(value) => `$${value/1000}k`}
                    axisLine={false} 
                    tickLine={false}
                  />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? '#13182B' : '#FFFFFF', 
                      borderColor: typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'rgba(255,255,255,0.1)' : '#E2E8F0', 
                      borderRadius: '12px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                    }}
                    itemStyle={{ 
                      color: typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? '#FFFFFF' : '#111827', 
                      fontWeight: 'bold' 
                    }}
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Expected']}
                  />
                  <Line type="monotone" dataKey="expected" stroke="#10B981" strokeWidth={3.5} dot={{ r: 5, fill: '#10B981', stroke: '#13182B', strokeWidth: 2 }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Proof of Work Integrations */}
        <div className="transition-shadow hover:shadow-[0_16px_40px_-10px_rgba(45,50,90,0.12)] w-full">
          <div className="bg-white dark:bg-[#13182B] border border-slate-200/80 dark:border-white/[0.08] rounded-3xl p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#5268FF]/5 blur-[80px] rounded-full pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h3 className="text-xl font-bold text-[#1D1D1F] dark:text-white mb-1">Proof of Work Matrix</h3>
                <p className="text-xs text-[#86868B] dark:text-[#94A3B8] uppercase tracking-widest font-bold">Verified Skills</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#EEF2FF] dark:bg-[#1E264D] flex items-center justify-center text-[#5268FF] border border-[#C7D4FF] dark:border-[#334185]">
                <Award className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              
              {verifiedSkills.map((skill, i) => (
                <div key={`v-${i}`} className="bg-slate-50 dark:bg-[#0B0F19] border border-slate-200/80 dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 flex items-center justify-between hover:border-[#5268FF]/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#EEF2FF] dark:bg-[#1E264D] border border-[#C7D4FF] dark:border-[#334185] flex items-center justify-center text-[#5268FF]">
                      <Code className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1D1D1F] dark:text-white text-base sm:text-lg">{skill}</h4>
                      <p className="text-xs text-[#059669] font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Verified via Arena
                      </p>
                    </div>
                  </div>
                  <button className="text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-white px-3 py-1.5 rounded-lg bg-white dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.08] transition-colors text-xs font-bold uppercase tracking-widest cursor-pointer">
                    View
                  </button>
                </div>
              ))}

              {profile.skills && profile.skills.filter(s => !verifiedSkills.includes(s)).slice(0, 3).map((skill, i) => (
                <div key={`uv-${i}`} className="bg-slate-50/50 dark:bg-[#0B0F19]/50 border border-slate-200/60 dark:border-white/[0.05] rounded-2xl p-4 sm:p-5 flex items-center justify-between hover:border-[#5268FF]/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.08] flex items-center justify-center text-[#86868B] dark:text-[#94A3B8]">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1D1D1F] dark:text-white text-base sm:text-lg">{skill}</h4>
                      <p className="text-xs text-[#86868B] dark:text-[#94A3B8] font-bold uppercase tracking-widest mt-0.5">
                        Unverified
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setTestingSkill(skill)}
                    className="text-[#5268FF] hover:text-white px-4 py-2 rounded-lg bg-[#EEF2FF] dark:bg-[#1E264D] hover:bg-[#5268FF] border border-[#C7D4FF] dark:border-[#334185] transition-colors text-xs font-bold uppercase tracking-widest cursor-pointer"
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
