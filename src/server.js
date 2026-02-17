// src/server.js
import 'dotenv/config'; // équivalent de require("dotenv").config()
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import seedData from './config/seeds.js';
import { populateReferenceIds } from './config/referenceIds.js';

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// connect DB
await connectDB();

// routes
app.use('/api/auth', authRoutes);

// seed et cache des _id
await seedData();           
await populateReferenceIds(); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
