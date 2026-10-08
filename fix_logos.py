import re

with open('src/components/Login.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the whole logo block inside Login.jsx
old_logo_regex = r'<div className="relative z-10 flex flex-col items-center mb-10 group">.*?<span className="block text-\[11px\] font-bold text-slate-400 tracking-\[0\.35em\] uppercase">AI Skill Matcher</span>\s*</div>'

new_logo = '''<div className="relative z-10 flex flex-col items-center mb-12 group">
          <svg viewBox="0 0 160 50" className="h-12 sm:h-14 w-auto group-hover:scale-[1.03] transition-transform duration-700 ease-out drop-shadow-[0_0_20px_rgba(249,203,40,0.15)]" fill="none">
             <path d="M25 10 V40 M50 10 L31 25 L50 40" stroke="url(#apple-siri)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
             <path d="M70 10 L85 25 L100 10 M85 25 V40" stroke="url(#apple-siri)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
             <path d="M137 14 A 15 15 0 1 0 137 36" stroke="url(#apple-siri)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
             <defs>
               <linearGradient id="apple-siri" x1="25" y1="10" x2="137" y2="40" gradientUnits="userSpaceOnUse">
                 <stop offset="0%" stopColor="#FF2A54" />
                 <stop offset="33%" stopColor="#FF9B00" />
                 <stop offset="66%" stopColor="#00F0FF" />
                 <stop offset="100%" stopColor="#A800FF" />
               </linearGradient>
             </defs>
          </svg>
        </div>'''

content = re.sub(old_logo_regex, new_logo, content, flags=re.DOTALL)

with open('src/components/Login.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    app_content = f.read()

old_app_logo_regex = r'<div className="flex items-center gap-4 group cursor-pointer">.*?<span className="text-\[9px\] font-bold text-slate-400 tracking-\[0\.2em\] uppercase leading-tight">\s*AI Skill<br/>Matcher\s*</span>\s*</div>\s*</div>'

new_app_logo = '''<div className="flex items-center gap-4 group cursor-pointer">
          <svg viewBox="0 0 160 50" className="h-8 w-auto group-hover:scale-105 transition-transform duration-500 drop-shadow-[0_0_12px_rgba(0,240,255,0.2)]" fill="none">
             <path d="M25 10 V40 M50 10 L31 25 L50 40" stroke="url(#apple-siri-app)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
             <path d="M70 10 L85 25 L100 10 M85 25 V40" stroke="url(#apple-siri-app)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
             <path d="M137 14 A 15 15 0 1 0 137 36" stroke="url(#apple-siri-app)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
             <defs>
               <linearGradient id="apple-siri-app" x1="25" y1="10" x2="137" y2="40" gradientUnits="userSpaceOnUse">
                 <stop offset="0%" stopColor="#FF2A54" />
                 <stop offset="33%" stopColor="#FF9B00" />
                 <stop offset="66%" stopColor="#00F0FF" />
                 <stop offset="100%" stopColor="#A800FF" />
               </linearGradient>
             </defs>
          </svg>
        </div>'''

app_content = re.sub(old_app_logo_regex, new_app_logo, app_content, flags=re.DOTALL)

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(app_content)

