import User from '../models/user/User.js'
import ClientProfile from '../models/client/ClientProfile.js';
import jwt from 'jsonwebtoken';
import { referenceIds } from '../config/referenceIds.js';

// =====================
// LOGIN (client / shop / admin)
// =====================
// backend/controllers/auth.controller.js ou votre fichier de contrôleur
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate('userType'); // N'oubliez pas populate pour avoir les détails du userType
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    if (user.isConfigured === false) {
      return res.status(403).json({ message: "Account not configured. Please check your email for configuration instructions." });
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Sécuriser la récupération du rôle avec une valeur par défaut
    let userRole = 'client'; // Défaut à 'client'
    
    if (user.userType && user.userType.name) {
      userRole = user.userType.name;
      console.log('Rôle trouvé dans userType:', userRole);
    } else {
      console.log('userType non trouvé, utilisation de client par défaut');
      
      // Optionnel: essayer de déterminer le rôle depuis l'email
      if (email === 'admin@mall.com') {
        userRole = 'admin';
      } else if (email === 'shop@example.com') {
        userRole = 'shop';
      }
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: userRole,
        email: user.email // Ajouter l'email peut être utile
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log('Token généré avec rôle:', userRole);
    console.log('Token:', token);

    res.json({ token });
    
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
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
