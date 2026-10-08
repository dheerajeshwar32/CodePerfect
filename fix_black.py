import re
with open('src/components/Dashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('bg-black/20', 'bg-navy-950/40')
content = content.replace('bg-black/30', 'bg-navy-950/50')

with open('src/components/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/components/Login.jsx', 'r', encoding='utf-8') as f:
    login = f.read()

login = login.replace('rgba(0,0,0,0.5)', 'rgba(11,17,32,0.6)')

with open('src/components/Login.jsx', 'w', encoding='utf-8') as f:
    f.write(login)

