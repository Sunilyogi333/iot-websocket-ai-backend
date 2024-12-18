import mongoose from "mongoose";

// Schema for tracking feed information
const feedSchema = new mongoose.Schema({
    company: { type: String, required: true },
    grainType: { type: String, required: true },
    weight: { type: Number, required: true },
    price: { type: Number, required: true },
    date: { type: Date, default: Date.now }
}, { _id: false });

// Schema for tracking sale details
const saleSchema = new mongoose.Schema({
    soldCount: { type: Number, required: true },   // Number of chickens sold in this sale
    soldPrice: { type: Number, required: true },   // Price at which chickens were sold
    soldDate: { type: Date, default: Date.now },   // Date of the sale
}, { _id: false });

// Schema for tracking mortality details
const mortalitySchema = new mongoose.Schema({
    mortalityCount: { type: Number, required: true },  // Number of chickens that died
    mortalityDate: { type: Date, default: Date.now },  // Date of mortality
    reason: { type: String, required: true },          // Reason for mortality (e.g., disease, age, accident)
}, { _id: false });

// Schema for chicken details
const chickenSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    type: { type: String, required: true },
    numberPurchased: { type: Number, required: true },
    purchasePrice: { type: Number, required: true },
    growthStartDate: { type: Date, default: Date.now },
    soldCount: { type: Number, default: 0 },         // Total number of chickens sold
    mortalityCount: { type: Number, default: 0 },     // Total number of chickens that died
    supplier: { type: String},
    feedDetails: [feedSchema],    // Information about the feed for the chickens
    soldDetails: [saleSchema],    // Track individual sales of chickens
    mortalityDetails: [mortalitySchema]  // Track individual mortality events
});

export default mongoose.model("Chicken", chickenSchema);
