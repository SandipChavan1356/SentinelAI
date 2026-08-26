import { Router } from "express";
import { testEmbedding } from "../controllers/embedding.controller";

const router = Router();

router.post("/test", testEmbedding);

export default router;