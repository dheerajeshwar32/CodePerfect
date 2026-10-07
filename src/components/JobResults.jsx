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
    <div className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden bg-slate-50 py-10 px-4 sm:px-8 font-sans">
      
      {/* Ambient Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-300/30 rounded-full mix-blend-multiply filter blur-[128px] opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-300/30 rounded-full mix-blend-multiply filter blur-[128px] opacity-60 pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 tracking-tight">
            {t("title")}
          </h2>

          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md border border-white/80 px-4 py-2 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
            <select 
              value={language} 
              onChange={handleLanguageChange}
              className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="English">English</option>
              <option value="Telugu">తెలుగు (Telugu)</option>
              <option value="Tamil">தமிழ் (Tamil)</option>
              <option value="Hindi">हिंदी (Hindi)</option>
            </select>
          </div>
        </div>
        
        {/* Job Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedJobs.map((job, index) => {
            return (
              <div key={index} className="bg-white/60 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 p-8 flex flex-col transition-all duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1">
                
                <div className="flex justify-between items-start mb-6 gap-3">
                  <h3 className="text-xl font-extrabold text-slate-800 leading-tight">
                    {getTranslatedTitle(job.title)}
                  </h3>
                  <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-[10px] uppercase tracking-widest font-extrabold px-3 py-1.5 rounded-lg shrink-0 border border-blue-200/50 shadow-sm">
                    {job.finalMatchScore}% {t("match")}
                  </span>
                </div>

                <div className="mb-6 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="font-bold text-slate-500 uppercase tracking-wider">{t("reqs")}</span>
                    <span className="font-extrabold text-slate-900">{job.matchPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-200/70 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${job.matchPercentage}%` }}></div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {job.skills.map((skill, i) => {
                    const found = hasSkill(skill, userSkills);
                    return (
                      <span 
                        key={i} 
                        onClick={() => !found && generateRoadmap(skill, job.title)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all duration-200 ${
                          found 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default shadow-sm' 
                            : 'bg-rose-50/80 text-rose-600 border-rose-200 cursor-pointer hover:bg-rose-100 hover:border-rose-300 hover:shadow-md hover:-translate-y-0.5'
                        }`}
                        title={!found ? "Click to generate AI learning roadmap" : ""}
                      >
                        {found ? (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
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
        <div className="mt-12 text-center">
          <button 
            onClick={onStartOver} 
            className="px-8 py-4 bg-slate-900 text-white font-extrabold text-lg rounded-2xl shadow-[0_10px_20px_rgb(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgb(0,0,0,0.2)] hover:bg-black hover:-translate-y-1 transition-all duration-300 active:scale-[0.98]"
          >
            {t("button")}
          </button>
        </div>

        {/* Glassmorphic AI Roadmap Modal */}
        {roadmap && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgb(0,0,0,0.2)] border border-white max-w-lg w-full p-8 sm:p-10 relative transform transition-all animate-fade-in-up">
              
              <button 
                onClick={() => setRoadmap(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider rounded-lg mb-3">AI Coach</span>
                <h3 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
                  Mastering {roadmap.skill}
                </h3>
              </div>
              
              {roadmap.loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4 shadow-sm"></div>
                  <p className="text-blue-600 font-bold tracking-wide animate-pulse">Generating your custom roadmap...</p>
                </div>
              ) : roadmap.error ? (
                <div className="prose prose-blue prose-sm sm:prose-base max-w-none mt-2 text-slate-700 leading-relaxed font-medium">
                  <div className="whitespace-pre-wrap bg-red-50 text-red-600 border border-red-100 p-6 rounded-2xl shadow-inner">
                    {roadmap.error}
                  </div>
                </div>
              ) : roadmap.steps && (
                <div className="mt-4 flex flex-col gap-4">
                  {roadmap.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 items-start bg-slate-50 border border-slate-100 p-4 rounded-2xl shadow-sm">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center border border-blue-200">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-lg mb-1">{step.title}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
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