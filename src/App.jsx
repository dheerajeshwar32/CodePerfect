import { useState, useEffect, useRef } from 'react';
import ProfileInput from './components/ProfileInput';
import ProcessingScreen from './components/ProcessingScreen';
import JobResults from './components/JobResults';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { cosineSimilarity } from './matcher.js';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase'; 
import { jobsData } from '../api/jobsData.js';

// Initialize worker outside to avoid recreation on re-renders (React StrictMode issue)
const workerInstance = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
workerInstance.postMessage({ type: 'INIT' });

function App() {
  const [user, setUser] = useState(null); 
  const [isGuest, setIsGuest] = useState(false);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [currentScreen, setCurrentScreen] = useState('input');
  const [jobMatches, setJobMatches] = useState([]);
  const [isModelReady, setIsModelReady] = useState(false);
  const [userSkillsText, setUserSkillsText] = useState(''); 
  const [vectorizedJobsData, setVectorizedJobsData] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  
  const aiWorker = useRef(workerInstance);

  
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Load jobs data directly instead of fetching from non-existent backend
    try {
      const jobsList = Array.isArray(jobsData) ? jobsData : (jobsData.jobs || Object.values(jobsData));
      setVectorizedJobsData(jobsList);
    } catch (err) {
      console.error("Failed to load jobs data:", err);
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoaded(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      const { status, embedding, error } = event.data;

      if (status === 'READY') {
        setIsModelReady(true);
      }

      if (status === 'SUCCESS' && embedding) {
        if (!vectorizedJobsData || vectorizedJobsData.length === 0) {
          alert("Jobs data is still loading. Please try again in a few seconds.");
          setCurrentScreen('input');
          return;
        }

        const rankedJobs = vectorizedJobsData.map((job) => {
          let score = 0;
          if (job.embedding && job.embedding.length === embedding.length) {
            score = cosineSimilarity(embedding, job.embedding);
          }
          return { ...job, score };
        });

        rankedJobs.sort((a, b) => b.score - a.score);
        setJobMatches(rankedJobs.slice(0, 9));
        setCurrentScreen('results');
      }

      if (status === 'ERROR') {
        alert("Failed to process with Edge AI: " + error);
        setCurrentScreen('input');
      }
    };

    const worker = aiWorker.current;
    worker.addEventListener('message', handleMessage);
    return () => worker.removeEventListener('message', handleMessage);
  }, [vectorizedJobsData]);

  const handleStartMatching = (userSkills, profileData = null) => {
    if (!isModelReady) {
      alert("Please wait for the AI model to finish loading.");
      return;
    }
    setUserSkillsText(userSkills);
    if (profileData) {
       setUserProfile(profileData);
    }
    setCurrentScreen('processing');
    
    aiWorker.current.postMessage({ 
      type: 'EMBED', 
      text: userSkills 
    });
  };

  const handleSignOut = () => {
    if (user) {
      signOut(auth).then(() => {
        setUser(null);
        setCurrentScreen('input'); 
      }).catch((error) => console.error("Sign out error", error));
    } else if (isGuest) {
      setIsGuest(false);
      setCurrentScreen('input');
    }
  };

  if (!isAuthLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-navy-950 font-sans text-slate-300 flex flex-col relative overflow-x-hidden transition-colors duration-300">
      
      <header className="sticky top-0 z-50 bg-navy-950/80 backdrop-blur-3xl border-b border-white/5 px-5 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 group cursor-pointer">
          <svg viewBox="0 0 160 50" className="h-8 w-auto group-hover:scale-105 transition-transform duration-500 drop-shadow-[0_0_12px_rgba(0,240,255,0.2)]" fill="none">
             <path d="M25 10 V40 M50 10 L31 25 L50 40" stroke="url(#apple-siri-app)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
             <path d="M70 10 L85 25 L100 10 M85 25 V40" stroke="url(#apple-siri-app)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
             <path d="M137 14 A 15 15 0 1 0 137 36" stroke="url(#apple-siri-app)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
             <defs>
               <linearGradient id="apple-siri-app" x1="25" y1="10" x2="137" y2="40" gradientUnits="userSpaceOnUse">
                 <stop offset="0%" stopColor="#FF2A54" />
                 <stop offset="33%" stopColor="#FF9B00" />
                 <stop offset="66%" stopColor="#00F0FF" />
                 <stop offset="100%" stopColor="#A800FF" />
               </linearGradient>
             </defs>
          </svg>
        </div>
        
        <div className="hidden sm:flex items-center gap-8 mr-auto ml-12">
          {(user || isGuest) && (
            <div className="flex gap-4">
              <button 
                onClick={() => setCurrentScreen(jobMatches.length > 0 ? 'results' : 'input')}
                className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all ${currentScreen !== 'dashboard' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                Match
              </button>
              <button 
                onClick={() => setCurrentScreen('dashboard')}
                className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all flex items-center gap-2 ${currentScreen === 'dashboard' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                Dashboard
                {userProfile && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
              </button>
            </div>
          )}
        </div>
        
        <div className="hidden sm:flex items-center gap-5">
          {(user || isGuest) && (
            <div className="flex items-center gap-3 pr-5 border-r border-white/5">
              <img 
                src={user?.photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border border-white/10" 
              />
              <div className="hidden md:flex flex-col">
                <span className="text-xs font-bold text-white leading-tight">
                  {user ? (user.displayName || user.email?.split('@')[0] || 'Authenticated User') : 'Guest User'}
                </span>
                <button 
                  onClick={handleSignOut}
                  className="text-[10px] text-slate-500 hover:text-white text-left transition-colors font-medium tracking-wide uppercase mt-0.5"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2 bg-navy-900 border border-white/5 px-3 py-1.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isModelReady ? 'bg-blue-400' : 'bg-slate-500'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isModelReady ? 'bg-blue-500' : 'bg-slate-500'}`}></span>
            </span>
            <span className="text-[10px] font-bold text-slate-300 tracking-widest uppercase">
              {isModelReady ? 'Engine Ready' : 'Initializing'}
            </span>
          </div>
          
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-14 h-7 rounded-full bg-apple-border border border-apple-border relative flex items-center px-1 transition-all duration-500 focus:outline-none shadow-inner"
            aria-label="Toggle theme"
          >
            <div className={`w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-md transition-transform duration-500 ease-out ${!isDarkMode ? 'translate-x-7' : 'translate-x-0'}`}>
              {isDarkMode ? (
                <svg className="w-3 h-3 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </div>
          </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col relative z-10 w-full h-full p-4 sm:p-8">
        {!(user || isGuest) ? (
          <Login onSignIn={setUser} onGuest={() => setIsGuest(true)} />
        ) : (
          <>
            {currentScreen === 'input' && (
              <ProfileInput onNext={handleStartMatching} isModelReady={isModelReady} setUserProfile={setUserProfile} />
            )}
            
            {currentScreen === 'processing' && (
              <ProcessingScreen onComplete={() => setCurrentScreen('results')} />
            )}
            
            {currentScreen === 'results' && (
              <JobResults matches={jobMatches} userSkills={userSkillsText} onStartOver={() => setCurrentScreen('input')} />
            )}
            
            {currentScreen === 'dashboard' && (
              <Dashboard user={user} userProfile={userProfile} jobMatches={jobMatches} onBack={() => setCurrentScreen('results')} />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;