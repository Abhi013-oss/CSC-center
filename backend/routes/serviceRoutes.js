import express from 'express';
import { getServices, getServiceBySlug } from '../controllers/serviceController.js';

const router = express.Router();

router.get('/', getServices);
router.get('/:slug', getServiceBySlug);

export default router;
