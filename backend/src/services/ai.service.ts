import { GoogleGenAI } from "@google/genai";

const analyzeIncident = async (
    title: string,
    description: string,
    logs: string
) => {

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is missing");
    }

    const ai = new GoogleGenAI({
        apiKey,
    });

    const prompt = `
You are an AI DevOps incident analyst.

Analyze this production incident.

Incident Title:
${title}

Incident Description:
${description}

Recent Logs:
${logs}

Determine the most probable root cause and suggest a practical fix.

Return ONLY valid JSON.
Do not use markdown.
Do not add explanations outside the JSON.

Required format:

{
  "rootCause": "string",
  "confidence": 0,
  "suggestedFix": "string"
}

Rules:
- confidence must be between 0 and 100.
- rootCause should explain the probable technical reason.
- suggestedFix should provide practical troubleshooting or remediation steps.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
    });

    const text = response.text;

    if (!text) {
        throw new Error("AI returned an empty response");
    }

    const cleanedText = text
        .replace(/^```json\s*/, "")
        .replace(/^```\s*/, "")
        .replace(/\s*```$/, "")
        .trim();

    let result;

    try {
        result = JSON.parse(cleanedText);
    } catch (error) {
        throw new Error("AI returned invalid JSON");
    }

    return result;
};

export { analyzeIncident };