import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  coupons: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" }
  ],
  points: { type: Number, default: 0 } // points gamification
}, { timestamps: true });

export default mongoose.model("Wallet", WalletSchema);