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

    aiWorker.current.addEventListener('message', handleMessage);
    return () => aiWorker.current.removeEventListener('message', handleMessage);
  }, []);

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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col selection:bg-blue-200 selection:text-blue-900 relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-400/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-400/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 pointer-events-none z-0"></div>

      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-white/80 shadow-[0_4px_30px_rgb(0,0,0,0.05)] px-4 sm:px-8 py-4 flex items-center justify-between transition-all">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 tracking-tight">
              KYC <span className="font-medium text-slate-500">| Know Your Career</span>
            </h1>
            <span className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-[10px] uppercase tracking-widest font-extrabold px-2.5 py-1 rounded-md border border-blue-200/50 shadow-sm w-fit">
              AI Skill Matcher
            </span>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-4">
          {(user || isGuest) && (
            <div className="flex items-center gap-3 mr-4 border-r border-slate-200 pr-4">
              {user ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-slate-200 shadow-sm" 
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm">
                  <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
              
              <div className="hidden md:flex flex-col">
                <span className="text-xs font-bold text-slate-700 leading-tight">
                  {user ? user.displayName : 'Guest User'}
                </span>
                <button 
                  onClick={handleSignOut}
                  className="text-[10px] text-slate-400 hover:text-red-500 text-left transition-colors font-medium"
                >
                  {user ? 'Sign Out' : 'Sign In'}
                </button>
              </div>
            </div>
          )}
          
          <div className={`flex items-center gap-3 border px-4 py-2 rounded-xl shadow-sm backdrop-blur-sm ${isModelReady ? 'bg-emerald-50/80 border-emerald-100' : 'bg-amber-50/80 border-amber-100'}`}>
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isModelReady ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isModelReady ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className={`text-xs font-extrabold uppercase tracking-widest ${isModelReady ? 'text-emerald-700' : 'text-amber-700'}`}>
              {isModelReady ? 'AI Engine Ready' : 'Loading Model...'}
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