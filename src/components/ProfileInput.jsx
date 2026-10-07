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
    <div className="relative flex-grow w-full flex items-center justify-center p-4 sm:p-12">
      
      {/* Clean Minimalist Card */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 w-full max-w-2xl p-8 sm:p-12 transition-all">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Build Your Profile
          </h2>
          <p className="text-slate-500 font-medium text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Upload your resume or enter your skills manually. Let our engine match you with community opportunities.
          </p>
        </div>

        {/* CONDITIONAL RENDERING FOR UI STATES */}
        {isExtracting ? (
          
          /* SCANNING SPINNER */
          <div className="mb-10 flex flex-col items-center justify-center w-full h-48 border border-dashed border-slate-300 rounded-2xl bg-slate-50">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
            <span className="text-slate-700 font-semibold text-sm">Processing Document...</span>
            <span className="text-xs text-slate-500 mt-2 truncate max-w-xs font-mono">{uploadedFileName}</span>
          </div>

        ) : uploadedFileName ? (
          
          /* SUCCESS BADGE */
          <div className="mb-10 flex items-center justify-between border border-slate-200 rounded-2xl p-5 bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm mb-0.5">Upload Successful</p>
                <p className="text-xs text-slate-500 truncate max-w-[200px] sm:max-w-xs font-mono">
                  {uploadedFileName}
                </p>
              </div>
            </div>
            <button 
              onClick={handleClearFile} 
              className="text-slate-400 hover:text-slate-700 p-2 transition-colors rounded-lg hover:bg-slate-100"
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
            <div className="group relative flex flex-col items-center justify-center w-full h-40 border border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-slate-100 hover:border-slate-400 transition-all cursor-pointer">
              <div className="mb-3 text-slate-400 group-hover:text-slate-600 transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
              </div>
              <span className="text-slate-600 font-medium text-sm group-hover:text-slate-900 transition-colors">
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
              <div className="flex-1 border-t border-slate-200"></div>
              <span className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Or type manually</span>
              <div className="flex-1 border-t border-slate-200"></div>
            </div>

            <div className="mb-8">
              <textarea
                className="w-full h-32 p-5 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all resize-none text-sm"
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
          className="w-full bg-slate-900 text-white font-semibold text-sm py-4 rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isModelReady ? "Analyze My Profile" : "Loading..."}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
        
      </div>
    </div>
  );
}