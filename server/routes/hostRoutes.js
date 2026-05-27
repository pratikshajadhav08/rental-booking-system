import express from "express";
import Listing from "../models/Listing.js";
import Booking from "../models/Booking.js";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("host", "admin"));

router.get("/dashboard", async (req, res) => {
  try {
    const listings = await Listing.find({ host: req.user._id });
    const listingIds = listings.map((listing) => listing._id);
    const bookings = await Booking.find({ listing: { $in: listingIds } });
    const activeBookings = bookings.filter(
      (booking) => booking.status !== "cancelled",
    );
    const totalEarnings = activeBookings.reduce(
      (sum, booking) => sum + booking.totalPrice,
      0,
    );
    const avgRating =
      listings.length === 0
        ? 0
        : listings.reduce((sum, listing) => sum + (listing.rating || 0), 0) /
          listings.length;

    res.json({
      totalListings: listings.length,
      totalBookings: bookings.length,
      totalEarnings,
      avgRating,
      pendingListings: listings.filter((listing) => listing.status === "pending")
        .length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/properties", async (req, res) => {
  try {
    const listings = await Listing.find({ host: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/bookings", async (req, res) => {
  try {
    const listings = await Listing.find({ host: req.user._id }).select("_id");
    const ids = listings.map((listing) => listing._id);

    const bookings = await Booking.find({ listing: { $in: ids } })
      .populate("listing")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/bookings/recent", async (req, res) => {
  try {
    const listings = await Listing.find({ host: req.user._id }).select("_id");
    const ids = listings.map((listing) => listing._id);

    const bookings = await Booking.find({ listing: { $in: ids } })
      .populate("listing", "title price")
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
