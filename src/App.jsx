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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kyc_theme');
      if (saved) return saved === 'dark';
    }
    return false; // Default to Light Mode as shown in screenshot
  });

  const [currentScreen, setCurrentScreen] = useState('input');
  const [jobMatches, setJobMatches] = useState([]);
  const [isModelReady, setIsModelReady] = useState(false);
  const [userSkillsText, setUserSkillsText] = useState(''); 
  const [vectorizedJobsData] = useState(() => {
    try {
      return Array.isArray(jobsData) ? jobsData : (jobsData.jobs || Object.values(jobsData) || []);
    } catch {
      return [];
    }
  });
  const [userProfile, setUserProfile] = useState(null);
  
  const aiWorker = useRef(workerInstance);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('kyc_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('kyc_theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0B0F19] text-[#111827] dark:text-white">
        Loading...
      </div>
    );
  }

  const isLandingView = !(user || isGuest);

  return (
    <div className={`min-h-screen flex flex-col relative overflow-x-hidden w-full max-w-[100vw] box-border transition-colors duration-300 ${
      isDarkMode ? 'dark bg-[#0B0F19] text-[#F0F4FF]' : 'bg-white text-[#111827]'
    } ${isLandingView ? '' : 'pb-24 md:pb-10'}`}>
      
      {/* Top Navbar */}
      <header className={`sticky top-0 z-50 w-full h-16 px-5 sm:px-8 flex items-center justify-between transition-colors duration-300 ${
        isLandingView 
          ? 'bg-transparent border-b border-transparent' 
          : 'bg-white/85 dark:bg-[#0B0F19]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/[0.08]'
      }`}>
        {/* Authentic Multi-Color KYC Logo */}
        <div 
          className="flex items-center gap-2 select-none cursor-pointer"
          onClick={() => setCurrentScreen(jobMatches.length > 0 ? 'results' : 'input')}
        >
          <KycLogo className="h-7 sm:h-8 w-auto" idPrefix="nav" />
        </div>
        
        {/* Navigation Tabs (Only when authenticated or in guest mode) */}
        {!isLandingView && (
          <div className="hidden md:flex items-center gap-4 mr-auto ml-10">
            <div className="flex gap-2.5">
              <button 
                onClick={() => setCurrentScreen(jobMatches.length > 0 ? 'results' : 'input')}
                className={`text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full transition-colors ${
                  currentScreen !== 'dashboard' 
                    ? 'bg-[#EEF2FF] dark:bg-[#1E264D] text-[#5268FF] border border-[#C7D4FF] dark:border-[#334185]' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Match
              </button>
              <button 
                onClick={() => setCurrentScreen('dashboard')}
                className={`text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full transition-colors flex items-center gap-2 ${
                  currentScreen === 'dashboard' 
                    ? 'bg-[#EEF2FF] dark:bg-[#1E264D] text-[#5268FF] border border-[#C7D4FF] dark:border-[#334185]' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Dashboard
                {userProfile && <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></span>}
              </button>
            </div>
          </div>
        )}
        
        {/* Header Right Actions */}
        <div className="flex items-center gap-4 sm:gap-5 ml-auto">
          {!isLandingView && (
            <div className="flex items-center gap-3 pr-4 border-r border-slate-200/80 dark:border-white/[0.08]">
              <img 
                src={user?.photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border border-slate-200/80 dark:border-white/[0.08]" 
              />
              <div className="hidden md:flex flex-col">
                <span className="text-xs font-bold text-[#111827] dark:text-white leading-tight">
                  {user ? (user.displayName || user.email?.split('@')[0] || 'Authenticated User') : 'Guest User'}
                </span>
                <button 
                  onClick={handleSignOut}
                  className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-[#5268FF] text-left transition-colors font-medium tracking-wide uppercase mt-0.5"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
          
          {/* ENGINE READY Status Pill */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.08] px-3.5 py-1.5 rounded-full shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isModelReady ? 'bg-[#3B82F6]' : 'bg-amber-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isModelReady ? 'bg-[#3B82F6]' : 'bg-amber-400'}`}></span>
            </span>
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 tracking-widest uppercase">
              {isModelReady ? 'ENGINE READY' : 'INITIALIZING'}
            </span>
          </div>
          
          {/* Sleek Pill Switch Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="relative w-12 h-6.5 rounded-full bg-slate-200/90 dark:bg-slate-800 border border-slate-300/80 dark:border-slate-700 p-0.5 flex items-center cursor-pointer transition-colors focus:outline-none"
            aria-label="Toggle theme"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <span
              className={`w-5.5 h-5.5 rounded-full shadow-sm flex items-center justify-center transform transition-transform duration-200 ${
                isDarkMode 
                  ? 'translate-x-0 bg-white' 
                  : 'translate-x-5.5 bg-slate-900'
              }`}
            >
              {isDarkMode ? (
                <Moon className="w-3 h-3 text-slate-900" />
              ) : (
                <Sun className="w-3 h-3 text-amber-400" />
              )}
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Bottom Tab Dock (when authenticated or in guest mode) */}
      {!isLandingView && (
        <nav className="fixed bottom-0 inset-x-0 z-50 flex md:hidden items-center justify-around bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-2xl border-t border-slate-200/80 dark:border-white/[0.08] pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-1.5 px-2">
          <button
            onClick={() => setCurrentScreen(jobMatches.length > 0 ? 'results' : 'input')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl min-h-[36px] ${currentScreen !== 'dashboard' ? 'text-[#5268FF]' : 'text-slate-500 dark:text-slate-400'}`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Match</span>
          </button>
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl min-h-[36px] ${currentScreen === 'dashboard' ? 'text-[#5268FF]' : 'text-slate-500 dark:text-slate-400'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            <span className="text-[10px] font-semibold">Dashboard</span>
          </button>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl min-h-[36px] text-slate-500 dark:text-slate-400"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            <span className="text-[10px] font-semibold">Theme</span>
          </button>
        </nav>
      )}

      {/* Main View Area */}
      <main className={`flex-grow flex flex-col relative z-10 w-full ${
        isLandingView ? 'h-full justify-center' : 'h-full p-4 sm:p-8'
      }`}>
        {isLandingView ? (
          <Login onSignIn={setUser} onGuest={() => setIsGuest(true)} />
        ) : (
          <Suspense fallback={
            <div className="flex-grow flex flex-col items-center justify-center p-12">
              <div className="w-10 h-10 border-2 border-slate-200 dark:border-white/[0.08] border-t-[#5268FF] rounded-full animate-spin mb-4"></div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-widest uppercase">Loading View...</span>
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
