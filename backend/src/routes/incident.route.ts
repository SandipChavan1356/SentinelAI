import { Router } from "express";
import {
    createIncident,
    getAllIncidents,
    getIncidentById,
    updateIncidentStatus,
} from "../controllers/incident.controller";

const incidentRouter = Router();

incidentRouter.post("/create", createIncident);

incidentRouter.get("/", getAllIncidents);

incidentRouter.get("/:incidentId", getIncidentById);

incidentRouter.patch("/:incidentId/status", updateIncidentStatus);

export default incidentRouter;