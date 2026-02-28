// src/server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { seedAdminUser, seedData } from './config/seeds.js';
import { seedBoxes } from './config/box.seeds.js';
import { populateReferenceIds } from './config/referenceIds.js';

import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import shopRoutes from './routes/shop.routes.js';
import configRoutes from './routes/config.routes.js';
import generalRoutes from './routes/general.route.js';
import clientRoutes from './routes/client.route.js';

import { startMonthlyChargeCron } from './cron/monthlyCharge.cron.js';
import { ensureCurrentMonthGenerated } from './services/monthlyCharge.generator.js';

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// connect DB
await connectDB();

/*
  IMPORTANT :
  On lance la vérification AVANT le cron,
  pour couvrir le cas où le serveur était éteint le 1er.
*/
await ensureCurrentMonthGenerated();

// routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/config', configRoutes);
app.use('/api/general', generalRoutes);
app.use('/api/client', clientRoutes);

// seed et cache des _id
await seedData();
await seedAdminUser();
await seedBoxes();
await populateReferenceIds();

/*
  On démarre le cron après que tout soit prêt.
*/
startMonthlyChargeCron();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));