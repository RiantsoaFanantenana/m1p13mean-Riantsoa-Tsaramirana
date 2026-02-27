import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["wheel", "treasure_qr"], required: true },
  reward: {
    type: String, // ex: "coupon", "points"
    required: true
  },
  rewardValue: { type: Number },
  claimed: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Game", GameSchema);