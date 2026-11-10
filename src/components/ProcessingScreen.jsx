export default function ProcessingScreen({ onComplete }) {
  return (
    <div className="max-w-2xl mx-auto mt-20 p-12 bg-white/95 dark:bg-[#151A36]/95 backdrop-blur-xl rounded-3xl border border-[#E2E8F8] dark:border-[#252D58] shadow-[0_10px_35px_-10px_rgba(45,50,90,0.06)] text-center flex flex-col items-center relative overflow-hidden">
      
      <div className="relative z-10 w-16 h-16 border-2 border-[#E2E8F8] dark:border-[#252D58] border-t-[#5268FF] rounded-full animate-spin mb-8 shadow-sm"></div>
      
      <h2 className="relative z-10 text-3xl font-extrabold text-[#2D325A] dark:text-[#F0F4FF] mb-4 tracking-tight">
        Analyzing Profile
      </h2>
      <p className="relative z-10 text-[#5A628A] dark:text-[#9BA6D1] text-lg mb-10 leading-relaxed font-normal max-w-md">
        Analyzing your skills with our private on-device AI to find your best career matches...
      </p>

      <button 
        onClick={onComplete}
        className="relative z-10 text-[10px] font-bold text-[#848DB3] hover:text-[#5268FF] uppercase tracking-widest transition-colors bg-[#F4F7FF] dark:bg-[#1B2244] px-6 py-3 rounded-full border border-[#DCE6FA] dark:border-[#2B3566] shadow-sm"
      >
        Skip to Results
      </button>
    </div>
  );
}
