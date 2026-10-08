import sys

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_logo = """<div className="w-10 h-10 shrink-0 flex items-center justify-center bg-white rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.1)] border border-black/5 dark:border-white/10 relative overflow-hidden group">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-navy-950 group-hover:scale-110 transition-transform duration-500" fill="currentColor">
               <path d="M4 4h4v16H4V4zm5 8l8-8h4l-8 8 8 8h-4l-8-8z" />
            </svg>
          </div>"""

new_logo = """<div className="h-10 shrink-0 flex items-center justify-center bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.1)] border border-black/5 dark:border-white/10 relative overflow-hidden group px-3">
            <svg viewBox="0 0 54 24" className="h-4 w-auto text-navy-950 group-hover:scale-105 transition-transform duration-500" fill="currentColor">
               <path d="M4 4h4.5v16H4V4zm11.5 0h-5.5L4.5 12l5.5 8h5.5l-5.5-8 5.5-8z" />
               <path d="M18.5 4h4.5l4 6.4l4-6.4h4.5l-6.25 10v6h-4.5v-6l-6.25-10z" />
               <path d="M52 4h-5.5c-5.5 0-8.5 3.5-8.5 8s3 8 8.5 8h5.5v-4.5h-5.5c-3 0-4-1.5-4-3.5s1-3.5 4-3.5h5.5V4z" />
            </svg>
          </div>"""

content = content.replace(old_logo, new_logo)

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated App.jsx successfully')

