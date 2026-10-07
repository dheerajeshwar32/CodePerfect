export default function ProcessingScreen({ onComplete }) {
  return (
    <div className="max-w-2xl mx-auto mt-20 p-12 bg-white/50 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-white/80 text-center flex flex-col items-center relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[150%] h-[150%] bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-emerald-500/10 blur-[60px] animate-pulse"></div>
      </div>

      <div className="relative z-10 w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-8 shadow-[0_0_30px_rgba(79,70,229,0.3)]"></div>
      
      <h2 className="relative z-10 text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 via-purple-800 to-slate-900 mb-4 tracking-tighter">
        Processing Profile
      </h2>
      <p className="relative z-10 text-slate-600 text-lg mb-10 leading-relaxed font-medium max-w-md">
        Running edge vector math to find your absolute best job matches...
      </p>

      <button 
        onClick={onComplete}
        className="relative z-10 text-sm font-bold text-indigo-500 hover:text-indigo-700 transition-all bg-white/60 hover:bg-white backdrop-blur-md px-6 py-3 rounded-xl border border-white/50 shadow-sm hover:shadow-md"
      >
        Skip to Results (Dev Mode)
      </button>
    </div>
  );
}