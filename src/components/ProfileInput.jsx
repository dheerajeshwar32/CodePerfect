import { useState } from 'react';
import { extractTextFromPDF } from '../pdfParser.js';

export default function ProfileInput({ onNext, isModelReady }) {
  const [skills, setSkills] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsExtracting(true);
    setSkills('');

    try {
      const text = await extractTextFromPDF(file);
      if (text.trim().length < 50) {
        throw new Error("No readable text found in this PDF (might be a scanned image).");
      }
      setSkills(text); 
    } catch (error) {
      alert("Could not read enough text from the PDF. Please try copying and pasting your skills manually.");
      setUploadedFileName(''); 
    }
    setIsExtracting(false);
  };

  const handleClearFile = () => {
    setSkills('');
    setUploadedFileName('');
    const fileInput = document.getElementById('resumeUpload');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="relative flex-grow w-full flex items-center justify-center p-4 sm:p-12 overflow-visible">
      
      {/* Premium Glassmorphic Card */}
      <div className="relative z-10 bg-white/60 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgb(0,0,0,0.1)] border border-white/80 w-full max-w-2xl p-8 sm:p-12 transition-all">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100/50 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse mr-2"></span>
            <span className="text-xs font-bold text-blue-800 tracking-widest uppercase">AI Profiler Active</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-tight mb-4">
            Build Your Profile
          </h2>
          <p className="text-slate-500 font-medium text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Upload your resume or enter your skills manually. Let our Edge AI engine match you with community opportunities.
          </p>
        </div>

        {/* CONDITIONAL RENDERING FOR UI STATES */}
        {isExtracting ? (
          
          /* SCANNING SPINNER */
          <div className="mb-10 flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-blue-300/50 rounded-3xl bg-blue-50/50 backdrop-blur-sm">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4 shadow-lg"></div>
            <span className="text-blue-700 font-bold tracking-wide">Processing Document...</span>
            <span className="text-xs text-blue-500 mt-2 truncate max-w-xs font-mono">{uploadedFileName}</span>
          </div>

        ) : uploadedFileName ? (
          
          /* SUCCESS BADGE */
          <div className="mb-10 flex items-center justify-between border-2 border-emerald-100 rounded-3xl p-6 bg-emerald-50/80 shadow-sm backdrop-blur-md">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-emerald-200/50 text-emerald-700 rounded-2xl shadow-sm">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <p className="font-bold text-slate-800 text-lg mb-1">Upload Successful</p>
                <p className="text-sm text-slate-500 truncate max-w-[200px] sm:max-w-xs mb-2">
                  <span className="font-mono text-slate-700">{uploadedFileName}</span>
                </p>
                <span className="text-[10px] uppercase tracking-widest text-emerald-700 font-extrabold bg-emerald-200/50 px-3 py-1 rounded-md">
                  Ready for Matching
                </span>
              </div>
            </div>
            <button 
              onClick={handleClearFile} 
              className="text-slate-400 hover:text-red-500 p-3 transition-colors bg-white rounded-2xl shadow-sm hover:bg-red-50 border border-slate-100 hover:border-red-200"
              title="Remove File"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>

        ) : (
          
          /* DUAL INPUT MODE */
          <>
            <div className="group relative flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-blue-200 rounded-3xl bg-white/50 hover:bg-blue-50/50 hover:border-blue-400 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md overflow-hidden">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-inner mb-4 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 border border-blue-100/50">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
              </div>
              <span className="text-slate-700 font-bold text-sm group-hover:text-blue-700 transition-colors">
                Click or drag PDF resume here
              </span>
              <input 
                id="resumeUpload" 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                accept=".pdf" 
                onChange={handleFileUpload}
              />
            </div>

            <div className="flex items-center my-8">
              <div className="flex-1 border-t border-slate-200/60"></div>
              <span className="px-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Or type manually</span>
              <div className="flex-1 border-t border-slate-200/60"></div>
            </div>

            <div className="mb-8 relative group">
              <textarea
                className="w-full h-36 p-6 bg-white/80 border border-slate-200 rounded-3xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all resize-none shadow-sm text-sm sm:text-base backdrop-blur-sm"
                placeholder="e.g. JavaScript, React, Python, Data Analysis..."
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              ></textarea>
            </div>
          </>
        )}

        <button 
          onClick={() => onNext(skills)}
          disabled={!skills.trim() || isExtracting || !isModelReady}
          className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-lg py-5 rounded-2xl shadow-[0_10px_20px_rgb(79,70,229,0.2)] hover:shadow-[0_15px_30px_rgb(79,70,229,0.3)] hover:-translate-y-1 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none disabled:bg-none disabled:bg-slate-300"
        >
          <span className="relative z-10 flex items-center justify-center gap-3 tracking-wide">
            {isModelReady ? "Analyze My Profile" : "Loading AI Engine..."}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </span>
        </button>
        
      </div>
    </div>
  );
}