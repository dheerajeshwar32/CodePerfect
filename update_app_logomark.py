import sys

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_header_logo = """<div className="flex items-center gap-4">
          <div className="h-10 shrink-0 flex items-center justify-center bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.1)] border border-black/5 dark:border-white/10 relative overflow-hidden group px-3">
            <svg viewBox="0 0 54 24" className="h-4 w-auto text-navy-950 group-hover:scale-105 transition-transform duration-500" fill="currentColor">
               <path d="M4 4h4.5v16H4V4zm11.5 0h-5.5L4.5 12l5.5 8h5.5l-5.5-8 5.5-8z" />
               <path d="M18.5 4h4.5l4 6.4l4-6.4h4.5l-6.25 10v6h-4.5v-6l-6.25-10z" />
               <path d="M52 4h-5.5c-5.5 0-8.5 3.5-8.5 8s3 8 8.5 8h5.5v-4.5h-5.5c-3 0-4-1.5-4-3.5s1-3.5 4-3.5h5.5V4z" />
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
        </div>"""

new_header_logo = """<div className="flex items-center gap-4 group cursor-pointer">
          <svg viewBox="0 0 54 24" className="h-7 w-auto group-hover:scale-105 transition-transform duration-500" fill="currentColor">
             <path className="text-white transition-colors" d="M4 4h4.5v16H4V4zm11.5 0h-5.5L4.5 12l5.5 8h5.5l-5.5-8 5.5-8z" />
             <path className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" d="M18.5 4h4.5l4 6.4l4-6.4h4.5l-6.25 10v6h-4.5v-6l-6.25-10z" />
             <path className="text-white transition-colors" d="M52 4h-5.5c-5.5 0-8.5 3.5-8.5 8s3 8 8.5 8h5.5v-4.5h-5.5c-3 0-4-1.5-4-3.5s1-3.5 4-3.5h5.5V4z" />
          </svg>
          
          <div className="h-8 w-px bg-white/10 mx-1"></div>
          
          <div className="flex flex-col justify-center">
            <span className="text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase leading-tight">
              AI Skill<br/>Matcher
            </span>
          </div>
        </div>"""

content = content.replace(old_header_logo, new_header_logo)

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated App.jsx successfully')

