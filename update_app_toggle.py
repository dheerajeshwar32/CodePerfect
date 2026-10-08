import sys

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add isDarkMode state
content = content.replace(
    'const [isAuthLoaded, setIsAuthLoaded] = useState(false);',
    'const [isAuthLoaded, setIsAuthLoaded] = useState(false);\n  const [isDarkMode, setIsDarkMode] = useState(true);'
)

# Add useEffect for dark mode
effect_code = '''
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);
'''
content = content.replace(
    'useEffect(() => {\n    // Fetch the jobs data',
    effect_code + '\n  useEffect(() => {\n    // Fetch the jobs data'
)

# Replace the logo block
old_logo = '''<div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-400 flex items-center justify-center border border-white/10 shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.15)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay"></div>
            <svg className="w-6 h-6 relative z-10 group-hover:scale-110 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" className="fill-blue-500/20 text-blue-400" />
              <path d="M12 2v4" />
              <path d="M12 18v4" />
              <path d="M4.93 4.93l2.83 2.83" />
              <path d="M16.24 16.24l2.83 2.83" />
              <path d="M2 12h4" />
              <path d="M18 12h4" />
              <path d="M4.93 19.07l2.83-2.83" />
              <path d="M16.24 7.76l2.83-2.83" />
              <circle cx="12" cy="12" r="9" className="stroke-white/10" strokeDasharray="4 4" />
            </svg>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center">
              KYC
            </h1>
            <span className="hidden sm:flex bg-blue-500/10 text-blue-400 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border border-blue-500/20">
              AI SKILL MATCHER
            </span>
          </div>
        </div>'''

new_logo = '''<div className="flex items-center gap-4">
          <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-white rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.1)] border border-black/5 dark:border-white/10 relative overflow-hidden group">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-navy-950 group-hover:scale-110 transition-transform duration-500" fill="currentColor">
               <path d="M4 4h4v16H4V4zm5 8l8-8h4l-8 8 8 8h-4l-8-8z" />
            </svg>
          </div>
          
          <div className="flex flex-col justify-center">
            <h1 className="text-xl font-extrabold text-white tracking-tight leading-none uppercase">
              KYC
            </h1>
            <span className="text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1">
              AI Skill Matcher
            </span>
          </div>
        </div>'''

content = content.replace(old_logo, new_logo)

old_header_right = '''<div className="flex items-center gap-2 bg-navy-900 border border-white/5 px-3 py-1.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isModelReady ? 'bg-blue-400' : 'bg-slate-500'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isModelReady ? 'bg-blue-500' : 'bg-slate-500'}`}></span>
            </span>
            <span className="text-[10px] font-bold text-slate-300 tracking-widest uppercase">
              {isModelReady ? 'Engine Ready' : 'Initializing'}
            </span>
          </div>'''

new_header_right = old_header_right + '''
          
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-12 h-6 rounded-full bg-navy-900 border border-white/10 relative flex items-center px-1 transition-colors duration-300 focus:outline-none"
            aria-label="Toggle theme"
          >
            <div className={`w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-sm transition-transform duration-300 ${!isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}>
              {isDarkMode ? (
                <svg className="w-2.5 h-2.5 text-navy-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-2.5 h-2.5 text-navy-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </div>
          </button>'''

content = content.replace(old_header_right, new_header_right)

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated App.jsx successfully')

