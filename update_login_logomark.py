import sys

with open('src/components/Login.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_login_logo = """<div className="relative z-10 h-16 w-auto px-6 rounded-2xl bg-white mx-auto mb-6 inline-flex items-center justify-center border border-black/5 dark:border-white/10 shadow-[0_2px_15px_rgba(0,0,0,0.1)]">
          <svg viewBox="0 0 54 24" className="h-6 w-auto text-navy-950" fill="currentColor">
             <path d="M4 4h4.5v16H4V4zm11.5 0h-5.5L4.5 12l5.5 8h5.5l-5.5-8 5.5-8z" />
             <path d="M18.5 4h4.5l4 6.4l4-6.4h4.5l-6.25 10v6h-4.5v-6l-6.25-10z" />
             <path d="M52 4h-5.5c-5.5 0-8.5 3.5-8.5 8s3 8 8.5 8h5.5v-4.5h-5.5c-3 0-4-1.5-4-3.5s1-3.5 4-3.5h5.5V4z" />
          </svg>
        </div>
        
        <h2 className="relative z-10 text-4xl font-extrabold text-white mb-1 tracking-tight uppercase">KYC</h2>
        <span className="relative z-10 block text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mb-8">AI Skill Matcher</span>"""

new_login_logo = """<div className="relative z-10 flex flex-col items-center mb-10 group">
          <svg viewBox="0 0 54 24" className="h-10 sm:h-12 w-auto mb-5 group-hover:scale-105 transition-transform duration-500 drop-shadow-2xl" fill="currentColor">
             <path className="text-white transition-colors" d="M4 4h4.5v16H4V4zm11.5 0h-5.5L4.5 12l5.5 8h5.5l-5.5-8 5.5-8z" />
             <path className="text-blue-500 drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]" d="M18.5 4h4.5l4 6.4l4-6.4h4.5l-6.25 10v6h-4.5v-6l-6.25-10z" />
             <path className="text-white transition-colors" d="M52 4h-5.5c-5.5 0-8.5 3.5-8.5 8s3 8 8.5 8h5.5v-4.5h-5.5c-3 0-4-1.5-4-3.5s1-3.5 4-3.5h5.5V4z" />
          </svg>
          <span className="block text-[11px] font-bold text-slate-400 tracking-[0.35em] uppercase">AI Skill Matcher</span>
        </div>"""

content = content.replace(old_login_logo, new_login_logo)

with open('src/components/Login.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated Login.jsx successfully')

