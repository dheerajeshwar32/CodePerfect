import fs from 'fs';

const englishJobs = [
  "Principal AI Architect", "Senior Machine Learning Engineer", "AI Research Scientist", 
  "Machine Learning Infrastructure Engineer", "Senior Distributed Systems Engineer", 
  "Backend Software Engineer", "Staff Software Engineer, Core Systems", "Software Engineer, Infrastructure", 
  "Senior Frontend Engineer", "Full Stack Developer", "Lead Web Developer", "Frontend Infrastructure Engineer", 
  "Senior Data Scientist", "Data Engineering Manager", "Staff Data Engineer", "Analytics Engineer", 
  "Senior Site Reliability Engineer (SRE)", "Cloud Security Architect", "DevOps Engineer", "Platform Engineer", 
  "Senior Product Manager, AI/ML", "Staff Product Designer", "UX Researcher", "Director of Product Management", 
  "Senior SRE", "Lead Machine Learning Engineer", "Principal Backend Engineer", "SRE", "Lead Data Scientist", 
  "Cloud Architect", "Product Manager", "Backend Engineer", "Lead Backend Engineer", "Lead Software Engineer", 
  "Machine Learning Engineer", "Lead SRE", "Principal DevOps Engineer", "Frontend Engineer", "Lead Frontend Engineer", 
  "Principal Machine Learning Engineer", "Software Engineer", "Senior Product Manager", "Lead Product Manager", 
  "Senior Software Engineer", "Data Scientist", "Principal Frontend Engineer", "Senior Cloud Architect", 
  "Lead Cloud Architect", "Senior DevOps Engineer", "Principal Data Scientist", "Principal Product Manager", 
  "Principal Cloud Architect", "Principal Software Engineer", "Senior Backend Engineer", "Principal SRE"
];

// Helper to quickly transliterate/translate to Telugu
const teluguMap = {
  "Principal": "ప్రిన్సిపల్", "Senior": "సీనియర్", "Lead": "లీడ్", "Staff": "స్టాఫ్", "Director": "డైరెక్టర్",
  "AI": "ఏఐ", "Machine Learning": "మెషిన్ లెర్నింగ్", "Software": "సాఫ్ట్‌వేర్", "Engineer": "ఇంజనీర్",
  "Architect": "ఆర్కిటెక్ట్", "Research Scientist": "రీసెర్చ్ సైంటిస్ట్", "Infrastructure": "ఇన్‌ఫ్రాస్ట్రక్చర్",
  "Distributed Systems": "డిస్ట్రిబ్యూటెడ్ సిస్టమ్స్", "Backend": "బ్యాకెండ్", "Frontend": "ఫ్రంటెండ్",
  "Core Systems": "కోర్ సిస్టమ్స్", "Full Stack": "ఫుల్ స్టాక్", "Developer": "డెవలపర్",
  "Web": "వెబ్", "Data Scientist": "డేటా సైంటిస్ట్", "Data Engineering": "డేటా ఇంజనీరింగ్",
  "Manager": "మేనేజర్", "Data Engineer": "డేటా ఇంజనీర్", "Analytics": "అనలిటిక్స్",
  "Site Reliability Engineer (SRE)": "సైట్ రిలయబిలిటీ ఇంజనీర్ (SRE)", "Cloud": "క్లౌడ్", "Security": "సెక్యూరిటీ",
  "DevOps": "డెవొప్స్", "Platform": "ప్లాట్‌ఫారమ్", "Product Manager, AI/ML": "ప్రొడక్ట్ మేనేజర్, AI/ML",
  "Product Designer": "ప్రొడక్ట్ డిజైనర్", "UX Researcher": "UX రీసెర్చర్", "of Product Management": "ఆఫ్ ప్రొడక్ట్ మేనేజ్‌మెంట్",
  "SRE": "SRE", "Product Manager": "ప్రొడక్ట్ మేనేజర్", "Data": "డేటా"
};

const tamilMap = {
  "Principal": "முதன்மை", "Senior": "மூத்த", "Lead": "தலைமை", "Staff": "ஸ்டாஃப்", "Director": "இயக்குனர்",
  "AI": "ஏஐ", "Machine Learning": "இயந்திர கற்றல்", "Software": "மென்பொருள்", "Engineer": "பொறியாளர்",
  "Architect": "ஆர்க்கிடெக்ட்", "Research Scientist": "ஆராய்ச்சி விஞ்ஞானி", "Infrastructure": "உள்கட்டமைப்பு",
  "Distributed Systems": "பகிர்ந்தளிக்கப்பட்ட அமைப்புகள்", "Backend": "பின்தள", "Frontend": "முன்பக்க",
  "Core Systems": "முக்கிய அமைப்புகள்", "Full Stack": "முழு ஸ்டாக்", "Developer": "டெவலப்பர்",
  "Web": "இணைய", "Data Scientist": "தரவு விஞ்ஞானி", "Data Engineering": "தரவு பொறியியல்",
  "Manager": "மேலாளர்", "Data Engineer": "தரவு பொறியாளர்", "Analytics": "பகுப்பாய்வு",
  "Site Reliability Engineer (SRE)": "தள நம்பகத்தன்மை பொறியாளர் (SRE)", "Cloud": "கிளவுட்", "Security": "பாதுகாப்பு",
  "DevOps": "டெவொப்ஸ்", "Platform": "பிளாட்ஃபார்ம்", "Product Manager, AI/ML": "தயாரிப்பு மேலாளர், AI/ML",
  "Product Designer": "தயாரிப்பு வடிவமைப்பாளர்", "UX Researcher": "UX ஆராய்ச்சியாளர்", "of Product Management": "தயாரிப்பு மேலாண்மை",
  "SRE": "SRE", "Product Manager": "தயாரிப்பு மேலாளர்", "Data": "தரவு"
};

