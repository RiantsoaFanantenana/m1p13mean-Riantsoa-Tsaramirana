// src/server.js
import 'dotenv/config'; // équivalent de require("dotenv").config()
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import {seedAdminUser, seedData} from './config/seeds.js';
import seedBoxes from './config/box.seeds.js';
import { populateReferenceIds } from './config/referenceIds.js';

import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import shopRoutes from './routes/shop.routes.js';
import configRoutes from './routes/config.routes.js';

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// connect DB
await connectDB();

// routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); // routes admin
app.use('/api/shop', shopRoutes); 
app.use('/api/config', configRoutes); // routes de configuration
// seed et cache des _id
await seedData(); 
await seedAdminUser();    
await seedBoxes();      
await populateReferenceIds(); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
