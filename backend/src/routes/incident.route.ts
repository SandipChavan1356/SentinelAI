import { Router } from "express";
import {
    createIncident,
    getAllIncidents,
    getIncidentById,
    updateIncidentStatus,
    analyzeIncidentWithAI
} from "../controllers/incident.controller";

const router = Router();

router.post("/", createIncident);
router.get("/", getAllIncidents);
router.post("/:incidentId/analyze", analyzeIncidentWithAI);
router.get("/:incidentId", getIncidentById);
router.patch("/:incidentId/status", updateIncidentStatus);

export default router;