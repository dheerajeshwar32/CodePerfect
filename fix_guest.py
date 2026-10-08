import re

# Fix Login.jsx text
with open('src/components/Login.jsx', 'r', encoding='utf-8') as f:
    login = f.read()

login = login.replace('Enter the Arena &rarr;', 'Get Started &rarr;')

with open('src/components/Login.jsx', 'w', encoding='utf-8') as f:
    f.write(login)

# Fix App.jsx Header User Section
with open('src/App.jsx', 'r', encoding='utf-8') as f:
    app = f.read()

old_user_block = """          {(user || isGuest) && (
            <div className="flex items-center gap-3 pr-5 border-r border-white/5">
              {user ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-white/10" 
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
              
              <div className="hidden md:flex flex-col">
                <span className="text-xs font-bold text-white leading-tight">
                  {user ? user.displayName : 'Guest User'}
                </span>
                <button 
                  onClick={handleSignOut}
                  className="text-[10px] text-slate-500 hover:text-white text-left transition-colors font-medium tracking-wide uppercase mt-0.5"
                >
                  {user ? 'Sign Out' : 'Sign In'}
                </button>
              </div>
            </div>
          )}"""

new_user_block = """          {(user || isGuest) && (
            <div className="flex items-center gap-3 pr-5 border-r border-white/5">
              {user ? (
                <>
                  <img 
                    src={user.photoURL} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full border border-white/10" 
                  />
                  <div className="hidden md:flex flex-col">
                    <span className="text-xs font-bold text-white leading-tight">
                      {user.displayName}
                    </span>
                    <button 
                      onClick={handleSignOut}
                      className="text-[10px] text-slate-500 hover:text-white text-left transition-colors font-medium tracking-wide uppercase mt-0.5"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <button 
                  onClick={handleSignOut}
                  className="text-xs font-bold text-white bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          )}"""

app = app.replace(old_user_block, new_user_block)

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(app)
