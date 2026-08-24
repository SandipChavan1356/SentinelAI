import { Router } from "express";
import {
    createIncident,
    getAllIncidents,
    getIncidentById,
    updateIncidentStatus,
} from "../controllers/incident.controller";

const router = Router();

router.post("/", createIncident);
router.get("/", getAllIncidents);
router.get("/:incidentId", getIncidentById);
router.patch("/:incidentId/status", updateIncidentStatus);

export default router;