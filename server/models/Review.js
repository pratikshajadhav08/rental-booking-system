import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
  rating: { type: Number, min: 1, max: 5 },
  comment: String
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);
