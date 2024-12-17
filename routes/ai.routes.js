import { Router } from "express";
import { 
    predictedNews,
} from "../controllers/ai.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router= Router()

router.get("/news", predictedNews)

export default router;