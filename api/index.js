import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import contactRoutes from "../routes/contactRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Cached database connection (required for Vercel Serverless)
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectToDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// ✅ Connect DB before routes
app.use(async (req, res, next) => {
  await connectToDB();
  next();
});

// ✅ Routes
app.use("/api/contacts", contactRoutes);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("Backend running on Vercel ✅");
});

// ✅ Export instead of listen()
export default app;
