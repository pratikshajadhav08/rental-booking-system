import mongoose from "mongoose";
import dotenv from "dotenv";
import Listing from "./models/Listing.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

const data = [
  {
    title: "Beachfront Villa in Goa",
    description:
      "Luxury villa with private pool and sea view. Perfect for relaxing vacations.",
    location: "Goa",
    price: 8500,
    image: "https://images.unsplash.com/photo-1501117716987-c8e1ecb2100d",
    maxGuests: 6,
    category: "Beach",
  },
  {
    title: "Modern Apartment in Mumbai",
    description: "Stylish city apartment near Marine Drive with skyline views.",
    location: "Mumbai",
    price: 4200,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    maxGuests: 3,
    category: "City",
  },
  {
    title: "Hill Cottage in Manali",
    description: "Cozy wooden cottage surrounded by mountains and snow views.",
    location: "Manali",
    price: 3800,
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    maxGuests: 4,
    category: "Mountain",
  },
  {
    title: "Luxury Penthouse in Delhi",
    description: "Premium penthouse with rooftop lounge and city skyline.",
    location: "Delhi",
    price: 12000,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    maxGuests: 5,
    category: "Luxury",
  },
  {
    title: "Cabin in Kerala Backwaters",
    description: "Peaceful wooden cabin floating near serene backwaters.",
    location: "Kerala",
    price: 5000,
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
    maxGuests: 4,
    category: "Cabin",
  },
  {
    title: "Beach Shack in Goa North",
    description: "Affordable beach shack just steps from the ocean.",
    location: "Goa",
    price: 2500,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    maxGuests: 2,
    category: "Beach",
  },
  {
    title: "Luxury Resort in Jaipur",
    description: "Royal palace-style resort with heritage architecture.",
    location: "Jaipur",
    price: 9000,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
    maxGuests: 6,
    category: "Luxury",
  },
  {
    title: "City Loft in Bangalore",
    description: "Minimalist loft near tech parks with modern interiors.",
    location: "Bangalore",
    price: 4500,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
    maxGuests: 3,
    category: "City",
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Listing.deleteMany();
    const password = await bcrypt.hash("password123", 10);
    const host = await User.findOneAndUpdate(
      { email: "host@stayfinder.com" },
      {
        name: "StayFinder Host",
        email: "host@stayfinder.com",
        password,
        role: "host",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    await User.findOneAndUpdate(
      { email: "admin@stayfinder.com" },
      {
        name: "StayFinder Admin",
        email: "admin@stayfinder.com",
        password,
        role: "admin",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    await Listing.insertMany(
      data.map((listing) => ({
        ...listing,
        host: host._id,
        status: "approved",
      })),
    );

    console.log("Database seeded successfully");
    console.log("Host login: host@stayfinder.com / password123");
    console.log("Admin login: admin@stayfinder.com / password123");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

seedDB();
