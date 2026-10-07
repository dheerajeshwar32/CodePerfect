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
      const primaryModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash", ...aiConfig });
      const primaryResult = await primaryModel.generateContent(prompt);
      jsonResponse = JSON.parse(primaryResult.response.text());
    } catch (primaryError) {
      console.warn("Gemini 1.5 Flash endpoint failed. Attempting fallback to 1.5 Pro...", primaryError);
      const fallbackModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro", ...aiConfig });
      const fallbackResult = await fallbackModel.generateContent(prompt);
      jsonResponse = JSON.parse(fallbackResult.response.text());
    }

    res.status(200).json(jsonResponse);
  } catch (error) {
    console.error("Roadmap generation failed completely:", error);
    res.status(500).json({ error: 'Failed to connect to AI Coach.' });
  }
}

