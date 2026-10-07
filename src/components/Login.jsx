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
      <div className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 text-center max-w-md w-full">
        
        <div className="w-12 h-12 rounded-2xl bg-slate-900 mx-auto mb-6 flex items-center justify-center shadow-sm">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Welcome to CodePerfect</h2>
        <p className="text-slate-500 mb-8 text-sm px-4">Sign in to save your career roadmaps or continue offline as a guest.</p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-xl hover:bg-slate-50 transition-all hover:shadow-sm"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-2">
            <div className="h-px bg-slate-100 flex-1"></div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">OR</span>
            <div className="h-px bg-slate-100 flex-1"></div>
          </div>

          <button 
            onClick={onGuestLogin}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-medium py-2.5 px-4 rounded-xl hover:bg-slate-800 transition-all hover:shadow-sm"
          >
            Continue as Guest
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
}