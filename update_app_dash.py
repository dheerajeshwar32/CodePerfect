import re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Dashboard component import if not exists
if "import Dashboard" not in content:
    content = content.replace("import JobResults from './components/JobResults';", "import JobResults from './components/JobResults';\nimport Dashboard from './components/Dashboard';")

# Add Navigation Tabs in the Header
nav_html = """
        <div className="hidden sm:flex items-center gap-5">
"""

new_nav_html = """
        <div className="hidden sm:flex items-center gap-8 mr-auto ml-12">
          {user && (
            <div className="flex gap-4">
              <button 
                onClick={() => setCurrentScreen(jobMatches.length > 0 ? 'results' : 'input')}
                className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all ${currentScreen !== 'dashboard' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                Match
              </button>
              <button 
                onClick={() => setCurrentScreen('dashboard')}
                className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all flex items-center gap-2 ${currentScreen === 'dashboard' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                Dashboard
                {userProfile && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
              </button>
            </div>
          )}
        </div>
        
        <div className="hidden sm:flex items-center gap-5">
"""

content = content.replace(nav_html, new_nav_html)

# Add Dashboard screen render
screen_html = """            {currentScreen === 'results' && (
              <JobResults matches={jobMatches} userSkills={userSkillsText} onStartOver={() => setCurrentScreen('input')} />
            )}"""

new_screen_html = """            {currentScreen === 'results' && (
              <JobResults matches={jobMatches} userSkills={userSkillsText} onStartOver={() => setCurrentScreen('input')} />
            )}
            
            {currentScreen === 'dashboard' && (
              <Dashboard userProfile={userProfile} jobMatches={jobMatches} onBack={() => setCurrentScreen('results')} />
            )}"""

content = content.replace(screen_html, new_screen_html)

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated App.jsx with Dashboard")

