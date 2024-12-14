import { Router } from "express";
import { 
    getCurrentUser, 
    editAccountDetails,
    getAINewsByModel
} from "../controllers/user.controller.js";
import {verifyUser } from "../middlewares/auth.middleware.js";

const router=Router()

router.route("/current-user").get( getCurrentUser)
router.route("/edit-account").patch(verifyUser, editAccountDetails)
router.route("/ai-news").get(getAINewsByModel)

export default  router
