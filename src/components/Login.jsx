import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function Login({ onSignIn, onGuest }) {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onSignIn(result.user);
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden bg-navy-950 z-50">
      {/* Immersive Orb Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[100px] opacity-60 animate-pulse mix-blend-screen pointer-events-none" style={{
        background: 'radial-gradient(circle, rgba(255,42,84,0.6) 0%, rgba(255,155,0,0.5) 30%, rgba(0,240,255,0.3) 60%, rgba(168,0,255,0) 80%)'
      }}></div>
      
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl px-6">
        
        <div className="mb-8">
          <svg viewBox="0 0 160 50" className="h-16 sm:h-20 w-auto drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]" fill="none">
             <path d="M25 10 V40 M50 10 L31 25 L50 40" stroke="url(#apple-siri)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
             <path d="M70 10 L85 25 L100 10 M85 25 V40" stroke="url(#apple-siri)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
             <path d="M137 14 A 15 15 0 1 0 137 36" stroke="url(#apple-siri)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
             <defs>
               <linearGradient id="apple-siri" x1="25" y1="10" x2="137" y2="40" gradientUnits="userSpaceOnUse">
                 <stop offset="0%" stopColor="#FF2A54" />
                 <stop offset="33%" stopColor="#FF9B00" />
                 <stop offset="66%" stopColor="#00F0FF" />
                 <stop offset="100%" stopColor="#A800FF" />
               </linearGradient>
             </defs>
          </svg>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40 tracking-tight mb-6 drop-shadow-sm">
          Your True Potential.<br/>Mathematically Proven.
        </h1>
        
        <p className="text-xl md:text-2xl text-white/50 font-light max-w-2xl mb-12">
          Upload your resume and let our Spatial AI engine align your skills with the universe of top-tier opportunities.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full max-w-lg">
          <button 
            onClick={handleLogin}
            className="group relative w-full flex items-center justify-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 text-white font-semibold text-lg py-5 px-6 rounded-3xl hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 shadow-[0_0_40px_rgba(11,17,32,0.6)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <svg viewBox="0 0 24 24" className="w-6 h-6 relative z-10" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="relative z-10 tracking-wide">Enter with Google</span>
          </button>
        </div>

        <button 
          onClick={onGuest}
          className="mt-6 text-slate-500 hover:text-white transition-colors text-sm font-medium tracking-wide uppercase"
        >
          Continue as Guest
        </button>
        
      </div>
      
      {/* Decorative Particle Grid Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50 pointer-events-none"></div>
    </div>
  );
}