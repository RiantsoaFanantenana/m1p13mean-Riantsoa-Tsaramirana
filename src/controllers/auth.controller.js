const User = require("../models/user/User");
const ClientProfile = require("../models/client/ClientProfile");
const jwt = require("jsonwebtoken");
const {
  hashPassword,
  comparePassword
} = require("../utils/password.util");

// =====================
// LOGIN (client / shop / admin)
// =====================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
};

// =====================
// REGISTER (CLIENT ONLY)
// =====================
exports.registerClient = async (req, res) => {
  const { email, password, userName, name, birthDate } = req.body;
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "Email already in use" });
  }
  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    email,
    password: hashedPassword,
    role: "client"
  });

  await ClientProfile.create({
    user: user._id,
    userName,
    name,
    birthDate
  });

  res.status(201).json({ message: "Client account created" });
};
