import { Request, Response } from "express";
import { Incident } from "../models/incident.model";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/Asynchandler";


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


export {
    createIncident,
    getAllIncidents,
    getIncidentById,
    updateIncidentStatus,
};