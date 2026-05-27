import Listing from "../models/Listing.js";

/**
 * CREATE PROPERTY (HOST)
 */
export const createProperty = async (req, res) => {
  try {
    const images = req.files?.map((file) => file.originalname) || [];

    const property = await Listing.create({
      ...req.body,
      host: req.user._id,
      images,
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL APPROVED PROPERTIES (PUBLIC)
 */
export const getProperties = async (req, res) => {
  try {
    const properties = await Listing.find({ status: "approved" }).populate(
      "host",
      "name email"
    );

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET SINGLE PROPERTY
 */
export const getPropertyById = async (req, res) => {
  try {
    const property = await Listing.findById(req.params.id).populate(
      "host",
      "name email"
    );

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE PROPERTY (ONLY OWNER)
 */
export const updateProperty = async (req, res) => {
  try {
    const property = await Listing.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    Object.assign(property, req.body);
    const updated = await property.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE PROPERTY (ONLY OWNER)
 */
export const deleteProperty = async (req, res) => {
  try {
    const property = await Listing.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await property.deleteOne();

    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
