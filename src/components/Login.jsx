import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function Login({ onSignIn, onGuestLogin }) {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onSignIn(result.user);
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[80vh]">
      <div className="bg-navy-900 backdrop-blur-2xl p-10 rounded-[32px] border border-apple-border shadow-apple text-center max-w-md w-full relative overflow-hidden">
        
        <div className="relative z-10 flex flex-col items-center mb-12 group">
          <svg viewBox="0 0 160 50" className="h-12 sm:h-14 w-auto group-hover:scale-[1.03] transition-transform duration-700 ease-out drop-shadow-[0_0_20px_rgba(249,203,40,0.15)]" fill="none">
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
        <p className="relative z-10 text-slate-400 mb-10 text-sm px-4 font-light leading-relaxed">Sign in to save your career roadmaps or continue offline as a guest.</p>
        
        <div className="relative z-10 flex flex-col gap-4">
          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/5 text-white font-medium text-lg py-4 px-4 rounded-2xl hover:bg-white/10 transition-all active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="h-px bg-white/5 flex-1"></div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">OR</span>
            <div className="h-px bg-white/5 flex-1"></div>
          </div>

          <button 
            onClick={onGuestLogin}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-medium text-lg py-4 px-4 rounded-2xl hover:bg-blue-500 transition-all active:scale-95 border border-blue-500/50"
          >
            Continue as Guest
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
}