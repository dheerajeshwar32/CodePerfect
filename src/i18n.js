import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  English: {
    translation: {
      title: "Your Top Job Matches",
      match: "Overall Match",
      reqs: "Requirements Met",
      button: "Start New Search",
      jobs: {
        "Frontend React Developer": "Frontend React Developer",
        "Backend Node.js Engineer": "Backend Node.js Engineer",
        "Full Stack Software Engineer": "Full Stack Software Engineer",
        "Quality Assurance (QA) Engineer": "Quality Assurance (QA) Engineer",
        "Machine Learning Engineer": "Machine Learning Engineer",
        "Mobile App Developer": "Mobile App Developer",
        "Game Developer": "Game Developer",
        "Graphic Designer": "Graphic Designer"
      }
    }
  },
  Telugu: {
    translation: {
      title: "మీ ఉత్తమ ఉద్యోగ సరిపోలికలు",
      match: "మొత్తం సరిపోలిక",
      reqs: "అవసరాలు తీర్చబడ్డాయి",
      button: "కొత్త శోధనను ప్రారంభించండి",
      jobs: {
        "Frontend React Developer": "ఫ్రంటెండ్ రియాక్ట్ డెవలపర్",
        "Backend Node.js Engineer": "బ్యాకెండ్ నోడ్.జెఎస్ ఇంజనీర్",
        "Full Stack Software Engineer": "ఫుల్ స్టాక్ సాఫ్ట్‌వేర్ ఇంజనీర్",
        "Quality Assurance (QA) Engineer": "క్వాలిటీ అస్యూరెన్స్ (QA) ఇంజనీర్",
        "Machine Learning Engineer": "మెషిన్ లెర్నింగ్ ఇంజనీర్",
        "Mobile App Developer": "మొబైల్ యాప్ డెవలపర్",
        "Game Developer": "గేమ్ డెవలపర్",
        "Graphic Designer": "గ్రాఫిక్ డిజైనర్"
      }
    }
  },
  Tamil: {
    translation: {
      title: "உங்கள் சிறந்த வேலை பொருத்தங்கள்",
      match: "ஒட்டுமொத்த பொருத்தம்",
      reqs: "தேவைகள் பூர்த்தி",
      button: "புதிய தேடலைத் தொடங்கவும்",
      jobs: {
        "Frontend React Developer": "முன்பக்க ரியாக்ட் டெவலப்பர்",
        "Backend Node.js Engineer": "பின்கள நோட்.ஜெஎஸ் பொறியாளர்",
        "Full Stack Software Engineer": "முழு அடுக்கு மென்பொருள் பொறியாளர்",
        "Quality Assurance (QA) Engineer": "தர உத்தரவாத (QA) பொறியாளர்",
        "Machine Learning Engineer": "இயந்திர கற்றல் பொறியாளர்",
        "Mobile App Developer": "மொபைல் ஆப் டெவலப்பர்",
        "Game Developer": "விளையாட்டு டெவலப்பர்",
        "Graphic Designer": "கிராஃபிக் டிசைனர்"
      }
    }
  },
  Hindi: {
    translation: {
      title: "आपके शीर्ष नौकरी मैच",
      match: "कुल मिलान",
      reqs: "आवश्यकताएं पूरी हुईं",
      button: "नई खोज शुरू करें",
      jobs: {
        "Frontend React Developer": "फ्रंटएंड रिएक्ट डेवलपर",
        "Backend Node.js Engineer": "बैकएंड नोड.जेएस इंजीनियर",
        "Full Stack Software Engineer": "फुल स्टैक सॉफ्टवेयर इंजीनियर",
        "Quality Assurance (QA) Engineer": "क्वालिटी एश्योरेंस (QA) इंजीनियर",
        "Machine Learning Engineer": "मशीन लर्निंग इंजीनियर",
        "Mobile App Developer": "मोबाइल ऐप डेवलपर",
        "Game Developer": "गेम डेवलपर",
        "Graphic Designer": "ग्राफिक डिजाइनर"
      }
    }
  }
};

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

