import { GoogleGenAI } from "@google/genai";

const generateEmbedding = async (text: string) => {

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is missing");
    }

    const ai = new GoogleGenAI({
        apiKey: apiKey,
    });

    const response = await ai.models.embedContent({
        model: "gemini-embedding-2",
        contents: text,
        config: {
            outputDimensionality: 768,
        },
    });

    return response.embeddings?.[0]?.values;
};

export { generateEmbedding };