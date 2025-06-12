import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  releaseYear: { type: Number },
  runtime: { type: Number },
  genre: [{ type: String }],
  director: { type: String , required:true},
  cast: [{ type: String }],
  AvgRating: { type: Number, default: 0 },
  likesCount: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Movie", MovieSchema);
