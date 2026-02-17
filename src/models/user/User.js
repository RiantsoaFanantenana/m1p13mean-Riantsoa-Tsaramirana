import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserType",
    required: true
  },
  isConfigured: { type: Boolean, default: true }
}, { timestamps: true });

// Hook pour hasher le mot de passe automatiquement avant la sauvegarde
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next(); // ne hash que si le password est nouveau ou modifié
  try {
    const hashed = await bcrypt.hash(this.password, SALT_ROUNDS);
    this.password = hashed;
  } catch (err) {
    return next(err);}
});

// Méthode pratique pour comparer un mot de passe en login
UserSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", UserSchema);
