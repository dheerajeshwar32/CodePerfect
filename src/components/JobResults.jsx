import { useState, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

export default function JobResults({ matches, userSkills, onStartOver }) {
  const [roadmap, setRoadmap] = useState(null); 
  const { t, i18n } = useTranslation();
  const language = i18n.language;

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const getTranslatedTitle = (title) => {
    return t(`jobs.${title}`, { defaultValue: title });
  };

  const hasSkill = (skill, text) => {
    if (!text || !skill) return false;
    const rawText = text.toLowerCase();
    const targetSkill = skill.toLowerCase();

    // Escape regex characters
    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Strict word boundary check to prevent false positives (e.g., 'java' matching 'javascript')
    const skillRegex = new RegExp(`\\b${escapeRegExp(targetSkill)}\\b`, 'i');
    if (skillRegex.test(rawText)) return true;

    // Special cases for common shorthand
    if (targetSkill === 'tailwind css' && /\btailwind\b/i.test(rawText)) return true;
    if (targetSkill === 'node.js' && /\bnode\b/i.test(rawText)) return true;
    if (targetSkill === 'ui/ux' && (/\bui\b/i.test(rawText) || /\bux\b/i.test(rawText))) return true;

    return false;
  };

  const generateRoadmap = async (skill, jobTitle) => {
    setRoadmap({ skill, steps: null, error: null, loading: true });
    
    try {
      const response = await fetch('/api/roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ skill, jobTitle, language })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setRoadmap({ skill, steps: data.steps, error: null, loading: false });
      
    } catch (error) {
      console.error("Roadmap generation failed completely:", error);
      setRoadmap({ skill, steps: null, error: 'Failed to connect to AI Coach. Check your connection to the backend server.', loading: false });
    }
  };

  const sortedJobs = useMemo(() => {
    return [...matches].map(job => {
      const matchedSkills = job.skills.filter(s => hasSkill(s, userSkills));
      const matchPercentage = job.skills.length > 0 ? Math.round((matchedSkills.length / job.skills.length) * 100) : 0;
      const finalMatchScore = Math.round(((job.score * 100) * 0.4) + (matchPercentage * 0.6));
      
      return { ...job, matchPercentage, finalMatchScore };
    }).sort((a, b) => b.finalMatchScore - a.finalMatchScore);
  }, [matches, userSkills]);

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full overflow-visible font-sans py-8">
      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 via-purple-800 to-slate-900 tracking-tighter">
            {t("title")}
          </h2>

          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-3xl border border-white/80 px-6 py-3 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
            <select 
              value={language} 
              onChange={handleLanguageChange}
              className="bg-transparent text-base font-black text-indigo-900 outline-none cursor-pointer"
            >
              <option value="English">English</option>
              <option value="Telugu">తెలుగు (Telugu)</option>
              <option value="Tamil">தமிழ் (Tamil)</option>
              <option value="Hindi">हिंदी (Hindi)</option>
            </select>
          </div>
        </div>
        
        {/* Job Cards Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sortedJobs.map((job, index) => {
            return (
              <div key={index} className="bg-white/50 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-white/80 p-8 flex flex-col transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(86,104,255,0.2)] hover:-translate-y-2 group overflow-hidden relative">
                
                {/* Glow effect on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>

                <div className="flex flex-col items-start mb-8 gap-4 relative z-10">
                  <span className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-xs uppercase tracking-[0.2em] font-black px-4 py-2 rounded-xl border border-indigo-200/50 shadow-sm">
                    {job.finalMatchScore}% {t("match")}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight break-words group-hover:text-indigo-700 transition-colors duration-300">
                    {getTranslatedTitle(job.title)}
                  </h3>
                </div>

                <div className="mb-8 relative z-10">
                  <div className="flex justify-between items-center text-xs mb-3 gap-4 flex-wrap">
                    <span className="font-bold text-slate-500 uppercase tracking-widest">{t("reqs")}</span>
                    <span className="font-black text-slate-900 text-sm">{job.matchPercentage}%</span>
                  </div>
                  <div className="w-full bg-white/60 rounded-full h-3 overflow-hidden border border-white/80 shadow-inner">
                    <div className="bg-gradient-to-r from-[#5668FF] to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(86,104,255,0.5)]" style={{ width: `${job.matchPercentage}%` }}></div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto relative z-10">
                  {job.skills.map((skill, i) => {
                    const found = hasSkill(skill, userSkills);
                    return (
                      <span 
                        key={i} 
                        onClick={() => !found && generateRoadmap(skill, job.title)}
                        className={`text-xs font-bold px-4 py-2 rounded-xl border flex items-center gap-2 transition-all duration-300 ${
                          found 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50 shadow-sm cursor-default' 
                            : 'bg-white/80 text-indigo-900 border-white cursor-pointer hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-200 hover:shadow-md hover:-translate-y-1'
                        }`}
                        title={!found ? "Click to generate AI learning roadmap" : ""}
                      >
                        {found ? (
                          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        ) : (
                          <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        )}
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-20 text-center">
          <button 
            onClick={onStartOver} 
            className="px-10 py-5 bg-white/60 backdrop-blur-3xl text-indigo-950 border border-white font-black text-lg rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_60px_-15px_rgba(86,104,255,0.2)] hover:bg-white hover:-translate-y-1 transition-all duration-300 active:scale-95 uppercase tracking-widest"
          >
            {t("button")}
          </button>
        </div>

        {/* Ultra Glassmorphic AI Roadmap Modal */}
        {roadmap && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white/70 backdrop-blur-3xl rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border border-white max-w-xl w-full p-8 sm:p-12 relative transform transition-all animate-fade-in-up">
              
              {/* Modal Glow */}
              <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 blur-[80px] rounded-full pointer-events-none"></div>

              <button 
                onClick={() => setRoadmap(null)}
                className="absolute top-8 right-8 text-slate-500 hover:text-indigo-700 transition-colors bg-white/80 p-3 rounded-full hover:shadow-md hover:scale-105 active:scale-95 z-20"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              
              <div className="mb-10 relative z-10">
                <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl mb-4 border border-indigo-200/50 shadow-sm">AI Coach</span>
                <h3 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 to-slate-900 leading-tight">
                  Mastering {roadmap.skill}
                </h3>
              </div>
              
              {roadmap.loading ? (
                <div className="flex flex-col items-center justify-center py-16 relative z-10">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-6 shadow-lg shadow-indigo-500/20"></div>
                  <p className="text-indigo-800 text-lg font-bold tracking-widest animate-pulse">Generating custom roadmap...</p>
                </div>
              ) : roadmap.error ? (
                <div className="bg-red-50/80 backdrop-blur-md text-red-700 border border-red-200 p-6 rounded-2xl text-base mt-4 font-semibold shadow-sm relative z-10">
                  {roadmap.error}
                </div>
              ) : roadmap.steps && (
                <div className="mt-4 flex flex-col gap-4 relative z-10 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {roadmap.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-5 items-start p-6 rounded-3xl bg-white/60 hover:bg-white transition-all duration-300 border border-white shadow-sm hover:shadow-md group">
                      <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-black flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-lg mb-2">{step.title}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed font-medium">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}