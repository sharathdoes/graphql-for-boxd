import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, trim:true, lowercase:true },
  password: { type: String, required: true },
  bio: { type: String },
  favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
  favoriteGenres: [{ type: String }],
  favoriteActors: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", UserSchema);
