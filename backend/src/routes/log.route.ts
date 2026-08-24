import { Router } from "express";
import {
    createLog,
    getAllLogs,
    getLogsByService,
    getLogById,
} from "../controllers/log.controller";

const router = Router();

router.post("/", createLog);
router.get("/", getAllLogs);
router.get("/service/:serviceId", getLogsByService);
router.get("/:logId", getLogById);

export default router;