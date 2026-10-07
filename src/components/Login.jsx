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
      <div className="bg-navy-900/50 backdrop-blur-md p-10 rounded-3xl border border-white/5 text-center max-w-md w-full relative overflow-hidden">
        
        <div className="relative z-10 w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-400 mx-auto mb-6 flex items-center justify-center border border-white/5">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        
        <h2 className="relative z-10 text-3xl font-bold text-white mb-3 tracking-tight">CodePerfect</h2>
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