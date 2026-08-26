import { Router } from "express";

import {
    createKnowledge,
    getAllKnowledge,
} from "../controllers/knowledge.controller";

const router = Router();

router.post("/", createKnowledge);

router.get("/", getAllKnowledge);

export default router;