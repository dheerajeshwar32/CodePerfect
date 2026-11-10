import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Sun, Moon, Compass } from 'lucide-react';
import Login from './components/Login';
import KycLogo from './components/KycLogo';
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
  const [isDarkMode, setIsDarkMode] = useState(false); // Light Mode by default

  const [currentScreen, setCurrentScreen] = useState('input');
  const [jobMatches, setJobMatches] = useState([]);
  const [isModelReady, setIsModelReady] = useState(false);
  const [userSkillsText, setUserSkillsText] = useState(''); 
  const [vectorizedJobsData, setVectorizedJobsData] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  
  const aiWorker = useRef(workerInstance);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
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
    return <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] dark:bg-[#0B0F19] text-[#1D1D1F] dark:text-white">Loading...</div>;
  }

  return (
    <div className={isDarkMode ? 'dark min-h-screen bg-[#0B0F19] text-[#F0F4FF] flex flex-col relative overflow-x-hidden w-full max-w-[100vw] box-border transition-colors duration-300 pb-24 md:pb-10' : 'min-h-screen bg-[#F5F7FA] text-[#1D1D1F] flex flex-col relative overflow-x-hidden w-full max-w-[100vw] box-border transition-colors duration-300 pb-24 md:pb-10'}>
      
      {/* Main Top KYC Navbar */}
      <header className="sticky top-0 z-50 w-full h-16 bg-white/85 dark:bg-[#0B0F19]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/[0.08] px-5 sm:px-8 flex items-center justify-between">
        {/* Authentic KYC Logo */}
        <div 
          className="flex items-center gap-2 select-none cursor-pointer"
          onClick={() => setCurrentScreen(jobMatches.length > 0 ? 'results' : 'input')}
        >
          <KycLogo width={78} height={26} />
        </div>
        
        <div className="hidden md:flex items-center gap-4 mr-auto ml-10">
          {(user || isGuest) && (
            <div className="flex gap-2.5">
              <button 
                onClick={() => setCurrentScreen(jobMatches.length > 0 ? 'results' : 'input')}
                className={`text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full transition-colors ${currentScreen !== 'dashboard' ? 'bg-[#EEF2FF] dark:bg-[#1E264D] text-[#5268FF] border border-[#C7D4FF] dark:border-[#334185]' : 'text-[#6E6E73] dark:text-[#94A3B8] hover:text-[#1D1D1F] dark:hover:text-white'}`}
              >
                Match
              </button>
              <button 
                onClick={() => setCurrentScreen('dashboard')}
                className={`text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full transition-colors flex items-center gap-2 ${currentScreen === 'dashboard' ? 'bg-[#EEF2FF] dark:bg-[#1E264D] text-[#5268FF] border border-[#C7D4FF] dark:border-[#334185]' : 'text-[#6E6E73] dark:text-[#94A3B8] hover:text-[#1D1D1F] dark:hover:text-white'}`}
              >
                Dashboard
                {userProfile && <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></span>}
              </button>
            </div>
          )}
        </div>
        
        <div className="hidden sm:flex items-center gap-5">
          {(user || isGuest) && (
            <div className="flex items-center gap-3 pr-5 border-r border-slate-200/80 dark:border-white/[0.08]">
              <img 
                src={user?.photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border border-slate-200/80 dark:border-white/[0.08]" 
              />
              <div className="hidden md:flex flex-col">
                <span className="text-xs font-bold text-[#1D1D1F] dark:text-white leading-tight">
                  {user ? (user.displayName || user.email?.split('@')[0] || 'Authenticated User') : 'Guest User'}
                </span>
                <button 
                  onClick={handleSignOut}
                  className="text-[10px] text-[#86868B] dark:text-[#94A3B8] hover:text-[#5268FF] text-left transition-colors font-medium tracking-wide uppercase mt-0.5"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.08] px-3 py-1.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isModelReady ? 'bg-[#5268FF]' : 'bg-slate-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isModelReady ? 'bg-[#5268FF]' : 'bg-slate-400'}`}></span>
            </span>
            <span className="text-[10px] font-bold text-[#1D1D1F] dark:text-white tracking-widest uppercase">
              {isModelReady ? 'Engine Ready' : 'Initializing'}
            </span>
          </div>
          
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-8 h-8 rounded-full bg-white dark:bg-[#13182B] border border-slate-200/80 dark:border-white/[0.08] flex items-center justify-center text-[#1D1D1F] dark:text-white hover:border-[#5268FF] transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </header>

      {/* Mobile Bottom Tab Dock */}
      {(user || isGuest) && (
        <nav className="fixed bottom-0 inset-x-0 z-50 flex md:hidden items-center justify-around bg-white/90 dark:bg-[#0B0F19]/92 backdrop-blur-2xl border-t border-slate-200/80 dark:border-white/[0.08] pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-1.5 px-2">
          <button
            onClick={() => setCurrentScreen(jobMatches.length > 0 ? 'results' : 'input')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl min-h-[36px] ${currentScreen !== 'dashboard' ? 'text-[#5268FF]' : 'text-[#86868B] dark:text-[#94A3B8]'}`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Match</span>
          </button>
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl min-h-[36px] ${currentScreen === 'dashboard' ? 'text-[#5268FF]' : 'text-[#86868B] dark:text-[#94A3B8]'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            <span className="text-[10px] font-semibold">Dashboard</span>
          </button>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl min-h-[36px] text-[#86868B] dark:text-[#94A3B8]"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
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
              <div className="w-10 h-10 border-2 border-slate-200 dark:border-white/[0.08] border-t-[#5268FF] rounded-full animate-spin mb-4"></div>
              <span className="text-xs font-semibold text-[#86868B] dark:text-[#94A3B8] tracking-widest uppercase">Loading View...</span>
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
