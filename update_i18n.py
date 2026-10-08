import re

with open('src/i18n.js', 'r', encoding='utf-8') as f:
    content = f.read()

subs = {
    'English': 'Based on your skills, here are the roles you are most qualified for.',
    'Telugu': 'మీ నైపుణ్యాల ఆధారంగా, మీకు బాగా సరిపోయే పాత్రలు ఇవి.',
    'Tamil': 'உங்கள் திறன்களின் அடிப்படையில், நீங்கள் மிகவும் தகுதியான பாத்திரங்கள் இங்கே.',
    'Hindi': 'आपके कौशल के आधार पर, यहाँ वे भूमिकाएँ हैं जिनके लिए आप सबसे अधिक योग्य हैं।'
}

for lang, sub in subs.items():
    pattern = rf'("{lang}": {{\s*"translation": {{\s*"title": "[^"]+",\s*)'
    replacement = r'\g<1>"subtitle": "' + sub + '",\n      '
    content = re.sub(pattern, replacement, content)

with open('src/i18n.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')

