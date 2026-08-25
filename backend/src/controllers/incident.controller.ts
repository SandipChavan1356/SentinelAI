import { Request, Response } from "express";
import { Incident } from "../models/incident.model";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/Asynchandler";
import { Log } from "../models/log.model";
import { analyzeIncident } from "../services/ai.service";


const createIncident = asyncHandler(async (req: Request, res: Response) => {

    const {
        title,
        description,
        severity,
        services,
        startedAt,
    } = req.body;

    if (!title) {
        throw new ApiError(400, "Incident title is required");
    }

    const incident = await Incident.create({
        title,
        description,
        severity,
        services,
        startedAt,
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                incident,
                "Incident created successfully"
            )
        );
});


const getAllIncidents = asyncHandler(async (req: Request, res: Response) => {

    const incidents = await Incident.find()
        .populate("services")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                incidents,
                "Incidents fetched successfully"
            )
        );
});


const getIncidentById = asyncHandler(async (req: Request, res: Response) => {

    const { incidentId } = req.params;

    const incident = await Incident.findById(incidentId)
        .populate("services");

    if (!incident) {
        throw new ApiError(404, "Incident not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                incident,
                "Incident fetched successfully"
            )
        );
});


const updateIncidentStatus = asyncHandler(async (req: Request, res: Response) => {

    const { incidentId } = req.params;
    const { status } = req.body;

    if (!status) {
        throw new ApiError(400, "Status is required");
    }

    const incident = await Incident.findByIdAndUpdate(
        incidentId,
        {
            status,
            ...(status === "resolved" && {
                resolvedAt: new Date(),
            }),
        },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!incident) {
        throw new ApiError(404, "Incident not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                incident,
                "Incident status updated successfully"
            )
        );
});

const analyzeIncidentWithAI = asyncHandler(
    async (req: Request, res: Response) => {

        const { incidentId } = req.params;

        const incident = await Incident.findById(incidentId);

        if (!incident) {
            throw new ApiError(404, "Incident not found");
        }

        const logs = await Log.find({
            service: { $in: incident.services },
            createdAt: {
                $gte: incident.startedAt || new Date(0),
            },
        })
            .sort({ createdAt: -1 })
            .limit(20);

        const formattedLogs = logs
            .map(
                (log) =>
                    `[${log.level}] ${log.message} - ${log.createdAt}`
            )
            .join("\n");

        const aiResult = await analyzeIncident(
        incident.title,
        incident.description || "",
        formattedLogs
    );

    const updatedIncident = await Incident.findByIdAndUpdate(
        incidentId,
        {
            rootCause: aiResult.rootCause,
            confidence: aiResult.confidence,
            suggestedFix: aiResult.suggestedFix,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!updatedIncident) {
        throw new ApiError(404, "Incident not found");
    }

    console.log("🤖 AI RESULT:", aiResult);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedIncident,
                "Incident analyzed successfully"
            )
        );
    }
);


export {
    createIncident,
    getAllIncidents,
    getIncidentById,
    updateIncidentStatus,
    analyzeIncidentWithAI
};