import { Log } from "../models/log.model";

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

export { searchSimilarLogs };