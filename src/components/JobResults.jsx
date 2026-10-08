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
    return [...matches].map(job => {
      const matchedSkills = job.skills.filter(s => hasSkill(s, userSkills));
      const matchPercentage = job.skills.length > 0 ? Math.round((matchedSkills.length / job.skills.length) * 100) : 0;
      const finalMatchScore = Math.round(((job.score * 100) * 0.4) + (matchPercentage * 0.6));
      
      return { ...job, matchPercentage, finalMatchScore };
    }).sort((a, b) => b.finalMatchScore - a.finalMatchScore);
  }, [matches, userSkills]);

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full overflow-visible font-sans py-8 animate-fade-in-up">
      <div className="relative z-10 max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 border-b border-white/5 pb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase">Analysis Complete</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              {t("title")}
            </h2>
            <p className="text-slate-400 font-light text-lg leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
          
          <div className="flex flex-col gap-2 min-w-[200px]">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t("language")}</label>
            <div className="relative">
              <select 
                value={language} 
                onChange={handleLanguageChange}
                className="appearance-none w-full bg-navy-900 border border-white/10 text-white py-3 pl-5 pr-10 rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-medium text-sm cursor-pointer shadow-sm"
              >
                <option value="English">English</option>
                <option value="Telugu">తెలుగు (Telugu)</option>
                <option value="Tamil">தமிழ் (Tamil)</option>
                <option value="Hindi">हिंदी (Hindi)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedJobs.map((job, index) => {
            return (
              <div key={index} className="bg-navy-900 backdrop-blur-2xl rounded-[32px] border border-apple-border shadow-apple hover:shadow-apple-hover p-8 flex flex-col transition-all duration-500 hover:-translate-y-1 group">
                
                <div className="flex flex-col items-start mb-8 gap-4 relative z-10">
                  <span className="bg-blue-500/10 text-blue-500 text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full border border-blue-500/20">
                    {job.finalMatchScore}% {t("match")}
                  </span>
                  <h3 className="text-2xl font-bold text-white leading-tight break-words group-hover:text-blue-500 transition-colors duration-300">
                    {getTranslatedTitle(job.title)}
                  </h3>

                  {job.company && (
                    <div className="flex flex-col gap-3 mt-1 w-full border-t border-apple-border pt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                           <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                           {job.company}
                        </span>
                        <span className="text-slate-400 font-medium text-xs flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                          {job.location}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="bg-navy-900 border border-apple-border text-slate-400 text-xs px-2.5 py-1 rounded-md shadow-sm">{job.level}</span>
                        <span className="text-emerald-500 font-bold text-sm bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">{job.salary}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-8 relative z-10">
                  <div className="flex justify-between items-center mb-3 gap-4 flex-wrap">
                    <span className="font-bold text-slate-500 text-[10px] uppercase tracking-widest">{t("reqs")}</span>
                    <span className="font-bold text-white text-sm">{job.matchPercentage}%</span>
                  </div>
                  <div className="w-full bg-apple-border rounded-full h-1 overflow-hidden">
                    <div className="bg-blue-500 h-1 rounded-full transition-all duration-1000 ease-out" style={{ width: `${job.matchPercentage}%` }}></div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto relative z-10">
                  {job.skills.map((skill, i) => {
                    const found = hasSkill(skill, userSkills);
                    return (
                      <span 
                        key={i} 
                        onClick={() => !found && generateRoadmap(skill, job.title)}
                        className={`text-xs font-medium px-4 py-2 rounded-full border flex items-center gap-1.5 transition-all duration-300 ${
                          found 
                            ? 'bg-blue-500/10 text-blue-500 border-blue-500/20 cursor-default' 
                            : 'bg-navy-900/50 text-slate-500 border-apple-border cursor-pointer hover:bg-apple-border hover:text-white hover:-translate-y-0.5 shadow-sm'
                        }`}
                        title={!found ? "Click to generate AI learning roadmap" : ""}
                      >
                        {found ? (
                          <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
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
            className="px-10 py-4 bg-white/5 text-white border border-white/10 font-bold text-sm rounded-full hover:bg-white/10 hover:border-white/20 transition-all duration-300 active:scale-95 uppercase tracking-widest"
          >
            {t("button")}
          </button>
        </div>

        {roadmap && (
          <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-navy-900 rounded-3xl border border-white/10 max-w-xl w-full p-8 sm:p-12 relative transform transition-all animate-fade-in-up">
              
              <button 
                onClick={() => setRoadmap(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors bg-white/5 p-2.5 rounded-full hover:bg-white/10 active:scale-95 z-20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              
              <div className="mb-10 relative z-10 pr-10">
                <span className="inline-block px-3 py-1 bg-white/5 text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded-md mb-4 border border-white/5">AI Coach</span>
                <h3 className="text-3xl font-bold text-white leading-tight">
                  Mastering {roadmap.skill}
                </h3>
              </div>
              
              {roadmap.loading ? (
                <div className="flex flex-col items-center justify-center py-16 relative z-10">
                  <div className="w-12 h-12 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-6"></div>
                  <p className="text-slate-400 text-sm font-medium tracking-wide animate-pulse">Generating custom roadmap...</p>
                </div>
              ) : roadmap.error ? (
                <div className="bg-red-500/10 text-red-400 border border-red-500/20 p-6 rounded-2xl text-sm mt-4 font-medium relative z-10">
                  {roadmap.error}
                </div>
              ) : roadmap.steps && (
                <div className="mt-4 flex flex-col gap-4 relative z-10 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {roadmap.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-5 items-start p-6 rounded-2xl bg-white/5 border border-white/5 transition-colors duration-300">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 text-white text-xs font-bold flex items-center justify-center border border-white/5">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base mb-1.5">{step.title}</h4>
                        <p className="text-slate-400 text-sm leading-relaxed font-light">{step.description}</p>
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
