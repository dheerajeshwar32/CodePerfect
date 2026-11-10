import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { ShieldCheck } from 'lucide-react';

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
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden bg-[#F6F8FC] dark:bg-[#0E1229] z-50">
      {/* Immersive Orb Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[100px] opacity-60 animate-pulse mix-blend-screen pointer-events-none" style={{
        background: 'radial-gradient(circle, rgba(82,104,255,0.35) 0%, rgba(82,104,255,0.15) 30%, rgba(45,50,90,0.1) 60%, transparent 80%)'
      }}></div>
      
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl px-6">
        
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#151A36] border border-[#DCE6FA] dark:border-[#2B3566] text-[#5268FF] text-xs font-bold shadow-sm mb-6">
          <ShieldCheck className="w-4 h-4" />
          100% PRIVATE ON-DEVICE CAREER ENGINE
        </div>

        {/* Brand Lockup */}
        <div className="flex items-center gap-2.5 select-none mb-8">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-[13px] bg-gradient-to-br from-[#5268FF] via-[#4355E8] to-[#2D325A] shadow-[0_3px_10px_rgba(82,104,255,0.32),inset_0_1px_0_rgba(255,255,255,0.35)] border border-[#4338CA]/50 shrink-0 overflow-hidden">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L14.8 9.2L21 12L14.8 14.8L12 21L9.2 14.8L3 12L9.2 9.2L12 3Z" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" fill="rgba(255,255,255,0.18)" />
              <circle cx="12" cy="12" r="2.2" fill="#FFFFFF" />
            </svg>
          </div>
          <span className="text-[28px] font-extrabold tracking-[-0.03em] text-[#2D325A] dark:text-[#F0F4FF]">KYC</span>
        </div>

        {/* Hero Heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          <span className="text-[#2D325A] dark:text-[#F0F4FF]">Your True Potential.</span>
          <br/>
          <span className="chromatic-accent">Mathematically Proven.</span>
        </h1>
        
        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg font-normal text-[#5A628A] dark:text-[#9BA6D1] max-w-xl mx-auto mb-12 leading-relaxed">
          Upload your resume and let our on-device AI engine match your skills with top-tier engineering roles.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full max-w-lg">
          <button 
            onClick={handleLogin}
            className="group relative w-full flex items-center justify-center gap-3 bg-white dark:bg-[#1B2244] hover:bg-[#F8FAFF] dark:hover:bg-[#232C56] text-[#2D325A] dark:text-[#F0F4FF] font-bold text-lg py-5 px-6 rounded-2xl border border-[#DCE6FA] dark:border-[#2E3B75] shadow-[0_10px_25px_-5px_rgba(82,104,255,0.16)] hover:shadow-[0_14px_30px_-5px_rgba(82,104,255,0.25)] transition-transform active:scale-[0.98] overflow-hidden"
          >
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
          className="mt-6 text-xs font-semibold text-[#5A628A] dark:text-[#9BA6D1] hover:text-[#5268FF] px-4 py-2 rounded-full hover:bg-[#EEF2FF] dark:hover:bg-[#151A36] transition-colors uppercase tracking-wide"
        >
          Continue as Guest
        </button>
        
      </div>
      
      {/* Decorative Particle Grid Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-30 pointer-events-none"></div>
    </div>
  );
}
