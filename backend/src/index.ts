import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import path from "path";
import userRoutes from "./routes/user";
import userAuthRoutes from "./routes/users-auth";
import myTransactionRoutes from "./routes/my-transactions";
import TransactionRoutes from "./routes/transactions";
import adminRoutes from "./routes/admin";
import adminAuthRoutes from "./routes/admins-auth";
import planRoutes from "./routes/plans";
import investmentsRoutes from "./routes/investments";
import myInvestmentsRoutes from "./routes/my-investments";
import codesRoutes from "./routes/code";
import mongoose from "mongoose";
import errorHandler from "./middlewares/errorHandler";
import "./services/scheduler";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log("Mongo Error:", err.message));

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, "../client-dist")));

app.use("/api/users", userRoutes);
app.use("/api/users-auth", userAuthRoutes);
app.use("/api/my-transactions", myTransactionRoutes);
app.use("/api/transactions", TransactionRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/admins-auth", adminAuthRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/investments", investmentsRoutes);
app.use("/api/my-investments", myInvestmentsRoutes);
app.use("/api/codes", codesRoutes);

// Error handling middleware
app.use(errorHandler);

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../client-dist/index.html"));
});

app.listen(5000, () => {
  console.log("Server is running on port localhost:5000");
});
