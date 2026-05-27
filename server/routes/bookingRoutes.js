import express from "express";
import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("user", "admin"), async (req, res) => {
  try {
    const { listing, checkIn, checkOut, guests, paymentMethod, cardLast4 } = req.body;
    const foundListing = await Listing.findById(listing);

    if (!foundListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (foundListing.status !== "approved") {
      return res.status(400).json({ message: "Listing is not available" });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (!checkIn || !checkOut || end <= start) {
      return res.status(400).json({ message: "Invalid dates selected" });
    }

    if (Number(guests) > foundListing.maxGuests) {
      return res.status(400).json({
        message: "Guest count exceeds listing capacity",
      });
    }

    const existingBooking = await Booking.findOne({
      listing,
      status: { $ne: "cancelled" },
      checkIn: { $lt: end },
      checkOut: { $gt: start },
    });

    if (existingBooking) {
      return res.status(400).json({ message: "Dates already booked" });
    }

    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * foundListing.price;

    const booking = await Booking.create({
      user: req.user._id,
      listing,
      checkIn: start,
      checkOut: end,
      guests: Number(guests),
      totalPrice,
      status: "confirmed",
      paymentStatus: paymentMethod === "pay_at_property" ? "pending" : "paid",
      paymentMethod: paymentMethod || "card",
      cardLast4,
    });

    foundListing.bookedDates.push({ checkIn: start, checkOut: end });
    await foundListing.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/my", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("listing")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id/status", protect, authorizeRoles("host", "admin"), async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid booking status" });
    }

    const booking = await Booking.findById(req.params.id).populate("listing");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const isHost = booking.listing.host.toString() === req.user._id.toString();
    if (!isHost && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const ownsBooking = booking.user.toString() === req.user._id.toString();
    if (!ownsBooking && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
