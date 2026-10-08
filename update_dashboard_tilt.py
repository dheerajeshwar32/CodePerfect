import re

with open('src/components/Dashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove Tilt import
content = content.replace("import Tilt from 'react-parallax-tilt';", "")

# Replace Tilt tags with div
content = re.sub(r'<Tilt[^>]*>', '<div className="transform transition-all duration-500 hover:scale-[1.02] h-full lg:col-span-2">', content, count=1)
content = re.sub(r'<Tilt[^>]*>', '<div className="transform transition-all duration-500 hover:scale-[1.02] h-full lg:col-span-1">', content, count=1)
content = re.sub(r'<Tilt[^>]*>', '<div className="transform transition-all duration-500 hover:scale-[1.02] w-full">', content, count=2)

content = content.replace("</Tilt>", "</div>")

with open('src/components/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed Tilt from Dashboard")

