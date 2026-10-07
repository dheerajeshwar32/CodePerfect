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
    <div className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden bg-[#F8FAFC] py-12 px-4 sm:px-8 font-sans">
      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t("title")}
          </h2>

          <div className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
            <select 
              value={language} 
              onChange={handleLanguageChange}
              className="bg-transparent text-sm font-semibold text-slate-700 outline-none cursor-pointer"
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
              <div key={index} className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-200 p-8 flex flex-col transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1">
                
                <div className="flex flex-col items-start mb-6 gap-3">
                  <span className="bg-slate-100 text-slate-700 text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-md border border-slate-200">
                    {job.finalMatchScore}% {t("match")}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight break-words">
                    {getTranslatedTitle(job.title)}
                  </h3>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center text-xs mb-2 gap-4 flex-wrap">
                    <span className="font-semibold text-slate-500 uppercase tracking-wider">{t("reqs")}</span>
                    <span className="font-bold text-slate-900">{job.matchPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-slate-900 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${job.matchPercentage}%` }}></div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {job.skills.map((skill, i) => {
                    const found = hasSkill(skill, userSkills);
                    return (
                      <span 
                        key={i} 
                        onClick={() => !found && generateRoadmap(skill, job.title)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all duration-200 ${
                          found 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default' 
                            : 'bg-white text-slate-600 border-slate-200 cursor-pointer hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900'
                        }`}
                        title={!found ? "Click to generate AI learning roadmap" : ""}
                      >
                        {found ? (
                          <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
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
        <div className="mt-16 text-center">
          <button 
            onClick={onStartOver} 
            className="px-8 py-3.5 bg-white text-slate-900 border border-slate-200 font-semibold text-sm rounded-xl shadow-sm hover:bg-slate-50 hover:shadow-md transition-all duration-200"
          >
            {t("button")}
          </button>
        </div>

        {/* Minimal AI Roadmap Modal */}
        {roadmap && (
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 sm:p-10 relative transform transition-all animate-fade-in-up">
              
              <button 
                onClick={() => setRoadmap(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              
              <div className="mb-8">
                <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-md mb-4 border border-slate-200">AI Coach</span>
                <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                  Mastering {roadmap.skill}
                </h3>
              </div>
              
              {roadmap.loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-500 text-sm font-medium">Generating roadmap...</p>
                </div>
              ) : roadmap.error ? (
                <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl text-sm mt-4">
                  {roadmap.error}
                </div>
              ) : roadmap.steps && (
                <div className="mt-4 flex flex-col gap-3">
                  {roadmap.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 items-start p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1">{step.title}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
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