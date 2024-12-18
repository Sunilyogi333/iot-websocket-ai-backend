import Chicken from '../models/chicken.model.js';
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

// Add a new chicken along with feed details
export const addChicken = asyncHandler(async (req, res) => {
    const { type, numberPurchased, purchasePrice, feedDetails } = req.body;
    console.log('Request body:', req.body);

    // Create a new chicken document with the provided data
    const chicken = new Chicken({
        userId: req.user._id,
        type,
        numberPurchased,
        purchasePrice,
        feedDetails: feedDetails || [],  // If no feed details are provided, set to empty array
        soldDetails: [],                // Initialize an empty array for sold details
        mortalityDetails: []            // Initialize an empty array for mortality details
    });

    // Save the chicken document to the database
    await chicken.save();
    console.log('Chicken added successfully', chicken);

    // Respond with the created chicken data
    res.status(201).json(new ApiResponse(201, chicken, 'Chicken added successfully'));
});

// Get all chickens for the authenticated user
export const getChickens = asyncHandler(async (req, res) => {
    const chickens = await Chicken.find({ userId: req.user._id });

    // Check if chickens are found
    if (!chickens || chickens.length === 0) {
        throw new ApiError(404, 'No chickens found for the user');
    }

    res.status(200).json(new ApiResponse(200, chickens, 'Chickens retrieved successfully'));
});

// Update feed details for a chicken
export const updateFeedDetails = asyncHandler(async (req, res) => {
    const { feedDetails } = req.body;
    const { chickenId } = req.params;

    console.log('chickenId:', chickenId);

    // Find the chicken document by id
    const chicken = await Chicken.findById(chickenId);

    // Check if chicken is found
    if (!chicken) {
        throw new ApiError(404, 'Chicken not found');
    }

    // Update the feed details for the chicken
    chicken.feedDetails = feedDetails;

    // Save the updated chicken document
    await chicken.save();

    res.status(200).json(new ApiResponse(200, chicken, 'Feed details updated successfully'));
});

// Update chicken sold details and decrease the number of chickens
export const updateSoldDetails = asyncHandler(async (req, res) => {
    const { soldCount, soldPrice } = req.body;  // Price and sold count should be passed in request body
    const { chickenId } = req.params;

    // Find the chicken document by id
    const chicken = await Chicken.findById(chickenId);

    // Check if chicken is found
    if (!chicken) {
        throw new ApiError(404, 'Chicken not found');
    }

    // Add the sale details to the soldDetails array
    chicken.soldDetails.push({
        soldCount,           // Number of chickens sold in this transaction
        soldPrice,           // Price at which chickens were sold
        soldDate: new Date() // Date of the sale
    });

    // Update the total sold count
    chicken.soldCount += soldCount;

    // Save the updated chicken document
    await chicken.save();

    res.status(200).json(new ApiResponse(200, chicken, 'Sold details updated successfully'));
});

// Update chicken mortality details and decrease the number of chickens
export const updateMortalityDetails = asyncHandler(async (req, res) => {
    const { mortalityCount, reason } = req.body;  // Mortality count and reason should be passed in request body
    const { chickenId } = req.params;

    // Find the chicken document by id
    const chicken = await Chicken.findById(chickenId);

    // Check if chicken is found
    if (!chicken) {
        throw new ApiError(404, 'Chicken not found');
    }

    // Add the mortality details to the mortalityDetails array
    chicken.mortalityDetails.push({
        mortalityCount,      // Number of chickens that died in this event
        mortalityDate: new Date(),  // Date of mortality
        reason               // Reason for mortality (e.g., disease, accident)
    });

    // Update the total mortality count
    chicken.mortalityCount += mortalityCount;

    // Save the updated chicken document
    await chicken.save();

    res.status(200).json(new ApiResponse(200, chicken, 'Mortality details updated successfully'));
});
