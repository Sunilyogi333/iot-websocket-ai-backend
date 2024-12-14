import express from "express";
import {
  addChicken,
  getChickens,
  updateFeedDetails,
  updateSoldDetails,
  updateMortalityDetails
} from "../controllers/chicken.controller.js"; // Corrected import (removed extra dot)
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protect all routes with Firebase authentication middleware
router.use(verifyUser);

// Route to add a new chicken along with feed details
router.post("/", addChicken);

// Route to get all chickens for the authenticated user
router.get("/", getChickens);

// Route to update feed details for a chicken
router.patch("/:chickenId/feed", updateFeedDetails);

// Route to update sold details for a chicken
router.patch("/:chickenId/sold", updateSoldDetails);

// Route to update mortality details for a chicken
router.patch("/:chickenId/mortality", updateMortalityDetails);

export default router;
