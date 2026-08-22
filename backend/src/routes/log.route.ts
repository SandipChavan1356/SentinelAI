import { Router } from "express";
import { createLog } from "../controllers/log.controller";

const logRouter = Router();

logRouter.post("/create", createLog);

export default logRouter;