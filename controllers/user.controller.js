import { PythonShell } from "python-shell"; // Make sure this is at the top of your file
import fs from "fs"; // Import the 'fs' module to read the file
import axios from "axios"; // Import the 'axios' module to make HTTP requests
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;
  return res
    .status(200)
    .json(new ApiResponse(200, user, "current user have been fetched"));
});

const editAccountDetails = asyncHandler(async (req, res) => {
  // update firstName, lastName, phoneNumber
  const { firstName, lastName, phoneNumber } = req.body;

  if (!firstName || !lastName || !phoneNumber) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        firstName,
        lastName,
        phoneNumber,
      },
    },
    { new: true }
  ).select("-password -refreshToken");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User details updated successfully"));
});

const getAINewsByModel = asyncHandler(async (req, res) => {
  const options = {
    mode: "text",
    pythonOptions: ["-u"], // Ensure unbuffered output from Python
    scriptPath: "AImodel", // Path to your Python script
    args: [], // Pass any arguments your script needs here
  };

  try {
    // Run the Python script and wait for the result
    await new Promise((resolve, reject) => {
      PythonShell.run("predict.py", options, (error, results) => {
        if (error) {
          console.error("Python script error:", error);
          reject("Error in Python script");
        } else {
          console.log("Python script results:", results);

          // After the Python script finishes, read the generated JSON file
          const filePath =
            "/home/sunil/Documents/Coding/KukhuriKaa/backend/AImodel/news_predictions.json";

          fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
              console.error("Error reading JSON file:", err);
              return reject("Failed to read JSON file");
            }

            try {
              const jsonData = JSON.parse(data); // Parse the JSON data
              console.log("Parsed JSON data:", jsonData);
              resolve(jsonData); // Resolve with the parsed JSON data
            } catch (parseError) {
              console.error("Error parsing JSON:", parseError);
              reject("Error parsing JSON data");
            }
          });
        }
      });
    })
      .then((jsonData) => {
        // Send the parsed JSON data as the response
        res.status(200).json({ data: jsonData });
      })
      .catch((error) => {
        // Handle any error that occurs during the process
        console.error("Error:", error);
        res.status(500).json({ error: error });
      });
  } catch (error) {
    console.error("Error in executing Python script:", error);
    res.status(500).json({ error: "Failed to run AI model" });
  }
});
// const getAINewsByModel = asyncHandler(async (req, res) => {
//   try {
//     // Call the Python Flask API to get the predictions
//     const response = await axios.get('http://localhost:5000/predict_news');
    
//     // Send the predictions as response to the frontend
//     res.status(200).json({ data: response.data });
//   } catch (error) {
//     console.error('Error fetching predictions from Python:', error);
//     res.status(500).json({ error: 'Failed to fetch predictions' });
//   }
// });


export { getCurrentUser, editAccountDetails, getAINewsByModel };
