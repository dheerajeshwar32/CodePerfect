import { useState } from 'react';
import { extractTextFromPDF } from '../pdfParser.js';

export default function ProfileInput({ onNext, isModelReady }) {
  const [skills, setSkills] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [parsedProfile, setParsedProfile] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsExtracting(true);
    setSkills('');

    try {
      // 1. Extract raw text via browser PDF.js
      const text = await extractTextFromPDF(file);
      if (text.trim().length < 50) {
        throw new Error("No readable text found in this PDF (might be a scanned image).");
      }
      
      // 2. Pass raw text to Vercel Gemini Parser
      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: text })
      });
      
      if (!res.ok) {
         // Fallback to raw text matching if backend limits hit
         setSkills(text);
         setIsExtracting(false);
         return;
      }
      
      const parsedData = await res.json();
      
      // parsedData has { skills: [], experienceYears: num, summary: str }
      if (parsedData.skills && parsedData.skills.length > 0) {
         setSkills(parsedData.skills.join(', '));
      } else {
         setSkills(text); // Fallback
      }
      
      // Wait for user to click "Analyze My Profile" but we can store this profile info 
      // by passing it to onNext when clicked. For now we just keep it in a state.
      // Wait, we need to pass it to App.jsx. Let's add local state.
      setParsedProfile(parsedData);
      
    } catch (error) {
      console.error(error);
      alert("Could not read or parse the PDF perfectly. Please paste your skills manually.");
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
      
      <div className="relative z-10 bg-navy-900 backdrop-blur-2xl rounded-[32px] border border-apple-border shadow-apple w-full max-w-3xl p-8 sm:p-12 transition-all">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-bold tracking-widest uppercase">AI Profiler Active</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Build Your Profile
          </h2>
          <p className="text-slate-400 font-light text-lg max-w-lg mx-auto leading-relaxed">
            Upload your resume or enter your skills manually. Let our AI engine match you with top-tier opportunities.
          </p>
        </div>

        {isExtracting ? (
          
          <div className="mb-10 flex flex-col items-center justify-center w-full h-56 border border-dashed border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
            <div className="w-12 h-12 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <span className="text-white font-medium tracking-wide">Processing Document</span>
            <span className="text-xs text-slate-400 mt-2 truncate max-w-xs">{uploadedFileName}</span>
          </div>

        ) : uploadedFileName ? (
          
          <div className="mb-10 flex items-center justify-between border border-white/10 rounded-2xl p-6 bg-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 flex items-center justify-center bg-blue-500/10 text-blue-400 rounded-xl border border-white/5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <p className="font-bold text-white text-lg mb-1">Upload Successful</p>
                <p className="text-sm text-slate-400 truncate max-w-[200px] sm:max-w-sm mb-1.5 font-light">
                  {uploadedFileName}
                </p>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold bg-white/5 px-2.5 py-1 rounded">
                  Ready for Matching
                </span>
              </div>
            </div>
            <button 
              onClick={handleClearFile} 
              className="text-slate-400 hover:text-red-400 p-3 transition-colors bg-white/5 rounded-xl hover:bg-white/10 border border-white/5 active:scale-95"
              title="Remove File"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>

        ) : (
          
          <>
            <div className="group relative flex flex-col items-center justify-center w-full h-48 border border-dashed border-apple-border rounded-[24px] bg-navy-900/50 hover:bg-navy-900 hover:border-blue-500/50 transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-sm shadow-sm">
              <div className="w-14 h-14 flex items-center justify-center bg-apple-border/50 rounded-2xl mb-4 group-hover:-translate-y-1 transition-all duration-300 border border-apple-border text-slate-400 group-hover:text-blue-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
              </div>
              <span className="text-slate-400 font-medium text-sm transition-colors tracking-wide group-hover:text-slate-300">
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
              <div className="flex-1 border-t border-apple-border"></div>
              <span className="px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Or type manually</span>
              <div className="flex-1 border-t border-apple-border"></div>
            </div>

            <div className="mb-10 relative group">
              <textarea
                className="w-full h-40 p-6 bg-navy-900/50 border border-apple-border rounded-[24px] text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none text-base font-light shadow-sm"
                placeholder="e.g. JavaScript, React, Python, Data Analysis..."
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              ></textarea>
            </div>
          </>
        )}

        <button 
          onClick={() => onNext(skills, parsedProfile)}
          disabled={!skills.trim() || isExtracting || !isModelReady}
          className="w-full relative flex items-center justify-center gap-3 bg-blue-600 text-white font-medium text-lg py-5 rounded-2xl hover:bg-blue-500 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 border border-blue-500/50"
        >
          <span className="tracking-wide">
            {isModelReady ? "Analyze My Profile" : "Loading AI Engine..."}
          </span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
        
      </div>
    </div>
  );
}