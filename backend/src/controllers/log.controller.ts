import { Request, Response } from "express";
import { Log } from "../models/log.model";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/Asynchandler";
import { detectIncident } from "../services/incident.service";
import { generateEmbedding } from "../services/embedding.service";

const createLog = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { service, level, message } = req.body;
        const embedding = await generateEmbedding(message);

        if (!service || !level || !message) {
            throw new ApiError(400, "Service, level and message are required");
        }

        const log = await Log.create({
            service,
            level,
            message,
            embedding,
        });

await detectIncident(service, level, message);

return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            log,
            "Log created successfully"
        )
    );
    } catch (error) {
        throw new ApiError(500, "Failed to create log");
    }
});

const getAllLogs = asyncHandler(async (req: Request, res: Response) => {
    try {
        const logs = await Log.find()
            .populate("service")
            .sort({ createdAt: -1 });

        return res
            .status(200)
            .json(new ApiResponse(200, logs, "Logs fetched successfully"));

    } catch (error) {
        throw new ApiError(500, "Failed to fetch logs");
    }
});

const getLogsByService = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { serviceId } = req.params;

        const logs = await Log.find({
            service: serviceId,
        })
            .populate("service")
            .sort({ createdAt: -1 });

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    logs,
                    "Service logs fetched successfully"
                )
            );

    } catch (error) {
        throw new ApiError(500, "Failed to fetch service logs");
    }
});

const getLogById = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { logId } = req.params;

        const log = await Log.findById(logId)
            .populate("service");

        if (!log) {
            throw new ApiError(404, "Log not found");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, log, "Log fetched successfully"));

    } catch (error) {
        throw new ApiError(500, "Failed to fetch log");
    }
});

export {
    createLog,
    getAllLogs,
    getLogsByService,
    getLogById,
};