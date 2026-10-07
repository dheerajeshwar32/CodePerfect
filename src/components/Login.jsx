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
      <div className="bg-white/60 backdrop-blur-3xl p-10 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-white/80 text-center max-w-md w-full relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-indigo-400/20 blur-[60px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto mb-6 flex items-center justify-center shadow-lg shadow-indigo-500/30 border border-indigo-400/30">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        
        <h2 className="relative z-10 text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 via-purple-800 to-slate-900 mb-3 tracking-tighter">Welcome to CodePerfect</h2>
        <p className="relative z-10 text-slate-600 mb-10 text-sm px-4 font-medium leading-relaxed">Sign in to save your career roadmaps or continue offline as a guest.</p>
        
        <div className="relative z-10 flex flex-col gap-4">
          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white/80 backdrop-blur-md border border-white text-slate-800 font-bold text-lg py-4 px-4 rounded-2xl hover:bg-white transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_30px_rgba(86,104,255,0.1)] hover:-translate-y-0.5 active:scale-95"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="h-px bg-slate-300/50 flex-1"></div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">OR</span>
            <div className="h-px bg-slate-300/50 flex-1"></div>
          </div>

          <button 
            onClick={onGuestLogin}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold text-lg py-4 px-4 rounded-2xl hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all active:scale-95 border border-slate-700/50"
          >
            Continue as Guest
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
}