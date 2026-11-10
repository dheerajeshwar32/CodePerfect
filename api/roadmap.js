import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { skill, jobTitle, language } = req.body;

  if (!skill || !jobTitle || !language) {
    return res.status(400).json({ error: "Missing required fields: skill, jobTitle, language" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server missing Gemini API Key" });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const prompt = `You are an expert career coach. A user wants to land a ${jobTitle} job but is missing the skill: ${skill}. Provide a highly concise, 3-step actionable roadmap to learn this skill. Output strictly in ${language} language, formatted as JSON matching this schema: { "steps": [{ "title": "string", "description": "string" }] }`;

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
      } catch {
        // Handle markdown block wrapper
        const match = text.match(/```json\n([\s\S]*)\n```/);
        if (match) {
           jsonResponse = JSON.parse(match[1]);
        } else {
           throw new Error("Failed to parse JSON: " + text);
        }
      }
    } catch (primaryError) {
      console.warn("gemini-flash-lite-latest endpoint failed. Attempting fallback to gemini-2.5-flash-lite...", primaryError);
      const fallbackModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite", ...aiConfig });
      const fallbackResult = await fallbackModel.generateContent(prompt);
      
      const text = fallbackResult.response.text();
      try {
        jsonResponse = JSON.parse(text);
      } catch {
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
    console.error("Roadmap generation failed completely:", error);
    res.status(500).json({ error: 'Failed to connect to AI Coach. Details: ' + (error.message || error.toString()) });
  }
}

