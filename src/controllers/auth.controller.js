import User from '../models/user/User.js'
import ClientProfile from '../models/client/ClientProfile.js';
import jwt from 'jsonwebtoken';
import { referenceIds } from '../config/referenceIds.js';

// =====================
// LOGIN (client / shop / admin)
// =====================
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (user.isConfigured === false) {
    return res.status(403).json({ message: "Account not configured. Please check your email for configuration instructions." });
  }

  const isValid = await user.comparePassword(password);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    {
      userId: user._id,
      role: user.userType.name
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
};

// =====================
// REGISTER (CLIENT ONLY)
// =====================
export const registerClient = async (req, res) => {
  console.log("BODY:", req.body);
  const { email, password, userName, name, birthDate } = req.body;
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const user = await User.create({
    email,
    password: password,
    userType: referenceIds.client_id
  });

  await ClientProfile.create({
    user: user._id,
    userName,
    name,
    birthDate
  });

  res.status(201).json({ message: "Client account created" });
};
