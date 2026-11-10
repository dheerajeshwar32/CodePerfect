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
      // Mocking the backend API call for roadmap generation
      setTimeout(() => {
        const mockSteps = [
          { title: `Master ${skill} Basics`, description: `Learn the core concepts and syntax of ${skill}.`, duration: "1 Week" },
          { title: `Advanced ${skill} Techniques`, description: `Deep dive into advanced patterns for ${jobTitle} roles.`, duration: "2 Weeks" },
          { title: `Build a Portfolio Project`, description: `Create a real-world project demonstrating your ${skill} expertise.`, duration: "3 Weeks" }
        ];
        setRoadmap({ skill, steps: mockSteps, error: null, loading: false });
      }, 2000);
    } catch (error) {
      console.error("Roadmap generation failed completely:", error);
      setRoadmap({ skill, steps: null, error: 'Failed to connect to AI Coach. Check your connection to the backend server.', loading: false });
    }
  };

  const sortedJobs = useMemo(() => {
    const scored = [...matches].map(job => {
      const matchedSkills = job.skills.filter(s => hasSkill(s, userSkills));
      const matchPercentage = job.skills.length > 0 ? Math.round((matchedSkills.length / job.skills.length) * 100) : 0;
      const finalMatchScore = Math.round(((job.score * 100) * 0.4) + (matchPercentage * 0.6));
      
      return { ...job, matchPercentage, finalMatchScore };
    }).sort((a, b) => b.finalMatchScore - a.finalMatchScore);

    const seen = new Set();
    const unique = [];
    for (const job of scored) {
      if (!seen.has(job.title)) {
        seen.add(job.title);
        unique.push(job);
      }
    }
    return unique;
  }, [matches, userSkills]);

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full overflow-visible font-sans py-8 animate-fade-in-up">
      <div className="relative z-10 max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 border-b border-slate-200/80 dark:border-white/[0.08] pb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-[#EEF2FF] dark:bg-[#1E264D] border border-[#C7D4FF] dark:border-[#334185] text-[#5268FF]">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5268FF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5268FF]"></span>
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase">Analysis Complete</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1D1D1F] dark:text-white tracking-tight mb-4">
              {t("title")}
            </h2>
            <p className="text-[#6E6E73] dark:text-[#94A3B8] font-normal text-lg leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
          
          <div className="flex flex-col gap-2 min-w-[200px]">
            <label className="text-[10px] font-bold text-[#86868B] dark:text-[#94A3B8] uppercase tracking-widest ml-1">{t("language")}</label>
            <div className="relative">
              <select 
                value={language} 
                onChange={handleLanguageChange}
                className="appearance-none w-full bg-white dark:bg-[#13182B] border border-slate-200/80 dark:border-white/[0.08] text-[#1D1D1F] dark:text-white py-3 pl-5 pr-10 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#5268FF]/50 font-medium text-base md:text-sm cursor-pointer shadow-sm"
              >
                <option value="English">English</option>
                <option value="Telugu">తెలుగు (Telugu)</option>
                <option value="Tamil">தமிழ் (Tamil)</option>
                <option value="Hindi">हिंदी (Hindi)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#86868B]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedJobs.map((job, index) => {
            return (
              <div key={index} className="bg-white dark:bg-[#13182B] rounded-3xl border border-slate-200/80 dark:border-white/[0.08] shadow-sm hover:shadow-md p-8 flex flex-col transition-transform duration-500 hover:-translate-y-1 group">
                
                <div className="flex flex-col items-start mb-8 gap-4 relative z-10">
                  <span className="bg-[#EEF2FF] dark:bg-[#1E264D] text-[#5268FF] text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full border border-[#C7D4FF] dark:border-[#334185]">
                    {job.finalMatchScore}% {t("match")}
                  </span>
                  <h3 className="text-2xl font-bold text-[#1D1D1F] dark:text-white leading-tight break-words group-hover:text-[#5268FF] transition-colors duration-300">
                    {getTranslatedTitle(job.title)}
                  </h3>

                  {job.company && (
                    <div className="flex flex-col gap-3 mt-1 w-full border-t border-slate-200/80 dark:border-white/[0.08] pt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-[#1D1D1F] dark:text-white flex items-center gap-1.5">
                           <svg className="w-4 h-4 text-[#86868B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                           {job.company}
                        </span>
                        <span className="text-[#86868B] dark:text-[#94A3B8] font-medium text-xs flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                          {job.location}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="bg-slate-100 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.08] text-[#6E6E73] dark:text-[#94A3B8] text-xs px-2.5 py-1 rounded-md shadow-sm">{job.level}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">{job.salary}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-8 relative z-10">
                  <div className="flex justify-between items-center mb-3 gap-4 flex-wrap">
                    <span className="font-bold text-[#86868B] dark:text-[#94A3B8] text-[10px] uppercase tracking-widest">{t("reqs")}</span>
                    <span className="font-bold text-[#1D1D1F] dark:text-white text-sm">{job.matchPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#0B0F19] rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#5268FF] to-[#38BDF8] h-full rounded-full transition-[width] duration-1000 ease-out" style={{ width: `${job.matchPercentage}%` }}></div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto relative z-10">
                  {job.skills.map((skill, i) => {
                    const found = hasSkill(skill, userSkills);
                    return (
                      <span 
                        key={i} 
                        onClick={() => !found && generateRoadmap(skill, job.title)}
                        className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border flex items-center gap-1.5 transition-[transform,opacity] duration-300 ${
                          found 
                            ? 'bg-[#EEF2FF] dark:bg-[#1E264D] text-[#5268FF] border-[#C7D4FF] dark:border-[#334185] cursor-default' 
                            : 'bg-slate-50 dark:bg-white/[0.04] text-[#6E6E73] dark:text-[#94A3B8] border-slate-200/80 dark:border-white/[0.08] cursor-pointer hover:bg-[#EEF2FF] dark:hover:bg-[#1E264D] hover:text-[#5268FF] hover:-translate-y-0.5 shadow-xs'
                        }`}
                        title={!found ? "Click to generate AI learning roadmap" : ""}
                      >
                        {found ? (
                          <svg className="w-3.5 h-3.5 text-[#5268FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 text-[#86868B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
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

        <div className="mt-16 text-center">
          <button 
            onClick={onStartOver} 
            className="px-10 py-3.5 bg-white dark:bg-[#13182B] text-[#1D1D1F] dark:text-white border border-slate-200/80 dark:border-white/[0.08] font-bold text-xs rounded-full hover:bg-slate-50 dark:hover:bg-white/[0.06] hover:border-[#5268FF]/30 transition-colors duration-300 active:scale-95 uppercase tracking-widest cursor-pointer shadow-xs"
          >
            {t("button")}
          </button>
        </div>

        {roadmap && (
          <div className="fixed inset-0 bg-slate-900/40 dark:bg-[#0B0F19]/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-[#13182B] rounded-3xl border border-slate-200/80 dark:border-white/[0.08] shadow-xl max-w-xl w-full p-8 sm:p-10 relative transform transition-transform animate-fade-in-up">
              
              <button 
                onClick={() => setRoadmap(null)}
                className="absolute top-6 right-6 text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-white transition-colors bg-slate-100 dark:bg-white/[0.08] p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/[0.15] active:scale-95 z-20 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              
              <div className="mb-8 relative z-10 pr-10">
                <span className="inline-block px-3 py-1 bg-[#EEF2FF] dark:bg-[#1E264D] text-[#5268FF] text-[10px] font-bold uppercase tracking-widest rounded-md mb-3 border border-[#C7D4FF] dark:border-[#334185]">AI Coach</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] dark:text-white leading-tight">
                  Mastering {roadmap.skill}
                </h3>
              </div>
              
              {roadmap.loading ? (
                <div className="flex flex-col items-center justify-center py-16 relative z-10">
                  <div className="w-10 h-10 border-2 border-slate-200 dark:border-white/[0.08] border-t-[#5268FF] rounded-full animate-spin mb-4"></div>
                  <p className="text-[#86868B] text-xs font-semibold tracking-wider uppercase animate-pulse">Generating custom roadmap...</p>
                </div>
              ) : roadmap.error ? (
                <div className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 p-5 rounded-2xl text-sm mt-4 font-medium relative z-10">
                  {roadmap.error}
                </div>
              ) : roadmap.steps && (
                <div className="mt-4 flex flex-col gap-3 relative z-10 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {roadmap.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 items-start p-5 rounded-2xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200/80 dark:border-white/[0.08] transition-colors duration-300">
                      <div className="shrink-0 w-7 h-7 rounded-lg bg-[#EEF2FF] dark:bg-[#1E264D] text-[#5268FF] text-xs font-bold flex items-center justify-center border border-[#C7D4FF] dark:border-[#334185]">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1D1D1F] dark:text-white text-sm mb-1">{step.title}</h4>
                        <p className="text-[#6E6E73] dark:text-[#94A3B8] text-xs leading-relaxed font-normal">{step.description}</p>
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