const hindiMap = {
  "Principal": "प्रिंसिपल", "Senior": "सीनियर", "Lead": "लीड", "Staff": "स्टाफ", "Director": "निदेशक",
  "AI": "एआई", "Machine Learning": "मशीन लर्निंग", "Software": "सॉफ्टवेयर", "Engineer": "इंजीनियर",
  "Architect": "आर्किटेक्ट", "Research Scientist": "रिसर्च साइंटिस्ट", "Infrastructure": "इन्फ्रास्ट्रक्चर",
  "Distributed Systems": "डिस्ट्रिब्यूटेड सिस्टम्स", "Backend": "बैकएंड", "Frontend": "फ्रंटएंड",
  "Core Systems": "कोर सिस्टम्स", "Full Stack": "फुल स्टैक", "Developer": "डेवलपर",
  "Web": "वेब", "Data Scientist": "डेटा साइंटिस्ट", "Data Engineering": "डेटा इंजीनियरिंग",
  "Manager": "मैनेजर", "Data Engineer": "डेटा इंजीनियर", "Analytics": "एनालिटिक्स",
  "Site Reliability Engineer (SRE)": "साइट रिलायबिलिटी इंजीनियर (SRE)", "Cloud": "क्लाउड", "Security": "सिक्योरिटी",
  "DevOps": "डेवऑप्स", "Platform": "प्लेटफॉर्म", "Product Manager, AI/ML": "प्रोडक्ट मैनेजर, AI/ML",
  "Product Designer": "प्रोडक्ट डिज़ाइनर", "UX Researcher": "UX रिसर्चर", "of Product Management": "ऑफ प्रोडक्ट मैनेजमेंट",
  "SRE": "SRE", "Product Manager": "प्रोडक्ट मैनेजर", "Data": "डेटा"
};

function translateJob(title, map) {
  let res = title;
  for (const [en, local] of Object.entries(map)) {
    res = res.replace(new RegExp('\\b' + en + '\\b', 'g'), local);
  }
  return res;
}

const resources = {
  English: {
    translation: {
      title: "Your Top Job Matches",
      subtitle: "Based on your skills, here are the roles you are most qualified for.",
      match: "Overall Match",
      reqs: "Requirements Met",
      button: "START NEW SEARCH",
      language: "Language",
      jobs: {}
    }
  },
  Telugu: {
    translation: {
      title: "మీ టాప్ జాబ్ మ్యాచ్‌లు",
      subtitle: "మీ నైపుణ్యాల ఆధారంగా, మీరు అత్యంత అర్హత కలిగిన పాత్రలు ఇక్కడ ఉన్నాయి.",
      match: "మొత్తం మ్యాచ్",
      reqs: "అవసరాలు తీర్చబడ్డాయి",
      button: "కొత్త శోధన ప్రారంభించండి",
      language: "భాష",
      jobs: {}
    }
  },
  Tamil: {
    translation: {
      title: "உங்கள் சிறந்த வேலைப் பொருத்தங்கள்",
      subtitle: "உங்கள் திறன்களின் அடிப்படையில், நீங்கள் மிகவும் தகுதியான பாத்திரங்கள் இங்கே.",
      match: "ஒட்டுமொத்த பொருத்தம்",
      reqs: "தேவைகள் பூர்த்தி செய்யப்பட்டன",
      button: "புதிய தேடலைத் தொடங்கவும்",
      language: "மொழி",
      jobs: {}
    }
  },
  Hindi: {
    translation: {
      title: "आपके शीर्ष नौकरी मिलान",
      subtitle: "आपके कौशल के आधार पर, यहाँ वे भूमिकाएँ हैं जिनके लिए आप सबसे योग्य हैं।",
      match: "कुल मिलान",
      reqs: "पूरी की गई आवश्यकताएं",
      button: "नई खोज शुरू करें",
      language: "भाषा",
      jobs: {}
    }
  }
};

for (const job of englishJobs) {
  resources.English.translation.jobs[job] = job;
  resources.Telugu.translation.jobs[job] = translateJob(job, teluguMap);
  resources.Tamil.translation.jobs[job] = translateJob(job, tamilMap);
  resources.Hindi.translation.jobs[job] = translateJob(job, hindiMap);
}

const i18nContent = `import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = ${JSON.stringify(resources, null, 2)};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "English",
    fallbackLng: "English",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
`;

fs.writeFileSync('src/i18n.js', i18nContent, 'utf8');
console.log('Successfully generated src/i18n.js with all 55 job translations!');

