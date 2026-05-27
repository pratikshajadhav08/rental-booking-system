import express from "express";
import User from "../models/User.js";
import Listing from "../models/Listing.js";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/dashboard", async (req, res) => {
  try {
    const [
      totalUsers,
      totalHosts,
      totalListings,
      pendingListings,
      totalBookings,
      activeBookings,
      bookings,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "host" }),
      Listing.countDocuments(),
      Listing.countDocuments({ status: "pending" }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: { $ne: "cancelled" } }),
      Booking.find({ status: { $ne: "cancelled" } }).select("totalPrice"),
    ]);

    const revenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

    res.json({
      totalUsers,
      totalHosts,
      totalListings,
      pendingListings,
      totalBookings,
      activeBookings,
      revenue,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/users/:id/role", async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "host", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/listings", async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate("host", "name email")
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/listings/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid listing status" });
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    listing.status = status;
    await listing.save();

    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate({
        path: "listing",
        populate: { path: "host", select: "name email" },
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("listing", "title")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/reports", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("listing", "location");
    const byLocation = bookings.reduce((acc, booking) => {
      const location = booking.listing?.location || "Unknown";
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});

    res.json({
      bookingsByLocation: Object.entries(byLocation).map(([location, count]) => ({
        location,
        count,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
