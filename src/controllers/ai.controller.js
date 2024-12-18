import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

import express from "express";
import { PythonShell } from "python-shell";

const router = express.Router();


// Define the /news route
const predictedNews = asyncHandler(async (req, res) => {
  try {
      const newsData = await getPredictionResult();
      res.status(200).json(new ApiResponse(200, newsData, "News data fetched successfully"));
  } catch (error) {
      console.error("Error in fetching news data:", error);
      throw new ApiError(500, "Failed to fetch news data");
  }
});


// Function to get news data from Python script
const getPredictionResult = async () => {
    return new Promise((resolve, reject) => {
      const options = {
        mode: "text",
        pythonOptions: ["-u"], // Unbuffered output from Python
        scriptPath: "model 2", // Path to your Python script
        args: [], // Add arguments if needed
      };
  
      PythonShell.run("predict.py", options)
        .then((messages) => {
          // Parse the Python output to JSON
          const rawResults = messages[0];
          const formattedResults = JSON.parse(rawResults.replace(/'/g, '"'));
          resolve(formattedResults);
        })
        .catch((error) => {
          console.error("Error in Python script:", error);
          reject("Failed to retrieve data from Python script");
        });
    });
  };

export { predictedNews };
