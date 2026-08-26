import { GoogleGenAI } from "@google/genai";
import { generateEmbedding } from "./embedding.service";
import { searchSimilarLogs } from "./vector.service";

const analyzeIncident = async (
    title: string,
    description: string,
    logs: string
) => {

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is missing");
    }

    const incidentText = `${title}. ${description}`;

    const embedding = await generateEmbedding(incidentText);

    if (!embedding) {
        throw new Error("Failed to generate incident embedding");
    }

    const similarLogs = await searchSimilarLogs(embedding, 5);

    console.log("🔎 SIMILAR LOGS:", similarLogs);

    const similarLogsContext = similarLogs
        .map((log, index) => {
            return `
Log ${index + 1}:
Level: ${log.level}
Message: ${log.message}
Similarity Score: ${log.score}
Created At: ${log.createdAt}
`;
        })
        .join("\n");

    const ai = new GoogleGenAI({
        apiKey,
    });

    const prompt = `
You are an AI DevOps incident analyst.

Analyze this production incident using the provided historical logs.

Incident Title:
${title}

Incident Description:
${description}

Recent Logs:
${logs}

Similar Historical Logs Retrieved From Database:
${similarLogsContext}

Use the historical logs as additional evidence when determining the probable root cause.

Determine:
1. The most probable root cause.
2. A practical suggested fix.
3. Your confidence level.

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