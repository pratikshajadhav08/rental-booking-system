import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";

/**
 * CREATE BOOKING (USER)
 */
export const createBooking = async (req, res) => {
  try {
    const { property, listing, checkIn, checkOut, guests } = req.body;
    const listingId = listing || property;

    const propertyData = await Listing.findById(listingId);

    if (!propertyData) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Date validation
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (end <= start) {
      return res.status(400).json({ message: "Invalid dates selected" });
    }

    // 🔴 Basic availability check (prevent overlapping bookings)
    const existingBooking = await Booking.findOne({
      listing: listingId,
      status: { $ne: "cancelled" },
      $or: [
        { checkIn: { $lte: end, $gte: start } },
        { checkOut: { $lte: end, $gte: start } },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "Property already booked for selected dates",
      });
    }

    // Calculate nights
    const nights = Math.ceil(
      (end - start) / (1000 * 60 * 60 * 24)
    );

    const totalPrice = nights * propertyData.price;

    const booking = await Booking.create({
      user: req.user._id,
      listing: listingId,
      checkIn: start,
      checkOut: end,
      guests,
      totalPrice,
      status: "pending",
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET USER BOOKINGS
 */
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("listing")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET HOST BOOKINGS
 */
export const getHostBookings = async (req, res) => {
  try {
    const properties = await Listing.find({ host: req.user._id }).select("_id");

    const propertyIds = properties.map((p) => p._id);

    const bookings = await Booking.find({
      listing: { $in: propertyIds },
    })
      .populate("user", "name email")
      .populate("listing", "title price");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE BOOKING STATUS (HOST ONLY)
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id).populate("listing");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * CANCEL BOOKING (USER)
 */
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
