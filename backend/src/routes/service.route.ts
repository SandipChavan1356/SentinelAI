import { Router } from "express";
import {
    createService,
    getAllServices,
    getServiceById,
} from "../controllers/service.controller";

const router = Router();

router.post("/", createService);
router.get("/", getAllServices);
router.get("/:serviceId", getServiceById);

export default router;