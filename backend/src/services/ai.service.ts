import { GoogleGenAI } from "@google/genai";
import { generateEmbedding } from "./embedding.service";
import {
    searchSimilarLogs,
    searchSimilarKnowledge,
} from "./vector.service";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
});


const analyzeIncident = async (
    title: string,
    description: string,
    logs: string
) => {
    const embedding = await generateEmbedding(
        `${title}\n${description}`
    );

    if (!embedding) {
        throw new Error("Failed to generate embedding");
    }

    const similarLogs = await searchSimilarLogs(
        embedding,
        5
    );

    const similarKnowledge = await searchSimilarKnowledge(
        embedding,
        5
    );

    const prompt = `
You are a DevOps Incident Intelligence AI.

Analyze the following incident using the current logs,
similar historical logs, and relevant knowledge.

INCIDENT
Title:
${title}

Description:
${description}

CURRENT LOGS:
${logs || "No logs available"}

SIMILAR HISTORICAL LOGS:
${JSON.stringify(similarLogs)}

RELEVANT KNOWLEDGE:
${JSON.stringify(similarKnowledge)}

Your task is to determine:

1. What is the probable root cause?
2. What should the developer/DevOps engineer do to fix it?
3. Why did you reach this conclusion?
4. How confident are you?
5. How severe is the incident?

Return ONLY valid JSON in exactly this format:

{
  "summary": "Short summary of the incident",
  "rootCause": "Probable root cause",
  "suggestedFix": "Recommended fix",
  "reasoning": "Reasoning based on logs and retrieved knowledge",
  "confidence": 0,
  "severity": "low"
}

Rules:
- severity must be exactly one of: low, medium, high, critical
- confidence must be a number between 0 and 100
- Do not return markdown
- Do not return explanations outside JSON
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
    });

    let text = response.text?.trim();

    if (!text) {
        throw new Error("AI returned an empty response");
    }

    text = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();


    let result;

    try {
        result = JSON.parse(text);
    } catch (error) {
        console.error("❌ Invalid AI JSON:", text);
        throw new Error("AI returned invalid JSON");
    }

    if (
        typeof result.summary !== "string" ||
        typeof result.rootCause !== "string" ||
        typeof result.suggestedFix !== "string" ||
        typeof result.reasoning !== "string" ||
        typeof result.confidence !== "number" ||
        !["low", "medium", "high", "critical"].includes(
            result.severity
        )
    ) {
        throw new Error("AI returned invalid incident analysis");
    }

    return {
        summary: result.summary,
        rootCause: result.rootCause,
        suggestedFix: result.suggestedFix,
        reasoning: result.reasoning,
        confidence: result.confidence,
        severity: result.severity,
    };
};

export default analyzeIncident;