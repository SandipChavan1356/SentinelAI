import { Router } from "express";
import {
    createService,
    getAllServices,
    getServiceById,
} from "../controllers/service.controller";

const serviceRouter = Router();

serviceRouter.post("/create", createService);
serviceRouter.get("/", getAllServices);
serviceRouter.get("/:serviceId", getServiceById);

export default serviceRouter;