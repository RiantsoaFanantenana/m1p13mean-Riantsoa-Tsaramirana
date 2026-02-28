import * as generalController from '../controllers/general.controller.js';
import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();
router.use(authenticate);
// Search shops
router.get('/shops/search', generalController.searchShops);
// Get shop profile
router.get('/shops/:shopId', generalController.getShopProfile);
// Get shops by group
router.get('/shops/group/:groupName', generalController.getShopByGroup);
// Get events
router.get('/events', generalController.getEvents);
// Get reviews
router.get('/shops/:shopId/reviews', generalController.getReviews);
// Get shop events
router.get('/shops/:shopId/events', generalController.getShopEvents);

export default router;