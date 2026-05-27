import express from "express";
import Favorite from "../models/Favorite.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:listingId", protect, async (req, res) => {
  try {
    const existing = await Favorite.findOne({
      user: req.user._id,
      listing: req.params.listingId,
    });

    if (existing) return res.json(existing);

    const favorite = await Favorite.create({
      user: req.user._id,
      listing: req.params.listingId,
    });

    res.status(201).json(favorite);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/my", protect, async (req, res) => {
  try {
    const favorites = await Favorite.find({
      user: req.user._id,
    }).populate("listing");

    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:favoriteId", protect, async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      _id: req.params.favoriteId,
      user: req.user._id,
    });

    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    await favorite.deleteOne();
    res.json({ message: "Favorite removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
