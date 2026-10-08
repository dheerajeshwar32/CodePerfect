import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { resumeText } = req.body;

  if (!resumeText) {
    return res.status(400).json({ error: "No resume text provided" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server missing Gemini API Key" });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const prompt = `You are an expert ATS (Applicant Tracking System) parser. Extract the user's top technical skills, soft skills, years of experience, and a brief 2-sentence professional summary from the following resume text. Output strictly in JSON format matching this schema: 
    { 
      "skills": ["string"], 
      "experienceYears": number,
      "summary": "string" 
    }
    
    Resume Text:
    """
    ${resumeText.substring(0, 5000)}
    """`;

    const aiConfig = {
      generationConfig: {
        responseMimeType: "application/json",
      }
    };

    let jsonResponse = null;

    try {
      const primaryModel = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest", ...aiConfig });
      const primaryResult = await primaryModel.generateContent(prompt);
      const text = primaryResult.response.text();
      try {
        jsonResponse = JSON.parse(text);
      } catch (e) {
        const match = text.match(/```json\n([\s\S]*)\n```/);
        if (match) {
           jsonResponse = JSON.parse(match[1]);
        } else {
           throw new Error("Failed to parse JSON: " + text);
        }
      }
    } catch (primaryError) {
      console.warn("gemini-flash-lite-latest failed. Attempting fallback to gemini-2.5-flash-lite...", primaryError);
      const fallbackModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite", ...aiConfig });
      const fallbackResult = await fallbackModel.generateContent(prompt);
      
      const text = fallbackResult.response.text();
      try {
        jsonResponse = JSON.parse(text);
      } catch (e) {
        const match = text.match(/```json\n([\s\S]*)\n```/);
        if (match) {
           jsonResponse = JSON.parse(match[1]);
        } else {
           throw new Error("Failed to parse JSON: " + text);
        }
      }
    }

    res.status(200).json(jsonResponse);
  } catch (error) {
    console.error("Resume parsing failed:", error);
    res.status(500).json({ error: 'Failed to connect to AI Parser. Details: ' + (error.message || error.toString()) });
  }
}

