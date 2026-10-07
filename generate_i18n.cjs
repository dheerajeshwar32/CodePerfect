const fs = require('fs');
const jobsData = require('./api/jobsData.js').jobsData;

const jobTitles = jobsData.map(j => j.title);

const translations = {
  Telugu: {
    "title": "మీ ఉత్తమ ఉద్యోగ సరిపోలికలు",
    "match": "మొత్తం సరిపోలిక",
    "reqs": "అవసరాలు తీర్చబడ్డాయి",
    "button": "కొత్త శోధనను ప్రారంభించండి",
    jobs: {
      "Delivery Driver": "డెలివరీ డ్రైవర్",
      "Truck Driver / Logistical Transport": "ట్రక్ డ్రైవర్ / లాజిస్టికల్ ట్రాన్స్‌పోర్ట్",
      "Rideshare & Taxi Driver": "రైడ్‌షేర్ & టాక్సీ డ్రైవర్",
      "Courier & Package Handler": "కొరియర్ & ప్యాకేజ్ హ్యాండ్లర్",
      "Warehouse Logistics Associate": "వేర్‌హౌస్ లాజిస్టిక్స్ అసోసియేట్",
      "Frontend React Developer": "ఫ్రంటెండ్ రియాక్ట్ డెవలపర్",
      "Backend Node.js Engineer": "బ్యాకెండ్ నోడ్.జెఎస్ ఇంజనీర్",
      "Full Stack Software Engineer": "ఫుల్ స్టాక్ సాఫ్ట్‌వేర్ ఇంజనీర్",
      "Data Analyst": "డేటా అనలిస్ట్",
      "Machine Learning Engineer": "మెషిన్ లెర్నింగ్ ఇంజనీర్",
      "DevOps & Cloud Engineer": "డెవాప్స్ & క్లౌడ్ ఇంజనీర్",
      "UI/UX Designer": "UI/UX డిజైనర్",
      "Mobile App Developer": "మొబైల్ యాప్ డెవలపర్",
      "Cybersecurity Specialist": "సైబర్ సెక్యూరిటీ స్పెషలిస్ట్",
      "Quality Assurance (QA) Engineer": "క్వాలిటీ అస్యూరెన్స్ (QA) ఇంజనీర్",
      "Database Administrator": "డేటాబేస్ అడ్మినిస్ట్రేటర్",
      "Cloud Architect": "క్లౌడ్ ఆర్కిటెక్ట్",
      "Game Developer": "గేమ్ డెవలపర్",
      "Embedded Systems Engineer": "ఎంబెడెడ్ సిస్టమ్స్ ఇంజనీర్",
      "IT Support Specialist": "IT సపోర్ట్ స్పెషలిస్ట్",
      "Registered Nurse": "రిజిస్టర్డ్ నర్స్",
      "Medical Laboratory Technician": "మెడికల్ లాబొరేటరీ టెక్నీషియన్",
      "Pharmacist": "ఫార్మసిస్ట్",
      "Physical Therapist": "ఫిజికల్ థెరపిస్ట్",
      "Dental Hygienist": "డెంటల్ హైజీనిస్ట్",
      "Radiologic Technologist": "రేడియోలాజిక్ టెక్నాలజిస్ట్",
      "Healthcare Administrator": "హెల్త్‌కేర్ అడ్మినిస్ట్రేటర్",
      "Financial Analyst": "ఫైనాన్షియల్ అనలిస్ట్",
      "Accountant": "అకౌంటెంట్",
      "Investment Banker": "ఇన్వెస్ట్‌మెంట్ బ్యాంకర్",
      "Risk Management Specialist": "రిస్క్ మేనేజ్‌మెంట్ స్పెషలిస్ట్",
      "Digital Marketing Specialist": "డిజిటల్ మార్కెటింగ్ స్పెషలిస్ట్",
      "Content Writer & Copywriter": "కంటెంట్ రైటర్ & కాపీరైటర్",
      "Graphic Designer": "గ్రాఫిక్ డిజైనర్",
      "Human Resources Manager": "హ్యూమన్ రిసోర్సెస్ మేనేజర్",
      "Sales Representative": "సేల్స్ రిప్రజెంటేటివ్",
      "Customer Support Representative": "కస్టమర్ సపోర్ట్ రిప్రజెంటేటివ్",
      "Project Manager": "ప్రాజెక్ట్ మేనేజర్",
      "Product Manager": "ప్రొడక్ట్ మేనేజర్",
      "Operations Manager": "ఆపరేషన్స్ మేనేజర్",
      "Event Planner": "ఈవెంట్ ప్లానర్",
      "Real Estate Agent": "రియల్ ఎస్టేట్ ఏజెంట్",
      "Legal Assistant / Paralegal": "లీగల్ అసిస్టెంట్ / పారాలీగల్",
      "Civil Engineer": "సివిల్ ఇంజనీర్",
      "Mechanical Engineer": "మెకానికల్ ఇంజనీర్",
      "Electrical Engineer": "ఎలక్ట్రికల్ ఇంజనీర్",
      "Architect": "ఆర్కిటెక్ట్",
      "Chef / Culinary Specialist": "షెఫ్ / క్యులినరీ స్పెషలిస్ట్",
      "Hotel Manager": "హోటల్ మేనేజర్",
      "Travel Consultant": "ట్రావెల్ కన్సల్టెంట్",
      "Teacher / Educator": "టీచర్ / ఎడ్యుకేటర్"
    }
  },
  Tamil: {
    "title": "உங்கள் சிறந்த வேலை பொருத்தங்கள்",
    "match": "ஒட்டுமொத்த பொருத்தம்",
    "reqs": "தேவைகள் பூர்த்தி",
    "button": "புதிய தேடலைத் தொடங்கவும்",
    jobs: {
      "Delivery Driver": "டெலிவரி டிரைவர்",
      "Truck Driver / Logistical Transport": "டிரக் டிரைவர் / லாஜிஸ்டிக்கல் டிரான்ஸ்போர்ட்",
      "Rideshare & Taxi Driver": "ரைட்ஷேர் & டாக்ஸி டிரைவர்",
      "Courier & Package Handler": "கூரியர் & பேக்கேஜ் ஹேண்ட்லர்",
      "Warehouse Logistics Associate": "கிடங்கு தளவாட கூட்டாளர்",
      "Frontend React Developer": "முன்பக்க ரியாக்ட் டெவலப்பர்",
      "Backend Node.js Engineer": "பின்கள நோட்.ஜெஎஸ் பொறியாளர்",
      "Full Stack Software Engineer": "முழு அடுக்கு மென்பொருள் பொறியாளர்",
      "Data Analyst": "தரவு ஆய்வாளர்",
      "Machine Learning Engineer": "இயந்திர கற்றல் பொறியாளர்",
      "DevOps & Cloud Engineer": "டெவஆப்ஸ் & கிளவுட் இன்ஜினியர்",
      "UI/UX Designer": "UI/UX டிசைனர்",
      "Mobile App Developer": "மொபைல் ஆப் டெவலப்பர்",
      "Cybersecurity Specialist": "சைபர் பாதுகாப்பு நிபுணர்",
      "Quality Assurance (QA) Engineer": "தர உத்தரவாத (QA) பொறியாளர்",
      "Database Administrator": "தரவுத்தள நிர்வாகி",
      "Cloud Architect": "கிளவுட் ஆர்கிடெக்ட்",
      "Game Developer": "விளையாட்டு டெவலப்பர்",
      "Embedded Systems Engineer": "உட்பொதிக்கப்பட்ட அமைப்புகள் பொறியாளர்",
      "IT Support Specialist": "IT ஆதரவு நிபுணர்",
      "Registered Nurse": "பதிவுசெய்யப்பட்ட செவிலியர்",
      "Medical Laboratory Technician": "மருத்துவ ஆய்வக தொழில்நுட்பவியலாளர்",
      "Pharmacist": "மருந்தாளர்",
      "Physical Therapist": "உடல் சிகிச்சை நிபுணர்",
      "Dental Hygienist": "பல் சுகாதார நிபுணர்",
      "Radiologic Technologist": "கதிரியக்க தொழில்நுட்பவியலாளர்",
      "Healthcare Administrator": "சுகாதார நிர்வாகி",
      "Financial Analyst": "நிதி ஆய்வாளர்",
      "Accountant": "கணக்காளர்",
      "Investment Banker": "முதலீட்டு வங்கியாளர்",
      "Risk Management Specialist": "இடர் மேலாண்மை நிபுணர்",
      "Digital Marketing Specialist": "டிஜிட்டல் சந்தைப்படுத்தல் நிபுணர்",
      "Content Writer & Copywriter": "உள்ளடக்க எழுத்தாளர்",
      "Graphic Designer": "கிராஃபிக் டிசைனர்",
      "Human Resources Manager": "மனித வள மேலாளர்",
      "Sales Representative": "விற்பனை பிரதிநிதி",
      "Customer Support Representative": "வாடிக்கையாளர் ஆதரவு பிரதிநிதி",
      "Project Manager": "திட்ட மேலாளர்",
      "Product Manager": "தயாரிப்பு மேலாளர்",
      "Operations Manager": "செயல்பாட்டு மேலாளர்",
      "Event Planner": "நிகழ்வு திட்டமிடுபவர்",
      "Real Estate Agent": "ரியல் எஸ்டேட் முகவர்",
      "Legal Assistant / Paralegal": "சட்ட உதவியாளர்",
      "Civil Engineer": "சிவில் இன்ஜினியர்",
      "Mechanical Engineer": "மெக்கானிக்கல் இன்ஜினியர்",
      "Electrical Engineer": "எலக்ட்ரிக்கல் இன்ஜினியர்",
      "Architect": "கட்டிடக்கலைஞர்",
      "Chef / Culinary Specialist": "சமையல்காரர்",
      "Hotel Manager": "ஹோటல் மேலாளர்",
      "Travel Consultant": "பயண ஆலோசகர்",
      "Teacher / Educator": "ஆசிரியர்"
    }
  },
  Hindi: {
    "title": "आपके शीर्ष नौकरी मैच",
    "match": "कुल मिलान",
    "reqs": "आवश्यकताएं पूरी हुईं",
    "button": "नई खोज शुरू करें",
    jobs: {
      "Delivery Driver": "डिलीवरी ड्राइवर",
      "Truck Driver / Logistical Transport": "ट्रक ड्राइवर / लॉजिस्टिक ट्रांसपोर्ट",
      "Rideshare & Taxi Driver": "राइडशेयर और टैक्सी ड्राइवर",
      "Courier & Package Handler": "कूरियर और पैकेज हैंडलर",
      "Warehouse Logistics Associate": "वेयरहाउस लॉजिस्टिक्स एसोसिएट",
      "Frontend React Developer": "फ्रंटएंड रिएक्ट डेवलपर",
      "Backend Node.js Engineer": "बैकएंड नोड.जेएस इंजीनियर",
      "Full Stack Software Engineer": "फुल स्टैक सॉफ्टवेयर इंजीनियर",
      "Data Analyst": "डेटा एनालिस्ट",
      "Machine Learning Engineer": "मशीन लर्निंग इंजीनियर",
      "DevOps & Cloud Engineer": "डेवऑप्स और क्लाउड इंजीनियर",
      "UI/UX Designer": "UI/UX डिजाइनर",
      "Mobile App Developer": "मोबाइल ऐप डेवलपर",
      "Cybersecurity Specialist": "साइबर सुरक्षा विशेषज्ञ",
      "Quality Assurance (QA) Engineer": "क्वालिटी एश्योरेंस (QA) इंजीनियर",
      "Database Administrator": "डेटाबेस एडमिनिस्ट्रेटर",
      "Cloud Architect": "क्लाउड आर्किटेक्ट",
      "Game Developer": "गेम डेवलपर",
      "Embedded Systems Engineer": "एंबेडेड सिस्टम इंजीनियर",
      "IT Support Specialist": "IT सपोर्ट स्पेशलिस्ट",
      "Registered Nurse": "रजिस्टर्ड नर्स",
      "Medical Laboratory Technician": "मेडिकल लेबोरेटरी तकनीशियन",
      "Pharmacist": "फार्मासिस्ट",
      "Physical Therapist": "फिजिकल थेरेपिस्ट",
      "Dental Hygienist": "डेंटल हाइजिनिस्ट",
      "Radiologic Technologist": "रेडियोलॉजिक टेक्नोलॉजिस्ट",
      "Healthcare Administrator": "हेल्थकेयर एडमिनिस्ट्रेटर",
      "Financial Analyst": "फाइनेंशियल एनालिस्ट",
      "Accountant": "अकाउंटेंट",
      "Investment Banker": "इन्वेस्टमेंट बैंकर",
      "Risk Management Specialist": "रिस्क मैनेजमेंट स्पेशलिस्ट",
      "Digital Marketing Specialist": "डिजिटल मार्केटिंग स्पेशलिस्ट",
      "Content Writer & Copywriter": "कंटेंट राइटर और कॉपीराइटर",
      "Graphic Designer": "ग्राफिक डिजाइनर",
      "Human Resources Manager": "ह्यूमन रिसोर्स मैनेजर",
      "Sales Representative": "सेल्स रिप्रेजेंटेटिव",
      "Customer Support Representative": "कस्टमर सपोर्ट रिप्रेजेंटेटिव",
      "Project Manager": "प्रोजेक्ट मैनेजर",
      "Product Manager": "प्रोडक्ट मैनेजर",
      "Operations Manager": "ऑपरेशंस मैनेजर",
      "Event Planner": "इवेंट प्लानर",
      "Real Estate Agent": "रियल एस्टेट एजेंट",
      "Legal Assistant / Paralegal": "लीगल असिस्टेंट / पैरालीगल",
      "Civil Engineer": "सिविल इंजीनियर",
      "Mechanical Engineer": "मैकेनिकल इंजीनियर",
      "Electrical Engineer": "इलेक्ट्रिकल इंजीनियर",
      "Architect": "आर्किटेक्ट",
      "Chef / Culinary Specialist": "शेफ / कुलिनरी स्पेशलिस्ट",
      "Hotel Manager": "होटल मैनेजर",
      "Travel Consultant": "ट्रैवल कंसल्टेंट",
      "Teacher / Educator": "टीचर / एजुकेटर"
    }
  }
};

const output = {
  English: {
    translation: {
      title: "Your Top Job Matches",
      match: "Overall Match",
      reqs: "Requirements Met",
      button: "Start New Search",
      jobs: jobTitles.reduce((acc, curr) => { acc[curr] = curr; return acc; }, {})
    }
  },
  Telugu: {
    translation: {
      ...translations.Telugu,
      jobs: translations.Telugu.jobs
    }
  },
  Tamil: {
    translation: {
      ...translations.Tamil,
      jobs: translations.Tamil.jobs
    }
  },
  Hindi: {
    translation: {
      ...translations.Hindi,
      jobs: translations.Hindi.jobs
    }
  }
};

const fileContent = `import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = ${JSON.stringify(output, null, 2)};

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

fs.writeFileSync('src/i18n.js', fileContent);
console.log('Successfully wrote src/i18n.js');
