import express from "express";
import Listing from "../models/Listing.js";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/suggest", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) return res.json([]);

    const results = await Listing.find({
      status: "approved",
      location: { $regex: q, $options: "i" },
    }).limit(5);

    res.json([...new Set(results.map((result) => result.location))]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { location, guests, checkIn, checkOut, category } = req.query;
    const filter = {
      $or: [{ status: "approved" }, { status: { $exists: false } }],
    };

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    if (guests) {
      filter.maxGuests = { $gte: Number(guests) };
    }

    let listings = await Listing.find(filter).populate("host", "name email");

    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);

      listings = listings.filter((listing) => {
        return !listing.bookedDates?.some((booking) => {
          const bookedStart = new Date(booking.checkIn);
          const bookedEnd = new Date(booking.checkOut);
          return start < bookedEnd && end > bookedStart;
        });
      });
    }

    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid listing ID" });
    }

    const listing = await Listing.findById(req.params.id).populate(
      "host",
      "name email",
    );

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", protect, authorizeRoles("host", "admin"), async (req, res) => {
  try {
    const listing = await Listing.create({
      ...req.body,
      price: Number(req.body.price),
      maxGuests: Number(req.body.maxGuests),
      bedrooms: Number(req.body.bedrooms || 1),
      bathrooms: Number(req.body.bathrooms || 1),
      host: req.user._id,
      status: req.user.role === "admin" ? "approved" : "pending",
    });

    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", protect, authorizeRoles("host", "admin"), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const ownsListing = listing.host.toString() === req.user._id.toString();
    if (!ownsListing && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    Object.assign(listing, req.body);
    const updated = await listing.save();

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete(
  "/:id",
  protect,
  authorizeRoles("host", "admin"),
  async (req, res) => {
    try {
      const listing = await Listing.findById(req.params.id);

      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }

      const ownsListing = listing.host.toString() === req.user._id.toString();
      if (!ownsListing && req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      await listing.deleteOne();
      res.json({ message: "Listing deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
);

export default router;
