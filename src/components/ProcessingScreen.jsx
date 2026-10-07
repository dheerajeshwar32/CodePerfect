export default function ProcessingScreen({ onComplete }) {
  return (
    <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 text-center flex flex-col items-center">
      
      <div className="w-10 h-10 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-6"></div>
      
      <h2 className="text-2xl font-bold text-slate-900 mb-3">
        Processing Profile
      </h2>
      <p className="text-slate-500 text-sm mb-8 leading-relaxed">
        Analyzing your skills and finding your perfect matches...
      </p>

      <button 
        onClick={onComplete}
        className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-lg border border-slate-200"
      >
        Skip to Results (Dev Mode)
      </button>
    </div>
  );
}