import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import hostRoutes from "./routes/hostRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";


dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/listings", listingRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/favorites", favoriteRoutes);
app.use("/api/host", hostRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (req, res) => {
  res.json({ message: "API running successfully" });
});

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
