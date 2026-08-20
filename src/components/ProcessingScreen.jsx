export default function ProcessingScreen({ onComplete }) {
  return (
    <div className="max-w-2xl mx-auto mt-16 p-12 bg-white rounded-2xl shadow-xl border border-gray-100 text-center flex flex-col items-center">
      
      {/* Animated Tailwind Spinner */}
      <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
      
      <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
        Processing Your Profile
      </h2>
      <p className="text-gray-500 mb-8 max-w-md">
        Please wait while our Edge AI analyzes your skills and runs local vector math to find your perfect job matches...
      </p>

      {/* Fixed: Now it actually calls onComplete to force-skip */}
      <button 
        onClick={onComplete}
        className="text-sm text-blue-600 font-semibold hover:underline transition-colors bg-blue-50 px-4 py-2 rounded-lg"
      >
        Skip to Results (Dev Mode) 🚀
      </button>
    </div>
  );
}