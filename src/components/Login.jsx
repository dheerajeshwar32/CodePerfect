import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import KycLogo from "./KycLogo";

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
    <div className="relative min-h-[calc(100vh-5rem)] w-full flex flex-col items-center justify-center px-4 overflow-hidden transition-colors duration-300">
      {/* Subtle Spatial Ambient Orb Backdrop (Enhanced for Dark Mode) */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="w-[380px] h-[380px] sm:w-[560px] sm:h-[560px] rounded-full border border-slate-900/[0.03] dark:border-white/[0.04] bg-[radial-gradient(circle,rgba(99,102,241,0.05)_0%,transparent_70%)]" />
        <div className="absolute w-[600px] h-[600px] sm:w-[840px] sm:h-[840px] rounded-full border border-slate-900/[0.02] dark:border-white/[0.02]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl px-4 w-full">
        {/* Authentic Multi-Color Gradient K Y C Centerpiece */}
        <div className="mb-8 flex justify-center">
          <KycLogo className="h-16 sm:h-20 w-auto" idPrefix="hero" />
        </div>

        {/* Hero Typography */}
        <h1 className="text-4xl sm:text-6xl md:text-[68px] font-extrabold tracking-tight text-center leading-[1.08] mb-6">
          <span className="block text-[#111827] dark:text-white">
            Your True Potential.
          </span>
          <span className="block text-[#4B5563] dark:text-[#94A3B8]">
            Mathematically Proven.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-normal max-w-xl text-center leading-relaxed mb-10">
          Upload your resume and let our Spatial AI engine align your skills with the universe of top-tier opportunities.
        </p>

        {/* Elevated Enter with Google Button */}
        <button
          onClick={handleLogin}
          className="w-full max-w-md h-14 rounded-2xl bg-white/95 dark:bg-[#151A30]/90 hover:bg-white dark:hover:bg-[#1C223D] text-[#111827] dark:text-white font-semibold text-[15px] border border-slate-200/80 dark:border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.10)] dark:shadow-[0_20px_45px_rgba(0,0,0,0.6)] flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] cursor-pointer"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Enter with Google</span>
        </button>

        {/* Continue as Guest */}
        <button
          onClick={onGuest}
          className="mt-6 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors text-xs font-semibold tracking-widest uppercase cursor-pointer"
        >
          CONTINUE AS GUEST
        </button>
      </div>
    </div>
  );
}
