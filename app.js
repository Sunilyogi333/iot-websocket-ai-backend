import express from "express";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import chickenRoutes from "./routes/chicken.routes.js";
import userRoutes from "./routes/user.routes.js";
// import iotRoutes from "./routes/iot.routes.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors({
    allowedHeaders: ['Authorization'],
    origin: '*'
  }));

// Routes
app.get("/",(req,res)=>{
    res.send("Welcome to the Child Thrift's homepage")
})

app.use("/auth", authRoutes);
app.use("/chickens", chickenRoutes);
app.use("/users", userRoutes);
// app.use("/iot", iotRoutes);

// Error handler
app.use(errorHandler);
console.log("app.js is running")

export default app;
