import { Log } from "../models/log.model";
import { Knowledge } from "../models/knowledge.model";

const searchSimilarLogs = async (
    embedding: number[],
    limit: number = 5
) => {

    const results = await Log.aggregate([
        {
            $vectorSearch: {
                index: "log_embedding_index",
                path: "embedding",
                queryVector: embedding,
                numCandidates: 50,
                limit: limit,
            },
        },
        {
            $project: {
                _id: 1,
                service: 1,
                level: 1,
                message: 1,
                createdAt: 1,
                score: {
                    $meta: "vectorSearchScore",
                },
            },
        },
    ]);

    return results;
};

const searchSimilarKnowledge = async (
    embedding: number[],
    limit: number = 5
) => {

    const results = await Knowledge.aggregate([
        {
            $vectorSearch: {
                index: "knowledge_embedding_index",
                path: "embedding",
                queryVector: embedding,
                numCandidates: 50,
                limit,
            },
        },
        {
            $project: {
                _id: 1,
                title: 1,
                content: 1,
                solution: 1,
                source: 1,
                score: {
                    $meta: "vectorSearchScore",
                },
            },
        },
    ]);

    return results;
};

export { 
    searchSimilarLogs, 
    searchSimilarKnowledge
};