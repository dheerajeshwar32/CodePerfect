import { useState, useEffect, useRef } from 'react';
import ProfileInput from './components/ProfileInput';
import ProcessingScreen from './components/ProcessingScreen';
import JobResults from './components/JobResults';
import Login from './components/Login';
import { cosineSimilarity } from './matcher.js';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase'; 

// Initialize worker outside to avoid recreation on re-renders (React StrictMode issue)
const workerInstance = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
workerInstance.postMessage({ type: 'INIT' });

function App() {
  const [user, setUser] = useState(null); 
  const [isGuest, setIsGuest] = useState(false);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  const [currentScreen, setCurrentScreen] = useState('input');
  const [jobMatches, setJobMatches] = useState([]);
  const [isModelReady, setIsModelReady] = useState(false);
  const [userSkillsText, setUserSkillsText] = useState(''); 
  const [vectorizedJobsData, setVectorizedJobsData] = useState([]);
  
  const aiWorker = useRef(workerInstance);

  useEffect(() => {
    // Fetch the jobs data from the backend
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        const jobsList = Array.isArray(data) ? data : (data.jobs || Object.values(data));
        setVectorizedJobsData(jobsList);
      })
      .catch(err => console.error("Failed to fetch jobs data:", err));

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
        setJobMatches(rankedJobs.slice(0, 6));
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

  const handleStartMatching = (userSkills) => {
    if (!isModelReady) {
      alert("Please wait for the AI model to finish loading.");
      return;
    }
    setUserSkillsText(userSkills); 
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
    } else {
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
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-white/5 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <h1 className="text-xl font-bold text-white tracking-tight">
              CodePerfect
            </h1>
            <span className="hidden sm:flex bg-white/5 text-slate-400 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border border-white/5">
              KYC AI
            </span>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-5">
          {(user || isGuest) && (
            <div className="flex items-center gap-3 pr-5 border-r border-white/5">
              {user ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-white/10" 
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
              
              <div className="hidden md:flex flex-col">
                <span className="text-xs font-bold text-white leading-tight">
                  {user ? user.displayName : 'Guest User'}
                </span>
                <button 
                  onClick={handleSignOut}
                  className="text-[10px] text-slate-500 hover:text-white text-left transition-colors font-medium tracking-wide uppercase mt-0.5"
                >
                  {user ? 'Sign Out' : 'Sign In'}
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
        </div>
      </header>

      <main className="flex-grow flex flex-col relative z-10 w-full h-full p-4 sm:p-8">
        {!user && !isGuest ? (
          <Login onSignIn={setUser} onGuestLogin={() => setIsGuest(true)} />
        ) : (
          <>
            {currentScreen === 'input' && (
              <ProfileInput onNext={handleStartMatching} isModelReady={isModelReady} />
            )}
            
            {currentScreen === 'processing' && (
              <ProcessingScreen onComplete={() => setCurrentScreen('results')} />
            )}
            
            {currentScreen === 'results' && (
              <JobResults matches={jobMatches} userSkills={userSkillsText} onStartOver={() => setCurrentScreen('input')} />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;