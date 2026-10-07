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
      
      {/* Premium Glassmorphic Card (Aesthetic) */}
      <div className="relative z-10 bg-white/50 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-white/80 w-full max-w-3xl p-8 sm:p-12 transition-all">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center px-5 py-2 mb-6 rounded-full bg-white/70 backdrop-blur-xl border border-white text-indigo-700 shadow-sm">
            <span className="relative flex h-2.5 w-2.5 mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
            </span>
            <span className="text-xs font-extrabold tracking-widest uppercase">AI Profiler Active</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 via-purple-800 to-slate-900 tracking-tighter mb-4">
            Build Your Profile
          </h2>
          <p className="text-slate-600 font-medium text-sm sm:text-lg max-w-lg mx-auto leading-relaxed">
            Upload your resume or enter your skills manually. Let our Edge AI engine match you with community opportunities.
          </p>
        </div>

        {/* CONDITIONAL RENDERING FOR UI STATES */}
        {isExtracting ? (
          
          /* SCANNING SPINNER */
          <div className="mb-10 flex flex-col items-center justify-center w-full h-56 border-4 border-dashed border-indigo-400/50 rounded-[2rem] bg-indigo-50/50 backdrop-blur-md">
            <div className="w-14 h-14 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4 shadow-lg"></div>
            <span className="text-indigo-800 font-bold tracking-widest text-lg">Processing Document...</span>
            <span className="text-sm text-indigo-500 mt-2 truncate max-w-xs font-mono bg-white/50 px-3 py-1 rounded-lg">{uploadedFileName}</span>
          </div>

        ) : uploadedFileName ? (
          
          /* SUCCESS BADGE */
          <div className="mb-10 flex items-center justify-between border-2 border-emerald-200/50 rounded-[2rem] p-6 bg-emerald-50/50 backdrop-blur-2xl shadow-sm">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-emerald-400/20 text-emerald-600 rounded-2xl shadow-inner border border-emerald-200/50">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <p className="font-black text-emerald-950 text-xl mb-1">Upload Successful</p>
                <p className="text-sm text-emerald-700 truncate max-w-[200px] sm:max-w-sm mb-2 font-medium">
                  {uploadedFileName}
                </p>
                <span className="text-[10px] uppercase tracking-widest text-emerald-700 font-extrabold bg-emerald-200/50 px-3 py-1 rounded-md">
                  Ready for Matching
                </span>
              </div>
            </div>
            <button 
              onClick={handleClearFile} 
              className="text-slate-400 hover:text-red-500 p-4 transition-all bg-white/80 backdrop-blur-md rounded-2xl shadow-sm hover:shadow-md hover:bg-red-50 border border-white hover:border-red-200 active:scale-95"
              title="Remove File"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>

        ) : (
          
          /* DUAL INPUT MODE */
          <>
            <div className="group relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-indigo-200 rounded-[2rem] bg-white/40 hover:bg-indigo-50/50 hover:border-indigo-400 transition-all duration-300 cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_15px_40px_rgba(79,70,229,0.1)] overflow-hidden backdrop-blur-sm">
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-inner mb-4 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 border border-indigo-100/50 text-indigo-600">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
              </div>
              <span className="text-slate-700 font-extrabold text-base group-hover:text-indigo-700 transition-colors tracking-wide">
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

            <div className="flex items-center my-10">
              <div className="flex-1 border-t border-slate-300/50"></div>
              <span className="px-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Or type manually</span>
              <div className="flex-1 border-t border-slate-300/50"></div>
            </div>

            <div className="mb-10 relative group">
              <textarea
                className="w-full h-40 p-6 bg-white/60 backdrop-blur-xl border border-white rounded-[2rem] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all resize-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-base sm:text-lg font-medium"
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
          className="w-full relative overflow-hidden bg-gradient-to-r from-[#5668FF] to-purple-600 text-white font-black text-xl py-6 rounded-[2rem] shadow-[0_15px_30px_rgba(86,104,255,0.3)] hover:shadow-[0_20px_40px_rgba(86,104,255,0.4)] hover:-translate-y-1 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none disabled:bg-slate-300 disabled:from-slate-300 disabled:to-slate-300 border border-white/20"
        >
          <span className="relative z-10 flex items-center justify-center gap-4 tracking-widest uppercase">
            {isModelReady ? "Analyze My Profile" : "Loading AI Engine..."}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </span>
        </button>
        
      </div>
    </div>
  );
}