import { useState } from 'react';
import { extractTextFromPDF } from '../pdfParser.js';

export default function ProfileInput({ onNext, isModelReady }) {
  const [skills, setSkills] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [parsedProfile, setParsedProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('pdf'); // 'pdf' | 'github' | 'manual'
  const [githubUsername, setGithubUsername] = useState('');
  const [githubError, setGithubError] = useState('');

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
      
      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: text })
      });
      
      if (!res.ok) {
         setSkills(text);
         setIsExtracting(false);
         return;
      }
      
      const parsedData = await res.json();
      if (parsedData.skills && parsedData.skills.length > 0) {
         setSkills(parsedData.skills.join(', '));
      } else {
         setSkills(text); 
      }
      setParsedProfile(parsedData);
    } catch (error) {
      console.error(error);
      alert("Could not read or parse the PDF perfectly. Please paste your skills manually.");
      setUploadedFileName(''); 
    }
    setIsExtracting(false);
  };

  const handleScanGithub = async () => {
    if (!githubUsername) return;
    setIsExtracting(true);
    setGithubError('');
    setSkills('');
    try {
      const res = await fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100`);
      if (!res.ok) throw new Error("GitHub user not found");
      const repos = await res.json();
      
      const langs = {};
      repos.forEach(repo => {
        if (repo.language) {
          langs[repo.language] = (langs[repo.language] || 0) + 1;
        }
      });
      
      const sortedLangs = Object.entries(langs).sort((a,b) => b[1] - a[1]).map(e => e[0]);
      
      if (sortedLangs.length === 0) {
         setGithubError("No public repositories with languages found.");
      } else {
         const foundSkills = sortedLangs.join(', ');
         setSkills(foundSkills);
         setParsedProfile({
           skills: sortedLangs,
           summary: `Verified via GitHub Proof-of-Work from @${githubUsername}. Top languages: ${foundSkills}`
         });
         setUploadedFileName(`github.com/${githubUsername}`);
      }
    } catch (err) {
      setGithubError(err.message);
    }
    setIsExtracting(false);
  };

  const handleClear = () => {
    setSkills('');
    setUploadedFileName('');
    setParsedProfile(null);
    setGithubUsername('');
    setGithubError('');
    const fileInput = document.getElementById('resumeUpload');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="relative flex-grow w-full flex items-center justify-center p-4 sm:p-12 overflow-visible z-10">
      <div className="relative z-10 bg-navy-900/60 backdrop-blur-2xl rounded-[32px] border border-apple-border shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-3xl p-8 sm:p-12 transition-all">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-bold tracking-widest uppercase">AI Profiler Active</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Verify Your Skills
          </h2>
          <p className="text-slate-400 font-light text-lg max-w-lg mx-auto leading-relaxed">
            Provide your data to mathematically match with the universe of top-tier opportunities.
          </p>
        </div>

        {/* Custom Tabs */}
        {!uploadedFileName && !isExtracting && (
          <div className="flex bg-navy-950/50 p-1.5 rounded-2xl border border-white/5 mb-8">
            <button onClick={() => setActiveTab('pdf')} className={`flex-1 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === 'pdf' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
              📄 Upload PDF
            </button>
            <button onClick={() => setActiveTab('github')} className={`flex-1 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === 'github' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
              🐙 GitHub Proof
            </button>
            <button onClick={() => setActiveTab('manual')} className={`flex-1 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === 'manual' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
              ⌨️ Type Manually
            </button>
          </div>
        )}

        {isExtracting ? (
          <div className="mb-10 flex flex-col items-center justify-center w-full h-56 border border-dashed border-white/10 rounded-[24px] bg-white/5 backdrop-blur-sm">
            <div className="w-12 h-12 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <span className="text-white font-medium tracking-wide">
              {activeTab === 'github' ? 'Scanning Public Repositories...' : 'Processing Document...'}
            </span>
            <span className="text-xs text-slate-400 mt-2 truncate max-w-xs">{uploadedFileName || githubUsername}</span>
          </div>
        ) : uploadedFileName ? (
          <div className="mb-10 flex flex-col sm:flex-row items-center justify-between border border-emerald-500/30 rounded-[24px] p-6 bg-emerald-500/5 backdrop-blur-sm shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 flex items-center justify-center bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <p className="font-bold text-white text-lg mb-1">Verification Successful</p>
                <p className="text-sm text-emerald-400 truncate max-w-[200px] sm:max-w-sm mb-1.5 font-light">
                  {uploadedFileName}
                </p>
                <span className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-1 rounded">
                  Ready for Spatial Match
                </span>
              </div>
            </div>
            <button 
              onClick={handleClear} 
              className="mt-4 sm:mt-0 text-slate-400 hover:text-red-400 p-3 transition-colors bg-white/5 rounded-xl hover:bg-white/10 border border-white/5 active:scale-95"
              title="Remove"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        ) : (
          <div className="mb-10 relative">
            {activeTab === 'pdf' && (
              <div className="group relative flex flex-col items-center justify-center w-full h-48 border border-dashed border-apple-border rounded-[24px] bg-navy-900/50 hover:bg-navy-900 hover:border-blue-500/50 transition-all duration-300 cursor-pointer overflow-hidden shadow-sm">
                <div className="w-14 h-14 flex items-center justify-center bg-white/5 rounded-2xl mb-4 group-hover:-translate-y-1 transition-all duration-300 border border-white/10 text-slate-400 group-hover:text-blue-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                </div>
                <span className="text-slate-400 font-medium text-sm transition-colors tracking-wide group-hover:text-white">
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
            )}

            {activeTab === 'github' && (
              <div className="w-full flex flex-col h-48 border border-apple-border rounded-[24px] bg-navy-900/50 p-8 shadow-sm">
                <label className="text-slate-300 font-medium mb-3">GitHub Username</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">github.com/</span>
                    <input 
                      type="text"
                      className="w-full bg-navy-950 border border-white/10 rounded-xl py-4 pl-[100px] pr-4 text-white focus:outline-none focus:border-blue-500/50"
                      placeholder="username"
                      value={githubUsername}
                      onChange={(e) => setGithubUsername(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleScanGithub()}
                    />
                  </div>
                  <button 
                    onClick={handleScanGithub}
                    disabled={!githubUsername}
                    className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 rounded-xl border border-white/5 transition-colors disabled:opacity-50"
                  >
                    Scan
                  </button>
                </div>
                {githubError && <p className="text-red-400 text-sm mt-4">{githubError}</p>}
                <p className="text-slate-500 text-sm mt-4 font-light">
                  We instantly scan your public repositories to build a mathematically backed Proof-of-Work profile.
                </p>
              </div>
            )}

            {activeTab === 'manual' && (
              <textarea
                className="w-full h-48 p-6 bg-navy-900/50 border border-apple-border rounded-[24px] text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all resize-none text-base font-light shadow-sm"
                placeholder="e.g. JavaScript, React, Python, Data Analysis..."
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              ></textarea>
            )}
          </div>
        )}

        <button 
          onClick={() => onNext(skills, parsedProfile)}
          disabled={!skills.trim() || isExtracting || !isModelReady}
          className="w-full relative flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-lg py-5 rounded-2xl hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(59,130,246,0.3)] border border-white/10"
        >
          <span className="tracking-wide">
            {isModelReady ? "Enter Spatial Dashboard" : "Initializing Deep Engine..."}
          </span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
        
      </div>
    </div>
  );
}