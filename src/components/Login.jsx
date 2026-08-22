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
      <div className="bg-white/60 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-xl border border-white/80 text-center max-w-sm w-full relative overflow-hidden">
        
        <h2 className="text-3xl font-black text-slate-800 mb-2">Welcome to KYC</h2>
        <p className="text-slate-500 mb-8 text-sm px-2">Sign in to save your career roadmaps or continue offline as a guest.</p>
        
        <div className="flex flex-col gap-3 relative z-10">
          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl hover:bg-slate-50 transition-all hover:shadow-md"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-2">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">OR</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <button 
            onClick={onGuestLogin}
            className="w-full flex items-center justify-center gap-3 bg-transparent border-2 border-slate-300 text-slate-600 font-bold py-3 px-4 rounded-xl hover:bg-slate-200/50 hover:border-slate-400 transition-all"
          >
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}