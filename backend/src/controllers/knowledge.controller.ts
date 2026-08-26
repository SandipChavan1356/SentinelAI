import { Request, Response } from "express";
import { Knowledge } from "../models/knowledge.model";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/Asynchandler";


const createKnowledge = asyncHandler(
    async (req: Request, res: Response) => {

        const { title, content, solution, source } = req.body;

        if (!title || !content || !solution) {
            throw new ApiError(
                400,
                "Title, content and solution are required"
            );
        }

        const knowledge = await Knowledge.create({
            title,
            content,
            solution,
            source,
        });

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    knowledge,
                    "Knowledge created successfully"
                )
            );
    }
);


const getAllKnowledge = asyncHandler(
    async (req: Request, res: Response) => {

        const knowledge = await Knowledge.find()
            .sort({ createdAt: -1 });

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    knowledge,
                    "Knowledge fetched successfully"
                )
            );
    }
);


export {
    createKnowledge,
    getAllKnowledge,
};