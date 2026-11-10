import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Sun, Moon, Compass } from 'lucide-react';
import Login from './components/Login';
import { cosineSimilarity } from './matcher.js';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase'; 
import { jobsData } from '../api/jobsData.js';

const ProfileInput = lazy(() => import('./components/ProfileInput'));
const ProcessingScreen = lazy(() => import('./components/ProcessingScreen'));
const JobResults = lazy(() => import('./components/JobResults'));
const Dashboard = lazy(() => import('./components/Dashboard'));

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
        
        // Deduplicate by job title so distinct engineering roles are displayed
        const seenTitles = new Set();
        const distinctJobs = [];
        for (const job of rankedJobs) {
          if (!seenTitles.has(job.title)) {
            seenTitles.add(job.title);
            distinctJobs.push(job);
            if (distinctJobs.length >= 9) break;
          }
        }
        setJobMatches(distinctJobs);
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
    return <div className="min-h-screen flex items-center justify-center bg-[#F6F8FC] dark:bg-[#0E1229] text-[#2D325A] dark:text-[#F0F4FF]">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F6F8FC] dark:bg-[#0E1229] font-sans text-[#2D325A] dark:text-[#F0F4FF] flex flex-col relative overflow-x-hidden w-full max-w-[100vw] box-border transition-colors duration-300 pb-24 md:pb-10">
      
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0E1229]/80 backdrop-blur-2xl border-b border-[#E2E8F8] dark:border-[#252D58] px-5 sm:px-8 py-4 flex items-center justify-between">
        {/* Brand Lockup */}
        <div className="flex items-center gap-2.5 select-none cursor-pointer">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-[9px] bg-gradient-to-br from-[#5268FF] via-[#4355E8] to-[#2D325A] shadow-[0_3px_10px_rgba(82,104,255,0.32),inset_0_1px_0_rgba(255,255,255,0.35)] border border-[#4338CA]/50 shrink-0 overflow-hidden">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L14.8 9.2L21 12L14.8 14.8L12 21L9.2 14.8L3 12L9.2 9.2L12 3Z" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" fill="rgba(255,255,255,0.18)" />
              <circle cx="12" cy="12" r="2.2" fill="#FFFFFF" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-extrabold tracking-[-0.03em] text-[#2D325A] dark:text-[#F0F4FF]">KYC</span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#EEF2FF] dark:bg-[#1E264D] text-[#5268FF] border border-[#C7D4FF] dark:border-[#334185]">
              Career AI
            </span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-4 mr-auto ml-12">
          {(user || isGuest) && (
            <div className="flex gap-3">
              <button 
                onClick={() => setCurrentScreen(jobMatches.length > 0 ? 'results' : 'input')}
                className={`text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full transition-colors ${currentScreen !== 'dashboard' ? 'bg-[#EEF2FF] dark:bg-[#1E264D] text-[#5268FF] border border-[#C7D4FF] dark:border-[#334185]' : 'text-[#5A628A] dark:text-[#9BA6D1] hover:text-[#5268FF] hover:bg-[#EEF2FF] dark:hover:bg-[#1E264D]'}`}
              >
                Match
              </button>
              <button 
                onClick={() => setCurrentScreen('dashboard')}
                className={`text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full transition-colors flex items-center gap-2 ${currentScreen === 'dashboard' ? 'bg-[#EEF2FF] dark:bg-[#1E264D] text-[#5268FF] border border-[#C7D4FF] dark:border-[#334185]' : 'text-[#5A628A] dark:text-[#9BA6D1] hover:text-[#5268FF] hover:bg-[#EEF2FF] dark:hover:bg-[#1E264D]'}`}
              >
                Dashboard
                {userProfile && <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></span>}
              </button>
            </div>
          )}
        </div>
        
        <div className="hidden sm:flex items-center gap-5">
          {(user || isGuest) && (
            <div className="flex items-center gap-3 pr-5 border-r border-[#E2E8F8] dark:border-[#252D58]">
              <img 
                src={user?.photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border border-[#E2E8F8] dark:border-[#252D58]" 
              />
              <div className="hidden md:flex flex-col">
                <span className="text-xs font-bold text-[#2D325A] dark:text-[#F0F4FF] leading-tight">
                  {user ? (user.displayName || user.email?.split('@')[0] || 'Authenticated User') : 'Guest User'}
                </span>
                <button 
                  onClick={handleSignOut}
                  className="text-[10px] text-[#848DB3] hover:text-[#5268FF] text-left transition-colors font-medium tracking-wide uppercase mt-0.5"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2 bg-[#EEF2FF] dark:bg-[#151A36] border border-[#C7D4FF] dark:border-[#2B3566] px-3 py-1.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isModelReady ? 'bg-[#5268FF]' : 'bg-[#848DB3]'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isModelReady ? 'bg-[#5268FF]' : 'bg-[#848DB3]'}`}></span>
            </span>
            <span className="text-[10px] font-bold text-[#2D325A] dark:text-[#F0F4FF] tracking-widest uppercase">
              {isModelReady ? 'Engine Ready' : 'Initializing'}
            </span>
          </div>
          
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-8 h-8 rounded-full bg-white dark:bg-[#151A36] border border-[#DCE6FA] dark:border-[#2B3566] flex items-center justify-center text-[#2D325A] dark:text-[#F0F4FF] hover:border-[#5268FF] transition-colors"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Bottom Tab Dock */}
      {(user || isGuest) && (
        <nav className="fixed bottom-0 inset-x-0 z-50 flex md:hidden items-center justify-around bg-white/90 dark:bg-[#11152B]/92 backdrop-blur-2xl border-t border-[#DCE6FA] dark:border-[#252D58] pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-1.5 px-2">
          <button
            onClick={() => setCurrentScreen(jobMatches.length > 0 ? 'results' : 'input')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl min-h-[36px] ${currentScreen !== 'dashboard' ? 'text-[#5268FF]' : 'text-[#848DB3]'}`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Match</span>
          </button>
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl min-h-[36px] ${currentScreen === 'dashboard' ? 'text-[#5268FF]' : 'text-[#848DB3]'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            <span className="text-[10px] font-semibold">Dashboard</span>
          </button>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl min-h-[36px] text-[#848DB3]`}
          >
            {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            <span className="text-[10px] font-semibold">Theme</span>
          </button>
        </nav>
      )}

      <main className="flex-grow flex flex-col relative z-10 w-full h-full p-4 sm:p-8">
        {!(user || isGuest) ? (
          <Login onSignIn={setUser} onGuest={() => setIsGuest(true)} />
        ) : (
          <Suspense fallback={
            <div className="flex-grow flex flex-col items-center justify-center p-12">
              <div className="w-10 h-10 border-2 border-[#E2E8F8] dark:border-[#252D58] border-t-[#5268FF] rounded-full animate-spin mb-4"></div>
              <span className="text-xs font-semibold text-[#848DB3] dark:text-[#6E78A3] tracking-widest uppercase">Loading View...</span>
            </div>
          }>
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
          </Suspense>
        )}
      </main>
    </div>
  );
}

export default App;
