import { Request, Response } from "express";
import { generateEmbedding } from "../services/embedding.service";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/Asynchandler";


const testEmbedding = asyncHandler(
    async (req: Request, res: Response) => {

        const { text } = req.body;

        if (!text) {
            throw new ApiError(400, "Text is required");
        }

        const embedding = await generateEmbedding(text);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        text,
                        embedding,
                        dimensions: embedding?.length,
                    },
                    "Embedding generated successfully"
                )
            );
    }
);

export {
    testEmbedding,
};