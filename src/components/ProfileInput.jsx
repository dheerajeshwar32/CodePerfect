import { useState } from 'react';
import { extractTextFromPDF } from '../pdfParser.js';
import { FileText, Keyboard } from 'lucide-react';

function Github({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

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
      <div className="relative z-10 bg-white dark:bg-[#13182B] rounded-3xl border border-slate-200/80 dark:border-white/[0.08] shadow-sm w-full max-w-3xl p-8 sm:p-12">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-[#EEF2FF] dark:bg-[#1E264D] border border-[#C7D4FF] dark:border-[#334185] text-[#5268FF]">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5268FF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5268FF]"></span>
            </span>
            <span className="text-[10px] font-bold tracking-widest uppercase">AI Profiler Active</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1D1D1F] dark:text-white tracking-tight mb-4">
            Verify Your Skills
          </h2>
          <p className="text-[#6E6E73] dark:text-[#94A3B8] font-normal text-lg max-w-lg mx-auto leading-relaxed">
            Provide your data to match with top-tier career opportunities.
          </p>
        </div>

        {/* Custom Tabs */}
        {!uploadedFileName && !isExtracting && (
          <div className="flex bg-slate-100 dark:bg-[#0B0F19] p-1.5 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] mb-8">
            <button onClick={() => setActiveTab('pdf')} className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-xl transition-colors cursor-pointer ${activeTab === 'pdf' ? 'bg-white dark:bg-[#151A30] text-[#1D1D1F] dark:text-white font-semibold shadow-xs border border-slate-200/60 dark:border-white/[0.08]' : 'text-[#6E6E73] dark:text-[#94A3B8] hover:text-[#1D1D1F] dark:hover:text-white'}`}>
              <FileText className="w-4 h-4" /> Upload PDF
            </button>
            <button onClick={() => setActiveTab('github')} className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-xl transition-colors cursor-pointer ${activeTab === 'github' ? 'bg-white dark:bg-[#151A30] text-[#1D1D1F] dark:text-white font-semibold shadow-xs border border-slate-200/60 dark:border-white/[0.08]' : 'text-[#6E6E73] dark:text-[#94A3B8] hover:text-[#1D1D1F] dark:hover:text-white'}`}>
              <Github className="w-4 h-4" /> GitHub Proof
            </button>
            <button onClick={() => setActiveTab('manual')} className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-xl transition-colors cursor-pointer ${activeTab === 'manual' ? 'bg-white dark:bg-[#151A30] text-[#1D1D1F] dark:text-white font-semibold shadow-xs border border-slate-200/60 dark:border-white/[0.08]' : 'text-[#6E6E73] dark:text-[#94A3B8] hover:text-[#1D1D1F] dark:hover:text-white'}`}>
              <Keyboard className="w-4 h-4" /> Type Manually
            </button>
          </div>
        )}

        {isExtracting ? (
          <div className="mb-10 flex flex-col items-center justify-center w-full h-56 border border-dashed border-[#E2E8F8] dark:border-[#252D58] rounded-[24px] bg-[#F4F7FF] dark:bg-[#11152B]">
            <div className="w-12 h-12 border-2 border-[#E2E8F8] dark:border-[#252D58] border-t-[#5268FF] rounded-full animate-spin mb-4"></div>
            <span className="text-[#2D325A] dark:text-[#F0F4FF] font-medium tracking-wide">
              {activeTab === 'github' ? 'Scanning Public Repositories...' : 'Processing Document...'}
            </span>
            <span className="text-xs text-[#848DB3] dark:text-[#6E78A3] mt-2 truncate max-w-xs">{uploadedFileName || githubUsername}</span>
          </div>
        ) : uploadedFileName ? (
          <div className="mb-10 flex flex-col sm:flex-row items-center justify-between border border-[#059669]/30 rounded-[24px] p-6 bg-[#ECFDF5] dark:bg-[#064E3B]/20">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 flex items-center justify-center bg-[#059669]/20 text-[#059669] rounded-xl border border-[#059669]/30">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <p className="font-bold text-[#2D325A] dark:text-[#F0F4FF] text-lg mb-1">Verification Successful</p>
                <p className="text-sm text-[#059669] truncate max-w-[200px] sm:max-w-sm mb-1.5 font-normal">
                  {uploadedFileName}
                </p>
                <span className="text-[10px] uppercase tracking-widest text-[#059669] font-bold bg-[#059669]/10 px-2.5 py-1 rounded">
                  Ready for Spatial Match
                </span>
              </div>
            </div>
            <button 
              onClick={handleClear} 
              className="mt-4 sm:mt-0 text-[#848DB3] hover:text-red-400 p-3 transition-colors bg-[#F4F7FF] dark:bg-[#11152B] rounded-xl hover:bg-[#EEF2FF] dark:hover:bg-[#1E264D] border border-[#E2E8F8] dark:border-[#252D58] active:scale-95"
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
              <div className="group relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-[#C7D4FF] dark:border-[#334185] hover:border-[#5268FF] rounded-2xl transition-colors cursor-pointer overflow-hidden bg-[radial-gradient(circle_at_50%_45%,#EBF0FF_0%,#F6F8FC_55%,#FFFFFF_100%)] dark:bg-[radial-gradient(circle_at_50%_45%,#1D254E_0%,#131836_60%,#0E1229_100%)]">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#1A2142] border border-[#E2E8F8] dark:border-[#2E3A72] shadow-[0_8px_24px_rgba(82,104,255,0.18)] flex items-center justify-center text-[#5268FF] mx-auto mb-3 group-hover:-translate-y-1 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                </div>
                <span className="text-[#5A628A] dark:text-[#9BA6D1] font-medium text-sm transition-colors tracking-wide hover:text-[#2D325A] dark:hover:text-[#F0F4FF]">
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
              <div className="w-full flex flex-col h-48 border border-slate-200/80 dark:border-white/[0.08] rounded-2xl bg-slate-50 dark:bg-[#0B0F19] p-6 sm:p-8">
                <label className="text-[#1D1D1F] dark:text-white font-medium mb-3">GitHub Username</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868B] dark:text-[#94A3B8]">github.com/</span>
                    <input 
                      type="text"
                      className="w-full bg-white dark:bg-[#13182B] border border-slate-200/80 dark:border-white/[0.08] rounded-xl py-3.5 pl-[105px] pr-4 text-[#1D1D1F] dark:text-white text-base md:text-sm focus:outline-none focus:border-[#5268FF]/50"
                      placeholder="username"
                      value={githubUsername}
                      onChange={(e) => setGithubUsername(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleScanGithub()}
                    />
                  </div>
                  <button 
                    onClick={handleScanGithub}
                    disabled={!githubUsername}
                    className="bg-[#EEF2FF] dark:bg-[#1E264D] hover:bg-[#E0E7FF] text-[#5268FF] border border-[#C7D4FF] dark:border-[#334185] font-semibold px-6 rounded-xl transition-colors disabled:opacity-50 cursor-pointer text-sm"
                  >
                    Scan
                  </button>
                </div>
                {githubError && <p className="text-red-500 text-sm mt-3">{githubError}</p>}
                <p className="text-[#86868B] dark:text-[#94A3B8] text-xs mt-3 font-normal">
                  We instantly scan your public repositories to build a mathematically backed Proof-of-Work profile.
                </p>
              </div>
            )}

            {activeTab === 'manual' && (
              <textarea
                className="w-full h-48 p-6 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200/80 dark:border-white/[0.08] rounded-2xl text-[#1D1D1F] dark:text-white placeholder-[#86868B] dark:placeholder-[#94A3B8] focus:outline-none focus:border-[#5268FF]/50 transition-colors resize-none text-base md:text-sm font-normal shadow-xs"
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
          className="w-full relative flex items-center justify-center gap-3 bg-[#5268FF] hover:bg-[#4256E8] text-white font-semibold text-lg py-5 rounded-2xl transition-transform active:scale-[0.98] shadow-[0_6px_20px_rgba(82,104,255,0.3)] border-none disabled:bg-[#E8EEFF] dark:disabled:bg-[#1E264D] disabled:text-[#5268FF]/70 dark:disabled:text-[#7C8EE8] disabled:cursor-not-allowed disabled:shadow-none"
        >
          <span className="tracking-wide">
            {isModelReady ? "Enter Spatial Dashboard" : "Preparing AI Engine..."}
          </span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
        
      </div>
    </div>
  );
}
