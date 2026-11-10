export default function ProcessingScreen({ onComplete }) {
  return (
    <div className="max-w-2xl mx-auto mt-20 p-12 bg-white dark:bg-[#13182B] rounded-3xl border border-slate-200/80 dark:border-white/[0.08] shadow-sm text-center flex flex-col items-center relative overflow-hidden">
      
      <div className="relative z-10 w-14 h-14 border-2 border-slate-200 dark:border-white/[0.08] border-t-[#5268FF] rounded-full animate-spin mb-8"></div>
      
      <h2 className="relative z-10 text-3xl font-extrabold text-[#1D1D1F] dark:text-white mb-3 tracking-tight">
        Analyzing Profile
      </h2>
      <p className="relative z-10 text-[#6E6E73] dark:text-[#94A3B8] text-base mb-8 leading-relaxed font-normal max-w-md">
        Analyzing your skills with our private on-device AI to find your best career matches...
      </p>

      <button 
        onClick={onComplete}
        className="relative z-10 text-[11px] font-bold text-[#86868B] hover:text-[#5268FF] dark:hover:text-white uppercase tracking-widest transition-colors bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] px-6 py-2.5 rounded-full border border-slate-200/80 dark:border-white/[0.08] cursor-pointer"
      >
        Skip to Results
      </button>
    </div>
  );
}
