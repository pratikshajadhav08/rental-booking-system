import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    location: String,
    price: Number,
    image: String,
    category: {
      type: String,
      default: "other",
    },
    bedrooms: {
      type: Number,
      default: 1,
    },
    bathrooms: {
      type: Number,
      default: 1,
    },
    amenities: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },

    maxGuests: {
      type: Number,
      default: 2,
    },

    bookedDates: [
      {
        checkIn: Date,
        checkOut: Date,
      },
    ],

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Listing", listingSchema);
