import sys

with open('src/components/Login.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_logo = """<div className="relative z-10 w-16 h-16 rounded-2xl bg-white mx-auto mb-6 flex items-center justify-center border border-black/5 dark:border-white/10 shadow-[0_2px_15px_rgba(0,0,0,0.1)]">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-navy-950" fill="currentColor">
             <path d="M4 4h4v16H4V4zm5 8l8-8h4l-8 8 8 8h-4l-8-8z" />
          </svg>
        </div>"""

new_logo = """<div className="relative z-10 h-16 w-auto px-6 rounded-2xl bg-white mx-auto mb-6 inline-flex items-center justify-center border border-black/5 dark:border-white/10 shadow-[0_2px_15px_rgba(0,0,0,0.1)]">
          <svg viewBox="0 0 54 24" className="h-6 w-auto text-navy-950" fill="currentColor">
             <path d="M4 4h4.5v16H4V4zm11.5 0h-5.5L4.5 12l5.5 8h5.5l-5.5-8 5.5-8z" />
             <path d="M18.5 4h4.5l4 6.4l4-6.4h4.5l-6.25 10v6h-4.5v-6l-6.25-10z" />
             <path d="M52 4h-5.5c-5.5 0-8.5 3.5-8.5 8s3 8 8.5 8h5.5v-4.5h-5.5c-3 0-4-1.5-4-3.5s1-3.5 4-3.5h5.5V4z" />
          </svg>
        </div>"""

content = content.replace(old_logo, new_logo)

with open('src/components/Login.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated Login.jsx successfully')

