export default function ProcessingScreen({ onComplete }) {
  return (
    <div className="max-w-2xl mx-auto mt-20 p-12 bg-navy-900/50 backdrop-blur-md rounded-3xl border border-white/5 text-center flex flex-col items-center relative overflow-hidden">
      
      <div className="relative z-10 w-16 h-16 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-8"></div>
      
      <h2 className="relative z-10 text-3xl font-bold text-white mb-4 tracking-tight">
        Analyzing Profile
      </h2>
      <p className="relative z-10 text-slate-400 text-lg mb-10 leading-relaxed font-light max-w-md">
        Running edge vector operations to find optimal career matches based on your skills...
      </p>

      <button 
        onClick={onComplete}
        className="relative z-10 text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors bg-white/5 hover:bg-white/10 px-6 py-3 rounded-full border border-white/5"
      >
        Skip to Results
      </button>
    </div>
  );
}