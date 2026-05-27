import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import hostRoutes from "./routes/hostRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/host", hostRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (req, res) => {
  res.json({ message: "API running successfully" });
});

export default app;
