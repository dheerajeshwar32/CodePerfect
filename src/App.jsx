import { useState, useEffect, useRef } from 'react';
import ProfileInput from './components/ProfileInput';
import ProcessingScreen from './components/ProcessingScreen';
import JobResults from './components/JobResults';
import vectorizedJobsData from './vectorized_jobs.json';
import { cosineSimilarity } from './matcher.js';

function App() {
  const [currentScreen, setCurrentScreen] = useState('input');
  const [jobMatches, setJobMatches] = useState([]);
  const [isModelReady, setIsModelReady] = useState(false);
  
  // Save the user's raw text to calculate the skill gap later
  const [userSkillsText, setUserSkillsText] = useState(''); 
  
  const aiWorker = useRef(null);

  useEffect(() => {
    aiWorker.current = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
    aiWorker.current.postMessage({ type: 'INIT' });

    aiWorker.current.onmessage = (event) => {
      const { status, embedding, error } = event.data;

      if (status === 'READY') {
        setIsModelReady(true);
      }

      if (status === 'SUCCESS' && embedding) {
        const jobsList = Array.isArray(vectorizedJobsData) 
          ? vectorizedJobsData 
          : (vectorizedJobsData.jobs || Object.values(vectorizedJobsData));

        const rankedJobs = jobsList.map((job) => {
          let score = 0;
          if (job.embedding && job.embedding.length === embedding.length) {
            score = cosineSimilarity(embedding, job.embedding);
          }
          return { ...job, score };
        });

        rankedJobs.sort((a, b) => b.score - a.score);
        setJobMatches(rankedJobs.slice(0, 6));
        setCurrentScreen('results');
      }

      if (status === 'ERROR') {
        alert("Failed to process with Edge AI: " + error);
        setCurrentScreen('input');
      }
    };

    return () => aiWorker.current?.terminate();
  }, []);

  const handleStartMatching = (userSkills) => {
    // Store the text in state before moving to the loading screen
    setUserSkillsText(userSkills); 
    setCurrentScreen('processing');
    
    aiWorker.current.postMessage({ 
      type: 'EMBED', 
      text: userSkills 
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col selection:bg-blue-200 selection:text-blue-900 relative overflow-hidden">
      
      {/* Global Ambient Background Gradients for the whole app */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-400/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-400/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 pointer-events-none z-0"></div>

      {/* Premium Global Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-white/80 shadow-[0_4px_30px_rgb(0,0,0,0.05)] px-4 sm:px-8 py-4 flex items-center justify-between transition-all">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            {/* Lightning Bolt Icon */}
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 tracking-tight">
            CodePerfect <span className="font-medium text-slate-500">AI Skill Matcher</span>
          </h1>
        </div>
        
        <div className={`hidden sm:flex items-center gap-3 border px-4 py-2 rounded-xl shadow-sm backdrop-blur-sm ${isModelReady ? 'bg-emerald-50/80 border-emerald-100' : 'bg-amber-50/80 border-amber-100'}`}>
          <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isModelReady ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isModelReady ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          </span>
          <span className={`text-xs font-extrabold uppercase tracking-widest ${isModelReady ? 'text-emerald-700' : 'text-amber-700'}`}>
            {isModelReady ? 'AI Engine Ready' : 'Loading Model...'}
          </span>
        </div>
      </header>

      {/* Main Routing Area */}
      <main className="flex-grow flex flex-col relative z-10 w-full h-full">
        {currentScreen === 'input' && (
          <ProfileInput onNext={handleStartMatching} />
        )}
        
        {currentScreen === 'processing' && (
          <ProcessingScreen onComplete={() => setCurrentScreen('results')} />
        )}
        
        {currentScreen === 'results' && (
          <JobResults matches={jobMatches} userSkills={userSkillsText} onStartOver={() => setCurrentScreen('input')} />
        )}
      </main>
    </div>
  );
}

export default App;