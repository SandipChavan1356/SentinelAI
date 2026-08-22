import { Request, Response } from "express";
import { Service } from "../models/service.model";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/Asynchandler";


const createService = asyncHandler(async (req: Request, res: Response) => {

    const { name, description, status } = req.body;

    if (!name) {
        throw new ApiError(400, "Service name is required");
    }

    const existingService = await Service.findOne({ name });

    if (existingService) {
        throw new ApiError(409, "Service already exists");
    }

    const service = await Service.create({
        name,
        description,
        status,
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                service,
                "Service created successfully"
            )
        );
});


const getAllServices = asyncHandler(async (req: Request, res: Response) => {

    const services = await Service.find()
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                services,
                "Services fetched successfully"
            )
        );
});


const getServiceById = asyncHandler(async (req: Request, res: Response) => {

    const { serviceId } = req.params;

    const service = await Service.findById(serviceId);

    if (!service) {
        throw new ApiError(404, "Service not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                service,
                "Service fetched successfully"
            )
        );
});


export {
    createService,
    getAllServices,
    getServiceById,
};